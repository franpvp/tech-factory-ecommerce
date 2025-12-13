import React, { useState, useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const COSTO_DESPACHO = 4990;

const regiones = [
  { nombre: "Región de Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
  { nombre: "Región de Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica", "Huara", "Camiña", "Colchane"] },
  { nombre: "Región de Antofagasta", comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "San Pedro de Atacama"] },
  { nombre: "Región de Atacama", comunas: ["Copiapó", "Tierra Amarilla", "Caldera", "Vallenar", "Huasco"] },
  { nombre: "Región de Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Salamanca", "Los Vilos"] },
  { nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Los Andes"] },
  { nombre: "Región Metropolitana", comunas: ["Santiago", "Maipú", "Puente Alto", "La Florida", "Las Condes", "Ñuñoa", "Providencia", "Colina", "Pudahuel", "Recoleta"] },
  { nombre: "Región de O’Higgins", comunas: ["Rancagua", "Machalí", "San Fernando", "Santa Cruz"] },
  { nombre: "Región del Maule", comunas: ["Talca", "Curicó", "Linares", "Cauquenes", "Molina"] },
  { nombre: "Región de Ñuble", comunas: ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes", "Quillón"] },
  { nombre: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Hualpén", "Coronel", "Lota", "Los Ángeles"] },
  { nombre: "Región de La Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"] },
  { nombre: "Región de Los Ríos", comunas: ["Valdivia", "La Unión", "Río Bueno", "Paillaco"] },
  { nombre: "Región de Los Lagos", comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud"] },
  { nombre: "Región de Aysén", comunas: ["Coyhaique", "Aysén", "Chile Chico"] },
  { nombre: "Región de Magallanes", comunas: ["Punta Arenas", "Puerto Natales", "Porvenir"] },
];

export default function Despacho() {
  const navigate = useNavigate();
  const { cart } = useCart();

  // Subtotal de productos
  const totalProductos = useMemo(
    () => cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
    [cart]
  );

  // Total con despacho
  const totalConEnvio = totalProductos + COSTO_DESPACHO;

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    region: "",
    ciudad: "",
    codigoPostal: "",
  });

  const [errors, setErrors] = useState({});

  const comunasDisponibles = useMemo(() => {
    const regionSeleccionada = regiones.find((r) => r.nombre === form.region);
    return regionSeleccionada ? regionSeleccionada.comunas : [];
  }, [form.region]);

  const normalizarTelefono = (value) => {
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("569")) digits = digits.slice(3);
    else if (digits.startsWith("56")) digits = digits.slice(2);

    digits = digits.slice(0, 9);

    return digits;
  };

  const guardarDespacho = () => {
    const despacho = {
      nombreDestinatario: form.nombre,
      apellidoDestinatario: form.apellido,
      telefono: form.telefono,
      direccion: form.direccion,
      region: form.region,
      ciudadComuna: form.ciudad,
      codigoPostal: form.codigoPostal || null
    };

    localStorage.setItem("despacho", JSON.stringify(despacho));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      setForm((prev) => ({ ...prev, telefono: normalizarTelefono(value) }));
      return;
    }

    if (name === "region") {
      setForm((prev) => ({ ...prev, region: value, ciudad: "" }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
    if (!form.direccion.trim()) newErrors.direccion = "La dirección es obligatoria.";

    // Teléfono: 9 dígitos empezando por 9 → 912345678
    if (!/^9\d{8}$/.test(form.telefono)) {
      newErrors.telefono =
        "Debe ser un teléfono chileno válido: 9 seguido de 8 dígitos (ej: 912345678).";
    }

    if (!form.region) newErrors.region = "Selecciona una región.";
    if (!form.ciudad) newErrors.ciudad = "Selecciona una ciudad/comuna.";

    // Código postal opcional
    if (form.codigoPostal.trim() && !/^\d{5,7}$/.test(form.codigoPostal)) {
      newErrors.codigoPostal = "Si ingresas código postal, debe tener entre 5 y 7 números.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const continuar = () => {
    if (!validate()) return;

    guardarDespacho();
    navigate("/pago");
  };
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="pt-[90px] pb-16 max-w-5xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          Información de Despacho
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl border border-slate-200 p-8 rounded-2xl w-full animate-fadeIn">
              <div className="space-y-4">
                {/* NOMBRE */}
                <div>
                  <label className="text-sm font-medium text-slate-700">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className={`w-full mt-1 p-3 border rounded-xl ${
                      errors.nombre ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.nombre && (
                    <p className="text-red-500 text-sm">{errors.nombre}</p>
                  )}
                </div>

                {/* APELLIDO */}
                <div>
                  <label className="text-sm font-medium text-slate-700">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    className={`w-full mt-1 p-3 border rounded-xl ${
                      errors.apellido ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.apellido && (
                    <p className="text-red-500 text-sm">{errors.apellido}</p>
                  )}
                </div>

                {/* TELÉFONO */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Teléfono (Chile){" "}
                    <span className="text-xs text-slate-500">(ej: 912345678)</span>
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="912345678"
                    className={`w-full mt-1 p-3 border rounded-xl ${
                      errors.telefono ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.telefono && (
                    <p className="text-red-500 text-sm">{errors.telefono}</p>
                  )}
                </div>

                {/* DIRECCIÓN */}
                <div>
                  <label className="text-sm font-medium text-slate-700">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Calle, número, depto..."
                    className={`w-full mt-1 p-3 border rounded-xl ${
                      errors.direccion ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.direccion && (
                    <p className="text-red-500 text-sm">{errors.direccion}</p>
                  )}
                </div>

                {/* REGIÓN */}
                <div>
                  <label className="text-sm font-medium text-slate-700">Región</label>
                  <select
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    className={`w-full mt-1 p-3 border rounded-xl ${
                      errors.region ? "border-red-500" : "border-slate-300"
                    }`}
                  >
                    <option value="">Selecciona una región</option>
                    {regiones.map((r) => (
                      <option key={r.nombre} value={r.nombre}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.region && (
                    <p className="text-red-500 text-sm">{errors.region}</p>
                  )}
                </div>

                {/* CIUDAD / COMUNA */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Ciudad / Comuna
                  </label>
                  <select
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    disabled={!form.region}
                    className={`w-full mt-1 p-3 border rounded-xl ${
                      errors.ciudad ? "border-red-500" : "border-slate-300"
                    } ${!form.region ? "bg-slate-100 cursor-not-allowed" : ""}`}
                  >
                    <option value="">
                      {form.region
                        ? "Selecciona una ciudad/comuna"
                        : "Primero selecciona una región"}
                    </option>
                    {comunasDisponibles.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.ciudad && (
                    <p className="text-red-500 text-sm">{errors.ciudad}</p>
                  )}
                </div>

                {/* CÓDIGO POSTAL (opcional) */}
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Código Postal (opcional)
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={form.codigoPostal}
                    onChange={handleChange}
                    className={`w-full mt-1 p-3 border rounded-xl ${
                      errors.codigoPostal ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  {errors.codigoPostal && (
                    <p className="text-red-500 text-sm">
                      {errors.codigoPostal}
                    </p>
                  )}
                </div>
              </div>

              {/* BOTONES */}
              <button
                onClick={continuar}
                data-testid='continue-pay-btn'
                className="mt-6 w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-semibold active:scale-95 transition"
              >
                Continuar al Pago
              </button>

              <button
                onClick={() => navigate("/carrito")}
                className="w-full text-center mt-4 text-sm text-slate-600 hover:text-orange-600 transition"
              >
                ← Volver al carrito
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: RESUMEN DE COMPRA */}
          <div className="bg-white rounded-3xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>

            <div className="text-sm">
              <div className="flex justify-between mb-3">
                <span>Productos:</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Subtotal productos:</span>
                <span>${totalProductos.toLocaleString()}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Despacho:</span>
                <span className="text-slate-800 font-semibold">
                  ${COSTO_DESPACHO.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
                <span>Total a pagar:</span>
                <span className="text-orange-600">
                  ${totalConEnvio.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}