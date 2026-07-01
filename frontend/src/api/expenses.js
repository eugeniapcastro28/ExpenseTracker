import { API_BASE, authHeaders } from './client.js';

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