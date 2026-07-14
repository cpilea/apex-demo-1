export type MovieSummary = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export type MovieListResponse = {
  page: number;
  results: MovieSummary[];
  total_pages: number;
  total_results: number;
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  genres: Array<{ id: number; name: string }>;
};

export type MovieCredits = {
  id: number;
  cast: CastMember[];
};

export type MovieReview = {
  id: string;
  movieId: number;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};
