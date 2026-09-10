-- Programming Pattern Trainer — initial schema, RLS, and language seed.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'User',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.languages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  monaco_language text not null,
  execution_language_id text not null,
  file_extension text not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  default_timeout_ms integer not null default 5000 check (default_timeout_ms > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.concepts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  parent_id uuid references public.concepts (id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text not null default '',
  learning_objectives text not null default '',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (parent_id is distinct from id)
);

create table public.problems (
  id uuid primary key default gen_random_uuid(),
  concept_id uuid not null references public.concepts (id) on delete restrict,
  slug text not null unique,
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  instructions text not null default '',
  constraints text not null default '',
  example_input text not null default '',
  example_output text not null default '',
  time_complexity text not null default '',
  space_complexity text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  created_by uuid references public.profiles (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.problem_languages (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems (id) on delete cascade,
  language_id uuid not null references public.languages (id) on delete restrict,
  starter_code text not null default '',
  solution_code text not null default '',
  function_signature text not null default '',
  explanation text not null default '',
  validation_status text not null default 'unverified'
    check (validation_status in ('unverified', 'passed', 'failed')),
  validation_log text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (problem_id, language_id)
);

create table public.problem_test_cases (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems (id) on delete cascade,
  input text not null default '',
  expected_output text not null default '',
  is_hidden boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.problem_hints (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references public.problems (id) on delete cascade,
  hint_level integer not null check (hint_level between 1 and 5),
  content text not null,
  created_at timestamptz not null default now(),
  unique (problem_id, hint_level)
);

create table public.user_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  problem_id uuid not null references public.problems (id) on delete cascade,
  language_id uuid not null references public.languages (id) on delete restrict,
  code text not null,
  mode text not null check (mode in ('run', 'submit')),
  status text not null check (
    status in (
      'passed',
      'failed_tests',
      'compile_error',
      'runtime_error',
      'timeout',
      'provider_unavailable'
    )
  ),
  tests_passed integer not null default 0,
  tests_total integer not null default 0,
  runtime_ms integer,
  stdout text not null default '',
  stderr text not null default '',
  created_at timestamptz not null default now()
);

create table public.user_problem_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  problem_id uuid not null references public.problems (id) on delete cascade,
  status text not null check (status in ('attempted', 'completed', 'mastered')),
  completed_at timestamptz,
  mastered_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, problem_id)
);

create table public.user_code_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  problem_id uuid not null references public.problems (id) on delete cascade,
  language_id uuid not null references public.languages (id) on delete restrict,
  code text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, problem_id, language_id)
);

create table public.ai_generation_runs (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles (id) on delete restrict,
  concept_id uuid not null references public.concepts (id) on delete restrict,
  request jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'validated', 'failed')),
  error text not null default '',
  created_at timestamptz not null default now()
);

create table public.api_rate_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index concepts_category_id_sort_order_idx
  on public.concepts (category_id, sort_order);
create index concepts_parent_id_sort_order_idx
  on public.concepts (parent_id, sort_order);

create index problems_status_concept_id_idx
  on public.problems (status, concept_id);
create index problems_status_difficulty_idx
  on public.problems (status, difficulty);
create index problems_published_created_at_idx
  on public.problems (created_at desc)
  where status = 'published';
create index problems_title_ilike_idx
  on public.problems (lower(title));

create index problem_test_cases_problem_id_sort_order_idx
  on public.problem_test_cases (problem_id, sort_order);

create index user_attempts_user_id_created_at_idx
  on public.user_attempts (user_id, created_at desc);
create index user_attempts_user_id_problem_id_created_at_idx
  on public.user_attempts (user_id, problem_id, created_at desc);

create index user_problem_progress_user_id_status_idx
  on public.user_problem_progress (user_id, status);

create index api_rate_events_user_id_action_created_at_idx
  on public.api_rate_events (user_id, action, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger languages_set_updated_at
  before update on public.languages
  for each row execute function public.set_updated_at();

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create trigger concepts_set_updated_at
  before update on public.concepts
  for each row execute function public.set_updated_at();

create trigger problems_set_updated_at
  before update on public.problems
  for each row execute function public.set_updated_at();

create trigger problem_languages_set_updated_at
  before update on public.problem_languages
  for each row execute function public.set_updated_at();

create trigger user_problem_progress_set_updated_at
  before update on public.user_problem_progress
  for each row execute function public.set_updated_at();

create trigger user_code_drafts_set_updated_at
  before update on public.user_code_drafts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth profile trigger — never trust the client to insert admin
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(coalesce(new.email, 'user'), '@', 1),
      'User'
    ),
    'user'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Language seed (Judge0 CE ids — confirm against the deployed Judge0 version)
-- ---------------------------------------------------------------------------

insert into public.languages (
  slug, name, monaco_language, execution_language_id, file_extension, enabled, sort_order
) values
  ('python', 'Python', 'python', '71', '.py', true, 10),
  ('javascript', 'JavaScript', 'javascript', '63', '.js', true, 20),
  ('typescript', 'TypeScript', 'typescript', '74', '.ts', true, 30),
  ('c', 'C', 'c', '50', '.c', true, 40),
  ('go', 'Go', 'go', '60', '.go', true, 50),
  ('php', 'PHP', 'php', '68', '.php', true, 60);

-- ---------------------------------------------------------------------------
-- Grants and column-level protection for solutions
-- ---------------------------------------------------------------------------

revoke select on table public.problem_languages from anon, authenticated;
grant select (
  id,
  problem_id,
  language_id,
  starter_code,
  function_signature,
  created_at,
  updated_at
) on table public.problem_languages to anon, authenticated;

revoke update on table public.profiles from anon, authenticated;
grant update (display_name) on table public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.languages enable row level security;
alter table public.categories enable row level security;
alter table public.concepts enable row level security;
alter table public.problems enable row level security;
alter table public.problem_languages enable row level security;
alter table public.problem_test_cases enable row level security;
alter table public.problem_hints enable row level security;
alter table public.user_attempts enable row level security;
alter table public.user_problem_progress enable row level security;
alter table public.user_code_drafts enable row level security;
alter table public.ai_generation_runs enable row level security;
alter table public.api_rate_events enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_display_name"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    raise exception 'Cannot change role';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_profile_role_change();

create policy "languages_select_enabled_or_admin"
  on public.languages for select
  to anon, authenticated
  using (enabled = true or public.is_admin());

create policy "languages_admin_write"
  on public.languages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "categories_select"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "categories_admin_write"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "concepts_select_published_or_admin"
  on public.concepts for select
  to anon, authenticated
  using (published = true or public.is_admin());

create policy "concepts_admin_write"
  on public.concepts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "problems_select_published_or_admin"
  on public.problems for select
  to anon, authenticated
  using (status = 'published' or public.is_admin());

create policy "problems_admin_write"
  on public.problems for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "problem_languages_select_published_or_admin"
  on public.problem_languages for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.problems p
      where p.id = problem_id
        and p.status = 'published'
    )
  );

create policy "problem_languages_admin_write"
  on public.problem_languages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "problem_test_cases_select_visible_or_admin"
  on public.problem_test_cases for select
  to anon, authenticated
  using (
    public.is_admin()
    or (
      is_hidden = false
      and exists (
        select 1
        from public.problems p
        where p.id = problem_id
          and p.status = 'published'
      )
    )
  );

create policy "problem_test_cases_admin_write"
  on public.problem_test_cases for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "problem_hints_select_published_or_admin"
  on public.problem_hints for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.problems p
      where p.id = problem_id
        and p.status = 'published'
    )
  );

create policy "problem_hints_admin_write"
  on public.problem_hints for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "user_attempts_select_own"
  on public.user_attempts for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "user_problem_progress_select_own"
  on public.user_problem_progress for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "user_code_drafts_own"
  on public.user_code_drafts for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "ai_generation_runs_admin"
  on public.ai_generation_runs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "api_rate_events_own_select"
  on public.api_rate_events for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Promote an administrator with the service role / SQL editor:
--   update public.profiles set role = 'admin' where id = '<user-uuid>';
