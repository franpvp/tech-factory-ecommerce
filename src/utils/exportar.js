// src/utils/exportar.js
import * as XLSX from 'xlsx';

// Mapea una fila normalizada del front a columnas de Excel
const mapRow = (r) => ({
  ID_TRADE: r.idTrade ?? '',
  MONTO: r.monto ?? '',
  CANAL: r.canal ?? '',
  FECHA_CREACION: r.fechaCreacion ?? '',
  ID_CLIENTE: r.idCliente ?? '',
});

function writeXlsx(rowsMapped, sheetName = 'Trades', filename = 'trades.xlsx') {
  const ws = XLSX.utils.json_to_sheet(rowsMapped);
  ws['!cols'] = [
    { wch: 12 }, // ID_TRADE
    { wch: 14 }, // MONTO
    { wch: 12 }, // CANAL
    { wch: 18 }, // FECHA_CREACION
    { wch: 12 }, // ID_CLIENTE
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

export function exportarFilas(rows, filename = 'trades.xlsx') {
  const mapped = rows.map(mapRow);
  writeXlsx(mapped, 'Trades', filename);
}

export function exportarSeleccionados(rows, selectedIds, filename = 'trades_seleccionados.xlsx') {
  const isSet = selectedIds instanceof Set;
  const filtered = rows.filter((r) =>
    isSet ? selectedIds.has(r.idTrade) : selectedIds.includes(r.idTrade)
  );
  exportarFilas(filtered, filename);
}

export function exportarTodos(rows, filename = 'trades_resultado.xlsx') {
  exportarFilas(rows, filename);
}

export function exportarFila(row, filenamePrefix = 'trade_') {
  exportarFilas([row], `${filenamePrefix}${row?.idTrade ?? 'sin_id'}.xlsx`);
}