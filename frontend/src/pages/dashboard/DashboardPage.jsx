import { useEffect, useState, useCallback } from 'react';
import { getSummary, getExpenses } from '../../api/expenses.js';
import { getIncomes } from '../../api/incomes.js';
import Summary from '../../components/dashboard/Summary.jsx';
import { getPendingRecurring, generateRecurring } from '../../api/recurring.js';
import PendingRecurringCard from '../../components/recurring/PendingRecurringCard.jsx';
import { filterDueSoon } from '../../utils/dateHelpers.js';

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [pending, setPending] = useState([]);

  const load = useCallback(async () => {
    // Ensure this month's pending items exist before fetching them
    await generateRecurring();

    const [summaryData, expensesData, incomesData, pendingData] = await Promise.all([
      getSummary(),
      getExpenses(),
      getIncomes(),
      getPendingRecurring()
    ]);
    setSummary(summaryData);
    setPending(filterDueSoon(pendingData,20));

    const combined = [
      ...expensesData.map((e) => ({ ...e, type: 'expense' })),
      ...incomesData.map((i) => ({ ...i, type: 'income' }))
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    setRecent(combined);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="page-content">
      <Summary summary={summary} />
      <PendingRecurringCard items={pending} onUpdate={load} />
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