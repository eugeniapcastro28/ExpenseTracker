import { useEffect, useState } from 'react';
import { getSummary } from '../../api/expenses.js';
import { getExpenses } from '../../api/expenses.js';
import { getIncomes } from '../../api/incomes.js';
import Summary from '../../components/dashboard/Summary.jsx';

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    async function load() {
      const [summaryData, expensesData, incomesData] = await Promise.all([
        getSummary(),
        getExpenses(),
        getIncomes()
      ]);
      setSummary(summaryData);

      const combined = [
        ...expensesData.map((e) => ({ ...e, type: 'expense' })),
        ...incomesData.map((i) => ({ ...i, type: 'income' }))
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setRecent(combined);
    }
    load();
  }, []);

  return (
    <div className="page-content">
      <Summary summary={summary} />
      <p className="section-label">Recent transactions</p>
      {recent.length === 0 && <p className="empty-state">No transactions yet.</p>}
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

export default DashboardPage;