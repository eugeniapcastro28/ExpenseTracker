import { useEffect, useState } from 'react';
import { getExpenses, createExpense, deleteExpense } from '../../api/expenses.js';
import ExpenseForm from '../../components/expense/ExpenseForm.jsx';
import ExpenseList from '../../components/expense/ExpenseList.jsx';

function ExpensePage() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => { loadExpenses(); }, []);

  async function loadExpenses() {
    const data = await getExpenses();
    setExpenses(data);
  }

  async function handleAdd(expense) {
    await createExpense(expense);
    await loadExpenses();
  }

  async function handleDelete(id) {
    await deleteExpense(id);
    await loadExpenses();
  }

  return (
    <div className="page-content">
      <p className="section-label">Add expense</p>
      <ExpenseForm onAdd={handleAdd} />
      <p className="section-label">All expenses</p>
      <ExpenseList expenses={expenses} onDelete={handleDelete} />
    </div>
  );
}

export default ExpensePage;