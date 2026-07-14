import { readScopedStorage, writeScopedStorage } from "../lib/localStorage";
import type { MovieSummary } from "../types/movie";

const WATCHLIST_KEY = "watchlist";

type WatchlistStore = Record<string, MovieSummary[]>;

function readWatchlistStore() {
  return readScopedStorage<WatchlistStore>(WATCHLIST_KEY, {});
}

export async function getWatchlist(userId: string) {
  return readWatchlistStore()[userId] ?? [];
}

export async function saveWatchlistMovie(userId: string, movie: MovieSummary) {
  const watchlistStore = readWatchlistStore();
  const currentMovies = watchlistStore[userId] ?? [];

  watchlistStore[userId] = [movie, ...currentMovies.filter((entry) => entry.id !== movie.id)];
  writeScopedStorage(WATCHLIST_KEY, watchlistStore);

  return watchlistStore[userId];
}

export async function removeWatchlistMovie(userId: string, movieId: number) {
  const watchlistStore = readWatchlistStore();
  const currentMovies = watchlistStore[userId] ?? [];

  watchlistStore[userId] = currentMovies.filter((entry) => entry.id !== movieId);
  writeScopedStorage(WATCHLIST_KEY, watchlistStore);

  return watchlistStore[userId];
}
