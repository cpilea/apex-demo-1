export function SkeletonCard() {
  return (
    <div className="movie-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-poster" />
      <div className="movie-card-content">
        <div className="skeleton skeleton-line skeleton-title" />
        <div className="skeleton skeleton-line skeleton-sub" />
        <div className="skeleton skeleton-line skeleton-sub short" />
      </div>
    </div>
  );
}
