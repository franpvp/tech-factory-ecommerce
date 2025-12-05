// src/components/dashboard/EmployeesStatusCard.jsx
const EmployeesStatusCard = () => {
  const segments = [
    { label: "Remote", value: 4075, percentage: 25, colorClass: "bar--primary" },
    { label: "Probation", value: 5775, percentage: 35, colorClass: "bar--accent" },
    { label: "Contract", value: 3976, percentage: 25, colorClass: "bar--info" },
    { label: "Work From Home", value: 1675, percentage: 15, colorClass: "bar--warning" },
  ];

  return (
    <section className="card">
      <header className="card-header">
        <h2 className="card-title">Employees Status</h2>
      </header>

      <div className="status-bars">
        {segments.map((s) => (
          <div key={s.label} className="status-row">
            <div className="status-row__header">
              <span className="status-label">{s.label}</span>
              <span className="status-value">{s.value.toLocaleString()}</span>
            </div>
            <div className="status-row__bar">
              <div
                className={`status-row__bar-fill ${s.colorClass}`}
                style={{ width: `${s.percentage}%` }}
              />
            </div>
            <span className="status-percentage">{s.percentage}%</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmployeesStatusCard;