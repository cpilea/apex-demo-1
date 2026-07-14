import { Link, useRouteError } from "react-router-dom";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected routing error occurred.";
}

export function ErrorPage() {
  const error = useRouteError();

  return (
    <section className="status-card status-card-error" role="alert">
      <h1 className="status-title">Page error</h1>
      <p className="status-message">{getErrorMessage(error)}</p>
      <div className="status-action">
        <Link className="load-more-btn status-link" to="/">
          Back to Home
        </Link>
      </div>
    </section>
  );
}