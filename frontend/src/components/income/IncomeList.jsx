function IncomeList({ incomes, onDelete }) {
  if (incomes.length === 0) {
    return <p className="empty-state">No income recorded yet.</p>;
  }

  return (
    <ul className="expense-list">
      {incomes.map((income) => (
        <li key={income.id} className="expense-item">
          <div>
            <div className="exp-cat">
              {income.note || income.category}
              <span className={`badge badge-income-${income.category}`}>{income.category}</span>
            </div>
            <div className="exp-note">{income.date}</div>
          </div>
          <div className="exp-right">
            <span className="exp-amt income-amt">+₱{income.amount.toFixed(2)}</span>
            <button className="btn-delete" onClick={() => onDelete(income.id)}>×</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default IncomeList;