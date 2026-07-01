export const API_BASE = 'https://expensetracker-w139.onrender.com/api';

export function getToken() {
  return localStorage.getItem('token');
}

export function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}