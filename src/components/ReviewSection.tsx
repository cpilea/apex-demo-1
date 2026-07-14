import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMovieReviews, saveMovieReview } from "../services/reviews";
import { EmptyState, ErrorState, LoadingState } from "./PageStatus";

type ReviewSectionProps = {
  movieId: number;
  movieTitle: string;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString();
}

export function ReviewSection({ movieId, movieTitle }: ReviewSectionProps) {
  const { user, isReady } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState("5");
  const [content, setContent] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const reviewsQuery = useQuery({
    queryKey: ["reviews", movieId],
    queryFn: () => getMovieReviews(movieId),
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Sign in to review movies.");
      }

      const trimmedContent = content.trim();

      if (!trimmedContent) {
        throw new Error("Write a short review before submitting.");
      }

      return saveMovieReview({
        movieId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        rating: Number(rating),
        content: trimmedContent,
      });
    },
    onSuccess: async () => {
      setContent("");
      setRating("5");
      setFormError(null);
      await queryClient.invalidateQueries({
        queryKey: ["reviews", movieId],
      });
    },
    onError: (error) => {
      setFormError(error instanceof Error ? error.message : "We couldn't save that review.");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    reviewMutation.mutate();
  };

  const handleSignIn = () => {
    navigate("/auth", {
      state: {
        message: "Sign in to review this movie.",
        redirectTo: `${location.pathname}${location.search}${location.hash}`,
      },
    });
  };

  return (
    <section className="reviews-section">
      <div className="section-copy">
        <h2 className="cast-title">Reviews</h2>
        <p className="home-subtitle">
          Share your take on {movieTitle} and see what other signed-in movie fans think.
        </p>
      </div>

      {!isReady || reviewsQuery.isLoading ? (
        <LoadingState title="Loading reviews" message="Pulling together the latest reactions." />
      ) : reviewsQuery.error ? (
        <ErrorState
          title="Could not load reviews"
          message="Reviews are unavailable right now. Please try again in a moment."
        />
      ) : reviewsQuery.data && reviewsQuery.data.length > 0 ? (
        <ul className="review-list">
          {reviewsQuery.data.map((review) => (
            <li key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-meta">
                  <strong>{review.userName}</strong>
                  <span>{review.userEmail}</span>
                </div>
                <div className="review-badges">
                  <span className="review-rating-badge">{review.rating}/5</span>
                  <span className="movie-card-year">{formatDate(review.updatedAt)}</span>
                </div>
              </div>
              <p className="review-copy">{review.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No reviews yet"
          message="Be the first signed-in viewer to leave a review for this movie."
        />
      )}

      {user ? (
        <div className="review-form-shell">
          <h3 className="movie-card-title">Write a review</h3>
          <p className="movie-card-year">Submitting again replaces your previous review for this movie.</p>

          <form className="stacked-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="review-rating">
              Rating
            </label>
            <select
              id="review-rating"
              className="text-input"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} / 5
                </option>
              ))}
            </select>

            <label className="field-label" htmlFor="review-content">
              Review
            </label>
            <textarea
              id="review-content"
              className="text-area"
              rows={5}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="What stood out to you?"
            />

            {formError ? <p className="helper-message error-copy">{formError}</p> : null}

            <div className="inline-actions">
              <button type="submit" className="load-more-btn" disabled={reviewMutation.isPending}>
                {reviewMutation.isPending ? "Saving review..." : "Submit review"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="review-form-shell">
          <p className="restricted-copy">
            Sign in to add your own review and keep it tied to your account.
          </p>
          <div className="inline-actions">
            <button type="button" className="load-more-btn" onClick={handleSignIn}>
              Sign in to review
            </button>
            <Link to="/auth" className="secondary-btn">
              Create account
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
