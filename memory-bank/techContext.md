# Tech Context

Next.js 16.3 App Router in `src/`, React 19, TypeScript strict, Tailwind v4, shadcn/ui (radix-nova), next-themes, Zod 4, Vitest 5, `@supabase/ssr`.

Scripts: `npm run dev`, `lint`, `typecheck`, `test`. Dev: `http://localhost:3000`.

Env: copy `.env.example` to `.env.local`. Required for auth: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Service role for hidden tests, solutions, and attempt writes. Auth currently off (`AUTH_DISABLED=true`).

## Judge0 (execution)

Self-hosted **CE v1.13.1** on Vultr Atlanta:

- Plan: Shared CPU `vc2-1c-2gb` ($10/mo), Ubuntu **22.04 LTS x64**, hostname `chancode`
- IP: `45.32.218.6`
- SSH: `ssh chancode` or `ssh judge0` (uses `~/.ssh/id_rsa` — Vultr `chan_key`)
- Tunnel: `ssh -N judge0-tunnel` (LocalForward 2358). Workspace UI reminds the user.
- Install: `/opt/judge0-v1.13.1`, Docker CE, cgroup v1 (`systemd.unified_cgroup_hierarchy=0`)
- API: `127.0.0.1:2358` only; UFW allows SSH (22), not 2358
- App env: `JUDGE0_BASE_URL=http://127.0.0.1:2358`, `JUDGE0_API_KEY` (header `X-Auth-Token`)
- Language ids: Python 71, JavaScript 63, TypeScript 74, C 50, Go 60, PHP 68

Do not publish port 2358. A subdomain + Caddy HTTPS is optional later when the Next.js app is on the public internet.

Migrations: `supabase/migrations/20260910000000_init.sql`.
