import { useEffect, useState } from 'react';
import { getIncomes, createIncome, deleteIncome } from '../api.js';
import IncomeForm from '../components/income/IncomeForm.jsx';
import IncomeList from '../components/income/IncomeList.jsx';

function IncomePage() {
  const [incomes, setIncomes] = useState([]);

  useEffect(() => { loadIncomes(); }, []);

  async function loadIncomes() {
    const data = await getIncomes();
    setIncomes(data);
  }

  async function handleAdd(income) {
    await createIncome(income);
    await loadIncomes();
  }

  async function handleDelete(id) {
    await deleteIncome(id);
    await loadIncomes();
  }

  return (
    <div className="page-content">
      <p className="section-label">Add income</p>
      <IncomeForm onAdd={handleAdd} />
      <p className="section-label">All income</p>
      <IncomeList incomes={incomes} onDelete={handleDelete} />
    </div>
  );
}

export default IncomePage;