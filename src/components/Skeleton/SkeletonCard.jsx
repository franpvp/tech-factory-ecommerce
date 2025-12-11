const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 animate-pulse">
    {/* Imagen */}
    <div className="h-40 bg-slate-200 rounded-xl mb-4"></div>

    {/* Título */}
    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>

    {/* Descripción */}
    <div className="h-3 bg-slate-200 rounded w-full mb-1"></div>
    <div className="h-3 bg-slate-200 rounded w-5/6 mb-4"></div>

    {/* Precio + botón */}
    <div className="flex justify-between items-center mt-auto">
      <div className="h-4 bg-slate-300 rounded w-16"></div>
      <div className="h-6 bg-slate-300 rounded-full w-20"></div>
    </div>
  </div>
);

export default SkeletonCard;