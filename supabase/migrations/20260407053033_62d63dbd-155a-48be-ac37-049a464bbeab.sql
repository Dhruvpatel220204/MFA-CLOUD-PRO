
CREATE POLICY "Authenticated users can insert failed login attempts"
ON public.login_attempts
FOR INSERT
TO authenticated
WITH CHECK (success = false);
