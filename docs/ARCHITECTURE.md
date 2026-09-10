# Architecture

Programming Pattern Trainer — application architecture for the MVP.

This document is the technical counterpart to [`docs/PRD.md`](./PRD.md). Product requirements live in the PRD. This file records system boundaries, data design, security, and the decisions that follow from the PRD.

**Status:** proposed. Do not begin major implementation until this document and [`docs/IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) are reviewed.

---

## 1. Repository inspection

Inspected on 2026-09-10.

| Question | Finding |
| --- | --- |
| What exists | Only `prd.md` at the repository root. No application code. |
| Dependencies | None. No `package.json`. |
| Next.js version / structure | Not scaffolded. |
| Styling conventions | None. |
| Environment configuration | None. No `.env.example`. |
| Supabase | None. No `supabase/` directory, no clients, no RLS. |
| Migrations | None. |
| Authentication | None. |
| Reusable components | None. |
| Conflicts with the PRD | None in code. The original PRD listed Go and PHP as future languages while enumerating only Python, JavaScript, TypeScript, and C as MVP languages. That is resolved in `docs/PRD.md`. |

This is a greenfield project. The architecture below is the starting contract, not a description of existing code.

Canonical product spec: `docs/PRD.md`. The root `prd.md` points at that file.

---

## 2. Application boundaries

Single Next.js application, deployable on Vercel.

```text
Browser
  │
  ▼
Next.js (Vercel)
  ├── App Router (Server Components, Client Components)
  ├── Route Handlers / Server Actions
  ├── Domain modules (TypeScript)
  │
  ├── Supabase
  │     ├── PostgreSQL
  │     ├── Auth
  │     └── Row Level Security
  │
  ├── AI Provider (server-only)
  │
  └── Code Execution Provider (server-only)
        └── External sandbox (Judge0 or equivalent)
```

In:

- Product UI
- Auth session handling
- Curriculum and problem reads
- Execution orchestration
- AI generation and tutoring orchestration
- Admin review/publish workflow

Out of process (external systems, not custom services we operate):

- Supabase Auth and PostgreSQL
- Sandboxed code execution
- AI model provider

Explicitly not in MVP:

- Microservices
- A separate Express API
- Redis
- Kafka / queues
- Kubernetes
- Extra package repositories / monorepo packages
- Contest anti-cheat beyond hidden tests and RLS
- Gamification (achievements, leaderboards, rewards)

---

## 3. Recommended stack

| Concern | Choice | Why |
| --- | --- | --- |
| App | Latest stable Next.js App Router | Matches PRD; Vercel-native |
| Language | TypeScript, `strict` | PRD |
| UI | React Server Components by default; Client Components for editor, filters, and interactive workspace | PRD |
| Styling | Tailwind CSS + shadcn/ui (Radix) | PRD; source-owned components |
| Database / Auth | Supabase PostgreSQL + Supabase Auth + RLS | PRD |
| Supabase in Next.js | `@supabase/ssr` + `@supabase/supabase-js` | Cookie sessions on App Router |
| Editor | Monaco via `@monaco-editor/react`, dynamic import, `ssr: false` | PRD; Monaco is browser-only |
| Validation | Zod | PRD; shared by API, AI, and forms |
| Tests | Vitest for domain logic | Fast unit tests without a browser |
| Execution | `CodeExecutionProvider` → Judge0 CE for MVP | PRD; stdin/stdout judge; Go and PHP included |
| AI | Thin `AiProvider` wrapping the Vercel AI SDK / AI Gateway | Structured output without coupling domain logic to one vendor SDK |
| Rate limits | PostgreSQL-backed counters | No Redis; works on Vercel |

Use a `src/` directory:

```text
src/
  app/                 # routes
  components/          # UI
  lib/                 # domain, integrations, auth
  types/               # shared types
supabase/
  migrations/
  seed.sql
docs/
```

---

## 4. Route map

```text
src/app/
  (marketing)/
    page.tsx                         # home
  (public)/
    concepts/page.tsx
    concepts/[slug]/page.tsx
    problems/page.tsx                # browser; filters via searchParams
    problems/[slug]/page.tsx         # workspace
  (authenticated)/
    dashboard/page.tsx
    attempts/page.tsx
  auth/
    sign-in/page.tsx
    sign-up/page.tsx
    callback/route.ts                # Supabase auth callback
  admin/
    layout.tsx                       # server-side admin gate
    page.tsx
    categories/page.tsx
    concepts/page.tsx
    problems/page.tsx
    problems/[id]/page.tsx
    languages/page.tsx
    generate/page.tsx
    drafts/page.tsx
    review/page.tsx
  api/
    execute/route.ts                 # Run / Submit
    ai/generate/route.ts             # admin
    ai/explain/route.ts              # authenticated tutor
```

Middleware may redirect unauthenticated users away from `/dashboard` and `/admin`, and non-admins away from `/admin`. Middleware is not the authorization boundary. Route handlers, server actions, and RLS are.

---

## 5. Database model

UUIDs for all primary keys except where a natural key is clearer (`languages.slug` remains unique; `id` is still UUID).

`created_at` / `updated_at` on every mutable table. `updated_at` maintained by a shared trigger.

### 5.1 ER overview

```text
auth.users
    │
    └── profiles

categories
    └── concepts (parent_id → concepts)
            └── problems
                    ├── problem_languages → languages
                    ├── problem_test_cases
                    └── problem_hints

profiles
    ├── user_attempts → problems, languages
    ├── user_problem_progress → problems
    └── user_code_drafts → problems, languages
```

### 5.2 Tables

#### `profiles`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | `references auth.users(id) on delete cascade` |
| `display_name` | `text` | |
| `role` | `text` | `'user' \| 'admin'`; default `'user'` |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

Check: `role in ('user', 'admin')`.

Create a row in a `on auth.users insert` trigger. Never trust the client to insert an `admin` profile.

#### `languages`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `slug` | `text` unique | `python`, `javascript`, `typescript`, `c`, `go`, `php` |
| `name` | `text` | Display name |
| `monaco_language` | `text` | Monaco id (`python`, `javascript`, `typescript`, `c`, `go`, `php`) |
| `execution_language_id` | `text` | Provider-specific id (Judge0 numeric id stored as text) |
| `file_extension` | `text` | `.py`, `.js`, `.ts`, `.c`, `.go`, `.php` |
| `enabled` | `boolean` | default true |
| `sort_order` | `int` | |
| `default_timeout_ms` | `int` | default 5000 |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

`execution_language_id` is `text` so a future provider can use slugs instead of integers without a migration of column type.

MVP seed (enabled): Python, JavaScript, TypeScript, C, Go, PHP.

Adding Rust later is a row insert plus provider support, not an application redesign.

#### `categories`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `slug` | `text` unique | |
| `name` | `text` | |
| `description` | `text` | |
| `sort_order` | `int` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

#### `concepts`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `category_id` | `uuid` FK → categories | not null |
| `parent_id` | `uuid` FK → concepts | nullable |
| `slug` | `text` unique | globally unique for `/concepts/[slug]` |
| `name` | `text` | |
| `description` | `text` | |
| `learning_objectives` | `text` | markdown; keep as text in MVP |
| `sort_order` | `int` | |
| `published` | `boolean` | default false |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

Check: `parent_id is distinct from id`. Hierarchy cycles are prevented in application writes (walk ancestors before save). A recursive CTE powers navigation.

#### `problems`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `concept_id` | `uuid` FK → concepts | not null |
| `slug` | `text` unique | `/problems/[slug]` |
| `title` | `text` | |
| `description` | `text` | markdown |
| `difficulty` | `text` | `'easy' \| 'medium' \| 'hard'` |
| `instructions` | `text` | |
| `constraints` | `text` | |
| `example_input` | `text` | primary visible example |
| `example_output` | `text` | |
| `time_complexity` | `text` | language-independent |
| `space_complexity` | `text` | language-independent |
| `status` | `text` | `'draft' \| 'review' \| 'published' \| 'archived'` |
| `created_by` | `uuid` FK → profiles | nullable |
| `published_at` | `timestamptz` | nullable |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

The problem is language-independent. There is no `python_problems` table.

#### `problem_languages`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `problem_id` | `uuid` FK → problems | |
| `language_id` | `uuid` FK → languages | |
| `starter_code` | `text` | |
| `solution_code` | `text` | never sent to the browser until authorized |
| `function_signature` | `text` | |
| `explanation` | `text` | |
| `validation_status` | `text` | `'unverified' \| 'passed' \| 'failed'` |
| `validation_log` | `text` | last automated run summary |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

Unique `(problem_id, language_id)`.

#### `problem_test_cases`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `problem_id` | `uuid` FK → problems | |
| `input` | `text` | stdin |
| `expected_output` | `text` | stdout |
| `is_hidden` | `boolean` | default false |
| `sort_order` | `int` | |
| `created_at` | `timestamptz` | |

Tests belong to the problem, not to a language. See §8.

#### `problem_hints`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `problem_id` | `uuid` FK → problems | |
| `hint_level` | `int` | 1–5 |
| `content` | `text` | |
| `created_at` | `timestamptz` | |

Unique `(problem_id, hint_level)`. Check: `hint_level between 1 and 5`.

#### `user_attempts`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → profiles | |
| `problem_id` | `uuid` FK → problems | |
| `language_id` | `uuid` FK → languages | |
| `code` | `text` | |
| `mode` | `text` | `'run' \| 'submit'` |
| `status` | `text` | see error taxonomy |
| `tests_passed` | `int` | |
| `tests_total` | `int` | |
| `runtime_ms` | `int` | nullable |
| `stdout` | `text` | truncated |
| `stderr` | `text` | truncated; no provider internals |
| `created_at` | `timestamptz` | |

#### `user_problem_progress`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → profiles | |
| `problem_id` | `uuid` FK → problems | |
| `status` | `text` | `'attempted' \| 'completed' \| 'mastered'` |
| `completed_at` | `timestamptz` | first passing submit |
| `mastered_at` | `timestamptz` | nullable |
| `updated_at` | `timestamptz` | |

Unique `(user_id, problem_id)`. Absence of a row means `not_started`.

#### `user_code_drafts`

In-progress editor buffers. Not attempts.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `user_id` | `uuid` FK → profiles | |
| `problem_id` | `uuid` FK → problems | |
| `language_id` | `uuid` FK → languages | |
| `code` | `text` | |
| `updated_at` | `timestamptz` | |

Unique `(user_id, problem_id, language_id)`.

#### `ai_generation_runs`

Admin audit of AI batches.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` PK | |
| `created_by` | `uuid` FK → profiles | |
| `concept_id` | `uuid` FK → concepts | |
| `request` | `jsonb` | inputs: count, difficulty, language ids |
| `status` | `text` | `'pending' \| 'validated' \| 'failed'` |
| `error` | `text` | |
| `created_at` | `timestamptz` | |

Generated problems still live in `problems` with `status = 'draft'`.

#### Not in MVP

`user_concept_progress` — calculate from published problems + `user_problem_progress`. Storing it creates sync bugs for no query benefit at this scale.

### 5.3 Indexes

| Index | Purpose |
| --- | --- |
| `problems(slug)` unique | lookup |
| `concepts(slug)` unique | lookup |
| `categories(slug)` unique | lookup |
| `languages(slug)` unique | lookup |
| `problems(status, concept_id)` | published browsing |
| `problems(status, difficulty)` | difficulty filter |
| `problems(created_at desc)` where published | listing |
| `problem_languages(problem_id, language_id)` unique | join |
| `problem_test_cases(problem_id, sort_order)` | suite order |
| `problem_hints(problem_id, hint_level)` unique | progressive hints |
| `user_attempts(user_id, created_at desc)` | recent activity |
| `user_attempts(user_id, problem_id, created_at desc)` | history |
| `user_problem_progress(user_id, status)` | dashboard |
| `user_problem_progress(user_id, problem_id)` unique | upsert |
| `user_code_drafts(user_id, problem_id, language_id)` unique | editor state |
| `concepts(category_id, sort_order)` | nav |
| `concepts(parent_id, sort_order)` | tree |

Full-text: `pg_trgm` GIN on `problems.title` (and optionally `description`) for search. Acceptable MVP alternative: `ilike` with a title index until catalog size demands trigram.

### 5.4 Slug uniqueness

Slugs are globally unique so URLs stay stable:

- `/problems/[slug]`
- `/concepts/[slug]`

Not unique-per-parent. Collisions are a validation error in admin writes.

---

## 6. Authentication

Supabase Auth.

MVP providers:

- Email / password
- Magic link

OAuth later; do not build provider-specific UI beyond a reserved slot.

Session: `@supabase/ssr` cookie adapter. Browser uses the anon key. Server uses the user session for RLS-scoped queries and the service role **only** for:

- Hidden test fetch during Submit
- Reference solution fetch when authorized
- Admin mutations that must bypass RLS
- Auth trigger-adjacent maintenance if needed

Never ship the service role key to the client.

Profile creation:

```text
auth.users insert
  → trigger handle_new_user()
  → insert profiles (id, display_name, role='user')
```

`role` cannot be set to `admin` from the client. Promote admins with a SQL statement or a server-only tool using the service role.

---

## 7. Authorization

Two layers, both required:

1. **PostgreSQL RLS** — defends direct Supabase access.
2. **Server checks** — route handlers, server actions, and `/admin` layout.

Client-only checks such as `if (user.role === "admin")` are UI convenience, not security.

### 7.1 Helper

```sql
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
```

Policies call `is_admin()`. Application code calls a server helper `requireAdmin()` that reads the profile through the service role or a security-definer RPC, not a value the client posted.

### 7.2 RLS summary

| Table | `anon` | `authenticated` | `admin` |
| --- | --- | --- | --- |
| `profiles` | none | select/update own row; cannot change `role` | select all |
| `languages` | select `enabled = true` | same | full |
| `categories` | select | select | full |
| `concepts` | select `published` | select `published` | full |
| `problems` | select `status = 'published'` | same | full |
| `problem_languages` | select starter fields for published problems | same | full, including `solution_code` |
| `problem_test_cases` | select `is_hidden = false` on published problems | same | full |
| `problem_hints` | select on published problems | same | full |
| `user_attempts` | none | CRUD own rows (insert via server preferred) | select all |
| `user_problem_progress` | none | select/update own | select all |
| `user_code_drafts` | none | own rows only | — |
| `ai_generation_runs` | none | none | full |

`solution_code` / `explanation`: do not grant `authenticated` select on those columns. Server uses service role after `canViewSolution(user, problem)`:

- user has `user_problem_progress.status` in `('completed', 'mastered')`, or
- user explicitly requested reveal (recorded as an attempt/event), or
- user is admin

Hidden tests: never selected with the user-scoped client. Submit handler loads them with the service role, runs them, returns pass/fail labels (`Hidden Test 3`) without `input` or `expected_output`.

Writes to curriculum tables: admin only, via server actions that re-check `is_admin()`.

---

## 8. Curriculum model

Data-driven tree:

```text
Category
  └── Concept
        ├── child Concept (recursive)
        └── Problems
```

Navigation is a recursive query, not a hard-coded React tree.

```sql
with recursive concept_tree as (
  select ... from concepts where parent_id is null and published
  union all
  select ... from concepts c
  join concept_tree t on c.parent_id = t.id
  where c.published
)
select * from concept_tree;
```

Routes are generic: `/concepts/[slug]`, `/problems/[slug]`. Slugs do not encode depth.

A small in-memory helper `buildConceptTree(rows)` turns a flat list into a tree for the sidebar. The helper does not know specific concept names.

---

## 9. Problem model

One problem. Many language implementations.

```text
Problem
  ├── concept, description, difficulty, constraints, complexity
  ├── tests (stdin / stdout, visible or hidden)
  ├── hints (levels 1–5)
  └── problem_languages[]
        ├── Python
        ├── JavaScript
        ├── TypeScript
        ├── C
        ├── Go
        └── PHP
```

Incorrect: `PythonProblem`, `GoProblem`, or routes like `/python/two-sum`.

Correct: `/problems/two-sum?language=go`.

Language query param is a slug from `languages`. Unknown slugs 404 or fall back to the first enabled implementation.

---

## 10. Language abstraction

No scattered `if (language === "python")` in UI or API.

```ts
interface ProgrammingLanguage {
  id: string;
  slug: string;
  name: string;
  monacoLanguage: string;
  executionLanguageId: string;
  fileExtension: string;
  enabled: boolean;
  sortOrder: number;
  defaultTimeoutMs: number;
}
```

Source of truth: `languages` table.

Application code:

- Loads enabled languages once per request (or via a tagged cache).
- Looks up by `id` or `slug`.
- Passes `monacoLanguage` to Monaco.
- Passes `executionLanguageId` to the execution provider.
- Renders tabs from `problem.languages` ∩ enabled languages.

Provider-specific mapping lives in `src/lib/execution/judge0.ts` (or the next adapter), not in components.

Adding Go or PHP is a seed row, not a new problem type:

| Field | Go | PHP |
| --- | --- | --- |
| slug | `go` | `php` |
| name | `Go` | `PHP` |
| monaco_language | `go` | `php` |
| execution_language_id | Judge0 Go id (confirm against the chosen version; commonly `60` or a newer Go id) | Judge0 PHP id (commonly `68` / PHP 7.x or a PHP 8 id) |
| file_extension | `.go` | `.php` |
| sort_order | after C | after Go |

Adding Rust later should not require a new problem type, new workspace, or new progress model.

---

## 11. Code execution abstraction

Browser never talks to Judge0.

```text
Browser
  → POST /api/execute
  → authenticate
  → validate (Zod)
  → rate limit
  → load problem + language + tests
  → CodeExecutionProvider.execute()
  → sandbox
  → compare stdout
  → persist attempt / progress
  → response
```

```ts
interface ExecutionRequest {
  language: ProgrammingLanguage;
  source: string;
  stdin: string;
  timeoutMs: number;
}

interface ExecutionResult {
  status:
    | "succeeded"
    | "compile_error"
    | "runtime_error"
    | "timeout"
    | "provider_unavailable";
  stdout: string;
  stderr: string;
  exitCode: number | null;
  runtimeMs: number | null;
}

interface CodeExecutionProvider {
  execute(input: ExecutionRequest): Promise<ExecutionResult>;
}
```

Run: visible tests only (`is_hidden = false`).

Submit: all tests. Hidden failures return `{ passed: false, label: "Hidden Test" }` with no payload.

Stdout comparison: trim trailing whitespace on each line, then exact match. Do not fuzzy-match. Document this in admin test-case UI.

Never:

- `eval` / `vm` / `child_process` user code on Vercel
- Put Judge0 keys in `NEXT_PUBLIC_*`
- Couple Monaco to the provider

### 11.1 Judge0 for MVP

Judge0 Community Edition (hosted API or self-hosted URL via env).

Why Judge0 first:

- Built as a multi-language programming judge
- Stdin/stdout matches language-independent tests
- Compile vs runtime vs timeout statuses map to our error taxonomy
- Python, JavaScript, TypeScript, C, Go, and PHP are all supported
- `execution_language_id` stays data-driven

Vercel Sandbox is a valid future adapter behind the same interface. Do not implement two providers in MVP.

### 11.2 Stdin/stdout contract

Starter code for every language must read stdin and write stdout. `function_signature` is documentation for the learner; the executable contract is I/O.

This is what makes tests language-independent and makes Go or PHP a row, not a new problem type.

Optional later: a `harness_template` column on `languages`. Not required if starter code already includes a tiny I/O wrapper.

### 11.3 Rate limiting

Without Redis, count recent rows:

- Run: 20 / 5 minutes / user from `user_attempts` where `mode = 'run'`
- Submit: 10 / 5 minutes / user
- AI tutor: 10 / hour from `ai` usage table or a small `api_rate_events` table
- AI generate: 5 / hour / admin

Return `429` with a retry-after. Guests: execution disabled (`ALLOW_GUEST_EXECUTION=false`).

---

## 12. AI provider abstraction

Domain operations, not SDK calls, are the public surface:

```ts
interface AiProvider {
  generateProblems(input: GenerateProblemsInput): Promise<GeneratedProblemDraft[]>;
  generateHints(input: GenerateHintsInput): Promise<GeneratedHint[]>;
  explainAttempt(input: ExplainAttemptInput): Promise<TutorExplanation>;
  generateLanguageImplementations(
    input: GenerateImplementationsInput,
  ): Promise<GeneratedImplementation[]>;
}
```

Inside the adapter: AI SDK `generateObject` (or equivalent) + Zod schemas. Domain code imports `AiProvider`, not `openai` or `@ai-sdk/anthropic`.

Model id comes from env (`AI_MODEL=anthropic/claude-...` via AI Gateway, or a direct provider if Gateway is not used).

### 12.1 Structured output

Zod schemas for:

- Generated problem (title, description, difficulty, instructions, constraints, examples, complexity, hints, tests)
- Per-language implementation (starter, solution, signature, explanation)
- Tutor response (diagnosis, concept, hint, optional pseudocode, optional code)

Invalid objects never become rows.

### 12.2 Generation pipeline

```text
Admin request
  → requireAdmin()
  → AI structured output
  → Zod parse
  → verify requested languages exist and are enabled
  → insert problems status=draft
  → execute each solution_code against all tests
  → store validation_status on problem_languages
  → flag failures; keep draft
  → human review
  → publish (blocked if any required language failed validation)
```

Never auto-publish.

A reference solution is not trusted because a model wrote it.

Publish rules:

- At least one visible and one hidden test
- Hints levels 1–4 present (level 5 optional if `solution_code` exists)
- Every selected language has starter + solution
- Every selected language `validation_status = 'passed'` unless an admin explicitly overrides and records a reason

---

## 13. Progress tracking

### Problem

| Status | Rule |
| --- | --- |
| `not_started` | no `user_problem_progress` row |
| `attempted` | any run/submit, none passing |
| `completed` | ≥1 passing **submit** in any language that implements the problem |
| `mastered` | passing submit in **every** enabled language that implements the problem |

Passing submit: `mode = 'submit'` and all tests passed.

Per-language completion: derived from `user_attempts`. Used by translation practice and the dashboard language rows.

### Concept

```text
completedPublished = count of published problems in the concept
                     (and descendants? MVP: the concept only, not descendants)
completedByUser    = those with progress completed or mastered

display = completedByUser / completedPublished
```

MVP does **not** roll child concepts into the parent. Parent “needs practice” can be added later.

### Streak

Consecutive UTC calendar days with ≥1 passing submit. Dashboard only. No rewards.

### Dashboard queries

Server-side aggregates:

- solved / attempted counts
- streak
- per enabled language: problems with a passing submit in that language
- concepts with highest and lowest completion ratios (minimum N published problems to appear)
- recent attempts

No invented mastery percentages.

---

## 14. Admin authorization

`/admin/*`:

1. Middleware: if no session → sign-in.
2. `admin/layout.tsx`: `requireAdmin()`; if not admin → 404 (do not confirm the route exists).
3. Every admin server action / route handler: `requireAdmin()` again.
4. RLS: non-admins cannot read drafts or write curriculum even with a stolen anon key session.

Admin UI may hide links. Hiding is not enforcement.

Promote an admin:

```sql
update profiles set role = 'admin' where id = '<uuid>';
```

No self-serve admin signup.

---

## 15. Security model

| Threat | Control |
| --- | --- |
| User A reads/writes B’s attempts | RLS `user_id = auth.uid()` |
| Hidden tests leaked | RLS + service role only on Submit |
| Solutions leaked | column privilege + server gate |
| Client sets `role = admin` | trigger default; revoke update on `role`; server checks `is_admin()` |
| User code on Vercel | forbidden; external sandbox only |
| Provider keys in browser | server-only env |
| Prompt injection → publish | drafts + Zod + execution verify + human review |
| Execution abuse | auth + Zod payload limits + DB rate limits + timeout |
| IDOR on drafts/admin | UUID + RLS + requireAdmin |

Input limits: source code max length (e.g. 64 KiB), stdin max length, timeout cap = `min(language.default_timeout_ms, MAX_TIMEOUT_MS)`.

Log execution errors without API keys, URLs with credentials, or raw provider secrets.

---

## 16. Coding workspace

Desktop:

```text
┌─────────────────────┬──────────────────────────────┐
│ Problem metadata    │ Language tabs (data-driven)  │
│ Description         ├──────────────────────────────┤
│ Examples            │ Monaco                       │
│ Constraints         │                              │
│ Hints               ├──────────────────────────────┤
│                     │ Console / tests              │
└─────────────────────┴──────────────────────────────┘
```

- Monaco: line numbers, indent, brackets, syntax from `monacoLanguage`, theme from app light/dark.
- No AI autocomplete.
- Editor state: map `languageId → code`. Tab switch does not destroy buffers.
- Persistence: debounce write to `user_code_drafts`. Initial code = draft ?? starter.
- Panels: resizable split (simple CSS / a small splitter). Desktop-first.
- Mobile: problem statement and progress; editor usable but not the design target.

Workspace talks only to `/api/execute` and draft server actions.

---

## 17. Problem browser

Server Component reads `searchParams`:

- `q`
- `category`
- `concept`
- `difficulty`
- `language`
- `status` (`all` / `not_started` / `attempted` / `completed` / `not_completed`)
- `page`

SQL filters + pagination (`limit 20 offset …`). Count query for pages.

Do not download the catalog to the client.

Language filter: problems that have a `problem_languages` row for that language (and language enabled).

Completion filter: left join `user_problem_progress` for the current user; guests see all published, no status filter.

---

## 18. Hints and translation

Hints 1→5 as in the PRD. UI requests the next level; it does not dump all hints in the first paint if we want progressive disclosure. For MVP, published hint rows are readable via RLS (this is a learning app, not a contest). The UI still discloses one level at a time.

Translation practice: after `completed` in language A, if another enabled implementation exists, prompt to open the same slug with `?language=B`. Same problem id. New draft. Do not auto-open the reference solution.

Compare Languages: side-by-side `problem_languages` for languages the user is allowed to view solutions for. Columns from data. No hard-coded Python/Go table in a component.

---

## 19. Error handling

Map to user-visible kinds:

| Kind | User message (example) |
| --- | --- |
| `compile_error` | Compilation failed. Show truncated compiler stderr. |
| `runtime_error` | Program crashed. Show truncated stderr. |
| `timeout` | The program exceeded the time limit. |
| `failed_tests` | Tests passed N / M. List visible cases; label hidden failures. |
| `provider_unavailable` | Code execution is temporarily unavailable. |
| `unauthenticated` | Sign in to run code. |
| `rate_limited` | Too many runs. Try again in N seconds. |
| `validation_error` | Request invalid (too large, unknown language). |
| `ai_failure` | Generation failed. Admin sees sanitized error. |

Do not swallow errors. Do not show stack traces, env, or keys.

---

## 20. Testing

Vitest, domain-first:

- Zod schemas (problems, execution request, AI drafts)
- Language lookup by slug; unknown slug behavior
- Execution request mapping (language → provider id, timeout cap)
- Stdout comparison
- Progress transitions (`attempted` → `completed` → `mastered`)
- Concept progress ratio
- Streak calculation
- `requireAdmin` / publish guards
- AI draft rejected on schema fail or failed reference run

No tests whose only purpose is coverage percentage. Playwright later for the workspace, not Phase 1.

---

## 21. Environment variables

Document in `.env.example`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

JUDGE0_BASE_URL=
JUDGE0_API_KEY=

AI_GATEWAY_API_KEY=          # or provider-specific
AI_MODEL=

AUTH_DISABLED=true           # default on when Supabase keys are absent
ALLOW_GUEST_EXECUTION=false
MAX_SOURCE_CHARS=65536
MAX_TIMEOUT_MS=8000
```

When `AUTH_DISABLED=true`, or when it is unset and Supabase is not configured, the app runs in local mode: no sign-in, a synthetic user, and admin routes are reachable. Turn this off before a public deployment that should require accounts.

Never prefix secrets with `NEXT_PUBLIC_`.

---

## 22. Visual / UX constraints

Developer-tool aesthetic: VS Code, GitHub, Linear, Vercel.

Prefer typography, compact nav, subtle borders, strong dark mode, density, keyboard access.

Avoid generic AI-SaaS chrome: hero gradients, giant cards, oversized headings, decorative dashboards.

shadcn/ui as primitives, restyled toward a dense workbench, not a marketing landing page for the authenticated app.

---

## 23. Decisions

These are the recommended resolutions. They are the architecture unless review overrides them.

| ID | Topic | Recommendation | Rationale |
| --- | --- | --- | --- |
| D1 | Initial languages | Python, JavaScript, TypeScript, C, **Go**, **PHP** | Product request; data-driven `languages` rows |
| D2 | Execution provider | Judge0 CE behind `CodeExecutionProvider` | PRD; I/O judge; Go and PHP supported; swap-later |
| D3 | Tests | Language-independent stdin/stdout | Preserves Problem ≠ Language; one suite for six languages |
| D4 | Rate limits | Count `user_attempts` / `api_rate_events` in Postgres | No Redis; Vercel-safe |
| D5 | Guest execution | Off in MVP | Cost, abuse, simpler auth story |
| D6 | Concept progress table | Do not persist | Derived; avoids drift |
| D7 | Mastery | Completed = any language; mastered = all implemented languages | Matches translation practice; explicit |
| D8 | Solutions / hidden tests | Column grants + service role | RLS alone is weak for column secrecy |
| D9 | AI | `AiProvider` + Zod + draft-only | PRD pipeline |
| D10 | Streak | UTC consecutive passing-submit days | PRD dashboard without gamification |
| D11 | Compare UI | Data from `problem_languages` | Adding Go/PHP/Rust must not edit JSX tables |
| D12 | App layout | `src/app` | Conventional, uncluttered root |
| D13 | Admin 404 vs 403 | 404 for non-admins | Does not advertise `/admin` |
| D14 | Hint level 5 | Stored as hint; UI only after explicit reveal | Aligns with progressive disclosure |
| D15 | Vercel Sandbox | Not in MVP; future adapter | One provider until Judge0 is insufficient |
| D16 | Queues for AI | None; request/response in the admin action | Batch sizes stay small; no Kafka/Queues yet |

---

## 24. Open items for review

The recommendations above are intended to close these. Confirm or override:

1. **Judge0 hosting** — hosted CE (RapidAPI or official cloud) vs a URL we point at. Env-only; code does not care. Need a key and the exact language ids for the chosen version (especially TypeScript, Go, and PHP).
2. **AI Gateway vs direct OpenAI/Anthropic** — prefer Gateway model strings if the project is on Vercel; otherwise one provider via env.
3. **Concept progress scope** — concept-only vs include descendant problems. Recommend concept-only for MVP.
4. **Hint RLS** — published hints readable (recommended) vs gated by server after “request hint”.
5. **Publish override** — may an admin publish a problem with a failing Go or PHP reference solution? Recommend no, with an explicit override flag if needed later.

---

## 25. What would contradict this architecture

Do not:

- Add per-language problem tables or routes
- Hard-code the six MVP languages in components
- Execute user code in Next.js
- Auto-publish AI output
- Filter thousands of problems only on the client
- Store `user_concept_progress` without a demonstrated need
- Introduce Redis, queues, or a second backend for MVP
- Treat `user.role` in the browser as authorization
