# System Patterns

- Single Next.js app on Vercel. No extra backends.
- Problems are language-independent; `problem_languages` hold starters/solutions.
- Curriculum tracks are data (`basics` | `patterns`). Basics are not modeled as a different problem type.
- Tests are stdin/stdout, shared across languages.
- Languages are data (`ProgrammingLanguage`). No `if (language === "php")` in UI.
- Browser → Next.js `POST /api/execute` → `CodeExecutionProvider` (Judge0 CE). Never execute user code on Vercel. Modes: `try` (custom stdin, no grade), `run` (visible tests), `submit` (all tests; hidden failures labeled without I/O).
- Judge0 lives on a dedicated Vultr Ubuntu 22.04 box (`chancode` / `45.32.218.6`), bound to localhost:2358 with `X-Auth-Token`. Local Next.js reaches it via `ssh -N judge0-tunnel`. Do not install Judge0 on the WHM/cPanel VPS.
- AI behind `AiProvider` + Zod; drafts only; verify reference solutions by running them.
- Auth: Supabase. Admin: `is_admin()` + `requireAdmin()` + RLS. Client role checks are not security.
- Concept progress is calculated, not stored. Mastered = passing submit in every implemented language for that problem.
