import DashboardLayout from "../Layout/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

export default function DashboardStats() {
  const ventas = [
    { mes: "Ene", total: 45 },
    { mes: "Feb", total: 60 },
    { mes: "Mar", total: 80 },
    { mes: "Abr", total: 75 },
  ];

  const visitas = [
    { dia: "Lun", views: 1200 },
    { dia: "Mar", views: 900 },
    { dia: "Mié", views: 1600 },
    { dia: "Jue", views: 1400 },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Ventas Mensuales</h2>
          <LineChart width={450} height={250} data={ventas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#F97316" strokeWidth={3} />
          </LineChart>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Visitas Diarias</h2>
          <BarChart width={450} height={250} data={visitas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#2563EB" />
          </BarChart>
        </div>

      </div>
    </DashboardLayout>
  );
}