import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function OrdenesBarChart({ data }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
      <h2 className="text-xl font-bold text-white mb-4">Órdenes último mes</h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="dia" stroke="#94a3b8"/>
          <YAxis stroke="#94a3b8"/>
          <Tooltip />
          <Bar dataKey="cantidad" fill="#6366f1" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}