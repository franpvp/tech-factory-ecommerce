import React, { useState } from "react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  ArrowRightStartOnRectangleIcon,
  UserIcon,
  Cog8ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const cartCount = 3;

  const cartItems = [
    { id: 1, name: "RTX 4060 Ti", price: 399990, qty: 1 },
    { id: 2, name: "Ryzen 7 7800X3D", price: 529990, qty: 1 },
  ];

  const total = cartItems.reduce((acc, p) => acc + p.price * p.qty, 0);

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  const handleLogin = () => navigate("/login");

  const profileName =
    accounts.length > 0 ? accounts[0].name || accounts[0].username : "Usuario";

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white text-slate-900 shadow-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <h1 className="text-lg font-semibold tracking-tight">
              <span className="text-orange-600">Tech</span> Factory
            </h1>
          </div>

          <ul className="hidden md:flex gap-8 font-medium">
            <li className="hover:text-orange-600 cursor-pointer">Inicio</li>
            <li className="hover:text-orange-600 cursor-pointer">Productos</li>
            <li className="hover:text-orange-600 cursor-pointer">Ofertas</li>
            <li className="hover:text-orange-600 cursor-pointer">Contacto</li>
          </ul>

          <div className="flex items-center gap-4">
            <MagnifyingGlassIcon className="w-6 h-6 cursor-pointer hover:text-orange-600" />

            <div
              onClick={() => setCartOpen(true)}
              className="relative cursor-pointer hover:text-orange-600 transition"
            >
              <ShoppingCartIcon className="w-6 h-6" />

              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogin}
                  className="px-4 py-1.5 bg-orange-600 text-white rounded-full text-sm font-semibold hover:bg-orange-500"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-1.5 rounded-full border border-orange-600 text-orange-600 text-sm font-semibold hover:bg-orange-50"
                >
                  Registrar
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1"
                >
                  <img
                    src="https://i.pravatar.cc/40"
                    className="w-10 h-10 rounded-full border border-slate-300"
                  />
                  <ChevronDownIcon className="w-4 h-4 text-slate-600" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 shadow-lg rounded-xl py-2 z-50">
                    <div className="px-4 py-2 text-xs text-slate-500">
                      {profileName}
                    </div>

                    <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-100 text-sm">
                      <UserIcon className="w-5 h-5" /> Mi perfil
                    </button>

                    <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-100 text-sm">
                      <Cog8ToothIcon className="w-5 h-5" /> Configuración
                    </button>

                    <hr className="my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-100 text-sm"
                    >
                      <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            <span className="text-orange-600">Tech</span> Factory
          </h2>
          <button onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            <li className="hover:text-orange-600 cursor-pointer">Inicio</li>
            <li className="hover:text-orange-600 cursor-pointer">Productos</li>
            <li className="hover:text-orange-600 cursor-pointer">Categorías</li>
            <li className="hover:text-orange-600 cursor-pointer">Mi carrito</li>
            <li className="hover:text-orange-600 cursor-pointer">Contacto</li>
          </ul>
        </nav>
      </aside>

      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tu carrito</h2>
          <button onClick={() => setCartOpen(false)}>
            <XMarkIcon className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* ITEMS */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[70%]">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3 hover:shadow-md transition"
            >
              {/* IMAGEN DEL PRODUCTO */}
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg border border-slate-300"
              />

              {/* INFO */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500">
                  Cantidad: {item.qty}
                </p>
              </div>

              {/* PRECIO */}
              <span className="text-sm font-bold text-orange-600 whitespace-nowrap">
                ${item.price.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-slate-50 flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span>Total:</span>
            <span className="font-bold text-orange-600">
              ${total.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => {
              setCartOpen(false);
              navigate("/carrito");
            }}
            className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-500 transition active:scale-95"
          >
            Ir a pagar
          </button>
        </div>
      </aside>
    </>
  );
}