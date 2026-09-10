# Active Context

## Current focus

Curriculum is split into two tracks:

- **Basics** (`/basics`) — variables, operators, control structures, loops, arrays, sets
- **Patterns** (`/problems`) — named patterns, starting with accumulator / Running Total

Basics section headings are large. Each basics problem has a Help control that opens a language-specific primer for that heading (Python variables vs C variables, and so on).

Auth is still disabled. Execution is live.

## Execution UX (this session)

- Workspace lists **visible tests** (stdin/stdout) on the problem pane; hidden tests are counted, not shown
- **Your stdin** + **Try** — learner types their own input; no grading
- **Run tests** — visible official cases
- **Submit** — all cases; hidden I/O stripped
- Reminder under the editor: keep `ssh -N judge0-tunnel` running

Judge0 CE 1.13.1 is on Vultr `chancode` (`45.32.218.6`), localhost:2358 + auth token. Next.js talks to `http://127.0.0.1:2358` through the tunnel. `POST /api/execute` → Judge0 adapter → stdout compare.

## Next

1. Persist drafts/progress when a database exists
2. More pattern problems after the basics track
3. Optional later: HTTPS subdomain + Caddy when the app is deployed off localhost
