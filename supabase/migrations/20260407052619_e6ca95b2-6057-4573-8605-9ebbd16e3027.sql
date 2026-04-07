
DROP POLICY IF EXISTS "Users can view own login attempts" ON public.login_attempts;
CREATE POLICY "Users can view own login attempts"
ON public.login_attempts
FOR SELECT
TO public
USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));
