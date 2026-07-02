import express from 'express';
import db from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4000;
const JWT_SECRET = 'my-temporary-dev-secret-123';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/expenses', requireAuth, (req, res) => {
  const { amount, category, note, date } = req.body;

  const result = db
    .prepare('INSERT INTO expenses (user_id, amount, category, note, date) VALUES (?, ?, ?, ?, ?)')
    .run(req.userId, amount, category, note || '', date);

  res.status(201).json({ id: result.lastInsertRowid, amount, category, note, date });
});

app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body;

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const result = db
    .prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)')
    .run(email, passwordHash);

  const token = jwt.sign({ userId: result.lastInsertRowid }, JWT_SECRET);

  res.status(201).json({ token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

app.get('/api/expenses', requireAuth, (req, res) => {
  const expenses = db.prepare('SELECT * FROM expenses WHERE user_id = ?').all(req.userId);
  res.json(expenses);
});
 

app.delete('/api/expenses/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api/expenses/summary', requireAuth, (req, res) => {
  const byCategory = db
    .prepare(`
      SELECT category, SUM(amount) as total
      FROM expenses
      WHERE user_id = ?
      GROUP BY category
    `)
    .all(req.userId);

  const totalExpenses = db
    .prepare('SELECT SUM(amount) as total FROM expenses WHERE user_id = ?')
    .get(req.userId);

  const totalIncome = db
    .prepare('SELECT SUM(amount) as total FROM incomes WHERE user_id = ?')
    .get(req.userId);

  res.json({
    byCategory,
    totalExpenses: totalExpenses.total || 0,
    totalIncome: totalIncome.total || 0,
    balance: (totalIncome.total || 0) - (totalExpenses.total || 0)
  });
});

// INCOMES ENDPOINTS

app.get('/api/incomes', requireAuth, (req, res) => {
  const incomes = db
    .prepare('SELECT * FROM incomes WHERE user_id = ? ORDER BY date DESC, id DESC')
    .all(req.userId);
  res.json(incomes);
});

app.post('/api/incomes', requireAuth, (req, res) => {
  const { amount, category, note, date } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ error: 'amount, category, and date are required' });
  }

  const result = db
    .prepare('INSERT INTO incomes (user_id, amount, category, note, date) VALUES (?, ?, ?, ?, ?)')
    .run(req.userId, amount, category, note || '', date);

  const created = db.prepare('SELECT * FROM incomes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

app.delete('/api/incomes/:id', requireAuth, (req, res) => {
  const existing = db
    .prepare('SELECT * FROM incomes WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId);

  if (!existing) return res.status(404).json({ error: 'Income not found' });

  db.prepare('DELETE FROM incomes WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

app.put('/api/expenses/:id', requireAuth, (req, res) => {
  const { amount, category, note, date } = req.body;

  const existing = db
    .prepare('SELECT * FROM expenses WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId);

  if (!existing) return res.status(404).json({ error: 'Expense not found' });

  db.prepare(
    'UPDATE expenses SET amount = ?, category = ?, note = ?, date = ? WHERE id = ?'
  ).run(
    amount ?? existing.amount,
    category ?? existing.category,
    note ?? existing.note,
    date ?? existing.date,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
  res.json(updated);
});

app.put('/api/incomes/:id', requireAuth, (req, res) => {
  const { amount, category, note, date } = req.body;

  const existing = db
    .prepare('SELECT * FROM incomes WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId);

  if (!existing) return res.status(404).json({ error: 'Income not found' });

  db.prepare(
    'UPDATE incomes SET amount = ?, category = ?, note = ?, date = ? WHERE id = ?'
  ).run(
    amount ?? existing.amount,
    category ?? existing.category,
    note ?? existing.note,
    date ?? existing.date,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM incomes WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// ── Recurring Expenses ──
app.get('/api/recurring/expenses', requireAuth, (req, res) => {
  const items = db
    .prepare('SELECT * FROM recurring_expenses WHERE user_id = ? AND active = 1 ORDER BY id DESC')
    .all(req.userId);
  res.json(items);
});

app.post('/api/recurring/expenses', requireAuth, (req, res) => {
  const { amount, category, note, day_of_month } = req.body;
  if (!amount || !category || !day_of_month) {
    return res.status(400).json({ error: 'amount, category, and day_of_month are required' });
  }
  const result = db
    .prepare('INSERT INTO recurring_expenses (user_id, amount, category, note, day_of_month) VALUES (?, ?, ?, ?, ?)')
    .run(req.userId, amount, category, note || '', day_of_month);
  const created = db.prepare('SELECT * FROM recurring_expenses WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

app.delete('/api/recurring/expenses/:id', requireAuth, (req, res) => {
  const existing = db
    .prepare('SELECT * FROM recurring_expenses WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE recurring_expenses SET active = 0 WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

// ── Recurring Incomes ──
app.get('/api/recurring/incomes', requireAuth, (req, res) => {
  const items = db
    .prepare('SELECT * FROM recurring_incomes WHERE user_id = ? AND active = 1 ORDER BY id DESC')
    .all(req.userId);
  res.json(items);
});

app.post('/api/recurring/incomes', requireAuth, (req, res) => {
  const { amount, category, note, day_of_month } = req.body;
  if (!amount || !category || !day_of_month) {
    return res.status(400).json({ error: 'amount, category, and day_of_month are required' });
  }
  const result = db
    .prepare('INSERT INTO recurring_incomes (user_id, amount, category, note, day_of_month) VALUES (?, ?, ?, ?, ?)')
    .run(req.userId, amount, category, note || '', day_of_month);
  const created = db.prepare('SELECT * FROM recurring_incomes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

app.delete('/api/recurring/incomes/:id', requireAuth, (req, res) => {
  const existing = db
    .prepare('SELECT * FROM recurring_incomes WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE recurring_incomes SET active = 0 WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

// ── Generate this month's transactions from recurring ──
app.post('/api/recurring/generate', requireAuth, (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const monthKey = `${year}-${month}`;

  const recurringExpenses = db
    .prepare('SELECT * FROM recurring_expenses WHERE user_id = ? AND active = 1')
    .all(req.userId);

  const recurringIncomes = db
    .prepare('SELECT * FROM recurring_incomes WHERE user_id = ? AND active = 1')
    .all(req.userId);

  let generated = 0;

  for (const item of recurringExpenses) {
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const day = String(Math.min(item.day_of_month, lastDay)).padStart(2, '0');
    const dueDate = `${year}-${month}-${day}`;

    const exists = db
      .prepare('SELECT id FROM recurring_pending WHERE user_id = ? AND recurring_id = ? AND type = ? AND month_key = ?')
      .get(req.userId, item.id, 'expense', monthKey);

    if (!exists) {
      db.prepare(`
        INSERT INTO recurring_pending (user_id, recurring_id, type, amount, category, note, due_date, month_key)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(req.userId, item.id, 'expense', item.amount, item.category, item.note || '', dueDate, monthKey);
      generated++;
    }
  }

  for (const item of recurringIncomes) {
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    const day = String(Math.min(item.day_of_month, lastDay)).padStart(2, '0');
    const dueDate = `${year}-${month}-${day}`;

    const exists = db
      .prepare('SELECT id FROM recurring_pending WHERE user_id = ? AND recurring_id = ? AND type = ? AND month_key = ?')
      .get(req.userId, item.id, 'income', monthKey);

    if (!exists) {
      db.prepare(`
        INSERT INTO recurring_pending (user_id, recurring_id, type, amount, category, note, due_date, month_key)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(req.userId, item.id, 'income', item.amount, item.category, item.note || '', dueDate, monthKey);
      generated++;
    }
  }

  res.json({ generated });
});

// Get all pending recurring items
app.get('/api/recurring/pending', requireAuth, (req, res) => {
  const items = db
    .prepare(`SELECT * FROM recurring_pending WHERE user_id = ? AND status = 'pending' ORDER BY due_date ASC`)
    .all(req.userId);
  res.json(items);
});

// Confirm — mark as paid/received and insert into real transactions
app.post('/api/recurring/pending/:id/confirm', requireAuth, (req, res) => {
  const pending = db
    .prepare('SELECT * FROM recurring_pending WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId);

  if (!pending) return res.status(404).json({ error: 'Not found' });

  // Insert into real transactions
  const table = pending.type === 'expense' ? 'expenses' : 'incomes';
  db.prepare(`INSERT INTO ${table} (user_id, amount, category, note, date) VALUES (?, ?, ?, ?, ?)`)
    .run(req.userId, pending.amount, pending.category, pending.note, pending.due_date);

  // Mark as confirmed
  db.prepare('UPDATE recurring_pending SET status = ? WHERE id = ?')
    .run('confirmed', req.params.id);

  res.json({ success: true });
});

// Dismiss — skip this month without adding to transactions
app.post('/api/recurring/pending/:id/dismiss', requireAuth, (req, res) => {
  const pending = db
    .prepare('SELECT * FROM recurring_pending WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.userId);

  if (!pending) return res.status(404).json({ error: 'Not found' });

  db.prepare('UPDATE recurring_pending SET status = ? WHERE id = ?')
    .run('dismissed', req.params.id);

  res.json({ success: true });
});