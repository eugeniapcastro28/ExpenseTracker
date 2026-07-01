import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import ExpensePage from './pages/expense/ExpensePage.jsx';
import IncomePage from './pages/income/IncomePage.jsx';
import AddTransactionPage from './pages/add-transaction/AddTransactionPage.jsx';
import AddExpensePage from './pages/add-transaction/AddExpensePage.jsx';
import AddIncomePage from './pages/add-transaction/AddIncomePage.jsx';
import BottomNav from './components/layout/BottomNav.jsx';
import TransactionsPage from './pages/transactions/TransactionsPage.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token')) setIsLoggedIn(true);
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
        </Routes>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;