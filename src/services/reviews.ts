import { readScopedStorage, writeScopedStorage } from "../lib/localStorage";
import type { MovieReview } from "../types/movie";

const REVIEWS_KEY = "reviews";

type ReviewDraft = {
  movieId: number;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  content: string;
};

type ReviewStore = Record<string, MovieReview[]>;

function readReviewStore() {
  return readScopedStorage<ReviewStore>(REVIEWS_KEY, {});
}

export async function getMovieReviews(movieId: number) {
  const reviews = readReviewStore()[String(movieId)] ?? [];

  return reviews.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function saveMovieReview(review: ReviewDraft) {
  const reviewStore = readReviewStore();
  const movieKey = String(review.movieId);
  const currentReviews = reviewStore[movieKey] ?? [];
  const timestamp = new Date().toISOString();

  const nextReview: MovieReview = {
    id: `${review.movieId}:${review.userId}`,
    movieId: review.movieId,
    userId: review.userId,
    userName: review.userName,
    userEmail: review.userEmail,
    rating: review.rating,
    content: review.content.trim(),
    createdAt:
      currentReviews.find((entry) => entry.userId === review.userId)?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };

  reviewStore[movieKey] = [
    nextReview,
    ...currentReviews.filter((entry) => entry.userId !== review.userId),
  ];
  writeScopedStorage(REVIEWS_KEY, reviewStore);

  return nextReview;
}
