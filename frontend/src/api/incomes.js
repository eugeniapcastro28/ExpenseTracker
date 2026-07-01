import { API_BASE, authHeaders } from './client.js';

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

export async function updateIncome(id, income) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/incomes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(income)
  });
  return res.json();
}