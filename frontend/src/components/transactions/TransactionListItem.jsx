import { X } from 'lucide-react';
import { getCategoryMeta } from '../../utils/categoryIcons.js';

function TransactionListItem({ item, type, onDelete }) {
  const { icon: Icon, color, bg } = getCategoryMeta(item.category, type);

  return (
    <li className="expense-item">
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
        <button className="btn-delete" onClick={() => onDelete(item.id)} type="button">
          <X size={14} />
        </button>
      </div>
    </li>
  );
}

export default TransactionListItem;