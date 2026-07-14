import { useCallback } from "react";
import { useInfiniteMovies, useSentinel } from "../hooks/useInfiniteMovies";
import { MovieCard } from "../components/MovieCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { EmptyState, ErrorState } from "../components/PageStatus";

const SKELETON_COUNT = 12;

export function HomePage() {
  const {
    movies,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteMovies();

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useSentinel(loadMore, Boolean(hasNextPage && !isFetchingNextPage));

  return (
    <section>
      <div className="home-header">
        <h1 className="home-title">Latest Releases</h1>
        <p className="home-subtitle">Sorted by release date &mdash; scroll to discover more</p>
      </div>

      {error ? (
        <ErrorState
          title="Could not load movies"
          message="Check your TMDB API key or network connection, then refresh and try again."
        />
      ) : null}

      {!isLoading && !error && movies.length === 0 ? (
        <EmptyState
          title="No movies found"
          message="The release feed returned no items. Try again later."
        />
      ) : null}

      <div className="movie-grid" aria-live="polite" aria-busy={isLoading || isFetchingNextPage}>
        {isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}

        {isFetchingNextPage
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)
          : null}
      </div>

      <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />

      {hasNextPage && !isFetchingNextPage ? (
        <div className="load-more-wrapper">
          <button className="load-more-btn" onClick={loadMore} aria-label="Load more movies">
            Load more
          </button>
        </div>
      ) : null}

      {!hasNextPage && movies.length > 0 ? (
        <p className="end-of-list">You've reached the end!</p>
      ) : null}
    </section>
  );
}
