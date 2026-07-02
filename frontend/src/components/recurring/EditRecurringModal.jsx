import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

function EditRecurringModal({ item, type, onSave, onClose }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [saving, setSaving] = useState(false);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (item) {
      setAmount(item.amount.toString());
      setCategory(item.category);
      setNote(item.note || '');
      setDayOfMonth(item.day_of_month.toString());
    }
  }, [item]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave(item.id, {
      amount: parseFloat(amount),
      category,
      note,
      day_of_month: parseInt(dayOfMonth)
    });
    setSaving(false);
    onClose();
  }

  function formatCreatedAt(dateStr) {
    if (!dateStr) return 'Unknown';
    const d = new Date(dateStr);
    return d.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Edit recurring {type}</span>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={16} />
          </button>
        </div>

        {item?.created_at && (
          <p className="recurring-created-at">
            Created: {formatCreatedAt(item.created_at)}
          </p>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
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

          <label className="form-label">Repeat on day</label>
          <select value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)}>
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>Day {d}</option>
            ))}
          </select>

          <button
            type="submit"
            className={`btn-add ${type === 'income' ? 'btn-add-income' : ''}`}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRecurringModal;