import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { HomePage } from "./pages/HomePage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { WatchlistPage } from "./pages/WatchlistPage";
import { AuthPage } from "./pages/AuthPage";
import { ErrorPage } from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "movie/:movieId",
        element: <MovieDetailsPage />,
      },
      {
        path: "watchlist",
        element: <WatchlistPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
