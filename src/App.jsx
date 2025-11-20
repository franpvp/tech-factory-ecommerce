import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register.jsx";
import Home from "./pages/Home/Home.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Perfil from "./pages/Perfil/Perfil.jsx";
import Carrito from "./pages/Carrito/Carrito.jsx";
import Pagos from "./pages/Pagos/Pagos.jsx";

function App() {
  return (
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
      <Route
        path="/carrito"
        element={
            <Carrito />
        }
      />
      <Route
        path="/pago"
        element={
            <Pagos />
        }
      />

      {/* fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;