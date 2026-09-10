# Implementation Plan

Programming Pattern Trainer — phased MVP build.

Canonical spec: [`docs/PRD.md`](./PRD.md).  
Architecture: [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md).

**Rule:** finish and verify one phase before expanding the next. Do not scaffold every table, service, and screen up front.

**Languages in seed data from Phase 1:** Python, JavaScript, TypeScript, C, Go, PHP. They are rows, not feature branches.

---

## Phase 0 — Scaffold

**Goal:** a running Next.js app on the agreed stack, with no product features yet.

### Work

- Create the Next.js App Router project under `src/`
- TypeScript `strict`
- Tailwind CSS
- shadcn/ui (Radix) with a dense, dark-mode-friendly theme
- ESLint, path aliases (`@/`)
- `.env.example` from the architecture env list
- `src/app` route groups as empty shells: `(public)`, `(authenticated)`, `auth`, `admin`, `api`
- Application shell: header, nav placeholders, light/dark toggle
- Vitest configured

### Verify

- `pnpm dev` (or npm) renders the shell
- `pnpm lint` and `pnpm typecheck` pass
- Dark mode toggles
- No language names hard-coded in layout components

### Exit

App boots locally. No database required yet.

---

## Phase 1 — Foundation

**Goal:** Supabase, auth, migrations, RLS, language seed.

### Work

- Supabase project + local `supabase/` config
- Migration: all tables in the architecture (including `languages`, drafts, generation runs)
- Indexes, FKs, checks, `updated_at` trigger
- `handle_new_user` profile trigger (`role = 'user'`)
- `is_admin()` helper
- RLS policies
- Seed `languages`:

  | slug | monaco | extension |
  | --- | --- | --- |
  | `python` | `python` | `.py` |
  | `javascript` | `javascript` | `.js` |
  | `typescript` | `typescript` | `.ts` |
  | `c` | `c` | `.c` |
  | `go` | `go` | `.go` |
  | `php` | `php` | `.php` |

- Confirm Judge0 language ids for this Judge0 version and store them on the seed rows
- `@supabase/ssr` clients (browser, server, service role)
- Auth pages: sign up, sign in (email/password + magic link), sign out, callback
- Server helper `requireUser()` / `requireAdmin()`
- `/admin` layout returns 404 unless admin

### Tests

- Language seed contains all six slugs and `enabled = true`
- Lookup by slug; unknown slug fails closed
- Profile created on signup (integration or SQL test)
- Non-admin cannot select draft problems or hidden tests via the user-scoped client

### Verify

- Sign up → profile row exists
- Sign in / sign out
- Direct SQL as authenticated user cannot update another profile or set `role`
- Service role can read hidden tests; anon cannot

### Exit

Auth works. Schema matches architecture. Languages are data.

---

## Phase 2 — Curriculum and browsing

**Goal:** categories, concepts, problems, published catalog.

### Work

- Seed a small curriculum (one category, a few nested concepts, 2–3 published problems)
- Each published problem has `problem_languages` for all six languages (starter code only is enough)
- Language-independent visible + hidden tests
- Concept tree helper from a flat query (recursive CTE)
- `/concepts`, `/concepts/[slug]`
- `/problems` with `searchParams` filters + pagination
- Problem statement page (no editor yet) listing available languages from data
- Server-side search / filter / page queries

### Tests

- Concept tree nesting
- Problem query respects `status = published`, pagination, language filter, difficulty
- Guests cannot see `draft` / `review`

### Verify

- Filters update the URL and survive refresh
- Language filter `?language=php` and `?language=go` return only problems with that implementation
- Catalog is not loaded in full to the client

### Exit

A learner can browse the tree and open a problem statement.

---

## Phase 3 — Coding workspace

**Goal:** Monaco workbench with per-language editor state.

### Work

- Problem workspace layout (statement | tabs + editor | console placeholder)
- Dynamic Monaco import (`ssr: false`)
- Language tabs from `problem_languages` ∩ enabled languages
- `monacoLanguage` from the language row (including `go` and `php`)
- In-memory map `languageId → code`; switching tabs keeps buffers
- Load starter code; debounce persist to `user_code_drafts` when signed in
- Theme follows light/dark
- No AI autocomplete
- Resizable panels (simple splitter)

### Tests

- Tab list is derived from implementations, not a hard-coded array of six names
- Draft upsert key is `(user, problem, language)`

### Verify

- Switch Python → PHP → Go without losing typed code
- Reload restores drafts for a signed-in user
- Syntax highlighting differs per tab
- Mobile: statement readable; editor present but not the focus

### Exit

The workspace feels like a small IDE. Run/Submit still stubbed.

---

## Phase 4 — Execution

**Goal:** Run and Submit through the provider abstraction.

### Work

- `CodeExecutionProvider` + Judge0 adapter
- `POST /api/execute` (`mode: run | submit`)
- Auth (guest execution off)
- Zod validation, source size cap, timeout cap
- Postgres rate limits
- Run: visible tests only
- Submit: all tests; hidden failures labeled without I/O
- Stdout compare (trim line-end whitespace, exact match)
- Persist `user_attempts`
- Console UI: compile / runtime / timeout / fail / pass
- Never expose Judge0 credentials

### Tests

- Request mapping uses `executionLanguageId` from the language row
- Comparison helper
- Hidden test payloads stripped from the response
- Unauthenticated execute → 401
- Rate limit → 429

### Verify

- Run a Python solution against visible tests
- Repeat for JavaScript, TypeScript, C, Go, PHP (at least one passing and one failing case each)
- Submit fails hidden tests without showing input
- Killing Judge0 URL yields `provider_unavailable`, not a stack trace

### Exit

Learners can run and submit in every MVP language.

---

## Phase 5 — Progress

**Goal:** attempts, completion, dashboard.

### Work

- Upsert `user_problem_progress` on attempts/submits using the architecture rules
- Dashboard: solved, attempted, UTC streak, per-language counts (from enabled languages), recent activity
- Concept ratios `completed / published` (concept only, not descendants)
- Problem browser completion filter for signed-in users
- Translation prompt after first-language completion when another implementation exists

### Tests

- `attempted` → `completed` (one language) → `mastered` (all implemented languages)
- Streak across UTC midnight
- Concept ratio ignores drafts

### Verify

- Completing in Python then PHP updates language rows independently
- Mastered only after every enabled implementation of that problem has a passing submit
- Dashboard language list grows if a seventh language is enabled in the database (no code change required for the list source)

### Exit

Progress is real, derived, and not a fake percentage.

---

## Phase 6 — Admin

**Goal:** humans can manage curriculum without SQL.

### Work

- `/admin` sections: dashboard, categories, concepts, problems, languages, drafts, review
- CRUD for categories, concepts (parent picker), problems, problem languages, tests, hints
- Language admin: enable/disable, sort order, execution id, monaco id (no deploy to add a language row)
- Status workflow: draft → review → published / archived
- Publish blocked unless validation rules pass (tests, hints, implementations)
- Server actions all call `requireAdmin()`
- Non-admin `/admin` → 404

### Tests

- Publish guard
- `requireAdmin` rejects `role = user`
- Enabling/disabling PHP hides/shows it in public tabs without UI edits

### Verify

- Create a problem, add six language starters, publish
- Disable PHP in admin; workspace tabs omit PHP
- Authenticated non-admin cannot call the publish action

### Exit

Curriculum is operable by an admin.

---

## Phase 7 — AI generation

**Goal:** structured drafts with verified reference solutions.

### Work

- `AiProvider` interface + one adapter (AI Gateway / configured model)
- Zod schemas for problem + per-language implementations + hints + tests
- Admin generate form: concept, difficulty, count, language checkboxes from DB
- Insert `status = draft`; record `ai_generation_runs`
- Execute each `solution_code` against the generated suite
- Set `validation_status` / `validation_log` on `problem_languages`
- Review UI: edit, see per-language pass/fail (including Go and PHP), never auto-publish
- Tutor endpoint `explainAttempt` (Phase 8 can deepen UX; stub allowed until then)

### Tests

- Schema reject
- Missing language in output → fail the batch item
- Failed reference run → `validation_status = failed`, still draft
- Publish still blocked on failed validations

### Verify

- Generate 1–2 easy problems for a concept targeting all six languages
- At least one intentional failure is flagged
- Nothing appears in the public catalog until an admin publishes a passing draft

### Exit

AI is a draft factory with a verification gate.

---

## Phase 8 — Learning features

**Goal:** progressive hints, explanations, compare, translation.

### Work

- Hint UI levels 1–5; level 5 / reference only after explicit reveal or completion
- Solution mode: tabs from implementations the user may view
- Compare Languages: side-by-side from `problem_languages`, not a hard-coded table
- Translation practice CTA (already prompted in Phase 5; polish copy and deep-link `?language=`)
- AI tutor: explain mistake using problem, code, stderr, failed visible tests only

### Tests

- Compare columns follow whichever languages are on the problem
- Tutor request does not include hidden test I/O
- Reveal gate for solutions

### Verify

- After solving in C, start PHP on the same slug without seeing C’s solution unless requested
- Compare view includes Go and PHP when those implementations exist
- Hint 1 does not show pseudocode or source

### Exit

MVP learning loop is complete.

---

## Suggested sequencing calendar

Not a commitment — a way to keep vertical slices:

| Phase | Slice |
| --- | --- |
| 0 | App boots |
| 1 | Auth + schema + six languages |
| 2 | Browse published problems |
| 3 | Edit code per language |
| 4 | Run/Submit in sandbox |
| 5 | Progress |
| 6 | Admin CRUD / publish |
| 7 | AI drafts + verify |
| 8 | Hints, compare, translation, tutor |

Do not start Phase 7 before Phase 4: generated solutions must be executable.

---

## Cross-cutting rules (every phase)

1. Inspect existing code before changing it.
2. No `if (language === "php")` in components; use language records.
3. No `any` to silence TypeScript; no disabled lint as a workaround.
4. Secrets only in env; update `.env.example` when adding one.
5. Lint + typecheck frequently; run the phase’s tests before calling it done.
6. Update `docs/ARCHITECTURE.md` if a decision changes.
7. Keep commits focused (when commits are requested).

---

## Explicitly out of MVP

- Rust, Java, C++, C#
- Redis, queues, extra services
- Guest code execution
- Stored `user_concept_progress`
- Achievements, leaderboards, paid plans
- AI autocomplete in Monaco
- Spaced repetition, classrooms, skill graphs
- Dual execution providers

---

## Definition of MVP done

A registered user can:

1. Sign in
2. Browse a hierarchical curriculum
3. Open a language-independent problem
4. Solve it in any of Python, JavaScript, TypeScript, C, Go, or PHP
5. See test results and progress
6. Be prompted to re-solve it in another language

An admin can:

1. Manage languages as data
2. Create or AI-generate drafts
3. See automated verification of reference solutions
4. Publish only after review
