import { useEffect, useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { msalInstance } from "../../../auth/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import ObtenerClientesService from "../../../services/ObtenerClientesService";
import { useAuth } from "../../../context/AuthContext";

export default function AdminUsuarios() {
  const endpointUsuarios = import.meta.env.VITE_SERVICE_ENDPOINT_BFF_OBTENER_CLIENTES;
  const { refetchRol } = useAuth();

  const obtenerToken = async () => {
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) return null;

      try {
        const response = await msalInstance.acquireTokenSilent({
          scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
          account: accounts[0],
        });
        return response.accessToken;
      } catch (silentError) {
        if (silentError instanceof InteractionRequiredAuthError) {
          const popupResponse = await msalInstance.acquireTokenPopup({
            scopes: ["api://967bfb43-f7a4-47db-8502-588b15908297/access"],
          });
          return popupResponse.accessToken;
        }
        throw silentError;
      }
    } catch (err) {
      return null;
    }
  };

  // ==========================================================
  // ESTADO
  // ==========================================================
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    rol: "CLIENTE",
  });

  // ==========================================================
  // CARGA INICIAL
  // ==========================================================
  useEffect(() => {
    const load = async () => {
      const data = await ObtenerClientesService();

      const parsed = data.map((c) => ({
        id: c.id,
        idUsuario: c.usuario?.id ?? "-",
        nombre: c.nombre,
        apellido: c.apellido,
        email: c.usuario?.email ?? "-",
        telefono: c.telefono ?? "-",
        direccion: c.direccion ?? "-",
        ciudad: c.ciudad ?? "-",
        fechaRegistro: (c.fechaRegistro || "").slice(0, 10),
        rol: c.usuario?.tipoUsuarioDTO?.nombreTipo ?? "CLIENTE",
      }));

      setUsuarios(parsed);
    };

    load();
  }, []);

  // ==========================================================
  // EDITAR
  // ==========================================================
  const startEdit = (u) => {
    setEditId(u.id);
    setEditForm({
      nombre: u.nombre,
      apellido: u.apellido,
      telefono: u.telefono,
      direccion: u.direccion,
      ciudad: u.ciudad,
      rol: u.rol,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    const token = await obtenerToken();
    if (!token) return alert("Debe iniciar sesión");

    // 1️⃣ Actualizar datos del cliente
    const clientePayload = {
      nombre: editForm.nombre,
      apellido: editForm.apellido,
      telefono: editForm.telefono,
      direccion: editForm.direccion,
      ciudad: editForm.ciudad,
    };

    const resCliente = await fetch(`${endpointUsuarios}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientePayload),
    });

    if (!resCliente.ok) {
      return alert("Error actualizando cliente");
    }

    // 2️⃣ Actualizar rol
    const resRol = await fetch(`${endpointUsuarios}/${id}/rol`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rol: editForm.rol }),
    });

    if (!resRol.ok) {
      return alert("Error actualizando rol");
    }

    // 3️⃣ Refrescar UI
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, ...clientePayload, rol: editForm.rol }
          : u
      )
    );

    // 🔥 CLAVE: refrescar rol global
    await refetchRol();

    setEditId(null);
  };

  // ==========================================================
  // ELIMINAR
  // ==========================================================
  const deleteUser = async (id) => {
    const token = await obtenerToken();
    if (!token) return;

    if (!confirm("¿Eliminar usuario?")) return;

    await fetch(`${endpointUsuarios}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  // ==========================================================
  // UI
  // ==========================================================
  return (
    <div className="text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>

      <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              {["ID", "Nombre", "Apellido", "Email", "Rol", "Acciones"].map(h => (
                <th key={h} className="px-3 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => {
              const editing = editId === u.id;

              return (
                <tr key={u.id} className="border-b">
                  <td className="px-3 py-2">{u.id}</td>
                  <td className="px-3">
                    {editing ? (
                      <input name="nombre" value={editForm.nombre} onChange={handleEditChange} className="border rounded px-2 py-1" />
                    ) : u.nombre}
                  </td>
                  <td className="px-3">
                    {editing ? (
                      <input name="apellido" value={editForm.apellido} onChange={handleEditChange} className="border rounded px-2 py-1" />
                    ) : u.apellido}
                  </td>
                  <td className="px-3">{u.email}</td>

                  <td className="px-3">
                    {editing ? (
                      <select name="rol" value={editForm.rol} onChange={handleEditChange} className="border rounded px-2 py-1">
                        <option value="CLIENTE">CLIENTE</option>
                        <option value="VENDEDOR">VENDEDOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      <span className="font-semibold">{u.rol}</span>
                    )}
                  </td>

                  <td className="px-3 text-right space-x-2">
                    {!editing ? (
                      <>
                        <button onClick={() => startEdit(u)}><PencilSquareIcon className="w-5 h-5" /></button>
                        <button onClick={() => deleteUser(u.id)}><TrashIcon className="w-5 h-5 text-red-600" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => saveEdit(u.id)}><CheckIcon className="w-5 h-5 text-green-600" /></button>
                        <button onClick={() => setEditId(null)}><XMarkIcon className="w-5 h-5" /></button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}