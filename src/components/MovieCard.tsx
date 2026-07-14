import { Link } from "react-router-dom";
import { buildPosterUrl } from "../services/tmdb";
import type { MovieSummary } from "../types/movie";

type MovieCardProps = {
  movie: MovieSummary;
};

export function MovieCard({ movie }: MovieCardProps) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "TBA";
  const fallbackPoster = buildPosterUrl(null);

  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <div className="movie-poster-wrap">
          <img
            className="movie-poster"
            src={buildPosterUrl(movie.poster_path)}
            alt={`${movie.title} poster`}
            loading="lazy"
            onError={(event) => {
              if (event.currentTarget.src !== fallbackPoster) {
                event.currentTarget.src = fallbackPoster;
              }
            }}
          />
          <div className="movie-card-overlay">
            <span className="overlay-view">View Details</span>
          </div>
          <span className="rating-badge">
            &#9733; {movie.vote_average.toFixed(1)}
          </span>
        </div>
        <div className="movie-card-content">
          <h3 className="movie-card-title">{movie.title}</h3>
          <p className="movie-card-year">{year}</p>
        </div>
      </Link>
    </article>
  );
}
