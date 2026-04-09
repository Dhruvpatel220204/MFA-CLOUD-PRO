
-- Drop the broken SELECT policy
DROP POLICY "Users can view own login attempts" ON public.login_attempts;

-- Recreate using auth.jwt() instead of querying auth.users
CREATE POLICY "Users can view own login attempts"
ON public.login_attempts
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR email = (auth.jwt() ->> 'email')
);
