import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./CandidateStatistics.css";

const data = [
  { month: "Jan", hired: 12, responses: 20 },
  { month: "Feb", hired: 22, responses: 35 },
  { month: "Mar", hired: 19, responses: 26 },
  { month: "Apr", hired: 25, responses: 55 },
  { month: "May", hired: 9, responses: 24 },
  { month: "Jun", hired: 13, responses: 30 },
  { month: "Jul", hired: 14, responses: 22 },
  { month: "Aug", hired: 18, responses: 40 },
  { month: "Sep", hired: 11, responses: 28 },
  { month: "Oct", hired: 20, responses: 46 },
  { month: "Nov", hired: 16, responses: 38 },
  { month: "Dec", hired: 24, responses: 55 },
];

const totalHired = data.reduce((acc, d) => acc + d.hired, 0);
const totalResponses = data.reduce((acc, d) => acc + d.responses, 0);

const CandidateStatistics = () => {
  return (
    <div className="card">
      <h2 className="title">Candidate Statistics</h2>

      <div className="stats-row">
        <div className="stat-block">
          <p className="stat-label">Total Candidates Hired</p>
          <p className="stat-value">{totalHired}</p>
        </div>
        <div className="stat-block">
          <p className="stat-label">Total Responses</p>
          <p className="stat-value">{totalResponses}</p>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#333245"
              horizontal={true}
              vertical={false}
            />
            <XAxis dataKey="month" stroke="#a5a1c2" tickLine={false} />
            <YAxis stroke="#a5a1c2" tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                backgroundColor: "#1b1a29",
                border: "1px solid #28263a",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="hired" stackId="a" fill="#9b5cff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="responses" stackId="a" fill="#4c3f91" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-color color-hired"></span> Candidates Hired
        </div>
        <div className="legend-item">
          <span className="legend-color color-responses"></span> Received Responses
        </div>
      </div>
    </div>
  );
};

export default CandidateStatistics;