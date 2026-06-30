function Summary({ summary }) {
  if (!summary || summary.byCategory.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Total: ${summary.total.toFixed(2)}</h2>
      <ul>
        {summary.byCategory.map((item) => (
          <li key={item.category}>
            {item.category}: ${item.total.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Summary;