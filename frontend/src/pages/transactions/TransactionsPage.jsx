import { useEffect, useState, useMemo } from 'react';
import { getExpenses, deleteExpense } from '../../api/expenses.js';
import { getIncomes, deleteIncome } from '../../api/incomes.js';
import ExpenseList from '../../components/expense/ExpenseList.jsx';
import IncomeList from '../../components/income/IncomeList.jsx';
import MonthFilter from '../../components/transactions/MonthFilter.jsx';
import TransactionStats from '../../components/transactions/TransactionStats.jsx';
import { filterByMonth, groupByWeek, getAvailableMonths, sortItems } from '../../utils/dateHelpers.js';

function TransactionsPage() {
  const [tab, setTab] = useState('expense');
  const [sortBy, setSortBy] = useState('newest');
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    loadExpenses();
    loadIncomes();
  }, []);

  async function loadExpenses() {
    const data = await getExpenses();
    setExpenses(data);
  }

  async function loadIncomes() {
    const data = await getIncomes();
    setIncomes(data);
  }

  async function handleDeleteExpense(id) {
    await deleteExpense(id);
    await loadExpenses();
  }

  async function handleDeleteIncome(id) {
    await deleteIncome(id);
    await loadIncomes();
  }

  const availableMonths = useMemo(
    () => getAvailableMonths(expenses, incomes),
    [expenses, incomes]
  );

  useEffect(() => {
    if (availableMonths.length === 0) return;
    const stillValid = selectedMonth && availableMonths.some(
      (m) => m.getFullYear() === selectedMonth.getFullYear() && m.getMonth() === selectedMonth.getMonth()
    );
    if (!stillValid) setSelectedMonth(availableMonths[0]);
  }, [availableMonths, selectedMonth]);

  const monthExpenses = useMemo(
    () => (selectedMonth ? filterByMonth(expenses, selectedMonth) : []),
    [expenses, selectedMonth]
  );
  const monthIncomes = useMemo(
    () => (selectedMonth ? filterByMonth(incomes, selectedMonth) : []),
    [incomes, selectedMonth]
  );

  const sortedExpenses = useMemo(() => sortItems(monthExpenses, sortBy), [monthExpenses, sortBy]);
  const sortedIncomes = useMemo(() => sortItems(monthIncomes, sortBy), [monthIncomes, sortBy]);

  const totalExpenses = useMemo(
    () => monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    [monthExpenses]
  );
  const totalIncome = useMemo(
    () => monthIncomes.reduce((sum, i) => sum + i.amount, 0),
    [monthIncomes]
  );
  const net = totalIncome - totalExpenses;

  const chartData = useMemo(() => {
    if (!selectedMonth) return [];
    const combined = [
      ...monthExpenses.map((e) => ({ ...e, type: 'expense' })),
      ...monthIncomes.map((i) => ({ ...i, type: 'income' })),
    ];
    return groupByWeek(combined, selectedMonth);
  }, [monthExpenses, monthIncomes, selectedMonth]);

  return (
    <div className="page-content">
      <div className="tx-page-header">
        <p className="section-label" style={{ marginBottom: 0 }}>Transactions</p>
        <MonthFilter
          selectedMonth={selectedMonth}
          onChange={setSelectedMonth}
          availableMonths={availableMonths}
        />
      </div>

      <div className="totals-grid">
        <div className="totals-card totals-card-income">
          <div className="summary-label">Total Income</div>
          <div className="totals-amt totals-amt-income">₱{totalIncome.toFixed(2)}</div>
        </div>
        <div className="totals-card totals-card-expense">
          <div className="summary-label">Total Expenses</div>
          <div className="totals-amt totals-amt-expense">₱{totalExpenses.toFixed(2)}</div>
        </div>
      </div>

      <div className={`net-badge ${net >= 0 ? 'net-positive' : 'net-negative'}`}>
        {net >= 0 ? 'Net gain this month' : 'Net loss this month'}: {net >= 0 ? '+' : ''}₱{net.toFixed(2)}
      </div>

      <TransactionStats data={chartData} />

      <div className="tx-controls-row">
        <div className="type-toggle" style={{ flex: 1 }}>
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
            Expenses
          </button>
        </div>

        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
      </div>

      {tab === 'expense' ? (
        <ExpenseList expenses={sortedExpenses} onDelete={handleDeleteExpense} />
      ) : (
        <IncomeList incomes={sortedIncomes} onDelete={handleDeleteIncome} />
      )}
    </div>
  );
}

export default TransactionsPage;