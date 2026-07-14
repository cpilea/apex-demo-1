import { config } from "../lib/config";
import type { MovieCredits, MovieDetails, MovieListResponse } from "../types/movie";

function createPlaceholderSvg(label: string, width: number, height: number): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#dcebe5" />
          <stop offset="100%" stop-color="#b9d2c8" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" rx="18" />
      <circle cx="50%" cy="40%" r="44" fill="#edf5f1" opacity="0.9" />
      <rect x="22%" y="62%" width="56%" height="18" rx="9" fill="#edf5f1" opacity="0.95" />
      <text x="50%" y="82%" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#36584d">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const posterPlaceholder = createPlaceholderSvg("No Poster", 500, 750);
const avatarPlaceholder = createPlaceholderSvg("?", 185, 185);

async function request<T>(path: string): Promise<T> {
  if (!config.tmdbApiKey) {
    throw new Error("TMDB API key is missing. Configure VITE_TMDB_API_KEY.");
  }

  const url = new URL(`${config.tmdbApiBaseUrl}${path}`);
  url.searchParams.set("api_key", config.tmdbApiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function getNowPlayingMovies(page = 1): Promise<MovieListResponse> {
  return request<MovieListResponse>(`/movie/now_playing?page=${page}`);
}

export function getMoviesByReleaseDate(page = 1): Promise<MovieListResponse> {
  return request<MovieListResponse>(
    `/discover/movie?sort_by=release_date.desc&page=${page}&include_adult=false&include_video=false`
  );
}

export function getMovieDetails(movieId: string): Promise<MovieDetails> {
  return request<MovieDetails>(`/movie/${movieId}`);
}

export function getMovieCredits(movieId: string): Promise<MovieCredits> {
  return request<MovieCredits>(`/movie/${movieId}/credits`);
}

export function buildPosterUrl(posterPath: string | null): string {
  if (!posterPath) {
    return posterPlaceholder;
  }

  return `${config.tmdbImageBaseUrl}${posterPath}`;
}

export function buildBackdropUrl(backdropPath: string | null): string | null {
  if (!backdropPath) return null;
  return `https://image.tmdb.org/t/p/w1280${backdropPath}`;
}

export function buildAvatarUrl(profilePath: string | null): string {
  if (!profilePath) return avatarPlaceholder;
  return `https://image.tmdb.org/t/p/w185${profilePath}`;
}
