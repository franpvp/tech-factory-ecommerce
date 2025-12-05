import React from "react";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";

import { exportarTodos, exportarFila } from "../../utils/exportar";

import './TablaReintentos.css';

// Helpers
function formatDateISOorLocal(v) {
  if (!v) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(v))) return v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? String(v) : d.toLocaleString();
}
ß
const canalBadgeClass = (canal) => {
  switch (canal) {
    case "BANCO":
      return "badge--info";
    case "DATATEC":
      return "badge--success";
    case "INTEGRAL":
      return "badge--warning";
    case "PTO.VENTA":
      return "badge--neutral";
    default:
      return "badge--neutral";
  }
};

export default function TablaTradesDashboard({
  endpoint = "http://localhost:8081/api/reintentos",
}) {
  const [filters, setFilters] = React.useState({
    idTrade: "",
    canal: "",
    fechaDesde: "",
    fechaHasta: "",
  });

  const [rows, setRows] = React.useState([]);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const [selected, setSelected] = React.useState(new Set());

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setErr(null);

      const qs = new URLSearchParams();
      if (filters.idTrade) qs.set("idTrade", filters.idTrade);
      if (filters.canal) qs.set("canal", filters.canal);
      if (filters.fechaDesde) qs.set("fechaDesde", filters.fechaDesde);
      if (filters.fechaHasta) qs.set("fechaHasta", filters.fechaHasta);

      const res = await fetch(`${endpoint}?${qs.toString()}`);
      if (!res.ok) throw new Error("Error HTTP " + res.status);

      const json = await res.json();
      setRows(json.content || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = () => {
    setHasSearched(true);
    fetchTrades();
  };

  const clearFilters = () => {
    setFilters({ idTrade: "", canal: "", fechaDesde: "", fechaHasta: "" });
    setHasSearched(false);
    setRows([]);
    setSelected(new Set());
  };

  return (
    <section className="card card--table">
      {/* HEADER */}
      <header className="card-header card-header--with-action">
        <h2 className="card-title">Trades</h2>

        <div className="table-filters">
          {/* limpia filtros */}
          <button className="chip chip--filter" onClick={clearFilters}>
            <ClearAllIcon fontSize="small" />
            Limpiar
          </button>

          {/* Buscar */}
          <button
            className="chip chip--filter chip--filter-active"
            onClick={onSearch}
          >
            <SearchIcon fontSize="small" />
            Buscar
          </button>

          {/* Refrescar */}
          <button
            className="chip chip--filter"
            onClick={fetchTrades}
            disabled={!hasSearched}
          >
            <RefreshIcon fontSize="small" />
            Refrescar
          </button>

          {/* Exportar todos */}
          <button
            className="chip chip--filter"
            onClick={() => exportarTodos(rows)}
            disabled={rows.length === 0}
          >
            <DownloadIcon fontSize="small" />
            Exportar
          </button>
        </div>
      </header>

      {/* FILTROS */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="ID Trade"
          value={filters.idTrade}
          onChange={(e) =>
            setFilters((f) => ({ ...f, idTrade: e.target.value }))
          }
        />

        <select
          value={filters.canal}
          onChange={(e) =>
            setFilters((f) => ({ ...f, canal: e.target.value }))
          }
        >
          <option value="">Todos los canales</option>
          <option value="BANCO">BANCO</option>
          <option value="DATATEC">DATATEC</option>
          <option value="INTEGRAL">INTEGRAL</option>
          <option value="PTO.VENTA">PTO.VENTA</option>
        </select>

        <input
          type="date"
          value={filters.fechaDesde}
          onChange={(e) =>
            setFilters((f) => ({ ...f, fechaDesde: e.target.value }))
          }
        />

        <input
          type="date"
          value={filters.fechaHasta}
          onChange={(e) =>
            setFilters((f) => ({ ...f, fechaHasta: e.target.value }))
          }
        />
      </div>

      {/* TABLA */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>ID Trade</th>
              <th>Monto</th>
              <th>Canal</th>
              <th>Fecha</th>
              <th>ID Cliente</th>
              <th className="col-action">Acción</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  Cargando...
                </td>
              </tr>
            )}

            {!loading && err && (
              <tr>
                <td colSpan="7" className="error">
                  {err}
                </td>
              </tr>
            )}

            {!loading && rows.length === 0 && hasSearched && (
              <tr>
                <td colSpan="7" className="empty">
                  Sin resultados
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((r) => (
                <tr key={r.idTrade}>
                  {/* checkbox selección */}
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(r.idTrade)}
                      onChange={() => toggleSelect(r.idTrade)}
                    />
                  </td>

                  <td>{r.idTrade}</td>
                  <td>{r.monto?.toLocaleString() ?? "-"}</td>

                  <td>
                    <span className={`badge ${canalBadgeClass(r.canal)}`}>
                      {r.canal}
                    </span>
                  </td>

                  <td>{formatDateISOorLocal(r.fechaCreacion)}</td>

                  <td>{r.idCliente ?? "-"}</td>

                  <td className="col-action">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => exportarFila(r)}
                    >
                      Exportar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <footer className="table-footer">
        <span>Mostrando {rows.length} resultados</span>
      </footer>
    </section>
  );
}