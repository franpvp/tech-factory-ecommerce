import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);

  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    telefono: "",
    direccion: "",
    ciudad: "",
  });

  // MODAL CREACIÓN
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    rol: "USER",
  });

  const [errors, setErrors] = useState({});

  // DATOS TEMPORALES
  useEffect(() => {
    setUsuarios([
      {
        id: 1,
        idUsuario: 101,
        nombre: "Francisca",
        apellido: "Valdivia",
        email: "fran@empresa.com",
        telefono: "987654321",
        direccion: "Av. Siempre Viva 123",
        ciudad: "Santiago",
        fechaRegistro: "2024-12-01",
        rol: "ADMIN",
      },
      {
        id: 2,
        idUsuario: 102,
        nombre: "Juan",
        apellido: "Perez",
        email: "juan@empresa.com",
        telefono: "945612378",
        direccion: "Calle Central 456",
        ciudad: "Valparaíso",
        fechaRegistro: "2024-12-02",
        rol: "USER",
      },
    ]);
  }, []);

  // VALIDACIÓN POR CAMPO
  const validateField = (name, value) => {
    let msg = "";

    if (name === "nombre" && value.trim() === "")
      msg = "El nombre es obligatorio.";

    if (name === "apellido" && value.trim() === "")
      msg = "El apellido es obligatorio.";

    if (name === "email") {
      if (!value.trim()) msg = "El email es obligatorio.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        msg = "El email no es válido.";
    }

    if (name === "telefono") {
      if (value && !/^[0-9]+$/.test(value)) msg = "Solo permite números.";
    }

    if (name === "direccion" && value.length > 0 && value.length < 5)
      msg = "La dirección debe tener al menos 5 caracteres.";

    if (name === "ciudad" && value.trim() === "")
      msg = "La ciudad es obligatoria.";

    return msg;
  };

  // HANDLE CHANGE — valida en tiempo real
  const handleCreateChange = (e) => {
    const { name, value } = e.target;

    setCreateForm({
      ...createForm,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  // CREAR USUARIO
  const crearUsuario = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(createForm).forEach((key) => {
      const error = validateField(key, createForm[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const nuevoId =
      usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;

    const nuevoUsuario = {
      id: nuevoId,
      idUsuario: 100 + nuevoId,
      nombre: createForm.nombre,
      apellido: createForm.apellido,
      email: createForm.email,
      telefono: createForm.telefono,
      direccion: createForm.direccion,
      ciudad: createForm.ciudad,
      rol: createForm.rol,
      fechaRegistro: new Date().toISOString().slice(0, 10),
    };

    setUsuarios((prev) => [...prev, nuevoUsuario]);

    // Reset
    setCreateForm({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      rol: "USER",
    });

    setErrors({});
    setCreateOpen(false);
  };

  // EDICIÓN
  const comenzarEdicion = (u) => {
    setEditUserId(u.id);
    setEditForm({
      telefono: u.telefono,
      direccion: u.direccion,
      ciudad: u.ciudad,
    });
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const guardarCambios = () => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === editUserId
          ? {
              ...u,
              telefono: editForm.telefono,
              direccion: editForm.direccion,
              ciudad: editForm.ciudad,
            }
          : u
      )
    );
    setEditUserId(null);
  };

  const cancelarEdicion = () => setEditUserId(null);

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Gestión de Usuarios
        </h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-orange-500 active:scale-95 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="text-slate-800 border-b bg-slate-100/80">
              <th className="py-3 px-2 font-semibold text-sm">ID</th>
              <th className="py-3 px-2 font-semibold text-sm">ID Usuario</th>
              <th className="py-3 px-2 font-semibold text-sm">Nombre</th>
              <th className="py-3 px-2 font-semibold text-sm">Apellido</th>
              <th className="py-3 px-2 font-semibold text-sm">Email</th>
              <th className="py-3 px-2 font-semibold text-sm">Teléfono</th>
              <th className="py-3 px-2 font-semibold text-sm">Dirección</th>
              <th className="py-3 px-2 font-semibold text-sm">Ciudad</th>
              <th className="py-3 px-2 font-semibold text-sm">Fecha Registro</th>
              <th className="py-3 px-2 font-semibold text-sm text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-slate-900">
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b hover:bg-slate-50 transition">
                <td className="py-4 px-2 text-sm">{u.id}</td>
                <td className="px-2 text-sm">{u.idUsuario}</td>
                <td className="px-2 text-sm font-medium">{u.nombre}</td>
                <td className="px-2 text-sm">{u.apellido}</td>
                <td className="px-2 text-sm">{u.email}</td>

                {/* EDICIÓN */}
                <td className="px-2 text-sm">
                  {editUserId === u.id ? (
                    <input
                      type="text"
                      name="telefono"
                      value={editForm.telefono}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  ) : (
                    u.telefono
                  )}
                </td>

                <td className="px-2 text-sm">
                  {editUserId === u.id ? (
                    <input
                      type="text"
                      name="direccion"
                      value={editForm.direccion}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  ) : (
                    u.direccion
                  )}
                </td>

                <td className="px-2 text-sm">
                  {editUserId === u.id ? (
                    <input
                      type="text"
                      name="ciudad"
                      value={editForm.ciudad}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  ) : (
                    u.ciudad
                  )}
                </td>

                <td className="px-2 text-sm">{u.fechaRegistro}</td>

                <td className="px-2 text-center">
                  {editUserId === u.id ? (
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={guardarCambios}
                        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                        title="Guardar cambios"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>

                      <button
                        onClick={cancelarEdicion}
                        className="p-2 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition"
                        title="Cancelar edición"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => comenzarEdicion(u)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                      title="Editar usuario"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 relative text-slate-900">
            <button
              onClick={() => setCreateOpen(false)}
              className="absolute top-3 right-3 text-slate-600 hover:text-slate-800 font-bold text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Crear nuevo usuario
            </h2>

            <form className="space-y-4" onSubmit={crearUsuario}>
              {/* NOMBRE + APELLIDO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={createForm.nombre}
                    onChange={handleCreateChange}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none 
                      ${errors.nombre ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-orange-500"}`}
                  />
                  {errors.nombre && (
                    <p className="text-red-600 text-xs mt-1">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={createForm.apellido}
                    onChange={handleCreateChange}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none 
                      ${errors.apellido ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-orange-500"}`}
                  />
                  {errors.apellido && (
                    <p className="text-red-600 text-xs mt-1">{errors.apellido}</p>
                  )}
                </div>

              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={createForm.email}
                  onChange={handleCreateChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none 
                    ${errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-orange-500"}`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* TELÉFONO + CIUDAD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={createForm.telefono}
                    onChange={handleCreateChange}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none 
                      ${errors.telefono ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-orange-500"}`}
                  />
                  {errors.telefono && (
                    <p className="text-red-600 text-xs mt-1">{errors.telefono}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="ciudad"
                    value={createForm.ciudad}
                    onChange={handleCreateChange}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none 
                      ${errors.ciudad ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-orange-500"}`}
                  />
                  {errors.ciudad && (
                    <p className="text-red-600 text-xs mt-1">{errors.ciudad}</p>
                  )}
                </div>

              </div>

              {/* DIRECCIÓN */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={createForm.direccion}
                  onChange={handleCreateChange}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none 
                    ${errors.direccion ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-orange-500"}`}
                />
                {errors.direccion && (
                  <p className="text-red-600 text-xs mt-1">{errors.direccion}</p>
                )}
              </div>

              {/* ROL */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Rol
                </label>
                <select
                  name="rol"
                  value={createForm.rol}
                  onChange={handleCreateChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm border-slate-300 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="VENDEDOR">VENDEDOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {/* BOTONES */}
              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-400 text-slate-800 text-sm hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-500 active:scale-95"
                >
                  Guardar usuario
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}