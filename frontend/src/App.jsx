import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ExpensePage from './pages/ExpensePage.jsx';
import IncomePage from './pages/IncomePage.jsx';
import AddTransactionPage from './pages/AddTransactionPage.jsx';
import AddExpensePage from './pages/AddExpensePage.jsx';
import AddIncomePage from './pages/AddIncomePage.jsx';

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

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

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
        </Routes>

        <nav className="bottom-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">⊞</span>
            <span className="nav-label">Dashboard</span>
          </NavLink>
          <NavLink to="/add" className="nav-add-btn">
            <span>+</span>
          </NavLink>
          <NavLink to="/expenses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">↓</span>
            <span className="nav-label">Expenses</span>
          </NavLink>
        </nav>
      </div>
    </BrowserRouter>
  );
}

export default App;