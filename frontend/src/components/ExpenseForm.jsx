import { useState } from 'react';

function ExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    await onAdd({ amount: parseFloat(amount), category, note, date });
    setAmount('');
    setNote('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Food</option>
        <option>Transport</option>
        <option>Bills</option>
        <option>Shopping</option>
        <option>Other</option>
      </select>
      <input
        type="text"
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Add expense</button>
    </form>
  );
}

export default ExpenseForm;