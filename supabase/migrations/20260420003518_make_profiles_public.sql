-- Drop the old policy
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;

-- Create the new policy allowing anyone to view profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
