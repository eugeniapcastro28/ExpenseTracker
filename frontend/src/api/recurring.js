import { API_BASE, authHeaders } from './client.js';
 
export async function getRecurringExpenses() {
  const res = await fetch(`${API_BASE}/recurring/expenses`, {
    headers: authHeaders()
  });
  return res.json();
}

export async function createRecurringExpense(data) {
  const res = await fetch(`${API_BASE}/recurring/expenses`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteRecurringExpense(id) {
  await fetch(`${API_BASE}/recurring/expenses/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
}

export async function getRecurringIncomes() {
  const res = await fetch(`${API_BASE}/recurring/incomes`, {
    headers: authHeaders()
  });
  return res.json();
}

export async function createRecurringIncome(data) {
  const res = await fetch(`${API_BASE}/recurring/incomes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteRecurringIncome(id) {
  await fetch(`${API_BASE}/recurring/incomes/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
}

export async function generateRecurring() {
  const res = await fetch(`${API_BASE}/recurring/generate`, {
    method: 'POST',
    headers: authHeaders()
  });
  return res.json();
}

export async function getPendingRecurring() {
  const res = await fetch(`${API_BASE}/recurring/pending`, {
    headers: authHeaders()
  });
  return res.json();
}

export async function confirmPending(id) {
  const res = await fetch(`${API_BASE}/recurring/pending/${id}/confirm`, {
    method: 'POST',
    headers: authHeaders()
  });
  return res.json();
}

export async function dismissPending(id) {
  const res = await fetch(`${API_BASE}/recurring/pending/${id}/dismiss`, {
    method: 'POST',
    headers: authHeaders()
  });
  return res.json();
}

export async function confirmRecurringNow(id, type) {
  const res = await fetch(`${API_BASE}/recurring/${type}s/${id}/confirm-now`, {
    method: 'POST',
    headers: authHeaders()
  });
  return res.json();
}

export async function dismissRecurringNow(id, type) {
  const res = await fetch(`${API_BASE}/recurring/${type}s/${id}/dismiss-now`, {
    method: 'POST',
    headers: authHeaders()
  });
  return res.json();
}