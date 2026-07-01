import TransactionListItem from './TransactionListItem.jsx';
import { groupByDate } from '../../utils/dateHelpers.js';

function GroupedTransactionList({ items, type, onRequestDelete, emptyMessage }) {
  if (items.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  const groups = groupByDate(items);
  const labels = Object.keys(groups);

  return (
    <div className="tx-grouped-list">
      {labels.map((label) => (
        <div key={label} className="tx-date-group">
          <p className="tx-date-label">{label}</p>
          <ul className="expense-list">
            {groups[label].map((item) => (
              <TransactionListItem key={item.id} item={item} type={type} onRequestDelete={onRequestDelete} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default GroupedTransactionList;