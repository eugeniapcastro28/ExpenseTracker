function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

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

export function groupByWeek(items, month) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  // Use explicit time to avoid timezone issues
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0); // last day of month

  const weeks = [];
  let weekStart = new Date(firstDay);
  let weekNum = 1;

  while (weekStart <= lastDay) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    if (weekEnd > lastDay) weekEnd.setTime(lastDay.getTime());

    const startStr = toLocalDateStr(weekStart);
    const endStr = toLocalDateStr(weekEnd);

    const weekItems = items.filter((item) => {
      // Compare as strings directly — avoids all timezone issues
      return item.date >= startStr && item.date <= endStr;
    });

    const income = weekItems
      .filter((i) => i.type === 'income')
      .reduce((s, i) => s + i.amount, 0);

    const expense = weekItems
      .filter((i) => i.type === 'expense')
      .reduce((s, i) => s + i.amount, 0);

    weeks.push({
      week: `W${weekNum}`,
      income: parseFloat(income.toFixed(2)),
      expense: parseFloat(expense.toFixed(2)),
      startDate: startStr,
      endDate: endStr,
    });

    weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() + 1);
    weekNum++;
  }

  return weeks;
}

export function isDueSoon(dueDate, daysAhead = 5) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const threshold = new Date(today);
  threshold.setDate(threshold.getDate() + daysAhead);

  // Includes anything overdue (due < today) up through daysAhead from now
  return due <= threshold;
}

export function filterDueSoon(items, daysAhead = 5) {
  return items.filter((item) => isDueSoon(item.due_date, daysAhead));
}