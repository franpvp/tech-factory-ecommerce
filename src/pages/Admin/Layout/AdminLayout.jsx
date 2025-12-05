import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Admin<span className="text-orange-400">Panel</span>
        </h2>

        <nav className="flex flex-col gap-2">
            <AdminLink to="/admin" label="Inicio" />
            <AdminLink to="/admin/productos" label="Productos" />
            <AdminLink to="/admin/usuarios" label="Usuarios" />
            <AdminLink to="/admin/roles" label="Roles" />
            <AdminLink to="/admin/categorias" label="Categorías" /> 
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}

function AdminLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg transition ${
          isActive ? "bg-gray-800 text-orange-400" : "hover:bg-gray-800"
        }`
      }
    >
      {label}
    </NavLink>
  );
}