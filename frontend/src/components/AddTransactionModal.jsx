import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpenses, getIncomes, createExpense, createIncome } from '../api.js';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

function AddTransactionPage() {
  const navigate = useNavigate();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [recent, setRecent] = useState([]);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  useEffect(() => { loadRecent(); }, []);

  async function loadRecent() {
    const [expenses, incomes] = await Promise.all([getExpenses(), getIncomes()]);
    const combined = [
      ...expenses.map((e) => ({ ...e, type: 'expense' })),
      ...incomes.map((i) => ({ ...i, type: 'income' }))
    ]
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 6);
    setRecent(combined);
  }

  function handleTypeSwitch(newType) {
    setType(newType);
    setCategory(newType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;

    if (type === 'expense') {
      await createExpense({ amount: parseFloat(amount), category, note, date });
    } else {
      await createIncome({ amount: parseFloat(amount), category, note, date });
    }

    setAmount('');
    setNote('');
    await loadRecent();
    navigate('/dashboard');
  }

  return (
    <div className="page-content">
      <div className="add-page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>←</button>
        <span className="add-page-title">Add</span>
        <span style={{ width: 28 }} /> {/* spacer to balance the back button */}
      </div>

      <div className="type-toggle">
        <button
          className={`type-btn ${type === 'expense' ? 'type-btn-active-expense' : ''}`}
          onClick={() => handleTypeSwitch('expense')}
          type="button"
        >
          Add Expense
        </button>
        <button
          className={`type-btn ${type === 'income' ? 'type-btn-active-income' : ''}`}
          onClick={() => handleTypeSwitch('income')}
          type="button"
        >
          Add Income
        </button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-row">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`btn-add ${type === 'income' ? 'btn-add-income' : ''}`}
        >
          Add {type}
        </button>
      </form>

      <p className="section-label" style={{ marginTop: '20px' }}>Last added</p>
      {recent.length === 0 && <p className="empty-state">Nothing added yet.</p>}
      <ul className="expense-list">
        {recent.map((item) => (
          <li key={`${item.type}-${item.id}`} className="expense-item">
            <div>
              <div className="exp-cat">
                {item.note || item.category}
                <span className={`badge ${item.type === 'income' ? `badge-income-${item.category}` : `badge-${item.category}`}`}>
                  {item.category}
                </span>
              </div>
              <div className="exp-note">{item.date}</div>
            </div>
            <div className="exp-right">
              <span className={`exp-amt ${item.type === 'income' ? 'income-amt' : ''}`}>
                {item.type === 'income' ? '+' : '-'}₱{item.amount.toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddTransactionPage;