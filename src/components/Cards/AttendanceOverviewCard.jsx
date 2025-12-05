// src/components/dashboard/AttendanceOverviewCard.jsx
const AttendanceOverviewCard = () => {
  const items = [
    { label: "Present", value: 1754, colorClass: "badge--success" },
    { label: "Late", value: 878, colorClass: "badge--warning" },
    { label: "Permission", value: 634, colorClass: "badge--info" },
    { label: "Absent", value: 470, colorClass: "badge--danger" },
  ];

  return (
    <section className="card">
      <header className="card-header card-header--with-action">
        <h2 className="card-title">Attendance Overview</h2>
        <button className="btn btn-sm btn-outline">View Complete Statistics</button>
      </header>

      <div className="attendance-grid">
        {items.map((item) => (
          <div key={item.label} className="attendance-item">
            <span className={`badge ${item.colorClass}`}>{item.label}</span>
            <span className="attendance-value">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AttendanceOverviewCard;