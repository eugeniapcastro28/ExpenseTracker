import { getCategoryMeta } from '../../utils/categoryIcons.js';

const EXPENSE_CATS = ['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Other'];
const INCOME_CATS = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

function CategoryFilterChips({ type, selected, onChange }) {
  const categories = type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  function toggle(cat) {
    if (selected === cat) {
      onChange(null); // tap active chip again to clear
    } else {
      onChange(cat);
    }
  }

  return (
    <div className="chip-row">
      <button
        className={`chip ${selected === null ? 'chip-active' : ''}`}
        onClick={() => onChange(null)}
        type="button"
      >
        All
      </button>
      {categories.map((cat) => {
        const { icon: Icon, color, bg } = getCategoryMeta(cat, type);
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            className={`chip ${isActive ? 'chip-active' : ''}`}
            style={isActive ? { background: bg, color, borderColor: color } : undefined}
            onClick={() => toggle(cat)}
            type="button"
          >
            <Icon size={13} />
            {cat}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilterChips;