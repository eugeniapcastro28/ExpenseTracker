const API_BASE = 'https://expensetracker-w139.onrender.com/api';

export async function signup(email, password) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getExpenses() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/expenses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function createExpense(expense) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(expense)
  });
  return res.json();
}

export async function deleteExpense(id) {
  const token = localStorage.getItem('token');
  await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
} 

export async function getSummary() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/expenses/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

// INCOME

export async function getIncomes() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/incomes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function createIncome(income) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/incomes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(income)
  });
  return res.json();
}

export async function deleteIncome(id) {
  const token = localStorage.getItem('token');
  await fetch(`${API_BASE}/incomes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}