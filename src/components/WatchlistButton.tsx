import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getWatchlist, removeWatchlistMovie, saveWatchlistMovie } from "../services/watchlist";
import type { MovieSummary } from "../types/movie";

type WatchlistButtonProps = {
  movie: MovieSummary;
  className?: string;
  redirectTo?: string;
};

export function WatchlistButton({ movie, className, redirectTo }: WatchlistButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const watchlistQuery = useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: () => getWatchlist(user!.id),
    enabled: Boolean(user),
  });

  const isSaved = Boolean(watchlistQuery.data?.some((entry) => entry.id === movie.id));

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Sign in to manage your watchlist.");
      }

      if (isSaved) {
        return removeWatchlistMovie(user.id, movie.id);
      }

      return saveWatchlistMovie(user.id, movie);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["watchlist", user?.id],
      }),
  });

  const handleClick = () => {
    if (!user) {
      navigate("/auth", {
        state: {
          message: "Sign in to save movies to your watchlist.",
          redirectTo: redirectTo ?? `${location.pathname}${location.search}${location.hash}`,
        },
      });
      return;
    }

    mutation.mutate();
  };

  const label = !user
    ? "Sign in to save"
    : mutation.isPending
      ? isSaved
        ? "Removing..."
        : "Saving..."
      : isSaved
        ? "Remove from Watchlist"
        : "Add to Watchlist";

  return (
    <button
      type="button"
      className={className ?? "watchlist-btn"}
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-pressed={user ? isSaved : undefined}
    >
      {label}
    </button>
  );
}
