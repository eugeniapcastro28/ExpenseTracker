import { getMonthLabel, monthKey } from '../../utils/dateHelpers.js';

function MonthFilter({ selectedMonth, onChange, availableMonths }) {
  function handleChange(e) {
    const found = availableMonths.find((m) => monthKey(m) === e.target.value);
    if (found) onChange(found);
  }

  if (availableMonths.length === 0) {
    return <span className="month-label">No data yet</span>;
  }

  return (
    <select
      className="month-select"
      value={selectedMonth ? monthKey(selectedMonth) : ''}
      onChange={handleChange}
    >
      {availableMonths.map((m) => (
        <option key={monthKey(m)} value={monthKey(m)}>
          {getMonthLabel(m)}
        </option>
      ))}
    </select>
  );
}

export default MonthFilter;