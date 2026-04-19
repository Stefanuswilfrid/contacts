# Contacts

A small contacts directory UI: sign in with email/password or **Google** (OAuth), then browse and search a list backed by **Supabase**. Built with **TanStack Start** (React, file routes, SSR via **Nitro**), **Tailwind CSS**, and **@tanstack/react-virtual** for long lists.

---

## Prerequisites

- **Node.js** — **22.x** is recommended; lower versions (e.g. **20.x**) can still run the app, though npm may show engine warnings.
- A **Supabase** project with Auth enabled and (for this app) a `public.users`-style table as described in your migrations / SQL notes



## Run locally

```bash
npm install
npm run dev
```


## Environment variables

Create a `.env` in the project root (see `.env.example` for the full template).

**Required for the app (Vite — exposed to the browser):**

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (Dashboard → **Project Settings** → **API** → **Project URL**) |
| `VITE_SUPABASE_ANON_KEY` | Supabase **anon** `public` key (same screen) |

---

## What it does 

1. **`/`** — Login and sign-up (`AuthForm`): email/password and Google OAuth via Supabase Auth.
2. **`/dashboard`** — Contact list page: loads rows from Supabase (`public.users` / contacts mapping in `src/lib/supabase/contacts.ts`), search, and a virtualized list so scrolling stays smooth with many rows.


## Key design decisions

- **Virtualized contact list** — On the dashboard contact list, only visible rows are rendered and measured, so long lists stay responsive instead of mounting thousands of DOM nodes at once.
- **Supabase as source of truth** — Contacts come from  DB 
- **Route guards**  guests cannot open `/dashboard`; signed-in users are redirected away from `/`. 
- **Auth** — **Email and password**  plus **Google OAuth** ; enable the Email and Google providers and redirect URLs in Supabase.
