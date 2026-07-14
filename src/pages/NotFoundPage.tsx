import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section>
      <h1>Page Not Found</h1>
      <p>This route is not available yet.</p>
      <Link to="/">Back to Home</Link>
    </section>
  );
}
