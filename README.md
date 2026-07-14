# Movie Database App

Phase 1 scaffold for the Movie Database project.

## Included in this phase
- React + TypeScript + Vite setup.
- Routing skeleton for:
  - Home (`/`)
  - Movie details (`/movie/:movieId`)
  - Watchlist placeholder (`/watchlist`)
  - Auth placeholder (`/auth`)
- TMDB API client and typed models.
- Environment variable configuration via `.env`.

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
