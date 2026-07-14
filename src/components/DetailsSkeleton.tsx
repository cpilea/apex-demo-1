export function DetailsSkeleton() {
  return (
    <section className="details-page" aria-busy="true" aria-live="polite">
      <div className="details-header details-header-skeleton">
        <div className="details-poster skeleton" />
        <div className="details-meta details-meta-skeleton">
          <div className="skeleton skeleton-heading" />
          <div className="details-badges">
            <span className="skeleton skeleton-badge" />
            <span className="skeleton skeleton-badge" />
            <span className="skeleton skeleton-badge short" />
          </div>
          <div className="skeleton skeleton-line details-line-wide" />
          <div className="skeleton skeleton-line details-line-wide" />
          <div className="skeleton skeleton-line details-line-mid" />
        </div>
      </div>
      <div className="cast-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="cast-card">
            <div className="cast-avatar skeleton" />
            <div className="cast-info">
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-sub" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}