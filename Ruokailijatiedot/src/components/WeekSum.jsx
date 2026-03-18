export default function WeekSummary({ fieldTotals }) {
  return (
    <div className="week-summary">
      {Object.entries(fieldTotals).map(([field, total]) => (
        <div key={field} className="summary-row">
          {field}: <strong>{total}</strong>
        </div>
      ))}
    </div>
  );
}