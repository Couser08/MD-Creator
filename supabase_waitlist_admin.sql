-- ==============================================================================
-- MD WRITER: Waitlist Table & Admin Access Migration
-- Dedicated for tungariyarahul08@gmail.com admin dashboard
-- ==============================================================================

-- 1. Create waitlist table if not exists
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    plan TEXT DEFAULT 'pro',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index on email and creation date for fast sorting and deduplication
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);

-- 3. Enable Row-Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- 4. Drop any existing policies to prevent conflicts
DROP POLICY IF EXISTS "Allow public insert into waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Allow admin read on waitlist" ON public.waitlist;

-- 5. Policy: Public (both anon and authenticated) can register their email
CREATE POLICY "Allow public insert into waitlist"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 6. Policy: Only tungariyarahul08@gmail.com can view all waitlist entries
CREATE POLICY "Allow admin read on waitlist"
ON public.waitlist
FOR SELECT
TO authenticated
USING (
    (auth.jwt() ->> 'email') = 'tungariyarahul08@gmail.com'
);

-- 7. Grant necessary permissions to anon and authenticated roles
GRANT INSERT ON public.waitlist TO anon, authenticated;
GRANT SELECT ON public.waitlist TO authenticated;

-- Confirmation query
COMMENT ON TABLE public.waitlist IS 'Stores pro waitlist signups with admin read permissions for tungariyarahul08@gmail.com';
