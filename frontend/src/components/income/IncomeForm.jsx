import { useState } from 'react';

const CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

function IncomeForm({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;
    await onAdd({ amount: parseFloat(amount), category, note, date });
    setAmount('');
    setNote('');
  }

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-row">
        <input type="number" step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-row">
        <input type="text" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <button type="submit" className="btn-add btn-add-income">Add income</button>
    </form>
  );
}

export default IncomeForm;