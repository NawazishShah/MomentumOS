-- Labels
create table public.labels (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  color      text not null default '#6366f1',
  created_at timestamptz default now()
);

-- Projects
create table public.projects (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  description text,
  color       text default '#6366f1',
  is_archived boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Tasks
create table public.tasks (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  project_id  uuid references public.projects(id) on delete set null,
  label_id    uuid references public.labels(id) on delete set null,
  title       text not null,
  notes       text,
  status      text not null default 'inbox'
              check (status in ('inbox','todo','in_progress','done')),
  priority    text not null default 'medium'
              check (priority in ('low','medium','high')),
  due_date    date,
  sort_order  integer default 0,
  completed_at timestamptz,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Enable RLS on all three tables
alter table public.labels  enable row level security;
alter table public.projects enable row level security;
alter table public.tasks    enable row level security;

-- RLS policies: users own their own rows
create policy "own labels"   on public.labels
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own projects" on public.projects
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own tasks"    on public.tasks
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Updated_at trigger (reuse for both tasks and projects)
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger tasks_updated_at    before update on public.tasks
  for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- Enable realtime for tasks table
alter publication supabase_realtime add table public.tasks;
