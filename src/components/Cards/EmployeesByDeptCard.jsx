// src/components/dashboard/EmployeesByDeptCard.jsx
const EmployeesByDeptCard = () => {
  const departments = [
    { name: "Marketing", count: 120 },
    { name: "IT & Development", count: 220 },
    { name: "Operations", count: 95 },
    { name: "Finance", count: 80 },
    { name: "Sales", count: 140 },
  ];

  const total = departments.reduce((sum, d) => sum + d.count, 0);

  return (
    <section className="card card--compact">
      <header className="card-header">
        <h2 className="card-title">Employees by Department</h2>
      </header>

      <div className="dept-chart">
        {departments.map((dept) => {
          const pct = Math.round((dept.count / total) * 100);
          return (
            <div key={dept.name} className="dept-row">
              <div className="dept-row__info">
                <span className="dept-name">{dept.name}</span>
                <span className="dept-count">{dept.count}</span>
              </div>
              <div className="dept-row__bar">
                <div
                  className="dept-row__bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="dept-percentage">{pct}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EmployeesByDeptCard;