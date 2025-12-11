import React, { useState, useRef, useEffect } from "react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  ArrowRightStartOnRectangleIcon,
  UserIcon,
  Cog8ToothIcon,
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

import "../Navbar/collapse.css";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [categoriesCollapseOpen, setCategoriesCollapseOpen] = useState(false);

  const categoriesRef = useRef(null);
  const profileMenuRef = useRef(null);

  const { cart, cartCount, deleteFromCart } = useCart();
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveCategory = (path) => location.pathname === path;

  const goHome = () => navigate("/");
  const goContacto = () => navigate("/contacto");
  const goProductosPage = () => {
    setProductsMenuOpen(false);
    setSidebarOpen(false);
    navigate("/productos");
  };
  const goCarrito = () => {
    setCartOpen(false);
    navigate("/carrito");
  };
  const goPerfil = () => navigate("/perfil");

  const handleLogin = () => navigate("/login");
  const handleLogout = () =>
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });

  const openProductosMenu = () => setProductsMenuOpen(!productsMenuOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        productsMenuOpen &&
        categoriesRef.current &&
        !categoriesRef.current.contains(e.target)
      ) {
        setProductsMenuOpen(false);
      }

      if (
        menuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [productsMenuOpen, menuOpen]);

  const profileName =
    accounts.length > 0 ? accounts[0].name || accounts[0].username : "Usuario";

  const profileLetter =
    accounts.length > 0
      ? (accounts[0].name || accounts[0].username || "U")
          .charAt(0)
          .toUpperCase()
      : "U";

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <h1 onClick={goHome} className="text-lg font-semibold cursor-pointer">
              <span className="text-orange-600">Tech</span> Factory
            </h1>
          </div>

          {/* LINKS DESKTOP */}
          <ul className="hidden md:flex gap-8 font-medium">
            <li className="hover:text-orange-600 cursor-pointer" onClick={goHome}>
              Inicio
            </li>
            <li
              onClick={openProductosMenu}
              className="hover:text-orange-600 cursor-pointer"
            >
              Productos
            </li>
            <li
              onClick={goContacto}
              className="hover:text-orange-600 cursor-pointer"
            >
              Contacto
            </li>
          </ul>

          {/* DERECHA */}
          <div className="flex items-center gap-4">
            <MagnifyingGlassIcon className="w-6 h-6 cursor-pointer hover:text-orange-600" />

            {/* CARRITO */}
            <div
              onClick={() => setCartOpen(true)}
              className="relative cursor-pointer hover:text-orange-600 transition"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            {/* PERFIL / LOGIN */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogin}
                  className="px-4 py-1.5 bg-orange-600 text-white rounded-full text-sm"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-1.5 border border-orange-600 text-orange-600 rounded-full text-sm"
                >
                  Registrar
                </button>
              </div>
            ) : (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center justify-center rounded-full bg-orange-600 text-white font-bold text-xl w-12 h-12">
                    {profileLetter}
                  </div>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-2xl border border-slate-200 z-50 overflow-hidden animate-[fadeIn_.2s_ease-out]">
                    <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-xl">
                        {profileLetter}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{profileName}</p>
                        <p className="text-xs text-slate-500">Mi cuenta</p>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={goPerfil}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition"
                      >
                        <UserIcon className="w-5 h-5 text-slate-500" />
                        Mi perfil
                      </button>
                    </div>

                    <div className="border-t border-slate-200" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition"
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

      {/* MENÚ PRODUCTOS DESPLEGABLE SUPERIOR */}
      {productsMenuOpen && (
        <div
          ref={categoriesRef}
          className="mt-[64px] w-full bg-white shadow-lg z-40 overflow-hidden animate-slideDown"
        >
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              onClick={() => navigate("/categorias/tarjetas-video")}
              className="p-4 border rounded-xl hover:bg-orange-50 cursor-pointer"
            >
              <h3 className="font-semibold">Tarjetas de Video</h3>
              <p className="text-xs text-slate-500">AMD • NVIDIA</p>
            </div>

            <div
              onClick={() => navigate("/categorias/procesadores")}
              className="p-4 border rounded-xl hover:bg-orange-50 cursor-pointer"
            >
              <h3 className="font-semibold">Procesadores</h3>
              <p className="text-xs text-slate-500">Intel • Ryzen</p>
            </div>

            <div
              onClick={() => navigate("/categorias/almacenamiento")}
              className="p-4 border rounded-xl hover:bg-orange-50 cursor-pointer"
            >
              <h3 className="font-semibold">Almacenamiento</h3>
              <p className="text-xs text-slate-500">SSD • HDD</p>
            </div>

            <div
              onClick={() => navigate("/categorias/ram")}
              className="p-4 border rounded-xl hover:bg-orange-50 cursor-pointer"
            >
              <h3 className="font-semibold">RAM</h3>
              <p className="text-xs text-slate-500">DDR4 • DDR5</p>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR IZQUIERDO */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 shadow-2xl z-50 
        transition-transform duration-300 rounded-r-2xl 
        flex flex-col justify-between
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER SIDEBAR */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            <span className="text-orange-600">Tech</span> Factory
          </h2>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <XMarkIcon className="w-6 h-6 text-slate-700" />
          </button>
        </div>

        {/* CONTENIDO SIDEBAR */}
        <nav className="p-4 flex-1">
          <ul className="flex flex-col gap-1 text-sm font-medium text-slate-900">

            {/* HOME */}
            <li
              onClick={goHome}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 cursor-pointer transition"
            >
              <HomeIcon className="w-5 h-5 text-orange-500" />
              Inicio
            </li>

            {/* PRODUCTOS CON COLAPSE */}
            <li>
              <button
                onClick={() => setCategoriesCollapseOpen(!categoriesCollapseOpen)}
                className="flex w-full items-center justify-between px-4 py-3 rounded-xl hover:bg-orange-50 cursor-pointer transition"
              >
                <span className="flex items-center gap-3">
                  <CubeIcon className="w-5 h-5 text-orange-500" />
                  Productos
                </span>

                <ChevronDownIcon
                  className={`w-5 h-5 text-slate-600 transition-transform ${
                    categoriesCollapseOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* COLAPSE */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  categoriesCollapseOpen ? "max-h-80" : "max-h-0"
                }`}
              >
                <ul className="pl-10 pr-4 py-2 flex flex-col gap-2 text-sm">

                  <li
                    onClick={() => {
                      navigate("/categorias/tarjetas-video");
                      setSidebarOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition font-medium
                      ${
                        isActiveCategory("/categorias/tarjetas-video")
                          ? "bg-orange-100 text-orange-700"
                          : "hover:bg-orange-50 hover:text-orange-600"
                      }`}
                  >
                    Tarjetas de Video
                  </li>

                  <li
                    onClick={() => {
                      navigate("/categorias/procesadores");
                      setSidebarOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition font-medium
                      ${
                        isActiveCategory("/categorias/procesadores")
                          ? "bg-orange-100 text-orange-700"
                          : "hover:bg-orange-50 hover:text-orange-600"
                      }`}
                  >
                    Procesadores
                  </li>

                  <li
                    onClick={() => {
                      navigate("/categorias/almacenamiento");
                      setSidebarOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition font-medium
                      ${
                        isActiveCategory("/categorias/almacenamiento")
                          ? "bg-orange-100 text-orange-700"
                          : "hover:bg-orange-50 hover:text-orange-600"
                      }`}
                  >
                    Almacenamiento
                  </li>

                  <li
                    onClick={() => {
                      navigate("/categorias/ram");
                      setSidebarOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition font-medium
                      ${
                        isActiveCategory("/categorias/ram")
                          ? "bg-orange-100 text-orange-700"
                          : "hover:bg-orange-50 hover:text-orange-600"
                      }`}
                  >
                    RAM
                  </li>

                </ul>
              </div>
            </li>

            {/* CARRITO */}
            <li
              onClick={goCarrito}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 cursor-pointer transition"
            >
              <ShoppingCartIcon className="w-5 h-5 text-orange-500" />
              Mi carrito
            </li>

            {/* CONTACTO */}
            <li
              onClick={goContacto}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 cursor-pointer transition"
            >
              <EnvelopeIcon className="w-5 h-5 text-orange-500" />
              Contacto
            </li>
          </ul>
        </nav>

        {/* FOOTER */}
        {isAuthenticated && (
          <div className="px-4 pb-6 border-t border-slate-200 pt-4">
            <button
              onClick={goPerfil}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition text-left"
            >
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-lg">
                {profileLetter}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">{profileName}</p>
                <p className="text-xs text-slate-500">Mi cuenta</p>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition text-left text-red-600"
            >
              <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>

      {/* SIDEBAR DERECHO (CARRITO) */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-2xl z-50 
        transition-transform duration-300 rounded-l-2xl 
        flex flex-col ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Tu carrito</h2>

          <button
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <XMarkIcon className="w-6 h-6 text-slate-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {cart.length === 0 ? (
            <p className="text-center text-slate-500 mt-10">
              Tu carrito está vacío
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.idProducto}
                className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm relative"
              >
                <button
                  onClick={() => deleteFromCart(item.idProducto)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-700 font-bold"
                >
                  ✕
                </button>

                <img
                  src={item.imagenUrl}
                  className="w-16 h-16 rounded-lg object-cover border border-slate-300"
                />

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.nombre}</p>
                  <p className="text-xs text-slate-500">
                    Cantidad: {item.cantidad}
                  </p>
                </div>

                <span className="font-bold text-orange-600">
                  ${item.precio.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-slate-700">Total:</span>
            <span className="font-bold text-orange-600 text-lg">
              ${cart.reduce((t, i) => t + i.precio * i.cantidad, 0).toLocaleString()}
            </span>
          </div>

          <button
            onClick={goCarrito}
            className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-500 active:scale-95 transition"
          >
            Ir al carrito
          </button>
        </div>
      </aside>
    </>
  );
}