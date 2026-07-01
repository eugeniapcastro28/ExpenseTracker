import { useState, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { getCategoryMeta } from '../../utils/categoryIcons.js';

const SWIPE_THRESHOLD = 70;
const MAX_SWIPE = 90;

function TransactionListItem({ item, type, onRequestDelete }) {
  const { icon: Icon, color, bg } = getCategoryMeta(item.category, type);
  const [translateX, setTranslateX] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const startX = useRef(null);
  const dragging = useRef(false);

  function handleTouchStart(e) {
    startX.current = e.touches[0].clientX;
    dragging.current = true;
  }

  function handleTouchMove(e) {
    if (!dragging.current || startX.current === null) return;
    const delta = e.touches[0].clientX - startX.current;
    if (delta < 0) {
      setTranslateX(Math.max(delta, -MAX_SWIPE));
    } else {
      setTranslateX(0);
    }
  }

  function handleTouchEnd() {
    dragging.current = false;
    if (translateX <= -SWIPE_THRESHOLD) {
      requestDelete();
    } else {
      setTranslateX(0);
    }
  }

  function requestDelete() {
    setIsHidden(true);
    setTranslateX(-400);
    setTimeout(() => onRequestDelete(item), 200);
  }

  if (isHidden) return null; // item is now "pending delete" in the parent, hide the row immediately

  return (
    <li className="tx-swipe-wrapper">
      <div className="tx-swipe-delete-bg">
        <Trash2 size={18} color="#fff" />
      </div>
      <div
        className="expense-item tx-swipe-row"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: dragging.current ? 'none' : 'transform 0.2s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="tx-item-left">
          <div className="tx-icon-circle" style={{ background: bg, color }}>
            <Icon size={18} />
          </div>
          <div>
            <div className="exp-cat">
              {item.note || item.category}
              <span className={`badge ${type === 'income' ? `badge-income-${item.category}` : `badge-${item.category}`}`}>
                {item.category}
              </span>
            </div>
            <div className="exp-note">{item.date}</div>
          </div>
        </div>
        <div className="exp-right">
          <span className={`exp-amt ${type === 'income' ? 'income-amt' : ''}`}>
            {type === 'income' ? '+' : '-'}₱{item.amount.toFixed(2)}
          </span>
          <button className="btn-delete" onClick={requestDelete} type="button">
            ×
          </button>
        </div>
      </div>
    </li>
  );
}

export default TransactionListItem;