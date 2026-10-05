# Snippet

A full-stack microblogging platform built with the MERN stack: post, like, bookmark, follow, and share images in a fast, responsive single-page app.

[**Live Demo**](#) · [**Backend Repo**](#) · [**Report a Bug**](https://github.com/aneeshaugustinehub/snippet-client/issues)

<!-- Replace (#) above with your deployed URL and server repo URL -->

![Snippet screenshot](./docs/screenshot-home.png)
<!-- Add 2-3 screenshots or a short GIF to /docs. This is the single biggest recruiter win. -->

---

## Features

- **Authentication:** JWT-based sign up / login with bcrypt-hashed passwords and protected routes
- **Tweets:** create, read, update, and delete posts, with image uploads
- **Engagement:** like and bookmark posts, with instant UI updates
- **Social graph:** follow / unfollow users and browse user profiles
- **Relative timestamps:** compact "2h" / "3d" style times via a centralized `moment` locale config
- **Responsive UI:** built with Tailwind CSS

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, TanStack Query, Axios, Tailwind CSS |
| Backend | Node.js, Express, Multer (uploads), JWT, bcrypt |
| Database | MongoDB with Mongoose |
| Tooling | ESLint, PostCSS, Autoprefixer |

> This repo contains the **client**. The API lives in the [backend repo](#).

## Engineering Highlights

**Server state with TanStack Query.** All data fetching goes through `useQuery`, `useMutation`, and `useQueries` instead of hand-rolled `useEffect`/`useState`. Consistent query keys (`["tweets"]`, `["tweet", id]`) make cache invalidation predictable, and `useQueries` fetches related data in parallel rather than in a waterfall.

**Efficient relationship modeling.** Likes, bookmarks, and follows are stored as array fields in Mongoose schemas and updated atomically with `$addToSet`, which keeps lookups simple and avoids extra joins at this scale.

**Vite reverse proxy.** The dev server proxies API calls to Express, so the frontend never hardcodes a backend origin. This removes CORS issues and keeps dev and production request paths consistent.

**Clean client/server boundary.** The client talks to the API only through a centralized Axios instance, with an interceptor that attaches the auth token to every request.

## Architecture

```
React (Vite) ──Axios──▶ Vite proxy ──▶ Express API ──Mongoose──▶ MongoDB
     │                                      │
 TanStack Query cache                 JWT auth + Multer
```

```
src/
├── components/   # Reusable UI
├── pages/        # Route-level views
├── context/      # Auth and tweets providers
└── ...
```
<!-- Adjust the folder tree to match your actual src/ structure. -->

## Getting Started

**Prerequisites:** Node.js 20+, a running MongoDB instance, and the [backend](#) set up.

```bash
# Clone and install
git clone https://github.com/aneeshaugustinehub/snippet-client.git
cd snippet-client
npm install

# Configure environment
cp .env.example .env   # set VITE_BASE_URL if needed

# Start the dev server (http://localhost:5173)
npm run dev
```

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Roadmap

- [ ] Deploy to a live URL
- [ ] Swap `moment` for `dayjs` to shrink the bundle
- [ ] Pagination / infinite scroll for the feed
- [ ] Move bookmarks to an indexed join collection for larger scale
- [ ] Automated tests (Vitest + React Testing Library)

## What I Learned

- Route ordering in Express and why specific routes must precede `/:param` routes
- Keeping Node-only code out of the browser bundle
- Designing cache keys and invalidation strategy for a server-state-driven UI
- Trade-offs between embedded arrays and normalized collections in MongoDB

## Author

**Aneeshaugustine**: [GitHub](https://github.com/aneeshaugustinehub)

<!-- Add LinkedIn, portfolio, and email here. -->