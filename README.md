# Movie Database App

Phase 4 movie database demo with local account, watchlist, and review support.

## Included in this phase
- React + TypeScript + Vite setup.
- Routing for:
  - Home (`/`)
  - Movie details (`/movie/:movieId`)
  - Watchlist (`/watchlist`)
  - Account/auth (`/auth`)
- TMDB API client and typed models.
- Environment variable configuration via `.env`.
- Custom local demo auth backed by browser storage.
- Per-user watchlist persistence.
- Per-movie reviews scoped to the signed-in user.

## Setup
1. Install Node.js 20+.
2. Copy `.env.example` to `.env`.
3. Add your TMDB key in `.env`.
4. Install dependencies and run:

```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Environment variables
- `VITE_TMDB_API_KEY`
- `VITE_TMDB_API_BASE_URL` (default: https://api.themoviedb.org/3)
- `VITE_TMDB_IMAGE_BASE_URL` (default: https://image.tmdb.org/t/p/w500)
- `VITE_APP_STORAGE_NAMESPACE` (default: `movie-database-app`)
- `VITE_AUTH_PROVIDER_LABEL` (default: `Custom local demo auth`)

## Phase 4 provider choice

This build uses a **custom local demo auth/persistence layer**. Account sessions, watchlists, and reviews are stored in browser local storage under the configured app namespace so the Phase 4 flows work without needing external credentials.
