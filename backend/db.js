import Database from 'better-sqlite3';

const db = new Database('expenses.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    note TEXT,
    date TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    note TEXT,
    date TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS recurring_expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    note TEXT,
    day_of_month INTEGER NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS recurring_incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    note TEXT,
    day_of_month INTEGER NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS recurring_pending (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recurring_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    note TEXT,
    due_date TEXT NOT NULL,
    month_key TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;