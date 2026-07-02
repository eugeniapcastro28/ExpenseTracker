import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import ExpensePage from './pages/expense/ExpensePage.jsx';
import IncomePage from './pages/income/IncomePage.jsx';
import AddTransactionPage from './pages/AddTransaction/AddTransactionPage.jsx';
import AddExpensePage from './pages/AddTransaction/AddExpensePage.jsx';
import AddIncomePage from './pages/AddTransaction/AddIncomePage.jsx';
import BottomNav from './components/Common/BottomNav.jsx';
import TransactionsPage from './pages/transactions/TransactionsPage.jsx';
import EditTransactionPage from './pages/transactions/EditTransactionPage.jsx';
import { generateRecurring, getPendingRecurring } from './api/recurring.js';
import RecurringPage from './pages/recurring/RecurringPage.jsx';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
      generateRecurring()
        .then(() => getPendingRecurring())
        .then((items) => setPendingCount(items.length))
        .catch(() => {});
    }
    setCheckingAuth(false);
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }

  if (checkingAuth) return null;
  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  return (
    <BrowserRouter>
      <div className="app">
        <div className="app-header">
          <h1>Expense Tracker</h1>
          <button className="btn-logout" onClick={handleLogout}>Log out</button>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/add" element={<AddTransactionPage />} />
          <Route path="/add/expense" element={<AddExpensePage />} />
          <Route path="/add/income" element={<AddIncomePage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/edit/:id" element={<EditTransactionPage />} />
          <Route path="/recurring" element={<RecurringPage />} />
        </Routes>

        <BottomNav
          pendingCount={pendingCount}
          onAddClick={() => setShowModal(true)}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;