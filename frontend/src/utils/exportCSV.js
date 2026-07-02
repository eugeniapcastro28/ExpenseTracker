import * as XLSX from 'xlsx';

export function exportToCSV(expenses, incomes, month) {
  const monthLabel = month
    ? month.toLocaleString('default', { month: 'long', year: 'numeric' })
    : 'All';

  // Expense rows
  const expenseRows = [
    ['Date', 'Category', 'Note', 'Amount'],
    ...expenses.map((e) => [
      e.date,
      e.category,
      e.note || '',
      parseFloat(e.amount.toFixed(2))
    ]),
    [],
    ['', '', 'Total', expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)]
  ];

  // Income rows
  const incomeRows = [
    ['Date', 'Category', 'Note', 'Amount'],
    ...incomes.map((i) => [
      i.date,
      i.category,
      i.note || '',
      parseFloat(i.amount.toFixed(2))
    ]),
    [],
    ['', '', 'Total', incomes.reduce((s, i) => s + i.amount, 0).toFixed(2)]
  ];

  // Summary rows
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  const summaryRows = [
    ['Summary', monthLabel],
    [],
    ['', 'Amount'],
    ['Total Income', parseFloat(totalIncome.toFixed(2))],
    ['Total Expenses', parseFloat(totalExpenses.toFixed(2))],
    ['Balance', parseFloat(balance.toFixed(2))],
  ];

  // Create workbook with 3 sheets
  const wb = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
  const expenseSheet = XLSX.utils.aoa_to_sheet(expenseRows);
  const incomeSheet = XLSX.utils.aoa_to_sheet(incomeRows);

  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
  XLSX.utils.book_append_sheet(wb, expenseSheet, 'Expenses');
  XLSX.utils.book_append_sheet(wb, incomeSheet, 'Income');

  XLSX.writeFile(wb, `transactions-${monthLabel.replace(' ', '-')}.xlsx`);
}