// src/components/dashboard/ApplicantTable.jsx
const applicants = [
  {
    id: "#SPT-011",
    name: "Mayor Kelly",
    position: "System Administrator",
    date: "24 Nov 2023",
    email: "mayorkelly2341@gmail.com",
    experience: "2+ Years",
    status: "New",
  },
  {
    id: "#SPT-012",
    name: "Andrew Garfield",
    position: "Data and Analytics",
    date: "13 Dec 2023",
    email: "andrewgarfield45@gmail.com",
    experience: "3+ Years",
    status: "Interviewed",
  },
  {
    id: "#SPT-013",
    name: "Simon Cowel",
    position: "UX/UI Design",
    date: "10 Nov 2023",
    email: "simoncowel234@gmail.com",
    experience: "Fresher",
    status: "Hired",
  },
  {
    id: "#SPT-014",
    name: "Mirinda Hers",
    position: "Database Management",
    date: "16 Dec 2023",
    email: "mirindahers@gmail.com",
    experience: "1 Year",
    status: "Under Review",
  },
  {
    id: "#SPT-015",
    name: "Jacob Smith",
    position: "AI and Machine Learning",
    date: "22 Dec 2023",
    email: "jacobsmith@gmail.com",
    experience: "5+ Years",
    status: "Rejected",
  },
];

const statusClass = (status) => {
  switch (status.toLowerCase()) {
    case "new":
      return "badge--info";
    case "interviewed":
      return "badge--warning";
    case "hired":
      return "badge--success";
    case "under review":
      return "badge--neutral";
    case "rejected":
      return "badge--danger";
    default:
      return "badge--neutral";
  }
};

const ApplicantTable = () => {
  return (
    <section className="card card--table">
      <header className="card-header card-header--with-action">
        <h2 className="card-title">Applicant Details</h2>
        <div className="table-filters">
          <span className="filter-label">Sort by:</span>
          <button className="chip chip--filter chip--filter-active">New</button>
          <button className="chip chip--filter">Popular</button>
          <button className="chip chip--filter">Relevant</button>
        </div>
      </header>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant Name</th>
              <th>Position Applied</th>
              <th>Date of Application</th>
              <th>Email</th>
              <th>Work Experience</th>
              <th>Status</th>
              <th className="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((app) => (
              <tr key={app.id}>
                <td>{app.id}</td>
                <td>
                  <div className="table-avatar">
                    <span className="table-avatar__circle">
                      {app.name[0].toUpperCase()}
                    </span>
                    <span className="table-avatar__name">{app.name}</span>
                  </div>
                </td>
                <td>{app.position}</td>
                <td>{app.date}</td>
                <td>{app.email}</td>
                <td>{app.experience}</td>
                <td>
                  <span className={`badge ${statusClass(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="col-action">
                  <button className="btn btn-sm btn-ghost">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="table-footer">
          <span>Showing 5 Entries</span>
          <div className="pagination">
            <button className="pagination-btn">Prev</button>
            <button className="pagination-btn pagination-btn--active">1</button>
            <button className="pagination-btn">2</button>
            <span className="pagination-ellipsis">…</span>
            <button className="pagination-btn">17</button>
            <button className="pagination-btn">Next</button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default ApplicantTable;