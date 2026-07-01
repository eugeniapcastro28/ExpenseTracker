import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIncome } from '../api.js';

const CATEGORIES = [
  { name: 'Salary', icon: '💼' },
  { name: 'Freelance', icon: '💻' },
  { name: 'Business', icon: '🏪' },
  { name: 'Investment', icon: '📈' },
  { name: 'Gift', icon: '🎁' },
  { name: 'Other', icon: '➕' },
];

function AddIncomePage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;
    setSaving(true);
    await createIncome({ amount: parseFloat(amount), category, note, date });
    setSaving(false);
    navigate('/dashboard');
  }

  return (
    <div className="page-content">
      <div className="add-page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>←</button>
        <span className="add-page-title">Add Income</span>
        <span style={{ width: 28 }} />
      </div>

      <form onSubmit={handleSubmit} className="tx-form">
        <label className="tx-label">Amount</label>
        <input
          type="number"
          step="0.01"
          placeholder="₱0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="tx-input"
          required
        />

        <label className="tx-label">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="tx-input"
          required
        />

        <label className="tx-label">Note (optional)</label>
        <input
          type="text"
          placeholder="Add a note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="tx-input"
        />

        <label className="tx-label">Categories</label>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.name}
              className={`cat-grid-item ${category === c.name ? 'cat-grid-item-active-income' : ''}`}
              onClick={() => setCategory(c.name)}
            >
              <span className="cat-grid-icon">{c.icon}</span>
              <span className="cat-grid-label">{c.name}</span>
            </button>
          ))}
        </div>

        <button type="submit" className="btn-save btn-save-income" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}

export default AddIncomePage;