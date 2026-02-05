
import React, { useState, useMemo } from 'react';
import { ICONS } from '../constants';
import { Sale } from '../types';

interface ReportsViewProps {
  sales: Sale[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ sales }) => {
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.toISOString().slice(0, 16);
  });

  const filteredSales = useMemo(() => {
    const start = new Date(fromDate).getTime();
    const end = new Date(toDate).getTime();
    return sales.filter(s => {
      const time = new Date(s.timestamp).getTime();
      return time >= start && time <= end;
    });
  }, [sales, fromDate, toDate]);

  const stats = useMemo(() => {
    const total = filteredSales.reduce((acc, s) => acc + s.total, 0);
    const cash = filteredSales.filter(s => s.paymentMethod === 'CASH').reduce((acc, s) => acc + s.total, 0);
    const card = filteredSales.filter(s => s.paymentMethod === 'CARD').reduce((acc, s) => acc + s.total, 0);
    const transfer = filteredSales.filter(s => s.paymentMethod === 'TRANSFER').reduce((acc, s) => acc + s.total, 0);
    
    let totalItems = 0;
    filteredSales.forEach(s => s.items.forEach(i => totalItems += i.quantity));

    return { total, cash, card, transfer, totalItems, count: filteredSales.length };
  }, [filteredSales]);

  const downloadCSV = () => {
    const headers = ['ID', 'Fecha', 'Cliente', 'Items', 'Total', 'Metodo Pago'];
    const rows = filteredSales.map(s => [
      s.id,
      new Date(s.timestamp).toLocaleString(),
      s.clientId,
      s.items.map(i => `${i.quantity}x ${i.name}`).join(' | '),
      s.total,
      s.paymentMethod
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_MG_${fromDate}_al_${toDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 no-print">
        <div>
          <h2 className="text-4xl font-black text-[#C5A059] tracking-tighter uppercase leading-none">Reportes</h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Análisis de Desempeño y Ventas</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()}
            className="bg-black border border-[#C5A059]/30 text-[#C5A059] px-8 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2 hover:bg-[#C5A059]/10 transition-all text-xs uppercase"
          >
            {ICONS.Print} Imprimir
          </button>
          <button 
            onClick={downloadCSV}
            className="bg-[#C5A059] text-black px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#C5A059]/10 flex items-center gap-2 hover:bg-[#E2C284] transition-all transform active:scale-95 text-xs uppercase"
          >
            {ICONS.Download} Bajar Excel (CSV)
          </button>
        </div>
      </header>

      <section className="bg-[#111111] p-8 rounded-[2.5rem] border border-[#C5A059]/10 no-print">
        <h3 className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em] mb-6 ml-2">Seleccionar Periodo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Desde (Fecha y Hora)</label>
            <input 
              type="datetime-local" 
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl outline-none font-bold text-white focus:border-[#C5A059] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Hasta (Fecha y Hora)</label>
            <input 
              type="datetime-local" 
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl outline-none font-bold text-white focus:border-[#C5A059] transition-all"
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] p-8 rounded-[2rem] border border-[#C5A059]/10 text-center">
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Facturado</p>
          <h4 className="text-2xl font-black text-[#C5A059] tracking-tighter">${stats.total.toLocaleString()}</h4>
        </div>
        <div className="bg-[#1A1A1A] p-8 rounded-[2rem] border border-[#C5A059]/10 text-center">
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Ventas Realizadas</p>
          <h4 className="text-2xl font-black text-white tracking-tighter">{stats.count}</h4>
        </div>
        <div className="bg-[#1A1A1A] p-8 rounded-[2rem] border border-[#C5A059]/10 text-center">
          <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Items Vendidos</p>
          <h4 className="text-2xl font-black text-white tracking-tighter">{stats.totalItems}</h4>
        </div>
        <div className="bg-[#C5A059] p-8 rounded-[2rem] text-black text-center shadow-lg shadow-[#C5A059]/20">
          <p className="text-black/50 text-[9px] font-black uppercase tracking-widest mb-1">Ticket Promedio</p>
          <h4 className="text-2xl font-black tracking-tighter">${stats.count > 0 ? (stats.total / stats.count).toFixed(0) : 0}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl">
          <p className="text-emerald-500 font-black uppercase text-[9px] tracking-widest mb-2">Efectivo</p>
          <h5 className="text-xl font-black text-white">${stats.cash.toLocaleString()}</h5>
        </div>
        <div className="bg-sky-500/5 border border-sky-500/10 p-6 rounded-3xl">
          <p className="text-sky-500 font-black uppercase text-[9px] tracking-widest mb-2">Tarjeta</p>
          <h5 className="text-xl font-black text-white">${stats.card.toLocaleString()}</h5>
        </div>
        <div className="bg-purple-500/5 border border-purple-500/10 p-6 rounded-3xl">
          <p className="text-purple-500 font-black uppercase text-[9px] tracking-widest mb-2">Transferencia</p>
          <h5 className="text-xl font-black text-white">${stats.transfer.toLocaleString()}</h5>
        </div>
      </div>

      <div className="bg-[#111111] rounded-[2.5rem] border border-[#C5A059]/10 overflow-hidden shadow-2xl">
        <div className="px-10 py-6 bg-black/40 border-b border-[#C5A059]/10 flex items-center justify-between">
          <h4 className="text-xs font-black text-white uppercase tracking-widest">Detalle de Operaciones en el Periodo</h4>
          <span className="text-[10px] text-gray-500 font-bold">{filteredSales.length} registros encontrados</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20">
              <tr>
                <th className="px-8 py-5 text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Fecha/Hora</th>
                <th className="px-8 py-5 text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Cliente</th>
                <th className="px-8 py-5 text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Items</th>
                <th className="px-8 py-5 text-[9px] font-black text-[#C5A059] uppercase tracking-widest text-right">Monto</th>
                <th className="px-8 py-5 text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/5">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-700 font-black uppercase text-[10px] tracking-[0.2em]">No hay ventas registradas en este periodo</td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#1A1A1A] transition-colors group">
                    <td className="px-8 py-5 text-gray-400 font-bold text-xs">
                      {new Date(sale.timestamp).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-8 py-5 font-black text-white uppercase text-xs tracking-tight">{sale.clientId}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        {sale.items.map((item, idx) => (
                          <span key={idx} className="text-[9px] text-gray-500 font-bold uppercase truncate max-w-[200px]">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-emerald-500 font-black text-sm">${sale.total.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-black border border-white/5 rounded-full text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                        {sale.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer solo para impresion */}
      <div className="print-only fixed bottom-0 left-0 w-full text-center border-t border-black pt-4">
        <p className="text-[10px] font-black">MG CONTROL - REPORTE DE GESTIÓN INTERNA</p>
        <p className="text-[8px] uppercase">Emitido el {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ReportsView;
