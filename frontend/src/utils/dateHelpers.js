export function getMonthLabel(date) {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export function isSameMonth(dateStr, refDate) {
  const d = new Date(dateStr);
  return d.getFullYear() === refDate.getFullYear() && d.getMonth() === refDate.getMonth();
}

export function filterByMonth(items, refDate) {
  return items.filter((item) => isSameMonth(item.date, refDate));
}

export function getAvailableMonths(expenses, incomes) {
  const all = [...expenses, ...incomes];
  const seen = new Map();

  all.forEach((item) => {
    const d = new Date(item.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!seen.has(key)) {
      seen.set(key, new Date(d.getFullYear(), d.getMonth(), 1));
    }
  });

  return Array.from(seen.values()).sort((a, b) => b - a); // newest first
}

export function monthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function groupByWeek(items, refDate) {
  // Splits the selected month into 4-5 week buckets based on day-of-month
  const buckets = {};

  items.forEach((item) => {
    const d = new Date(item.date);
    const weekNum = Math.ceil(d.getDate() / 7);
    const key = `Week ${weekNum}`;
    if (!buckets[key]) buckets[key] = { week: key, income: 0, expense: 0 };
    buckets[key][item.type] += item.amount;
  });

  // Ensure weeks appear in order even if empty
  const maxWeek = Math.ceil(
    new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0).getDate() / 7
  );
  const result = [];
  for (let i = 1; i <= maxWeek; i++) {
    const key = `Week ${i}`;
    result.push(buckets[key] || { week: key, income: 0, expense: 0 });
  }
  return result;
}

export function sortItems(items, sortBy) {
  const copy = [...items];
  switch (sortBy) {
    case 'newest':
      return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'oldest':
      return copy.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'highest':
      return copy.sort((a, b) => b.amount - a.amount);
    case 'lowest':
      return copy.sort((a, b) => a.amount - b.amount);
    default:
      return copy;
  }
}

export function groupByDate(items) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = {};

  items.forEach((item) => {
    const d = new Date(item.date);
    d.setHours(0, 0, 0, 0);

    let label;
    if (d.getTime() === today.getTime()) {
      label = 'Today';
    } else if (d.getTime() === yesterday.getTime()) {
      label = 'Yesterday';
    } else {
      label = d.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  return groups; // { "Today": [...], "Yesterday": [...], "June 28, 2026": [...] }
}

export function searchItems(items, query) {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.category.toLowerCase().includes(q) ||
      (item.note && item.note.toLowerCase().includes(q))
  );
}

export function filterByCategory(items, category) {
  if (!category) return items;
  return items.filter((item) => item.category === category);
}