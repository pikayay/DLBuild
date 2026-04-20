-- Create a table for user builds
create table public.builds (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  hero_id integer not null,
  name text not null,
  description text,
  items jsonb not null default '{}'::jsonb,
  published boolean not null default false
);

create table public.build_likes (
  build_id uuid not null references public.builds on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (build_id, user_id)
);

create table public.build_comments (
  id uuid primary key default gen_random_uuid(),
  build_id uuid not null references public.builds on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table public.builds enable row level security;
alter table public.build_likes enable row level security;
alter table public.build_comments enable row level security;

-- Policies
create policy "Users can view published builds" on public.builds
  for select using (published = true);

create policy "Users can view their own builds" on public.builds
  for select using (auth.uid() = user_id);

create policy "Users can insert their own builds" on public.builds
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own builds" on public.builds
  for update using (auth.uid() = user_id);

create policy "Users can delete their own builds" on public.builds
  for delete using (auth.uid() = user_id);

-- Likes policies
create policy "Anyone can view build likes" on public.build_likes
  for select using (true);

create policy "Users can insert their own likes" on public.build_likes
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own likes" on public.build_likes
  for delete using (auth.uid() = user_id);

-- Comments policies
create policy "Anyone can view build comments" on public.build_comments
  for select using (true);

create policy "Users can insert their own comments" on public.build_comments
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own comments" on public.build_comments
  for update using (auth.uid() = user_id);

create policy "Users can delete their own comments" on public.build_comments
  for delete using (auth.uid() = user_id);

-- Trigger to update `updated_at` before any update
CREATE TRIGGER update_builds_updated_at
  BEFORE UPDATE ON public.builds
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_build_comments_updated_at
  BEFORE UPDATE ON public.build_comments
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();
