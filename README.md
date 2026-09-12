# Vidya — College Discovery Platform

A frontend-focused MVP for a college discovery/decision platform (AI Software Engineer
Internship demo task, Track A). Search, filter, compare, and dig into colleges backed by
a real Postgres database and typed API routes — no hardcoded frontend data.

## Features built (3, done deliberately, not 6 done shallow)

1. **College listing + search** — free-text search (name/city), filters for stream,
   state, college type, fee ceiling, and minimum rating; sortable; paginated.
   Filter options are loaded from `/api/meta`, derived from the actual data — not
   hardcoded dropdowns that could drift from what's in the DB.
2. **College detail page** — overview, courses, 3-year placement history, and reviews,
   as tabs.
3. **Compare colleges** — add up to 3 colleges to a persistent compare tray (works
   across pages, survives a refresh) and view fees / rating / location / placements
   side by side.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- PostgreSQL + Prisma ORM
- Zod for API input validation
- No client-side UI kit — components are hand-built and intentionally styled
  (see "Design notes" below)

## Getting started

```bash
npm install

# 1. Point DATABASE_URL at a real Postgres instance.
#    Easiest: create a free instance at https://neon.tech, then:
cp .env.example .env
# edit .env and paste your connection string into DATABASE_URL

# 2. Generate the Prisma client and create the schema in your database
npx prisma generate
npx prisma db push

# 3. Seed ~42 colleges with courses, placements, and reviews
npx prisma db seed

# 4. Run it
npm run dev
```

Open http://localhost:3000.

> **Note:** I built and validated all the query/filter/sort/pagination/compare logic
> against an in-memory stand-in for Prisma Client, because the sandbox I built this in
> couldn't reach Prisma's binary-download host. The schema and queries are standard
> Prisma syntax with no exotic features, but **run through the steps above yourself
> before your demo** to confirm end-to-end against a real database.

## Regenerating seed data

`prisma/seed-data.ts` is generated, not hand-written:

```bash
node prisma/generate-seed-data.js
```

It deterministically produces colleges across 20 Indian cities with varied types,
streams, fee bands, and realistic-looking (but synthetic) placement/review data — edit
`prisma/generate-seed-data.js` if you want to change volume or shape.

## Architecture decisions

- **Single source of truth for queries.** `lib/queryColleges.ts` and `lib/getFacets.ts`
  hold the actual Prisma query logic. Both the API route (`app/api/colleges/route.ts`)
  and the server-rendered `/colleges` page call the *same* functions, so the initial
  SSR page and subsequent client-side API calls can never drift out of sync with each
  other.
- **URL as the source of truth for filter state**, not React state. Every filter,
  sort, and page number lives in the query string. That makes filtered searches
  shareable/bookmarkable and gives back/forward-button support for free — a small
  decision that matters a lot for a search-heavy product like this.
- **Hybrid render strategy.** `/colleges` is server-rendered for the *first* page load
  (fast first paint, good for SEO on a discovery product), then hands off to a client
  component (`CollegeSearch`) that fetches `/api/colleges` on every subsequent filter
  change. This was a deliberate choice to demonstrate both SSR data-fetching and
  client-side API state handling (loading/error states, request cancellation via
  `AbortController`, debounced search input) rather than picking one and ignoring the
  other.
- **Compare tray as a small client Context**, persisted to `localStorage`, so you can
  add a college to comparison from the listing page or a detail page and it survives
  navigation and refresh. Deliberately not URL state, because "what am I comparing"
  is closer to a shopping cart than a page's content.
- **Validation at the edge.** All query params are parsed with a single Zod schema
  (`lib/collegeQuery.ts`) shared by the API route — bad input gets a 400 with a
  specific message, not a silent fallback or a crash.
- **Data normalization trade-off:** `streams` and `topRecruiters` are stored as
  comma-separated strings rather than a join table. For an MVP with a fixed, small
  set of streams this kept the schema and queries simple; a production version with
  many-to-many stream/recruiter relationships (e.g. filtering by multiple streams at
  once) would move these to proper relations.

## Design notes

The palette and type system are deliberately not the generic "cream background +
terracotta accent" AI-template look. It leans academic/editorial: deep indigo (`#1b2340`)
for text and structure, a muted gold (`#b1811f`) as the single accent color (used for
ratings, active filters, and CTAs only), Fraunces for display type and Inter for UI/data.
Cards use a left-border color-code per college rather than the generic
rounded-card-with-shadow kit, and the listing page is a left-aligned, sidebar-filter
layout (like a real search tool) rather than a centered marketing page — because the
product's job is dense, comparable information, not a hero pitch.

## What I'd add with more time

- Auth + saved colleges/comparisons (explicitly out of scope for this pass — see
  the "Choose 3–4 features" instruction in the brief)
- Infinite scroll as an alternative to numbered pagination
- Server-side caching (`unstable_cache` / Redis) on `/api/meta`, which rarely changes
- Proper `streams`/`topRecruiters` join tables once filtering needs to support
  multi-select
