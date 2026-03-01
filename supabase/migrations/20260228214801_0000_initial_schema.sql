-- Create the profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  primary key (id)
);

-- Add RLS
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "Users can view their own profile."
  on profiles for select using (auth.uid() = id);

create policy "Users can insert their own profile."
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update using (auth.uid() = id);

-- Function to automatically create a profile for a new user
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function when a new user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up updated_at trigger
create extension if not exists moddatetime schema extensions;
create trigger handle_updated_at before update on profiles
  for each row execute procedure extensions.moddatetime (updated_at);
