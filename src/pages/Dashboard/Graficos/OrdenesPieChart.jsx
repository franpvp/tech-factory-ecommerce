import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#34d399", "#fbbf24", "#ef4444"];

export function OrdenesPieChart({ data }) {

  const chartData = data.map(d => ({
    name: d.estado,
    value: d.cantidad
  }));

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
      <h2 className="text-xl font-bold text-white mb-4">Órdenes por Estado (Hoy)</h2>

      <PieChart width={350} height={250}>
        <Pie
          data={chartData}
          cx={150}
          cy={100}
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}