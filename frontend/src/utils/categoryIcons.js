import {
  ShoppingCart, Car, Receipt, ShoppingBag, Gamepad2, Plus,
  Briefcase, Laptop, Store, TrendingUp, Gift
} from 'lucide-react';

export const EXPENSE_ICONS = {
  Food: { icon: ShoppingCart, color: '#c0392b', bg: '#fdf2f2' },
  Transport: { icon: Car, color: '#1e40af', bg: '#dbeafe' },
  Bills: { icon: Receipt, color: '#166534', bg: '#f0fdf4' },
  Shopping: { icon: ShoppingBag, color: '#7e22ce', bg: '#fdf4ff' },
  Entertainment: { icon: Gamepad2, color: '#9a3412', bg: '#fff7ed' },
  Other: { icon: Plus, color: '#475569', bg: '#f1f5f9' },
};

export const INCOME_ICONS = {
  Salary: { icon: Briefcase, color: '#166534', bg: '#dcfce7' },
  Freelance: { icon: Laptop, color: '#1e40af', bg: '#dbeafe' },
  Business: { icon: Store, color: '#7e22ce', bg: '#fdf4ff' },
  Investment: { icon: TrendingUp, color: '#854d0e', bg: '#fef9c3' },
  Gift: { icon: Gift, color: '#9d174d', bg: '#fce7f3' },
  Other: { icon: Plus, color: '#475569', bg: '#f1f5f9' },
};

export function getCategoryMeta(category, type) {
  const map = type === 'income' ? INCOME_ICONS : EXPENSE_ICONS;
  return map[category] || map.Other;
}