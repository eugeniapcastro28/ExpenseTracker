import { useState, useEffect } from 'react';
import { login, signup, getExpenses, getSummary, createExpense, deleteExpense } from './api.js';
import ExpenseList from './components/ExpenseList.jsx';
import ExpenseForm from './components/ExpenseForm.jsx';
import Summary from './components/Summary.jsx';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isSignup, setIsSignup] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  async function loadData() {
  const expensesData = await getExpenses();
  const summaryData = await getSummary();
  setExpenses(expensesData);
  setSummary(summaryData);
}

  async function handleAuth(e) {
  e.preventDefault();
  const authFn = isSignup ? signup : login;
  const result = await authFn(email, password);
  if (result.token) {
    localStorage.setItem('token', result.token);
    setIsLoggedIn(true);
  } else {
    alert(result.error || 'Something went wrong');
  }
}

  function handleLogout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setExpenses([]);
  }

  async function handleAddExpense(expense) {
  await createExpense(expense);
  await loadData();
  }
  
  async function handleDeleteExpense(id) {
    await deleteExpense(id);
    await loadData();
  }

  if (!isLoggedIn) {
  return (
    <div>
      <h1>Expense Tracker</h1>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isSignup ? 'Sign up' : 'Log in'}</button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
      </button>
    </div>
  );
}

  return (
    <div>
      <h1>Expenses</h1>
      <button onClick={handleLogout}>Log out</button>
      <Summary summary={summary} />
      <ExpenseForm onAdd={handleAddExpense} />
      <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
    </div>
  );
}

export default App;