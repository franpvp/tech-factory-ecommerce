import { Outlet, NavLink } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  UserIcon,
  TagIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

export default function DashboardLayout() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Tech<span className="text-orange-500">Admin</span>
        </h2>

        <nav className="space-y-3 flex-1">
          <SidebarLink to="/dashboard" icon={<HomeIcon className="w-5" />} label="Inicio" />
          <SidebarLink to="/dashboard/productos" icon={<CubeIcon className="w-5" />} label="Productos" />
          <SidebarLink to="/dashboard/usuarios" icon={<UserIcon className="w-5" />} label="Usuarios" />
          <SidebarLink to="/dashboard/categorias" icon={<TagIcon className="w-5" />} label="Categorías" />
          <SidebarLink to="/dashboard/stats" icon={<ChartBarIcon className="w-5" />} label="Analytics" />
        </nav>

        <button onClick={logout} className="flex items-center gap-3 text-red-400 hover:text-red-300">
          <ArrowLeftOnRectangleIcon className="w-5" />
          Cerrar sesión
        </button>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
          isActive ? "bg-slate-800 text-orange-400" : "hover:bg-slate-800"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}