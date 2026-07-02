import { useEffect, useState } from 'react';
import {
  getRecurringExpenses,
  getRecurringIncomes,
  createRecurringExpense,
  createRecurringIncome,
  deleteRecurringExpense,
  deleteRecurringIncome,
  getPendingRecurring,
  confirmPending,
  dismissPending,
  confirmRecurringNow,
  dismissRecurringNow
} from '../../api/recurring.js';
import { getCategoryMeta } from '../../utils/categoryIcons.js';
import { Repeat, Trash2, Check, X } from 'lucide-react';
import PendingRecurringCard from '../../components/recurring/PendingRecurringCard.jsx';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

function RecurringPage() {
  const [tab, setTab] = useState('expense');
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [recurringIncomes, setRecurringIncomes] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('1');

  const categories = tab === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setCategory(tab === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }, [tab]);

  async function load() {
    setLoading(true);
    const [exp, inc, pend] = await Promise.all([
      getRecurringExpenses(),
      getRecurringIncomes(),
      getPendingRecurring()
    ]);
    setRecurringExpenses(exp);
    setRecurringIncomes(inc);
    setPending(pend);
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    const data = {
      amount: parseFloat(amount),
      category,
      note,
      day_of_month: parseInt(dayOfMonth)
    };
    if (tab === 'expense') {
      await createRecurringExpense(data);
    } else {
      await createRecurringIncome(data);
    }
    setAmount('');
    setNote('');
    await load();
  }

  async function handleDelete(id, type) {
    if (type === 'expense') {
      await deleteRecurringExpense(id);
    } else {
      await deleteRecurringIncome(id);
    }
    await load();
  }

  function findPendingFor(item) {
    return pending.find((p) => p.recurring_id === item.id && p.type === tab);
  }

  async function handleConfirm(item) {
    if (resolvingId) return;
    setResolvingId(item.id);
    try {
      const pendingEntry = findPendingFor(item);
      if (pendingEntry) {
        await confirmPending(pendingEntry.id);
      } else {
        await confirmRecurringNow(item.id, tab);
      }
      await load();
    } finally {
      setResolvingId(null);
    }
  }

  async function handleDismiss(item) {
    if (resolvingId) return;
    setResolvingId(item.id);
    try {
      const pendingEntry = findPendingFor(item);
      if (pendingEntry) {
        await dismissPending(pendingEntry.id);
      } else {
        await dismissRecurringNow(item.id, tab);
      }
      await load();
    } finally {
      setResolvingId(null);
    }
  }

  const activeItems = tab === 'expense' ? recurringExpenses : recurringIncomes;

  return (
    <div className="page-content">
      <div className="tx-page-header">
        <p className="section-label" style={{ marginBottom: 0 }}>Recurring</p>
      </div>

      {pending.length > 0 && (
        <>
          <p className="section-label">Action needed</p>
          <PendingRecurringCard items={pending} onUpdate={load} />
        </>
      )}

      <div className="type-toggle">
        <button
          className={`type-btn ${tab === 'income' ? 'type-btn-active-income' : ''}`}
          onClick={() => setTab('income')}
          type="button"
        >
          Income
        </button>
        <button
          className={`type-btn ${tab === 'expense' ? 'type-btn-active-expense' : ''}`}
          onClick={() => setTab('expense')}
          type="button"
        >
          Expense
        </button>
      </div>

      <form onSubmit={handleAdd} className="expense-form">
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
          <select value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)}>
            {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>Day {d}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={`btn-add ${tab === 'income' ? 'btn-add-income' : ''}`}
        >
          Add recurring {tab}
        </button>
      </form>

      <p className="section-label">
        Active recurring {tab === 'expense' ? 'expenses' : 'income'}
      </p>

      {loading && <p className="empty-state">Loading...</p>}

      {!loading && activeItems.length === 0 && (
        <p className="empty-state">
          No recurring {tab === 'expense' ? 'expenses' : 'income'} yet.
        </p>
      )}

      {!loading && activeItems.length > 0 && (
        <ul className="expense-list">
          {activeItems.map((item) => {
            const { icon: Icon, color, bg } = getCategoryMeta(item.category, tab);
            const pendingEntry = findPendingFor(item);
            const isResolving = resolvingId === item.id;

            return (
              <li key={item.id} className="expense-item">
                <div className="tx-item-left">
                  <div className="tx-icon-circle" style={{ background: bg, color }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="exp-cat">
                      {item.note || item.category}
                      <span className={`badge ${tab === 'income' ? `badge-income-${item.category}` : `badge-${item.category}`}`}>
                        {item.category}
                      </span>
                    </div>
                    <div className="exp-note">
                      {pendingEntry
                        ? `Due ${pendingEntry.due_date}`
                        : `Every month on day ${item.day_of_month}`}
                    </div>
                  </div>
                </div>
                <div className="exp-right">
                  <span className={`exp-amt ${tab === 'income' ? 'income-amt' : ''}`}>
                    {tab === 'income' ? '+' : '-'}₱{item.amount.toFixed(2)}
                  </span>
                  <button
                    className="pending-btn-confirm"
                    onClick={() => handleConfirm(item)}
                    title={tab === 'income' ? 'Mark as received' : 'Mark as paid'}
                    type="button"
                    disabled={isResolving}
                  >
                    <Check size={14} />
                  </button>
                  <button
                    className="pending-btn-dismiss"
                    onClick={() => handleDismiss(item)}
                    title="Skip this month"
                    type="button"
                    disabled={isResolving}
                  >
                    <X size={14} />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id, tab)}
                    type="button"
                    title="Delete recurring rule"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default RecurringPage;