function Skeleton({ width = '100%', height = '16px', borderRadius = '8px', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

export function SkeletonTransactionItem() {
  return (
    <li className="expense-item" style={{ gap: 12 }}>
      <div className="tx-item-left" style={{ flex: 1 }}>
        <Skeleton width="38px" height="38px" borderRadius="50%" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width="60%" height="13px" />
          <Skeleton width="35%" height="11px" />
        </div>
      </div>
      <Skeleton width="60px" height="15px" borderRadius="6px" />
    </li>
  );
}

export function SkeletonTotalsGrid() {
  return (
    <div className="totals-grid">
      <div className="totals-card totals-card-income">
        <Skeleton width="60%" height="11px" style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height="24px" />
      </div>
      <div className="totals-card totals-card-expense">
        <Skeleton width="60%" height="11px" style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height="24px" />
      </div>
    </div>
  );
}

export function SkeletonStatsCard() {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <Skeleton width="80px" height="10px" />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '16px 8px 8px', height: 180 }}>
        {[60, 90, 40, 110, 70, 130, 50].map((h, i) => (
          <Skeleton key={i} width="100%" height={`${h}px`} borderRadius="4px 4px 0 0" style={{ flex: 1 }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTransactionGroup() {
  return (
    <div className="tx-date-group">
      <Skeleton width="80px" height="10px" style={{ marginBottom: 8 }} />
      <ul className="expense-list">
        <SkeletonTransactionItem />
        <SkeletonTransactionItem />
        <SkeletonTransactionItem />
      </ul>
    </div>
  );
}

export default Skeleton;