import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExpense } from '../../api/expenses.js';
import { ShoppingCart, Car, Receipt, ShoppingBag, Gamepad2, Plus } from 'lucide-react';

const CATEGORIES = [
  { name: 'Food', icon: ShoppingCart },
  { name: 'Transport', icon: Car },
  { name: 'Bills', icon: Receipt },
  { name: 'Shopping', icon: ShoppingBag },
  { name: 'Entertainment', icon: Gamepad2 },
  { name: 'Other', icon: Plus },
];

function AddExpensePage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!amount) return;
    setSaving(true);
    await createExpense({ amount: parseFloat(amount), category, note, date });
    setSaving(false);
    navigate('/dashboard');
  }

  return (
    <div className="page-content">
      <div className="add-page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>←</button>
        <span className="add-page-title">Add Expense</span>
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
        {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
            <button
                type="button"
                key={c.name}
                className={`cat-grid-item ${category === c.name ? 'cat-grid-item-active-expense' : ''}`}
                onClick={() => setCategory(c.name)}
            >
                <Icon className="cat-grid-icon" size={20} strokeWidth={2} />
                <span className="cat-grid-label">{c.name}</span>
            </button>
            );
        })}
        </div>

        <button type="submit" className="btn-save btn-save-expense" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}

export default AddExpensePage;