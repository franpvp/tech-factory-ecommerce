export function DashboardCards({ usuariosActivos, ventasCorrectas, ordenesHoy }) {

  const cards = [
    {
      title: "Usuarios Activos",
      value: usuariosActivos,
      icon: "🟢",
    },
    {
      title: "Órdenes Hoy",
      value: ordenesHoy.reduce((sum, r) => sum + r.cantidad, 0),
      icon: "📦",
    },
    {
      title: "Pagos Correctos Hoy",
      value: ventasCorrectas,
      icon: "💰",
    },
    {
      title: "Pagos Pendientes",
      value: ordenesHoy.find(o => o.estado === "PAGO_PENDIENTE")?.cantidad || 0,
      icon: "⏳",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((c) => (
        <div
          key={c.title}
          className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm 
                    hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:border-indigo-500 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-indigo-500/20 text-indigo-400">
              {c.icon}
            </div>

            <div>
              <p className="text-sm text-slate-400">{c.title}</p>
              <h2 className="text-xl font-semibold text-white">{c.value}</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}