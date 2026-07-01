import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { getExpenses, deleteExpense } from '../../api/expenses.js';
import { getIncomes, deleteIncome } from '../../api/incomes.js';
import GroupedTransactionList from '../../components/transactions/GroupedTransactionList.jsx';
import MonthFilter from '../../components/transactions/MonthFilter.jsx';
import TransactionStats from '../../components/transactions/TransactionStats.jsx';
import UndoToast from '../../components/transactions/UndoToast.jsx';
import {
  filterByMonth,
  groupByWeek,
  getAvailableMonths,
  sortItems,
  searchItems,
} from '../../utils/dateHelpers.js';

function TransactionsPage() {
  const [tab, setTab] = useState('expense');
  const [sortBy, setSortBy] = useState('newest');
  const [query, setQuery] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null); // { item, type }

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

  function handleRequestDelete(item) {
    // If something was already pending, finalize it immediately before starting a new one
    if (pendingDelete) {
      finalizeDelete(pendingDelete);
    }
    setPendingDelete({ item, type: tab });
  }

  function handleUndo() {
    setPendingDelete(null); // item reappears since it's no longer filtered out
  }

  async function finalizeDelete(pending) {
    if (!pending) return;
    if (pending.type === 'expense') {
      await deleteExpense(pending.item.id);
      await loadExpenses();
    } else {
      await deleteIncome(pending.item.id);
      await loadIncomes();
    }
  }

  function handleToastExpire() {
    finalizeDelete(pendingDelete);
    setPendingDelete(null);
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

  // Hide the item currently pending deletion from totals, chart, and list
  const visibleExpenses = useMemo(() => {
    if (pendingDelete?.type === 'expense') {
      return monthExpenses.filter((e) => e.id !== pendingDelete.item.id);
    }
    return monthExpenses;
  }, [monthExpenses, pendingDelete]);

  const visibleIncomes = useMemo(() => {
    if (pendingDelete?.type === 'income') {
      return monthIncomes.filter((i) => i.id !== pendingDelete.item.id);
    }
    return monthIncomes;
  }, [monthIncomes, pendingDelete]);

  const totalExpenses = useMemo(
    () => visibleExpenses.reduce((sum, e) => sum + e.amount, 0),
    [visibleExpenses]
  );
  const totalIncome = useMemo(
    () => visibleIncomes.reduce((sum, i) => sum + i.amount, 0),
    [visibleIncomes]
  );
  const net = totalIncome - totalExpenses;

  const chartData = useMemo(() => {
    if (!selectedMonth) return [];
    const combined = [
      ...visibleExpenses.map((e) => ({ ...e, type: 'expense' })),
      ...visibleIncomes.map((i) => ({ ...i, type: 'income' })),
    ];
    return groupByWeek(combined, selectedMonth);
  }, [visibleExpenses, visibleIncomes, selectedMonth]);

  const activeItems = tab === 'expense' ? visibleExpenses : visibleIncomes;
  const filteredItems = useMemo(() => searchItems(activeItems, query), [activeItems, query]);
  const sortedItems = useMemo(() => sortItems(filteredItems, sortBy), [filteredItems, sortBy]);

  const emptyMessage =
    query.trim()
      ? `No ${tab === 'expense' ? 'expenses' : 'income'} match "${query}".`
      : tab === 'expense'
      ? 'No expenses yet. Add your first one above.'
      : 'No income recorded yet.';

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
          Expenses
        </button>
      </div>

      <div className="tx-search-row">
        <div className="tx-search-box">
          <Search size={15} className="tx-search-icon" />
          <input
            type="text"
            placeholder={`Search ${tab === 'expense' ? 'expenses' : 'income'}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
      </div>

      <GroupedTransactionList
        items={sortedItems}
        type={tab}
        onRequestDelete={handleRequestDelete}
        emptyMessage={emptyMessage}
      />

      {pendingDelete && (
        <UndoToast
          message={`${pendingDelete.type === 'income' ? 'Income' : 'Expense'} deleted`}
          onUndo={handleUndo}
          onExpire={handleToastExpire}
        />
      )}
    </div>
  );
}

export default TransactionsPage;