-- ═══════════════════════════════════════════════════════════
--  V008: Comprehensive Inbox System
-- ═══════════════════════════════════════════════════════════

-- 1. Enhance crm_inbox_messages
ALTER TABLE public.crm_inbox_messages
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general', -- contact, support, sales, general
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS assigned_to UUID; -- References auth.users(id), but we'll leave as UUID to avoid strict FK issues if users are deleted

-- 2. Create Audit Logs table
CREATE TABLE IF NOT EXISTS public.crm_inbox_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES public.crm_inbox_messages(id) ON DELETE CASCADE,
  user_id UUID, -- The user who performed the action
  action TEXT NOT NULL, -- created, status_changed, priority_changed, assigned, replied
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crm_inbox_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all_crm_inbox_audit_logs" ON public.crm_inbox_audit_logs
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

GRANT ALL ON public.crm_inbox_audit_logs TO authenticated, service_role;

-- 3. Update RLS on crm_inbox_messages to allow public inserts
DROP POLICY IF EXISTS "public_insert_crm_inbox_messages" ON public.crm_inbox_messages;
CREATE POLICY "public_insert_crm_inbox_messages" ON public.crm_inbox_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 4. Trigger: Auto-capture quote_requests into crm_inbox_messages
CREATE OR REPLACE FUNCTION public.capture_quote_request_to_inbox()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.crm_inbox_messages (
    direction,
    subject,
    body,
    from_email,
    type,
    priority,
    metadata
  ) VALUES (
    'inbound',
    COALESCE(NEW.service_type, 'New Quote Request'),
    NEW.message,
    NEW.email,
    'sales',
    'high',
    jsonb_build_object(
      'full_name', NEW.full_name,
      'company', NEW.company,
      'budget_range', NEW.budget_range,
      'quote_request_id', NEW.id
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS capture_quote_request_to_inbox_trigger ON public.quote_requests;
CREATE TRIGGER capture_quote_request_to_inbox_trigger
  AFTER INSERT ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.capture_quote_request_to_inbox();

-- 5. Trigger: Auto-log audit trail for crm_inbox_messages
CREATE OR REPLACE FUNCTION public.log_inbox_message_audit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.crm_inbox_audit_logs (message_id, action, details)
    VALUES (NEW.id, 'created', jsonb_build_object('type', NEW.type, 'direction', NEW.direction));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.crm_inbox_audit_logs (message_id, action, details)
      VALUES (NEW.id, 'status_changed', jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status));
    END IF;
    IF OLD.priority IS DISTINCT FROM NEW.priority THEN
      INSERT INTO public.crm_inbox_audit_logs (message_id, action, details)
      VALUES (NEW.id, 'priority_changed', jsonb_build_object('old_priority', OLD.priority, 'new_priority', NEW.priority));
    END IF;
    IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
      INSERT INTO public.crm_inbox_audit_logs (message_id, action, details)
      VALUES (NEW.id, 'assigned', jsonb_build_object('old_assigned_to', OLD.assigned_to, 'new_assigned_to', NEW.assigned_to));
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS log_inbox_message_audit_trigger ON public.crm_inbox_messages;
CREATE TRIGGER log_inbox_message_audit_trigger
  AFTER INSERT OR UPDATE ON public.crm_inbox_messages
  FOR EACH ROW EXECUTE FUNCTION public.log_inbox_message_audit();

-- 6. Trigger: Auto-acknowledgment (creates an outbound message draft or logs it)
CREATE OR REPLACE FUNCTION public.auto_acknowledge_inbox_message()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Only auto-reply to inbound messages that have an email
  IF NEW.direction = 'inbound' AND NEW.from_email IS NOT NULL AND NEW.from_email != '' THEN
    -- We can log an outbound message as a draft or sent (representing the auto-reply)
    -- In a real scenario, this might call an Edge Function to actually send the email.
    -- Here we log it in the inbox for visibility.
    INSERT INTO public.crm_inbox_messages (
      direction,
      subject,
      body,
      to_email,
      type,
      status,
      metadata
    ) VALUES (
      'outbound',
      'Re: ' || NEW.subject,
      'Thank you for reaching out to Imba Marketing! We have received your message and our team will get back to you within 24 hours. Your inquiry is important to us.',
      NEW.from_email,
      NEW.type,
      'sent', -- Mark as sent since it's an auto-reply
      jsonb_build_object('is_auto_reply', true, 'original_message_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$;

-- We only want this to run once on insert
DROP TRIGGER IF EXISTS auto_acknowledge_inbox_message_trigger ON public.crm_inbox_messages;
CREATE TRIGGER auto_acknowledge_inbox_message_trigger
  AFTER INSERT ON public.crm_inbox_messages
  FOR EACH ROW
  WHEN (NEW.direction = 'inbound')
  EXECUTE FUNCTION public.auto_acknowledge_inbox_message();

-- 7. Enable Realtime for crm_inbox_messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'crm_inbox_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_inbox_messages;
  END IF;
END $$;

