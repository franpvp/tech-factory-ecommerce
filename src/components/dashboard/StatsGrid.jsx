// src/components/dashboard/StatsGrid.jsx
const StatsGrid = () => {
  const stats = [
    {
      label: "Total Employees",
      value: "12,235",
      change: "+3.21%",
      subtitle: "This Year",
      tone: "up",
    },
    {
      label: "New Employees",
      value: "10,784",
      change: "+1.86%",
      subtitle: "This Year",
      tone: "up",
    },
    {
      label: "Total Job Applicants",
      value: "2,235",
      change: "+3.09%",
      subtitle: "This Year",
      tone: "up",
    },
    {
      label: "Resigned Employees",
      value: "1,986",
      change: "+0.97%",
      subtitle: "This Year",
      tone: "down",
    },
  ];

  return (
    <section className="card-grid card-grid--stats">
      {stats.map((item) => (
        <article key={item.label} className="card card--stat">
          <div className="card-header-row">
            <span className="card-kpi-label">{item.label}</span>
          </div>
          <div className="card-kpi-main">
            <span className="card-kpi-value">{item.value}</span>
          </div>
          <div className="card-kpi-footer">
            <span
              className={`chip chip--compact ${
                item.tone === "down" ? "chip--danger" : "chip--success"
              }`}
            >
              {item.change}
            </span>
            <span className="card-kpi-subtitle">{item.subtitle}</span>
          </div>
        </article>
      ))}
    </section>
  );
};

export default StatsGrid;