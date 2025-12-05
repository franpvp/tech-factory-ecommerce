import React from "react";
import Navbar from "../../components/Navbar/Navbar";

import {
  ShieldCheckIcon,
  GiftIcon,
  TruckIcon,
  SparklesIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function BeneficiosPremium() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENIDO */}
      <div className="max-w-5xl mx-auto pt-[100px] mb-20 px-4">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Beneficios de ser <span className="text-orange-600">Premium</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
            Una suscripción diseñada para quienes buscan comodidad, exclusividad
            y una experiencia superior en cada compra.
          </p>
        </div>

        {/* GRID DE BENEFICIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BENEFICIO 1 */}
          <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-200 flex gap-4 items-start">
            <SparklesIcon className="w-10 h-10 text-orange-600" />
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                Acceso anticipado a ofertas
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Entra antes que todos a las mejores promociones del año.
              </p>
            </div>
          </div>

          {/* BENEFICIO 2 */}
          <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-200 flex gap-4 items-start">
            <GiftIcon className="w-10 h-10 text-orange-600" />
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                Descuentos exclusivos
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Ahorros especiales solo para suscriptores Premium.
              </p>
            </div>
          </div>

          {/* BENEFICIO 3 */}
          <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-200 flex gap-4 items-start">
            <TruckIcon className="w-10 h-10 text-orange-600" />
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                Despacho prioritario
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Tu pedido saldrá más rápido y tendrá prioridad en el envío.
              </p>
            </div>
          </div>

          {/* BENEFICIO 4 */}
          <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-200 flex gap-4 items-start">
            <ChatBubbleOvalLeftEllipsisIcon className="w-10 h-10 text-orange-600" />
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                Soporte técnico prioritario
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Atención preferencial en caso de consultas o problemas.
              </p>
            </div>
          </div>

          {/* BENEFICIO 5 */}
          <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-200 flex gap-4 items-start">
            <ClockIcon className="w-10 h-10 text-orange-600" />
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                Extensión de garantía
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Disfruta de más tiempo de protección en tus compras.
              </p>
            </div>
          </div>

          {/* BENEFICIO 6 */}
          <div className="p-6 bg-white rounded-3xl shadow-xl border border-slate-200 flex gap-4 items-start">
            <ShieldCheckIcon className="w-10 h-10 text-orange-600" />
            <div>
              <h3 className="font-semibold text-lg text-slate-900">
                Protección avanzada de compras
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Reemplazo o reembolso inmediato ante fallas o extravíos.
              </p>
            </div>
          </div>
        </div>

        {/* COMPARATIVO PLANES */}
        <div className="mt-14 bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Comparación de planes
          </h3>

          <div className="grid grid-cols-3 text-sm font-medium text-slate-700">
            <div></div>
            <div className="text-center font-bold text-slate-900">Gratis</div>
            <div className="text-center font-bold text-orange-600">Premium</div>
          </div>

          {[
            ["Acceso a catálogo completo", true, true],
            ["Ofertas exclusivas", false, true],
            ["Envío prioritario", false, true],
            ["Soporte preferencial", false, true],
            ["Acceso anticipado a eventos", false, true],
            ["Garantía extendida", false, true],
            ["Reembolsos acelerados", false, true],
          ].map(([label, free, premium], index) => (
            <div
              key={index}
              className="grid grid-cols-3 py-3 border-t border-slate-200 text-sm"
            >
              <div className="text-slate-700">{label}</div>

              <div className="flex justify-center">
                {free ? (
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </div>

              <div className="flex justify-center">
                {premium ? (
                  <CheckCircleIcon className="w-5 h-5 text-orange-600" />
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-orange-600 text-white rounded-2xl text-lg font-semibold shadow-md hover:bg-orange-500 active:scale-95 transition">
            Obtener Premium ahora
          </button>

          <p className="mt-3 text-xs text-slate-500">
            Cancela cuando quieras · Sin contratos · Beneficios inmediatos
          </p>
        </div>
      </div>
    </div>
  );
}