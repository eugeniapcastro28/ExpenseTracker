function Summary({ summary }) {
  if (!summary) return null;

  const isPositive = summary.balance >= 0;

  return (
    <div className="summary-card">
      <div className="summary-grid">
        <div>
          <div className="summary-label">Income</div>
          <div className="summary-income">₱{summary.totalIncome.toFixed(2)}</div>
        </div>
        <div>
          <div className="summary-label">Expenses</div>
          <div className="summary-total">₱{summary.totalExpenses.toFixed(2)}</div>
        </div>
      </div>
      <div className="summary-balance-row">
        <div className="summary-label">Balance</div>
        <div className={isPositive ? 'summary-balance positive' : 'summary-balance negative'}>
          {isPositive ? '+' : ''}₱{summary.balance.toFixed(2)}
        </div>
      </div>
      {summary.byCategory.length > 0 && (
        <>
          <div className="summary-label" style={{marginTop: '14px'}}>Expenses by category</div>
          <div className="summary-cats">
            {summary.byCategory.map((item) => (
              <div key={item.category} className="summary-cat">
                <div className="cat-name">{item.category}</div>
                <div className="cat-amt">₱{item.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Summary;