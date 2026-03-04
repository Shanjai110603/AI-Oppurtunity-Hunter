-- Create leads table
CREATE TABLE leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name text,
  platform_source text NOT NULL,
  original_post_url text,
  problem_description text NOT NULL,
  opportunity_score numeric DEFAULT 0,
  urgency_level text,
  solution_suggested text,
  contact_email text,
  contact_phone text,
  social_links jsonb DEFAULT '[]'::jsonb,
  estimated_revenue_range text,
  automation_blueprint text,
  estimated_build_hours numeric,
  pricing_beginner text,
  pricing_intermediate text,
  pricing_expert text,
  outreach_message text,
  status text DEFAULT 'new',
  follow_up_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Turn on RLS but allow anon access for now (since this is an MVP without user auth yet)
-- Alternatively, in a real app protect this. For our MVP, we can just allow public access or use service roles.
-- We will keep it simple and allow public inserts for the extension, and public reads for the dashboard.
CREATE POLICY "Allow public all access to leads"
ON public.leads
FOR ALL
USING (true)
WITH CHECK (true);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
