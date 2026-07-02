import { API_BASE, authHeaders } from './client.js';

export async function getExpenses() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/expenses`, {
    headers: authHeaders()
  });
  return res.json();
}

export async function createExpense(expense) {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(expense)
  });
  return res.json();
}

export async function deleteExpense(id) {
  const token = localStorage.getItem('token');
  await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
} 

export async function getSummary() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/expenses/summary`, {
    headers: authHeaders()
  });
  return res.json();
}

export async function updateExpense(id, expense) {
  const res = await fetch(`${API_BASE}/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(expense)
  });
  return res.json();
}