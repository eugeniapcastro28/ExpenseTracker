import { useEffect, useState, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { getExpenses, deleteExpense } from '../../api/expenses.js';
import { getIncomes, deleteIncome } from '../../api/incomes.js';
import GroupedTransactionList from '../../components/Transactions/GroupedTransactionList.jsx';
import MonthFilter from '../../components/Transactions/MonthFilter.jsx';
import TransactionStats from '../../components/Transactions/TransactionStats.jsx';
import UndoToast from '../../components/Transactions/UndoToast.jsx';
import CategoryFilterChips from '../../components/Transactions/CategoryFilterChips.jsx';
import {
  filterByMonth,
  groupByWeek,
  getAvailableMonths,
  sortItems,
  searchItems,
  filterByCategory,
} from '../../utils/dateHelpers.js';
import {
  SkeletonTotalsGrid,
  SkeletonStatsCard,
  SkeletonTransactionGroup
} from '../../components/Common/Skeleton.jsx';
import { exportToCSV } from '../../utils/exportCSV.js';
import PullToRefresh from '../../components/Common/PullToRefresh.jsx';





function TransactionsPage() {
  const [tab, setTab] = useState('expense');
  const [sortBy, setSortBy] = useState('newest');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleRefresh = useCallback(async () => {
  await Promise.all([loadExpenses(), loadIncomes()]);
}, []);
  const [activeWeek, setActiveWeek] = useState(null);

  useEffect(() => {
  async function load() {
    setLoading(true);
    await Promise.all([loadExpenses(), loadIncomes()]);
    setLoading(false);
  }
  load();
}, []);

  // Reset category filter when switching tabs (Food doesn't exist under Income, etc.)
  useEffect(() => {
    setCategoryFilter(null);
  }, [tab]);

  async function loadExpenses() {
    const data = await getExpenses();
    setExpenses(data);
  }

  async function loadIncomes() {
    const data = await getIncomes();
    setIncomes(data);
  }

  function handleRequestDelete(item) {
    if (pendingDelete) {
      finalizeDelete(pendingDelete);
    }
    setPendingDelete({ item, type: tab });
  }

  function handleUndo() {
    setPendingDelete(null);
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

  function handleExport() {
  exportToCSV(visibleExpenses, visibleIncomes, selectedMonth);
}

  useEffect(() => {
  setActiveWeek(null);
}, [selectedMonth]);

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
  const categoryFiltered = useMemo(
    () => filterByCategory(activeItems, categoryFilter),
    [activeItems, categoryFilter]
  );
  const searched = useMemo(() => searchItems(categoryFiltered, query), [categoryFiltered, query]);
  const sortedItems = useMemo(() => sortItems(searched, sortBy), [searched, sortBy]);
  const weekFiltered = useMemo(() => {
  if (!activeWeek || !chartData.length) return sortedItems;
  const weekEntry = chartData.find((w) => w.week === activeWeek);
  if (!weekEntry) return sortedItems;
  return sortedItems.filter((item) => {
    const itemDate = new Date(item.date);
    const start = new Date(weekEntry.startDate);
    const end = new Date(weekEntry.endDate);
    return itemDate >= start && itemDate <= end;
  });
}, [sortedItems, activeWeek, chartData]);

  const emptyMessage =
    query.trim() || categoryFilter
      ? `No ${tab === 'expense' ? 'expenses' : 'income'} match your filters.`
      : tab === 'expense'
      ? 'No expenses yet. Add your first one above.'
      : 'No income recorded yet.';

  return (
  <PullToRefresh onRefresh={handleRefresh}>
  <div className="page-content">
    <div className="tx-page-header">
      <p className="section-label" style={{ marginBottom: 0 }}>Transactions</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MonthFilter
          selectedMonth={selectedMonth}
          onChange={setSelectedMonth}
          availableMonths={availableMonths}
        />
        <button className="btn-export" onClick={handleExport} type="button">
        ↓ Excel
      </button>
      </div>
    </div>

    {loading ? <SkeletonTotalsGrid /> : (
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
    )}

    {loading ? <SkeletonStatsCard /> : (
      <>
        <div className={`net-badge ${net >= 0 ? 'net-positive' : 'net-negative'}`}>
          {net >= 0 ? 'Net gain this month' : 'Net loss this month'}: {net >= 0 ? '+' : ''}₱{net.toFixed(2)}
        </div>
        <TransactionStats
          data={chartData}
          activeWeek={activeWeek}
          onWeekSelect={setActiveWeek}
        />
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
        Expenses
      </button>
    </div>

    <CategoryFilterChips type={tab} selected={categoryFilter} onChange={setCategoryFilter} />

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

    {loading ? (
      <div className="tx-grouped-list">
        <SkeletonTransactionGroup />
        <SkeletonTransactionGroup />
      </div>
    ) : (
      <GroupedTransactionList
        items={weekFiltered}
        type={tab}
        onRequestDelete={handleRequestDelete}
        emptyMessage={emptyMessage}
      />
    )}

    {pendingDelete && (
      <UndoToast
        message={`${pendingDelete.type === 'income' ? 'Income' : 'Expense'} deleted`}
        onUndo={handleUndo}
        onExpire={handleToastExpire}
      />
    )}
  </div>
  </PullToRefresh>
);
}

export default TransactionsPage;