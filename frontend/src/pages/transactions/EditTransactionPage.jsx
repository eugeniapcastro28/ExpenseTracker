import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getExpenses } from '../../api/expenses.js';
import { getIncomes } from '../../api/incomes.js';
import { updateExpense } from '../../api/expenses.js';
import { updateIncome } from '../../api/incomes.js';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

function EditTransactionPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'expense';
  const navigate = useNavigate();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    async function load() {
      const data = type === 'income' ? await getIncomes() : await getExpenses();
      const item = data.find((d) => d.id === parseInt(id));
      if (!item) {
        navigate('/transactions');
        return;
      }
      setAmount(item.amount.toString());
      setCategory(item.category);
      setNote(item.note || '');
      setDate(item.date);
      setLoading(false);
    }
    load();
  }, [id, type, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { amount: parseFloat(amount), category, note, date };
      if (type === 'income') {
        await updateIncome(id, payload);
      } else {
        await updateExpense(id, payload);
      }
      navigate('/transactions');
    } catch (err) {
      setError('Failed to save. Please try again.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="edit-page-header">
          <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        </div>
        <div className="expense-form">
          <div className="skeleton" style={{ height: '44px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '44px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '44px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '44px', borderRadius: '8px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="edit-page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="edit-page-title">Edit {type}</h2>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <label className="form-label">Amount</label>
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <label className="form-label">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>

        <label className="form-label">Note</label>
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <label className="form-label">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button
          type="submit"
          className={`btn-add ${type === 'income' ? 'btn-add-income' : ''}`}
          disabled={saving}
        >
          {saving ? 'Saving...' : `Save ${type}`}
        </button>

        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditTransactionPage;