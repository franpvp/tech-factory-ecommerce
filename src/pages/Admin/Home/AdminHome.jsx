export default function AdminHome() {
  const cards = [
    {
      title: "Usuarios Registrados",
      value: "1,294",
      icon: "👤",
      trend: "+12%",
    },
    {
      title: "Órdenes del Día",
      value: "82",
      icon: "🛒",
      trend: "+5%",
    },
    {
      title: "Ingresos Mensuales",
      value: "$4,520,000",
      icon: "💰",
      trend: "+8%",
    },
    {
      title: "Soporte Activo",
      value: "14 tickets",
      icon: "🎧",
      trend: "-2%",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-1">Panel de Administración</h1>
      <p className="text-slate-400 mb-8">Selecciona una sección del menú lateral.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((c) => (
          <div
            key={c.title}
            className="
              bg-[var(--color-surface-soft)]
              border border-[var(--color-border-subtle)]
              rounded-xl p-5 shadow-sm
              hover:shadow-[0_0_15px_rgba(99,102,241,0.25)]
              hover:border-[var(--color-primary)]
              transition-all duration-300
              cursor-pointer
            "
          >
            {/* ICONO */}
            <div className="flex items-center gap-3">
              <div
                className="
                  w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                  bg-[var(--color-primary-soft)]
                  text-[var(--color-primary)]
                "
              >
                {c.icon}
              </div>

              <div>
                <p className="text-sm text-[var(--color-text-muted)]">{c.title}</p>
                <h2 className="text-xl font-semibold text-white">{c.value}</h2>
              </div>
            </div>

            <p
              className={`mt-4 text-sm ${
                c.trend.startsWith("+")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {c.trend} en comparación al mes anterior
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}