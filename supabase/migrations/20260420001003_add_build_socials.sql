ALTER TABLE public.builds DROP CONSTRAINT IF EXISTS builds_user_id_fkey;
ALTER TABLE public.builds ADD CONSTRAINT builds_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

CREATE TABLE public.build_likes (
  build_id uuid not null references public.builds on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (build_id, user_id)
);

CREATE TABLE public.build_comments (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.builds on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

ALTER TABLE public.build_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.build_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view build likes" ON public.build_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON public.build_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON public.build_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view build comments" ON public.build_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comments" ON public.build_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.build_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.build_comments FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_build_comments_updated_at
  BEFORE UPDATE ON public.build_comments
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();
