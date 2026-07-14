import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ReviewSection } from "../components/ReviewSection";
import { WatchlistButton } from "../components/WatchlistButton";
import {
  buildAvatarUrl,
  buildBackdropUrl,
  buildPosterUrl,
  getMovieCredits,
  getMovieDetails,
} from "../services/tmdb";
import { DetailsSkeleton } from "../components/DetailsSkeleton";
import { EmptyState, ErrorState } from "../components/PageStatus";
import type { MovieSummary } from "../types/movie";

function StarRating({ value }: { value: number }) {
  const pct = (value / 10) * 100;
  return (
    <span className="star-rating" title={`${value.toFixed(1)} / 10`}>
      <span className="star-fill" style={{ width: `${pct}%` }}>★★★★★</span>
      <span className="star-empty">★★★★★</span>
    </span>
  );
}

export function MovieDetailsPage() {
  const { movieId } = useParams();
  const fallbackPoster = buildPosterUrl(null);
  const fallbackAvatar = buildAvatarUrl(null);

  const detailsQuery = useQuery({
    queryKey: ["movie", movieId, "details"],
    queryFn: () => getMovieDetails(movieId ?? ""),
    enabled: Boolean(movieId),
  });

  const creditsQuery = useQuery({
    queryKey: ["movie", movieId, "credits"],
    queryFn: () => getMovieCredits(movieId ?? ""),
    enabled: Boolean(movieId),
  });

  if (!movieId) {
    return (
      <ErrorState
        title="Missing movie id"
        message="The movie details URL is incomplete. Go back and choose a movie again."
        action={<Link className="load-more-btn status-link" to="/">Back to Home</Link>}
      />
    );
  }

  if (detailsQuery.isLoading || creditsQuery.isLoading) {
    return <DetailsSkeleton />;
  }

  if (detailsQuery.error || creditsQuery.error || !detailsQuery.data) {
    return (
      <ErrorState
        title="Could not load movie details"
        message="The movie information or cast list could not be retrieved right now."
        action={<Link className="load-more-btn status-link" to="/">Back to Home</Link>}
      />
    );
  }

  const movie = detailsQuery.data;
  const cast = creditsQuery.data?.cast.slice(0, 10) ?? [];
  const backdrop = buildBackdropUrl(movie.backdrop_path);
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "TBA";
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;
  const watchlistMovie: MovieSummary = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
  };

  return (
    <div className="details-page">
      {backdrop && (
        <div
          className="details-backdrop"
          style={{ backgroundImage: `url(${backdrop})` }}
          aria-hidden="true"
        />
      )}

      <div className="details-content">
        <Link to="/" className="details-back">&#8592; Back to Movies</Link>

        <div className="details-header">
          <img
            className="details-poster"
            src={buildPosterUrl(movie.poster_path)}
            alt={`${movie.title} poster`}
            onError={(event) => {
              if (event.currentTarget.src !== fallbackPoster) {
                event.currentTarget.src = fallbackPoster;
              }
            }}
          />
          <div className="details-meta">
            <h1 className="details-title">{movie.title}</h1>

            {movie.genres.length > 0 ? (
              <div className="details-badges" aria-label="Movie genres">
                {movie.genres.map((g) => (
                  <span key={g.id} className="badge">{g.name}</span>
                ))}
              </div>
            ) : null}

            <div className="details-stats">
              <span className="stat-item">
                <StarRating value={movie.vote_average} />
                <strong>{movie.vote_average.toFixed(1)}</strong>/10
              </span>
              <span className="stat-separator">·</span>
              <span className="stat-item">📅 {releaseYear}</span>
              {runtime && (
                <>
                  <span className="stat-separator">·</span>
                  <span className="stat-item">⏱ {runtime}</span>
                </>
              )}
            </div>

            <p className="details-overview">{movie.overview || "No overview available."}</p>
            <div className="details-actions">
              <WatchlistButton
                movie={watchlistMovie}
                className="watchlist-btn watchlist-btn-hero"
                redirectTo={`/movie/${movie.id}`}
              />
            </div>
          </div>
        </div>

        {cast.length > 0 ? (
          <div className="cast-section">
            <h2 className="cast-title">Main Cast</h2>
            <div className="cast-grid">
              {cast.map((member) => (
                <div key={member.id} className="cast-card">
                  <img
                    className="cast-avatar"
                    src={buildAvatarUrl(member.profile_path)}
                    alt={member.name}
                    loading="lazy"
                    onError={(event) => {
                      if (event.currentTarget.src !== fallbackAvatar) {
                        event.currentTarget.src = fallbackAvatar;
                      }
                    }}
                  />
                  <div className="cast-info">
                    <span className="cast-name">{member.name}</span>
                    <span className="cast-character">{member.character || ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No cast information"
            message="This movie does not currently have cast data available."
          />
        )}

        <ReviewSection movieId={movie.id} movieTitle={movie.title} />
      </div>
    </div>
  );
}
