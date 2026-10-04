export default function SkeletonCard() {
  return (
    <div className="card listing-card skeleton-card" aria-hidden="true">
      <div className="skeleton-thumb skeleton-shimmer" />
      <div className="card-body">
        <div className="row-between">
          <div className="skeleton-bar skeleton-shimmer" style={{ width: '60px', height: '16px' }} />
          <div className="skeleton-bar skeleton-shimmer" style={{ width: '40px', height: '16px' }} />
        </div>
        <div className="skeleton-bar skeleton-shimmer" style={{ width: '80%', height: '18px' }} />
        <div className="skeleton-bar skeleton-shimmer" style={{ width: '50%', height: '14px' }} />
        <div className="skeleton-bar skeleton-shimmer" style={{ width: '40%', height: '18px' }} />
      </div>
    </div>
  );
}
