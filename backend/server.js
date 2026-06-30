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

app.put('/api/expenses/:id', requireAuth, (req, res) => {
  const { amount, category, note, date } = req.body;

  db.prepare(
    'UPDATE expenses SET amount = ?, category = ?, note = ?, date = ? WHERE id = ? AND user_id = ?'
  ).run(amount, category, note || '', date, req.params.id, req.userId);

  res.json({ id: req.params.id, amount, category, note, date });
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

  const totalRow = db
    .prepare('SELECT SUM(amount) as total FROM expenses WHERE user_id = ?')
    .get(req.userId);

  res.json({ byCategory, total: totalRow.total || 0 });
});