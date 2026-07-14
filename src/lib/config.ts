const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined;

if (!tmdbApiKey) {
  console.warn(
    "VITE_TMDB_API_KEY is missing. Create a .env file from .env.example before running API calls."
  );
}

export const config = {
  tmdbApiKey,
  tmdbApiBaseUrl:
    (import.meta.env.VITE_TMDB_API_BASE_URL as string | undefined) ??
    "https://api.themoviedb.org/3",
  tmdbImageBaseUrl:
    (import.meta.env.VITE_TMDB_IMAGE_BASE_URL as string | undefined) ??
    "https://image.tmdb.org/t/p/w500",
  appStorageNamespace:
    (import.meta.env.VITE_APP_STORAGE_NAMESPACE as string | undefined) ??
    "movie-database-app",
  authProviderLabel:
    (import.meta.env.VITE_AUTH_PROVIDER_LABEL as string | undefined) ??
    "Custom local demo auth",
};
