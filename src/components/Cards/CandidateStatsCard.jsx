// src/components/dashboard/CandidateStatsCard.jsx
const CandidateStatsCard = () => {
  return (
    <section className="card card--compact">
      <header className="card-header">
        <h2 className="card-title">Candidate Statistics</h2>
      </header>

      <div className="candidate-stats">
        <div className="candidate-stat-block">
          <span className="candidate-stat-label">Total Candidates Hired</span>
          <span className="candidate-stat-value">576</span>
        </div>
        <div className="candidate-stat-block">
          <span className="candidate-stat-label">Total Responses</span>
          <span className="candidate-stat-value">1,854</span>
        </div>
      </div>

      <div className="candidate-inline-chart">
        <div className="dot-line">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <p className="candidate-note">
          Datos simulados para ejemplo visual. Puedes conectar aquí tus propias métricas.
        </p>
      </div>
    </section>
  );
};

export default CandidateStatsCard;