import { API_BASE, authHeaders } from './client.js';

export async function getIncomes() {
  const res = await fetch(`${API_BASE}/incomes`, {
    headers: authHeaders()
  });
  return res.json();
}

export async function createIncome(income) {
  const res = await fetch(`${API_BASE}/incomes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(income)
  });
  return res.json();
}

export async function deleteIncome(id) {
  await fetch(`${API_BASE}/incomes/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
}

export async function updateIncome(id, income) {
  const res = await fetch(`${API_BASE}/incomes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(income)
  });
  return res.json();
}