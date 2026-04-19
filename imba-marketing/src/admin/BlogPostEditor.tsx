import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { BlogPost, BlogCategory } from '@/lib/supabase'
import RichTextEditor from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { ArrowLeft, Loader2, Save, Eye, Sparkles, X, Upload } from 'lucide-react'

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function BlogPostEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'

  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const tagInputRef = useRef<HTMLInputElement>(null)

  // Media picker state
  const [mediaOpen, setMediaOpen] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<Array<{ id: string; url: string; filename: string; mime_type: string }>>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaUploading, setMediaUploading] = useState(false)
  const editorRef = useRef<any>(null)

  // AI state
  const [aiOpen, setAiOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    cover_image_url: '',
    featured_image_url: '',
    category: '',
    category_id: '',
    tags: [] as string[],
    read_time_minutes: 5,
    published: false,
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    author_name: '',
    seo_title: '',
    seo_description: '',
    og_image_url: '',
  })

  useEffect(() => {
    supabase.from('blog_categories').select('*').order('name')
      .then(({ data }) => setCategories(data || []))
  }, [])

  useEffect(() => {
    if (isNew) return
    setLoading(true)
    supabase.from('blog_posts').select('*').eq('id', id).single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          navigate('/admin/blog', { replace: true })
          return
        }
        const post = data as BlogPost
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          body: post.body || '',
          cover_image_url: post.cover_image_url || '',
          featured_image_url: post.featured_image_url || '',
          category: post.category || '',
          category_id: post.category_id || '',
          tags: post.tags ? [...post.tags] : [],
          read_time_minutes: post.read_time_minutes ?? 5,
          published: post.published,
          status: post.status || 'draft',
          author_name: post.author_name || '',
          seo_title: post.seo_title || '',
          seo_description: post.seo_description || '',
          og_image_url: post.og_image_url || '',
        })
        setLoading(false)
      })
  }, [id, isNew, navigate])

  function addTag() {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }))
    }
    setTagInput('')
    tagInputRef.current?.focus()
  }

  function removeTag(tag: string) {
    setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))
  }

  async function loadMedia() {
    setMediaLoading(true)
    const { data } = await supabase
      .from('media_files')
      .select('id, url, filename, mime_type')
      .like('mime_type', 'image/%')
      .order('created_at', { ascending: false })
      .limit(50)
    setMediaFiles(data || [])
    setMediaLoading(false)
  }

  function handleMediaSelect(url: string) {
    if (editorRef.current) {
      editorRef.current.chain().focus().setImage({ src: url }).run()
    }
    setMediaOpen(false)
  }

  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setMediaUploading(true)
    const ext = file.name.split('.').pop()
    const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: uploadErr } = await supabase.storage.from('media').upload(path, file)
    if (uploadErr) {
      setError(`Upload failed: ${uploadErr.message}`)
      setMediaUploading(false)
      return
    }
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(path)
    const publicUrl = urlData.publicUrl
    // Insert record into media_files table
    await supabase.from('media_files').insert([{
      filename: file.name,
      url: publicUrl,
      mime_type: file.type,
      size_bytes: file.size,
      storage_path: path,
    }])
    // Insert into editor and refresh grid
    handleMediaSelect(publicUrl)
    setMediaUploading(false)
    loadMedia()
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setError('')
    setSaved(false)

    const payload = {
      title: form.title,
      slug: form.slug || toSlug(form.title),
      excerpt: form.excerpt,
      body: form.body,
      cover_image_url: form.cover_image_url,
      featured_image_url: form.featured_image_url,
      category: form.category,
      category_id: form.category_id || null,
      tags: form.tags,
      read_time_minutes: form.read_time_minutes,
      published: form.published,
      status: form.status,
      author_name: form.author_name,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      og_image_url: form.og_image_url,
      published_at: form.published ? new Date().toISOString() : null,
    }

    if (isNew) {
      const { data, error: err } = await supabase.from('blog_posts').insert([payload]).select().single()
      if (err) { setError(err.message); setSaving(false); return }
      setSaving(false)
      setSaved(true)
      // Navigate to edit mode with the new ID
      if (data) navigate(`/admin/blog/${data.id}`, { replace: true })
    } else {
      const { error: err } = await supabase.from('blog_posts').update(payload).eq('id', id)
      if (err) { setError(err.message); setSaving(false); return }
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  async function handleAiGenerate() {
    if (!aiPrompt.trim()) { setAiError('Please enter a topic.'); return }
    setAiLoading(true)
    setAiError('')
    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-suggest', {
        body: { kind: 'blog_post', topic: aiPrompt.trim() },
      })
      if (fnError) throw new Error(fnError.message)
      if (data?.error) throw new Error(data.error)
      const parsed = data as {
        title?: string; slug?: string; excerpt?: string; body?: string
        category?: string; tags?: string[]; read_time_minutes?: number
        seo_title?: string; seo_description?: string
      }
      setForm(f => ({
        ...f,
        title: parsed.title || f.title,
        slug: parsed.slug || toSlug(parsed.title || f.title),
        excerpt: parsed.excerpt || f.excerpt,
        body: parsed.body || f.body,
        category: parsed.category || f.category,
        tags: parsed.tags || f.tags,
        read_time_minutes: parsed.read_time_minutes || f.read_time_minutes,
        seo_title: parsed.seo_title || f.seo_title,
        seo_description: parsed.seo_description || f.seo_description,
      }))
      setAiOpen(false)
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-6 py-3 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/blog')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              All posts
            </Button>
            <span className="text-muted-foreground text-sm">
              {isNew ? 'New post' : `Editing: ${form.title || 'Untitled'}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs text-green-500 font-mono">Saved ✓</span>
            )}
            <Button variant="outline" size="sm"
              onClick={() => { setAiOpen(true); setAiError(''); setAiPrompt('') }}>
              <Sparkles className="h-4 w-4 mr-1" />
              AI Generate
            </Button>
            {form.slug && (
              <Button variant="outline" size="sm" asChild>
                <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </a>
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Saving...</>
              ) : (
                <><Save className="h-4 w-4 mr-1" />Save</>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Editor layout ── */}
      <div className="max-w-screen-2xl mx-auto px-6 py-8 grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">

        {/* Main column */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: isNew ? toSlug(e.target.value) : f.slug }))}
              placeholder="Post title"
              className="w-full bg-transparent border-none outline-none font-display text-3xl font-light text-foreground placeholder:text-muted-foreground/40"
            />
          </div>

          {/* Excerpt */}
          <div>
            <RichTextEditor
              content={form.excerpt}
              onChange={val => setForm(f => ({ ...f, excerpt: val }))}
              compact
              placeholder="Write a short excerpt (shown in blog listings)…"
            />
          </div>

          {/* Rich text editor */}
          <RichTextEditor
            content={form.body}
            onChange={html => setForm(f => ({ ...f, body: html }))}
            placeholder="Start writing your blog post..."
            onInsertImage={() => { loadMedia(); setMediaOpen(true) }}
            editorRef={editorRef}
          />

          {error && (
            <p className="text-destructive text-sm bg-destructive/10 px-4 py-2 rounded">{error}</p>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">

          {/* Publish settings */}
          <div className="border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Publish</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="s-published" className="text-sm">Published</Label>
                <Switch
                  id="s-published"
                  checked={form.published}
                  onCheckedChange={c => setForm(f => ({ ...f, published: c, status: c ? 'published' : 'draft' }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={val => setForm(f => ({ ...f, status: val as 'draft' | 'published' | 'scheduled' }))}
                >
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: toSlug(e.target.value) }))}
                  placeholder="auto-generated"
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Category & Author */}
          <div className="border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Details</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <Select
                  value={form.category_id || '__none__'}
                  onValueChange={val => {
                    if (val === '__none__') {
                      setForm(f => ({ ...f, category_id: '', category: '' }))
                    } else {
                      const cat = categories.find(c => c.id === val)
                      setForm(f => ({ ...f, category_id: val, category: cat?.name || '' }))
                    }
                  }}
                >
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">No category</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Author</Label>
                <Input
                  value={form.author_name}
                  onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                  placeholder="e.g. Imba Team"
                  className="h-9"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Read time (min)</Label>
                <Input
                  type="number" min={1}
                  value={form.read_time_minutes}
                  onChange={e => setForm(f => ({ ...f, read_time_minutes: parseInt(e.target.value) || 5 }))}
                  className="h-9"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Tags</h3>
            <div className="flex flex-wrap gap-1.5 min-h-[2rem] p-2 border border-input rounded-md bg-background mb-2">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
                }}
                placeholder={form.tags.length === 0 ? 'Type + Enter' : 'Add...'}
                className="flex-1 min-w-[80px] outline-none bg-transparent text-sm"
              />
            </div>
          </div>

          {/* Images */}
          <div className="border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Images</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Cover image URL</Label>
                <Input
                  value={form.cover_image_url}
                  onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))}
                  placeholder="https://..."
                  className="h-9"
                />
                {form.cover_image_url && (
                  <img src={form.cover_image_url} alt="Cover preview" className="w-full h-24 object-cover rounded mt-1 border border-border" />
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Featured image URL</Label>
                <Input
                  value={form.featured_image_url}
                  onChange={e => setForm(f => ({ ...f, featured_image_url: e.target.value }))}
                  placeholder="https://..."
                  className="h-9"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">SEO</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">SEO title</Label>
                <Input
                  value={form.seo_title}
                  onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))}
                  placeholder="Override for search engines"
                  className="h-9"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">SEO description</Label>
                <Textarea
                  rows={2}
                  value={form.seo_description}
                  onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))}
                  placeholder="150–160 chars"
                  className="text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">OG image URL</Label>
                <Input
                  value={form.og_image_url}
                  onChange={e => setForm(f => ({ ...f, og_image_url: e.target.value }))}
                  placeholder="https://..."
                  className="h-9"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Generator Dialog ── */}
      <Dialog open={aiOpen} onOpenChange={open => { setAiOpen(open); if (!open) setAiError('') }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate post with AI
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ai-prompt">Post topic / brief</Label>
              <Textarea
                id="ai-prompt"
                rows={3}
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. How AI email personalization increases e-commerce repeat purchases by 40%"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-muted-foreground">
                Uses the workspace AI provider configuration from Admin Settings.
              </p>
            </div>
            {aiError && <p className="text-destructive text-sm">{aiError}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setAiOpen(false)}>Cancel</Button>
            <Button onClick={handleAiGenerate} disabled={aiLoading}>
              {aiLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Generate</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Media Picker Dialog ── */}
      <Dialog open={mediaOpen} onOpenChange={setMediaOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Click an image to insert it into the editor.
            </p>
            <label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMediaUpload}
                disabled={mediaUploading}
              />
              <Button variant="outline" size="sm" asChild disabled={mediaUploading}>
                <span className="cursor-pointer">
                  {mediaUploading ? (
                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Uploading...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-1" />Upload</>
                  )}
                </span>
              </Button>
            </label>
          </div>
          <div className="flex-1 overflow-y-auto">
            {mediaLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : mediaFiles.length === 0 ? (
              <p className="text-center text-muted-foreground py-16 text-sm">
                No images found. Upload one to get started.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {mediaFiles.map(file => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => handleMediaSelect(file.url)}
                    className="group relative aspect-square rounded-md overflow-hidden border border-border hover:border-primary hover:ring-2 hover:ring-primary/30 transition-all bg-muted"
                  >
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] truncate">{file.filename}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
