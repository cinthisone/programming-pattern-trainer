# Pattern Trainer

Learn **programming patterns**, not a language in isolation.

A problem is the same idea in every language. You write it in Monaco, run it against stdin/stdout tests, then solve it again in Python, JavaScript, TypeScript, C, Go, or PHP.

Two tracks:

- **Basics** (`/basics`) — variables, control structures, loops, arrays, sets
- **Patterns** (`/problems`) — named patterns, starting with accumulator / Running Total

Canonical spec: [docs/PRD.md](docs/PRD.md) · Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · Plan: [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind v4, shadcn/ui, Monaco, Zod, Vitest. Supabase is planned for auth and progress. Code execution is **Judge0 CE** on a dedicated box — never on Vercel, never in the browser.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Auth is off by default (`AUTH_DISABLED=true`).

### Run / Submit / Try

Code runs through Judge0. If your Judge0 API is only on the sandbox host’s localhost, keep a tunnel open in a second terminal while you train:

```bash
ssh -N judge0-tunnel
```

Then in `.env.local`:

```bash
JUDGE0_BASE_URL=http://127.0.0.1:2358
JUDGE0_API_KEY=           # X-Auth-Token from the Judge0 host
```

- **Try** — your stdin, no grading
- **Run tests** — visible official cases
- **Submit** — includes hidden tests (input not shown)

Do not commit `.env.local`.

## Scripts

```bash
npm run lint
npm run typecheck
npm test
```

## Later

To turn auth on: set `AUTH_DISABLED=false`, fill the Supabase variables, apply `supabase/migrations`, then promote an admin:

```sql
update public.profiles set role = 'admin' where id = '<user-uuid>';
```
