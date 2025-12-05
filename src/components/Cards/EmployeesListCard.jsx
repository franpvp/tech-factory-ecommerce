// src/components/dashboard/EmployeesListCard.jsx
const employees = [
  {
    name: "Sarah Miller",
    department: "Marketing",
    role: "Marketing Manager",
    joined: "Apr 20, 2024",
  },
  {
    name: "Mark Taylor",
    department: "IT & Development",
    role: "Backend Developer",
    joined: "Nov 30, 2022",
  },
  {
    name: "Jessica Lee",
    department: "Operations",
    role: "Project Manager",
    joined: "Jun 20, 2021",
  },
  {
    name: "David Wilson",
    department: "IT & Development",
    role: "Data Scientist",
    joined: "Oct 10, 2020",
  },
  {
    name: "Lisa Grant",
    department: "Finance",
    role: "Finance Analyst",
    joined: "Feb 02, 2022",
  },
  {
    name: "John Peterson",
    department: "Sales",
    role: "Sales Executive",
    joined: "Jul 25, 2022",
  },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const EmployeesListCard = () => {
  return (
    <section className="card">
      <header className="card-header card-header--with-action">
        <h2 className="card-title">Employees List</h2>
        <button className="btn btn-sm btn-outline">View All</button>
      </header>

      <div className="employees-list">
        {employees.map((emp) => (
          <article key={emp.name} className="employee-row">
            <div className="employee-avatar">
              <span>{getInitials(emp.name)}</span>
            </div>
            <div className="employee-main">
              <div className="employee-name">{emp.name}</div>
              <div className="employee-meta">
                <span>{emp.department}</span> • <span>{emp.role}</span>
              </div>
            </div>
            <div className="employee-joined">
              <span className="employee-joined-label">Joined</span>
              <span className="employee-joined-date">{emp.joined}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default EmployeesListCard;