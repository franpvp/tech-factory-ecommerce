import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"]; // Tonos más elegantes

export function OrdenesPieChart({ data }) {

  const chartData = data.map(d => ({
    name: d.estado,
    value: d.cantidad,
  }));

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Órdenes por Estado (Hoy)
      </h2>

      {/* Contenedor responsive */}
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((d, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            {/* Tooltip personalizado */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f3f4f6",
              }}
            />

            {/* Leyenda más moderna */}
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value, entry) => (
                <span style={{ color: "#e5e7eb" }}>
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}