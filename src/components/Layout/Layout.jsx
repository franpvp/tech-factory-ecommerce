import Sidebar from "../Sidebar/Sidebar";
import MenuPanel from "../Sidebar/MenuPanel";
import "../Layout.css"; // si ya tienes estilos base

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      {/* Columna izquierda — iconos */}
      <Sidebar />

      {/* Columna intermedia — panel del menú */}
      <MenuPanel />

      {/* Contenido principal */}
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}