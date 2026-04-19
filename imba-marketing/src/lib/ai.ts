/**
 * Shared AI provider utilities for the CRM.
 * Handles multi-provider API calls with proper error handling.
 */

import { supabase } from '@/lib/supabase'

export interface AIProvider {
  id: string
  name: string
  api_key: string
  base_url: string | null
  default_model: string | null
  available_models: string[]
  enabled: boolean
}

/**
 * Load AI providers from DB with localStorage fallback
 */
export async function loadAIProviders(): Promise<AIProvider[]> {
  try {
    const { data, error } = await supabase
      .from('ai_providers')
      .select('*')
      .order('id')

    if (data?.length && !error) {
      return data.map(p => ({
        ...p,
        available_models: (p.available_models as string[] | null) || [],
      }))
    }
  } catch { /* table may not exist */ }

  // Fallback: localStorage Anthropic key
  const localKey = localStorage.getItem('anthropic_api_key') || ''
  return [{
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    api_key: localKey,
    base_url: null,
    default_model: 'claude-sonnet-4-20250514',
    available_models: [
      'claude-opus-4-6',
      'claude-sonnet-4-6',
      'claude-sonnet-4-20250514',
      'claude-haiku-4-5-20251001',
    ],
    enabled: !!localKey,
  }]
}

/**
 * Get the best default provider (first enabled with key + model)
 */
export function getDefaultProvider(providers: AIProvider[]): { provider: AIProvider; model: string } | null {
  const p = providers.find(p => p.enabled && p.api_key && p.default_model)
  if (p) return { provider: p, model: p.default_model! }

  const fallback = providers.find(p => p.enabled && p.api_key)
  if (fallback) {
    const model = fallback.default_model || fallback.available_models[0] || ''
    if (model) return { provider: fallback, model }
  }

  return null
}

/**
 * Call an AI provider and return the text response.
 * Handles Anthropic, OpenAI, Perplexity, and Ollama.
 */
export async function callAI(
  provider: AIProvider,
  model: string,
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  if (!provider.api_key) throw new Error(`No API key for ${provider.name}. Configure in CRM Settings.`)
  if (!model) throw new Error(`No model selected for ${provider.name}.`)

  const pid = provider.id

  // ── Anthropic (via nginx proxy to avoid CORS) ──────
  if (pid === 'anthropic') {
    const body: Record<string, unknown> = {
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }
    if (systemPrompt) body.system = systemPrompt

    // Use /api/anthropic/ proxy in production, direct in dev
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const apiUrl = isLocalhost
      ? 'https://api.anthropic.com/v1/messages'
      : '/api/anthropic/v1/messages'

    const headers: Record<string, string> = {
      'x-api-key': provider.api_key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      // New header name (renamed from anthropic-dangerous-direct-browser-access)
      'anthropic-dangerous-direct-browser-access': 'true',
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      const msg = (err as { error?: { message?: string } } | null)?.error?.message
        || `Anthropic API error ${res.status}: ${res.statusText}`
      throw new Error(msg)
    }

    const data = await res.json() as { content: Array<{ text: string }> }
    return data.content?.[0]?.text || ''
  }

  // ── OpenAI / Perplexity (same format, via proxy) ────
  if (pid === 'openai' || pid === 'perplexity') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

    let baseUrl: string
    if (provider.base_url) {
      baseUrl = provider.base_url // Custom endpoint (no proxy needed)
    } else if (pid === 'perplexity') {
      baseUrl = isLocalhost ? 'https://api.perplexity.ai/chat/completions' : '/api/perplexity/chat/completions'
    } else {
      baseUrl = isLocalhost ? 'https://api.openai.com/v1/chat/completions' : '/api/openai/v1/chat/completions'
    }

    const messages: Array<{ role: string; content: string }> = []
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
    messages.push({ role: 'user', content: prompt })

    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, max_tokens: 4096 }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => null)
      const msg = (err as { error?: { message?: string } } | null)?.error?.message
        || `${provider.name} API error ${res.status}: ${res.statusText}`
      throw new Error(msg)
    }

    const data = await res.json() as { choices: Array<{ message: { content: string } }> }
    return data.choices?.[0]?.message?.content || ''
  }

  // ── Ollama ─────────────────────────────────────────
  if (pid === 'ollama') {
    const base = (provider.base_url || 'http://localhost:11434').replace(/\/+$/, '')
    const messages: Array<{ role: string; content: string }> = []
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
    messages.push({ role: 'user', content: prompt })

    // Try native Ollama API first: POST /api/chat
    try {
      const res = await fetch(`${base}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, stream: false }),
      })
      if (res.ok) {
        const data = await res.json() as { message: { content: string } }
        return data.message?.content || ''
      }
    } catch { /* try OpenAI-compatible */ }

    // Try OpenAI-compatible: POST /v1/chat/completions
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (provider.api_key) headers['Authorization'] = `Bearer ${provider.api_key}`
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model, messages, max_tokens: 4096 }),
    })
    if (!res.ok) throw new Error(`Ollama error ${res.status}: ${res.statusText}. Check that Ollama is running at ${base}`)
    const data = await res.json() as { choices: Array<{ message: { content: string } }> }
    return data.choices?.[0]?.message?.content || ''
  }

  // ── Unknown provider — try OpenAI-compatible format ─
  if (provider.base_url) {
    const messages: Array<{ role: string; content: string }> = []
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
    messages.push({ role: 'user', content: prompt })

    const res = await fetch(`${provider.base_url}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, max_tokens: 4096 }),
    })

    if (!res.ok) throw new Error(`${provider.name} error ${res.status}`)
    const data = await res.json() as { choices: Array<{ message: { content: string } }> }
    return data.choices?.[0]?.message?.content || ''
  }

  throw new Error(`Unsupported provider: ${pid}. Configure a base URL in Settings for custom providers.`)
}

/**
 * Extract JSON from AI response text (handles markdown code blocks, extra text, etc.)
 */
export function extractJSON<T>(text: string): T {
  // Try direct parse first
  try { return JSON.parse(text.trim()) as T } catch { /* continue */ }

  // Strip markdown code blocks
  const stripped = text.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim()
  try { return JSON.parse(stripped) as T } catch { /* continue */ }

  // Find JSON array or object
  const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
  if (match) return JSON.parse(match[0]) as T

  throw new Error('Could not extract JSON from AI response. The AI may have returned an unexpected format.')
}
