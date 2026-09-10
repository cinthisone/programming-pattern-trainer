# Progress

## Done

- Next.js 16 App Router scaffold (`src/`), Tailwind, shadcn/ui, dark-first shell
- Vitest domain tests (49 passing): languages, lookup, stdout compare, execution request, Judge0 mapping, evaluate/hidden tests, custom stdin try, progress, streak, concept tree, catalog tracks, Zod
- Supabase migration: tables, indexes, RLS, admin helper, Go/PHP language seed
- Auth pages (email/password + magic link) and `/auth/callback`
- `/admin` 404 for non-admins
- Local catalog with Basics track (7 problems) and Patterns track (Running Total)
- Monaco workspace with per-language starter and solution
- `/basics` topic tabs: Variables, Control structures, Loops, Arrays, Sets
- Language-specific Help primers (legacy syntax marked not recommended)
- Dedicated Vultr Judge0 box + SSH shortcuts (`chancode`, `judge0`, `judge0-tunnel`)
- Phase 4 execution: Judge0 adapter, `POST /api/execute` (`try` | `run` | `submit`), workspace Try / Run tests / Submit, visible-test list, custom stdin

## In progress

- Live Supabase project / `.env.local` (user-provided)
- Phase 2 curriculum browsing against the database

## Not started

- Persist attempts / progress
- Dashboard aggregates
- Admin CRUD
- AI generation
- Hints / compare / translation UX

## Known issues

- Judge0 language ids confirmed on CE 1.13.1: Python 71, JavaScript 63, TypeScript 74, C 50, Go 60, PHP 68
- Local Run/Submit/Try need `ssh -N judge0-tunnel` while `npm run dev` is running
- App cannot complete signup until Supabase env vars exist
- Cursor browser hydration warnings come from `data-cursor-ref`, not app bugs
