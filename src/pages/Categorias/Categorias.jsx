import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import './Categorias.css';


const categorias = [
  { slug: "tarjetas-video", nombre: "Tarjetas de Video (AMD / NVIDIA)" },
  { slug: "procesadores", nombre: "Procesadores" },
  { slug: "almacenamiento", nombre: "Almacenamiento (SSD / NVMe)" },
  { slug: "fuentes-poder", nombre: "Fuentes de Poder" },
  { slug: "placas-madre", nombre: "Placas Madre" },
  { slug: "refrigeracion", nombre: "Refrigeración" },
];

export default function Categorias() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="pt-[90px] max-w-5xl mx-auto px-4 pb-16">
        <h1 className="text-2xl font-bold mb-6">Categorías de productos</h1>

        <div className="grid gap-4">
          {categorias.map((c) => (
            <button
              key={c.slug}
              onClick={() => navigate(`/categorias/${c.slug}`)}
              className="bg-white p-4 text-left rounded-xl border border-slate-200 shadow hover:bg-slate-50 transition flex justify-between items-center"
            >
              <span className="font-medium">{c.nombre}</span>
              <span className="text-orange-600 font-bold">&gt;</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}