import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import { EmptyState, ErrorState, LoadingState } from "../components/PageStatus";
import { useAuth } from "../contexts/useAuth";
import { getWatchlist } from "../services/watchlist";

export function WatchlistPage() {
  const { user, isReady } = useAuth();
  const watchlistQuery = useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: () => getWatchlist(user!.id),
    enabled: Boolean(user),
  });

  if (!isReady) {
    return (
      <LoadingState
        title="Loading watchlist"
        message="Checking your account before showing saved movies."
      />
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Sign in to view your watchlist"
        message="Your saved movies are stored per account, so you need to sign in before we can show them."
        action={
          <Link className="load-more-btn status-link" to="/auth">
            Go to account
          </Link>
        }
      />
    );
  }

  if (watchlistQuery.isLoading) {
    return (
      <LoadingState
        title="Loading watchlist"
        message="Gathering the movies you've saved for later."
      />
    );
  }

  if (watchlistQuery.error) {
    return (
      <ErrorState
        title="Could not load your watchlist"
        message="We couldn't read your saved movies right now. Please refresh and try again."
      />
    );
  }

  if (!watchlistQuery.data || watchlistQuery.data.length === 0) {
    return (
      <EmptyState
        title="Your watchlist is empty"
        message="Save a movie from the home feed or the details page and it will appear here."
        action={
          <Link className="load-more-btn status-link" to="/">
            Browse movies
          </Link>
        }
      />
    );
  }

  return (
    <section>
      <div className="section-copy">
        <h1 className="home-title">Watchlist</h1>
        <p className="home-subtitle">Only movies saved to your account are shown here.</p>
      </div>

      <div className="movie-grid">
        {watchlistQuery.data.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
