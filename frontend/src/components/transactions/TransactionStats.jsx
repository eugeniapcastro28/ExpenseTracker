import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

function TransactionStats({ data }) {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <p className="section-label">Statistics</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value) => `₱${value.toFixed(2)}`}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #e8e8e8' }}
          />
          <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#c0392b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TransactionStats;