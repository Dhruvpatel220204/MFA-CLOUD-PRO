-- Enable realtime for login_attempts
ALTER PUBLICATION supabase_realtime ADD TABLE public.login_attempts;

-- Allow anonymous (unauthenticated) users to insert login attempts for failed logins
CREATE POLICY "Anyone can insert failed login attempts"
ON public.login_attempts
FOR INSERT
TO anon
WITH CHECK (success = false);