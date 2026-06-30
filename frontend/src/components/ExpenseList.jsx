function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p>No expenses yet.</p>;
  }

    return (
        <ul>
        {expenses.map((expense) => (
            <li key={expense.id}>
            {expense.date} — {expense.category}: ${expense.amount} ({expense.note})
            <button onClick={() => onDelete(expense.id)}>Delete</button>
            </li>
        ))}
        </ul>
    );
    }

export default ExpenseList;