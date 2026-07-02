import { useState } from 'react';
import { Repeat, Check, X } from 'lucide-react';
import { confirmPending, dismissPending } from '../../api/recurring.js';
import { getCategoryMeta } from '../../utils/categoryIcons.js';

function PendingRecurringCard({ items, onUpdate }) {
  const [processing, setProcessing] = useState(null);

  if (!items || items.length === 0) return null;

  async function handleConfirm(item) {
    setProcessing(item.id);
    await confirmPending(item.id);
    await onUpdate();
    setProcessing(null);
  }

  async function handleDismiss(item) {
    setProcessing(item.id);
    await dismissPending(item.id);
    await onUpdate();
    setProcessing(null);
  }

  return (
    <div className="pending-card">
      <div className="pending-card-header">
        <div className="pending-card-title">
          <Repeat size={14} color="#c0392b" />
          <span>Recurring — action needed</span>
        </div>
        <span className="pending-badge">{items.length}</span>
      </div>

      <ul className="pending-list">
        {items.map((item) => {
          const { icon: Icon, color, bg } = getCategoryMeta(item.category, item.type);
          const isProcessing = processing === item.id;

          return (
            <li key={item.id} className="pending-item">
              <div className="tx-item-left">
                <div className="tx-icon-circle" style={{ background: bg, color }}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="exp-cat" style={{ fontSize: 13 }}>
                    {item.note || item.category}
                    <span className={`badge ${item.type === 'income' ? `badge-income-${item.category}` : `badge-${item.category}`}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="exp-note">Due {item.due_date}</div>
                </div>
              </div>

              <div className="pending-actions">
                <span className={`exp-amt ${item.type === 'income' ? 'income-amt' : ''}`}>
                  {item.type === 'income' ? '+' : '-'}₱{item.amount.toFixed(2)}
                </span>
                <button
                  className="pending-btn-confirm"
                  onClick={() => handleConfirm(item)}
                  disabled={isProcessing}
                  title={item.type === 'income' ? 'Mark as received' : 'Mark as paid'}
                >
                  <Check size={14} />
                </button>
                <button
                  className="pending-btn-dismiss"
                  onClick={() => handleDismiss(item)}
                  disabled={isProcessing}
                  title="Skip this month"
                >
                  <X size={14} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PendingRecurringCard;