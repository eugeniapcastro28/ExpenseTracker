import TransactionListItem from '../Transactions/TransactionListItem.jsx';

function IncomeList({ incomes, onDelete }) {
  if (incomes.length === 0) {
    return <p className="empty-state">No income recorded yet.</p>;
  }

  return (
    <ul className="expense-list">
      {incomes.map((income) => (
        <TransactionListItem key={income.id} item={income} type="income" onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default IncomeList;