import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register.jsx";
import Home from "./pages/Home/Home.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Perfil from "./pages/Perfil/Perfil.jsx";
import Carrito from "./pages/Carrito/Carrito.jsx";
import Pagos from "./pages/Pagos/Pagos.jsx";
import Productos from "./pages/Productos/Productos.jsx";
import ProductoDetalle from "./pages/Productos/ProductoDetalle.jsx";
import Categorias from "./pages/Categorias/Categorias.jsx";
import CategoriaDetalle from "./pages/Categorias/CategoriaDetalle.jsx";
import Contacto from "./pages/Contacto/Contacto";
import Despacho from "./pages/Despacho/Despacho.jsx";
import ConfirmacionCompra from "./pages/Confirmacion/ConfirmacionCompra.jsx";
import PagoFallido from "./pages/PagoFallido/PagoFallido.jsx";
import BeneficiosPremium from "./pages/BeneficiosPremium/BeneficiosPremium.JSX";

// Dashboard
import DashboardLayout from "./pages/Dashboard/Layout/DashboardLayout";
import DashboardHome from "./pages/Dashboard/Inicio/DashboardHome.jsx";
import DashboardProductos from "./pages/Dashboard/Productos/DashboardProductos";
import ProtectedDashboardRoute from "./routes/ProtectedDashboardRoute";

import AdminLayout from "./pages/Admin/Layout/AdminLayout.jsx";
import AdminHome from "./pages/Admin/Home/AdminHome";
import AdminUsers from "./pages/Admin/Usuarios/AdminUsers.jsx";
import AdminRoles from "./pages/Admin/Roles/AdminRoles.jsx";
import AdminCategorias from "./pages/Admin/Categorias/AdminCategorias.jsx";

import WhatsappButton from "./components/Buttons/WhatsappButton";
import { CartProvider } from "./context/CartContext";
import AdminProducts from "./pages/Admin/Productos/AdminProducts.jsx";

function App() {
  return (
    <>
      <WhatsappButton />

      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route path="/beneficios" element={<BeneficiosPremium />} />

          <Route path="/carrito" element={<Carrito />} />
          <Route path="/pago" element={<Pagos />} />

          <Route path="/metodo-pago" element={<Pagos />} />
          <Route path="/confirmacion-compra" element={<ConfirmacionCompra />} />
          <Route path="/pago-fallido" element={<PagoFallido />} />

          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:categoria" element={<CategoriaDetalle />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/despacho" element={<Despacho />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedDashboardRoute>
                <DashboardLayout />
              </ProtectedDashboardRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="productos" element={<DashboardProductos />} />
          </Route>

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedDashboardRoute>
                <AdminLayout />
              </ProtectedDashboardRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="categorias" element={<AdminCategorias />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </CartProvider>
    </>
  );
}

export default App;