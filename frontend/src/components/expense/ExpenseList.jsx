import TransactionListItem from '../transactions/TransactionListItem.jsx';

function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p className="empty-state">No expenses yet. Add your first one above.</p>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((expense) => (
        <TransactionListItem key={expense.id} item={expense} type="expense" onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default ExpenseList;