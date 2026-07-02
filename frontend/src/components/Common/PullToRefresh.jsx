import { useState, useRef, useCallback } from 'react';

const PULL_THRESHOLD = 70;
const MAX_PULL = 100;

function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const pulling = useRef(false);
  const containerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    const scrollTop = containerRef.current?.scrollTop ?? 0;
    if (scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!pulling.current || startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.5, MAX_PULL));
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    pulling.current = false;
    if (pullDistance >= PULL_THRESHOLD) {
      setRefreshing(true);
      setPullDistance(60);
      await onRefresh();
      setRefreshing(false);
    }
    setPullDistance(0);
    startY.current = null;
  }, [pullDistance, onRefresh]);

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);

  return (
    <div
      ref={containerRef}
      style={{ overflowY: 'auto', height: '100%' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="pull-indicator"
        style={{
          height: `${pullDistance}px`,
          opacity: progress,
          transform: `scale(${0.6 + progress * 0.4})`,
        }}
      >
        <div className={`pull-spinner ${refreshing ? 'pull-spinning' : ''}`}>
          {refreshing ? '↻' : pullDistance >= PULL_THRESHOLD ? '↑ Release' : '↓ Pull to refresh'}
        </div>
      </div>
      {children}
    </div>
  );
}

export default PullToRefresh;