# Programming Pattern Trainer

## 1. Product Overview

Programming Pattern Trainer is an AI-assisted web application for learning programming concepts and problem-solving patterns across multiple programming languages.

The initial supported languages are:

* Python
* JavaScript
* TypeScript
* C
* Go
* PHP

The primary goal is not simply to solve coding challenges. The application should help users understand the **underlying programming pattern** and then learn how that same pattern is expressed in different languages.

Examples include:

* Accumulator
* Array traversal
* Min/max tracking
* Frequency counting
* Two pointers
* Sliding window
* Recursion
* Binary search
* Stack
* Queue
* Hash maps
* Trees
* Graphs

Users should write solutions manually inside a real IDE-style code editor, execute their code, receive test results, request progressive hints, and compare implementations between languages.

AI will also be used administratively to continuously generate new concepts, problems, hints, tests, explanations, and reference solutions.

---

# 2. Product Philosophy

The application should teach:

**Concept → Pattern → Algorithm → Implementation → Language Syntax**

rather than:

**Language → Syntax → Memorization**

A programming problem should therefore be fundamentally **language-independent**.

A problem may then have implementations for any number of supported programming languages.

Example:

```text
Problem
│
├── Concept
├── Description
├── Difficulty
├── Examples
├── Test Cases
├── Hints
│
└── Language Implementations
    ├── Python
    ├── JavaScript
    ├── TypeScript
    ├── C
    ├── Go
    └── PHP
```

The architecture must allow additional languages to be added later without redesigning the application.

Potential future languages include:

* Rust
* Java
* C++
* C#

Do not hard-code assumptions around the initial languages.

---

# 3. Technology Stack

Use:

* **Next.js App Router**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Vercel**
* **Supabase PostgreSQL**
* **Supabase Auth**
* **Supabase Row Level Security**
* **Monaco Editor**
* **Judge0 or equivalent sandboxed execution provider**
* **Zod**
* AI provider abstraction supporting OpenAI and/or Anthropic

Do not introduce a separate Express server, microservices, Redis, queues, or other infrastructure unless there is a demonstrated requirement.

Prefer Next.js Server Components where appropriate.

Use Client Components only when browser interactivity requires them.

---

# 4. User Types

## Guest

Guests may:

* Browse concepts
* Browse published problems
* View public curriculum information

Whether guests can execute code should be configurable.

**MVP default:** guests cannot execute or submit code. Execution requires an authenticated user.

## Registered User

Registered users may:

* Solve problems
* Execute code
* Submit solutions
* Save code
* Track progress
* View previous attempts
* Receive hints
* Compare languages
* View learning statistics

## Administrator

Administrators may:

* Create concepts
* Edit concepts
* Create problems manually
* Generate problems with AI
* Review AI-generated content
* Edit generated content
* Publish/unpublish problems
* Manage languages
* Manage categories
* Manage curriculum structure

---

# 5. Authentication

Use Supabase Auth.

Initially support:

* Email/password
* Magic link

Architecture should allow OAuth providers later.

Each authenticated user should have a profile associated with their Supabase Auth user.

---

# 6. Curriculum Architecture

The curriculum should be hierarchical.

Example:

```text
Programming
│
├── Fundamentals
│   ├── Variables
│   ├── Data Types
│   ├── Operators
│   ├── Conditionals
│   ├── Loops
│   └── Functions
│
├── Arrays
│   ├── Traversal
│   ├── Accumulator
│   ├── Min / Max
│   ├── Frequency Counting
│   ├── Two Pointers
│   └── Sliding Window
│
├── Strings
│   ├── Traversal
│   ├── Parsing
│   ├── Palindrome
│   └── Character Frequency
│
├── Algorithms
│   ├── Linear Search
│   ├── Binary Search
│   ├── Sorting
│   ├── Recursion
│   └── Backtracking
│
└── Data Structures
    ├── Array
    ├── Hash Map
    ├── Set
    ├── Stack
    ├── Queue
    ├── Linked List
    ├── Tree
    └── Graph
```

Concepts should support parent/child relationships so arbitrary depth is possible.

Do not encode this hierarchy directly into application routes or components.

Store it as data.

---

# 7. Core Data Model

Design normalized PostgreSQL tables around approximately the following entities.

## profiles

Contains application-specific user information.

Potential fields:

```text
id
display_name
role
created_at
updated_at
```

`id` should reference the Supabase Auth user.

---

## languages

```text
id
slug
name
monaco_language
execution_language_id
file_extension
enabled
sort_order
created_at
updated_at
```

Example records:

```text
python
javascript
typescript
c
go
php
```

Language configuration must be data-driven.

---

## categories

Used for high-level curriculum organization.

```text
id
slug
name
description
sort_order
created_at
updated_at
```

---

## concepts

```text
id
category_id
parent_id
slug
name
description
learning_objectives
sort_order
published
created_at
updated_at
```

`parent_id` enables hierarchical concepts.

---

## problems

```text
id
concept_id
slug
title
description
difficulty
instructions
constraints
example_input
example_output
time_complexity
space_complexity
status
created_by
created_at
updated_at
```

Possible status values:

```text
draft
review
published
archived
```

`constraints`, `time_complexity`, and `space_complexity` describe the language-independent algorithmic problem. Visible examples beyond the primary pair are represented as non-hidden test cases.

---

## problem_languages

Stores language-specific implementations.

```text
id
problem_id
language_id
starter_code
solution_code
function_signature
explanation
created_at
updated_at
```

---

## problem_test_cases

```text
id
problem_id
input
expected_output
is_hidden
sort_order
created_at
```

Support both visible example tests and hidden validation tests.

Test cases belong to the problem, not to a language. Execution uses a language-independent stdin/stdout contract so the same tests validate every implementation.

---

## problem_hints

```text
id
problem_id
hint_level
content
created_at
```

Hints should progressively reveal more information.

Preferred `hint_level` sequence:

```text
1 Conceptual direction
2 Pattern identification
3 Implementation strategy
4 Pseudocode
5 Reference solution
```

---

## user_attempts

```text
id
user_id
problem_id
language_id
code
status
tests_passed
tests_total
runtime
created_at
```

---

## user_problem_progress

Track current mastery of individual problems.

```text
id
user_id
problem_id
status
completed_at
updated_at
```

Possible states:

```text
not_started
attempted
completed
mastered
```

**Status rules:**

* `not_started` — no attempts
* `attempted` — at least one run or submit, no passing submit
* `completed` — at least one passing submit in any enabled language for that problem
* `mastered` — a passing submit in every enabled language that has an implementation for that problem

Per-language completion is derived from `user_attempts`, not stored separately.

---

## user_concept_progress

Track broader concept mastery.

This may initially be calculated rather than stored if that simplifies the system.

Avoid duplicating derived data unnecessarily.

**Decision:** do not persist `user_concept_progress` in MVP. Derive concept progress from published problems and `user_problem_progress`.

---

# 8. Problem Browser

Users need a scalable way to find problems as the library grows.

Provide:

* Search
* Category filtering
* Concept filtering
* Difficulty filtering
* Language availability filtering
* Completion filtering

Example:

```text
Problems

Search: [________________]

Category:   [ Arrays ▼ ]
Concept:    [ Two Pointers ▼ ]
Difficulty: [ All ▼ ]
Status:     [ Not Completed ▼ ]

────────────────────────────────

Two Sum II
Two Pointers
Easy
✓ Python ✓ JS ✓ TS ✓ C ✓ Go ✓ PHP

Remove Duplicates
Two Pointers
Easy
✓ Python ✓ JS ✓ TS ✓ C ✓ Go ✓ PHP

Three Sum
Two Pointers
Medium
✓ Python ✓ JS ✓ TS ✓ C ✓ Go ✓ PHP
```

The interface should remain usable with thousands of problems.

Filters must use URL search parameters so views are shareable.

Do not fetch the full problem catalog to the client and filter only in JavaScript. Use database/server filtering and pagination.

---

# 9. Coding Workspace

The problem-solving workspace is the central application experience.

Desktop layout should approximately contain:

```text
┌──────────────────────┬────────────────────────────┐
│                      │ Py JS TS C Go PHP          │
│ Problem              ├────────────────────────────┤
│                      │                            │
│ Description          │       Monaco Editor        │
│                      │                            │
│ Examples             │                            │
│                      │                            │
│ Constraints          ├────────────────────────────┤
│                      │ Console / Test Results     │
│ Hints                │                            │
│                      │                            │
└──────────────────────┴────────────────────────────┘
```

Language tabs are rendered from enabled languages that have an implementation for the problem. They are not hard-coded in the layout.

Allow panels to resize where practical.

Use Monaco Editor.

Provide:

* Syntax highlighting
* Line numbers
* Auto indentation
* Bracket matching
* Language-aware syntax
* Dark/light theme compatibility

Do **not** provide AI code autocomplete by default.

The purpose is deliberate practice.

---

# 10. Language Switching

Users should be able to switch between any enabled language that has an implementation for the current problem.

Their work in each language should remain available when switching tabs.

Example:

```text
[ Python ] [ JavaScript ] [ TypeScript ] [ C ] [ Go ] [ PHP ]
```

Each language may have its own starter code.

---

# 11. Code Execution

Users click:

**Run Code**

Flow:

```text
Monaco Editor
      ↓
Next.js API
      ↓
Authentication
      ↓
Input validation
      ↓
Rate limiting
      ↓
Execution provider
      ↓
Sandbox
      ↓
stdout / stderr
      ↓
Application
```

Never expose execution-provider credentials in the browser.

Arbitrary user code must never execute directly on the Vercel server.

Execution must occur inside an external sandbox designed for untrusted code.

---

# 12. Solution Validation

Provide two separate actions.

## Run

Runs code against visible/example inputs.

## Submit

Runs the solution against the full test suite including hidden tests.

Return:

```text
Tests Passed: 7 / 8

✓ Test 1
✓ Test 2
✓ Test 3
✓ Test 4
✓ Test 5
✓ Test 6
✓ Test 7
✗ Hidden Test
```

Do not expose hidden test data.

---

# 13. Hint System

Hints should be progressive.

### Hint 1

Explain the conceptual direction.

### Hint 2

Identify the likely pattern.

### Hint 3

Provide an implementation strategy without code.

### Hint 4

Provide pseudocode.

### Hint 5

Reveal the reference solution only after an intentional request.

Avoid immediately providing working code.

---

# 14. Solution Mode

After completing a problem—or intentionally choosing to reveal it—the user may inspect the reference solution.

Provide a tab for each language that has a reference implementation. Tabs come from language data, not a hard-coded list.

Show:

* Reference implementation
* Explanation
* Time complexity
* Space complexity

---

# 15. Cross-Language Comparison

This is a core differentiating feature.

Provide a mode called:

**Compare Languages**

Example:

| Concept      | Python         | JavaScript      | TypeScript              | C               | Go                    | PHP              |
| ------------ | -------------- | --------------- | ----------------------- | --------------- | --------------------- | ---------------- |
| Variable     | `total = 0`    | `let total = 0` | `let total: number = 0` | `int total = 0` | `total := 0`          | `$total = 0;`    |
| Array length | `len(arr)`     | `arr.length`    | `arr.length`            | explicit length | `len(arr)`            | `count($arr)`    |
| Loop         | `for x in arr` | `for...of`      | `for...of`              | indexed `for`   | `for _, x := range`   | `foreach`        |
| Return type  | dynamic        | dynamic         | explicit/inferred       | explicit        | explicit              | dynamic/typed    |

The table above is illustrative. Comparison content must be produced from problem/language data (and later from curated concept notes), not hard-coded language lists in React components.

The purpose is to separate:

**Algorithmic knowledge**

from:

**Language syntax knowledge**

---

# 16. Translation Practice Mode

After solving a problem in one language, optionally challenge the user to solve the same problem in another.

Example:

```text
You solved this in Python.

Now implement the same algorithm in PHP.

[ Start PHP Version ]
```

Do not show the previous reference solution unless requested.

This mode should reinforce understanding of the underlying algorithm.

---

# 17. AI Problem Generation

Administrators should be able to generate curriculum content with AI.

Admin workflow:

```text
Generate Problems

Concept:
[ Sliding Window ]

Difficulty:
[ Easy → Hard ]

Problems:
[ 10 ]

Languages:
☑ Python
☑ JavaScript
☑ TypeScript
☑ C
☑ Go
☑ PHP

[ Generate ]
```

Language checkboxes are rendered from enabled languages in the database.

AI should return structured data rather than prose.

Use a strict schema validated with Zod.

Generated information should include:

* Problem title
* Description
* Difficulty
* Instructions
* Examples
* Constraints
* Hints
* Test cases
* Starter code
* Reference solution per language
* Explanation per language
* Time complexity
* Space complexity

---

# 18. AI Content Safety Pipeline

AI-generated problems must NOT automatically become public.

Use:

```text
AI Generation
      ↓
Schema Validation
      ↓
Automated Test Validation
      ↓
Draft
      ↓
Human Review
      ↓
Published
```

Where possible, execute AI-generated reference solutions against generated tests before allowing publication.

A failing implementation should be flagged for review.

---

# 19. AI Tutor

Users may request:

**Explain My Mistake**

Provide the AI:

* Problem
* Concept
* User language
* User code
* Compiler output
* Failed test summary

The tutor should prioritize explanation over replacement.

Preferred behavior:

1. Explain what appears wrong.
2. Identify the relevant concept.
3. Give a small hint.
4. Give pseudocode if requested.
5. Only provide corrected code when explicitly requested.

---

# 20. Progress Dashboard

Provide a user dashboard containing:

```text
Problems Solved
Problems Attempted
Current Streak

Language Progress

Python
JavaScript
TypeScript
C
Go
PHP

Concept Mastery

Strongest Concepts
Needs Practice
Recently Practiced
```

Language rows on the dashboard are rendered from enabled languages.

Avoid inventing arbitrary mastery percentages.

Define a deterministic scoring model before displaying mastery metrics.

**Streak** is a derived activity metric: consecutive calendar days (UTC in MVP) with at least one passing submission. It is not a gamification system. Do not add achievements, leaderboards, or rewards in MVP.

**Concept mastery display:** `{completedPublishedProblems} / {publishedProblemsInConcept}`. Optionally label strongest / needs-practice from those ratios. Do not invent a separate percentage algorithm.

---

# 21. Practice Modes

Eventually support:

## Learn

Work through concepts sequentially.

## Practice

Choose concept, language, and difficulty.

## Random

Random problem matching selected criteria.

## Translation

Solve the same problem in multiple languages.

## Review

Practice previously failed problems.

## Challenge

Timed or restricted-hint sessions.

These do not all need to be implemented in MVP.

MVP includes Translation as a workspace prompt after a first-language completion. Learn / Random / Review / Challenge can wait.

---

# 22. Admin Interface

Provide `/admin`.

Only administrators may access it.

Sections:

```text
Dashboard
Concepts
Categories
Problems
Languages
AI Generator
Drafts
Review Queue
```

Use server-side authorization in addition to UI hiding.

Never rely solely on client-side role checks.

---

# 23. Security

Implement:

* Supabase Row Level Security
* Server-side authorization
* API input validation
* Rate limiting for execution
* Rate limiting for AI
* Environment-variable secrets
* Safe handling of user-generated code

Never expose:

* Supabase service role key
* AI provider API keys
* execution-provider credentials

Never execute arbitrary code inside Next.js/Vercel runtime.

---

# 24. Responsive Design

Desktop is the primary coding experience.

Tablet should remain functional.

Mobile should prioritize:

* Browsing curriculum
* Reading concepts
* Viewing progress
* Reviewing solutions

Coding on mobile may be supported but does not need to match the desktop IDE experience.

---

# 25. Visual Direction

The application should feel like a modern developer tool rather than a children's educational application.

Inspiration:

* VS Code
* GitHub
* Linear
* Vercel
* modern developer documentation

Characteristics:

* Clean
* Minimal
* Information dense without clutter
* Excellent typography
* Strong dark mode
* Subtle borders
* Restrained animation
* Keyboard-friendly interactions

Avoid excessive gradients, oversized cards, unnecessary animations, and generic "AI SaaS" aesthetics.

---

# 26. MVP

The first usable version should include:

### Authentication

* Sign up
* Sign in
* Sign out

### Curriculum

* Categories
* Concepts
* Problem browser

### Problems

* Problem page
* Difficulty
* Examples
* Hints

### Languages

* Python
* JavaScript
* TypeScript
* C
* Go
* PHP

### Coding

* Monaco editor
* Language switching
* Run
* Submit
* Console
* Test results

### Progress

* Attempts
* Completed problems
* Basic dashboard

### Admin

* Concept management
* Problem management
* AI problem generation
* Draft/review/publish workflow

Do not build advanced gamification in MVP.

---

# 27. Future Features

Potential future functionality:

* Spaced repetition
* Skill graphs
* Adaptive problem selection
* Daily challenges
* Streaks as a richer gamification system
* Achievements
* Leaderboards
* User-created problem sets
* Classroom functionality
* Public profiles
* Interview preparation tracks
* AI-generated personalized curricula
* Code performance comparison
* Collaborative coding
* Additional languages
* PWA/offline reading
* Subscription plans

The initial architecture should not prevent these features, but do not prematurely implement infrastructure for them.

---

# 28. Engineering Principles

Follow these rules throughout implementation:

1. Prefer simple architecture.
2. Keep domain logic independent from UI components.
3. Make languages data-driven.
4. Make curriculum data-driven.
5. Treat problems as language-independent entities.
6. Validate all AI output.
7. Never trust client input.
8. Never execute user code on application infrastructure.
9. Use database migrations.
10. Maintain strong TypeScript types.
11. Avoid unnecessary dependencies.
12. Avoid premature abstraction.
13. Avoid premature microservices.
14. Keep components small and focused.
15. Design for thousands of problems without building for millions of users prematurely.

---

# 29. Core Product Principle

Every architectural decision should preserve this relationship:

```text
                    PROGRAMMING CONCEPT
                           │
                           ▼
                         PATTERN
                           │
                           ▼
                        PROBLEM
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Python        PHP             ...
             │             │
             └─────────────┬─────────────┘
                           ▼
                  Same Algorithmic Idea
```

The application exists to teach users to recognize the programming idea independently of the language used to implement it.
