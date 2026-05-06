-- Habits
create table public.habits (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  description text,
  color       text not null default '#6366f1',
  frequency   text not null default 'daily' 
              check (frequency in ('daily', 'weekly')),
  target_days integer default 1, -- e.g. 3 times a week
  is_archived boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Habit Logs (completions)
create table public.habit_logs (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  habit_id    uuid references public.habits(id) on delete cascade not null,
  completed_at date not null default current_date,
  created_at  timestamptz default now(),
  -- Ensure a user can only log a specific habit once per day
  unique(habit_id, completed_at)
);

-- Enable RLS
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

-- RLS policies
create policy "own habits" on public.habits
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own logs" on public.habit_logs
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Updated_at trigger
create trigger habits_updated_at before update on public.habits
  for each row execute function public.set_updated_at();

-- Enable realtime
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.habit_logs;
