import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMoviesByReleaseDate } from "../services/tmdb";
import type { MovieListResponse } from "../types/movie";

export function useInfiniteMovies() {
  const query = useInfiniteQuery<MovieListResponse>({
    queryKey: ["movies", "by-release-date"],
    queryFn: ({ pageParam }) => getMoviesByReleaseDate(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  // Flatten all pages into a single deduped array
  const movies = query.data?.pages.flatMap((p) => p.results) ?? [];

  return { ...query, movies };
}

/** Returns a ref to attach to a sentinel element; fires callback when visible. */
export function useSentinel(callback: () => void, enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callback();
      },
      { rootMargin: "200px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [callback, enabled]);

  return ref;
}
