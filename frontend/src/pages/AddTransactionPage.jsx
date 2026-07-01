import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpenses, getIncomes } from '../api.js';

function AddTransactionPage() {
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);

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

  return (
    <div className="page-content">
      <div className="add-page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>←</button>
        <span className="add-page-title">Add</span>
        <span style={{ width: 28 }} />
      </div>

      <div className="add-tab-row">
        <button className="add-tab add-tab-income" onClick={() => navigate('/add/income')}>
          <span className="add-tab-icon">💰</span>
          Add Income
        </button>
        <button className="add-tab add-tab-expense" onClick={() => navigate('/add/expense')}>
          <span className="add-tab-icon">💳</span>
          Add Expense
        </button>
      </div>

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