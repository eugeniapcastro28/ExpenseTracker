function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p className="empty-state">No expenses yet. Add your first one above.</p>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((expense) => (
        <li key={expense.id} className="expense-item">
          <div>
            <div className="exp-cat">
              {expense.note || expense.category}
              <span className={`badge badge-${expense.category}`}>{expense.category}</span>
            </div>
            <div className="exp-note">{expense.date}</div>
          </div>
          <div className="exp-right">
            <span className="exp-amt">₱{expense.amount.toFixed(2)}</span>
            <button className="btn-delete" onClick={() => onDelete(expense.id)}>×</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;