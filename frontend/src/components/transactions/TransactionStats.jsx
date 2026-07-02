import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from 'recharts';

function TransactionStats({ data, activeWeek, onWeekSelect }) {
  // console.log('chartData:', data);
  return (
    <div className="stats-card">
      <div className="stats-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="section-label">Statistics</p>
        {activeWeek && (
          <button className="chip chip-active" style={{ borderColor: '#c0392b', color: '#c0392b', background: '#fdf2f2' }} onClick={() => onWeekSelect(null)}>
            {activeWeek} ×
          </button>
        )}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barGap={4} onClick={(e) => {
          if (e && e.activeLabel) {
            onWeekSelect(activeWeek === e.activeLabel ? null : e.activeLabel);
          }
        }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value) => `₱${value.toFixed(2)}`}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #e8e8e8' }}
          />
          <Bar dataKey="income" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.week}
                fill="#16a34a"
                opacity={!activeWeek || activeWeek === entry.week ? 1 : 0.3}
              />
            ))}
          </Bar>
          <Bar dataKey="expense" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.week}
                fill="#c0392b"
                opacity={!activeWeek || activeWeek === entry.week ? 1 : 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TransactionStats;