# Project Brief

Programming Pattern Trainer is an AI-assisted web app for learning programming **patterns** across languages, not language syntax in isolation.

A problem is language-independent. Implementations exist per language. Users write code in Monaco, run it in an external sandbox, and can re-solve the same problem in another language.

## MVP languages

Python, JavaScript, TypeScript, C, Go, PHP — stored as `languages` rows, not hard-coded product types.

## Stack

Next.js App Router, React, TypeScript, Tailwind, shadcn/ui, Supabase (Postgres, Auth, RLS), Monaco, Judge0 CE (self-hosted on a dedicated Vultr box — not WHM/cPanel, not WSL), Zod. App deploys on Vercel; user code never runs on Vercel.

## Out of scope for MVP

Microservices, Redis, queues, guest execution, gamification, extra languages (Rust, Java, C++, C#).

## Canonical docs

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/IMPLEMENTATION_PLAN.md`
