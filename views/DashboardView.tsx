
import React, { useState } from 'react';
import { CajaSession } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  caja: CajaSession;
  openCaja: (amount: number) => void;
  closeCaja: () => void;
}

const DashboardView: React.FC<DashboardProps> = ({ caja, openCaja, closeCaja }) => {
  const [showCajaModal, setShowCajaModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPortableGuide, setShowPortableGuide] = useState(false);
  const [openAmount, setOpenAmount] = useState(0);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const exportData = () => {
    const data = {
      products: localStorage.getItem('mg_products'),
      services: localStorage.getItem('mg_services'),
      sales: localStorage.getItem('mg_all_sales'),
      users: localStorage.getItem('mg_users'),
      config: localStorage.getItem('mg_ticket_config'),
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RESPALDO_MG_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('ATENCIÓN: Se reemplazarán todos los datos por el respaldo. ¿Continuar?')) {
          if (data.products) localStorage.setItem('mg_products', data.products);
          if (data.services) localStorage.setItem('mg_services', data.services);
          if (data.sales) localStorage.setItem('mg_all_sales', data.sales);
          if (data.users) localStorage.setItem('mg_users', data.users);
          if (data.config) localStorage.setItem('mg_ticket_config', data.config);
          window.location.reload();
        }
      } catch (err) {
        alert('Error: Archivo no válido.');
      }
    };
    reader.readAsText(file);
  };

  const downloadLauncher = () => {
    const currentUrl = window.location.href;
    const batContent = `@echo off
title MG CONTROL - Cargando...
echo Iniciando sistema MG CONTROL en modo independiente...

:: Intentar abrir con Microsoft Edge en modo APP
start msedge --app="${currentUrl}" --window-size=1280,800

:: Si no existe Edge, intentar con Chrome
if %errorlevel% neq 0 (
    start chrome --app="${currentUrl}" --window-size=1280,800
)

exit`;

    const blob = new Blob([batContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Abrir_MG_CONTROL.bat';
    link.click();
  };

  const cashSales = caja.sessionSales.filter(s => s.paymentMethod === 'CASH').reduce((acc, s) => acc + (s.total - (s.deposit || 0)), 0);

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black text-[#C5A059] tracking-tighter leading-none mb-2">MG CONTROL</h2>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.5em]">Gestión Profesional de Estética</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={downloadLauncher}
            className="px-6 py-4 bg-[#C5A059] text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-xl shadow-[#C5A059]/10"
          >
            {ICONS.Download} Descargar App de Escritorio
          </button>
          <button 
            onClick={toggleFullScreen}
            className="p-4 bg-[#1A1A1A] border border-[#C5A059]/20 rounded-2xl text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111111] p-10 rounded-[3rem] border border-[#C5A059]/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <div className="scale-[4]">{ICONS.Trending}</div>
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Ventas del Turno</p>
            <h4 className="text-5xl font-black text-white tracking-tighter">${caja.totalSales.toLocaleString()}</h4>
            <div className="mt-8 flex items-center gap-4">
               {caja.isOpen ? (
                 <button onClick={() => setShowReportModal(true)} className="bg-rose-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-rose-500/20">Cerrar Caja</button>
               ) : (
                 <button onClick={() => setShowCajaModal(true)} className="bg-[#C5A059] text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase">Abrir Caja</button>
               )}
               <div className="flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${caja.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                 <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{caja.isOpen ? 'Terminal Activa' : 'Terminal Bloqueada'}</span>
               </div>
            </div>
          </div>

          <div className="bg-[#111111] p-10 rounded-[3rem] border border-[#C5A059]/10 flex flex-col justify-between">
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Fondo Inicial</p>
              <h4 className="text-4xl font-black text-[#C5A059] tracking-tighter">${caja.openingBalance.toLocaleString()}</h4>
            </div>
            <div className="pt-6 border-t border-[#C5A059]/5 mt-6 flex justify-between items-end">
                <div>
                  <span className="text-[9px] text-gray-600 font-black uppercase block mb-1">Efectivo Total</span>
                  <span className="text-2xl font-black text-emerald-500">${(caja.openingBalance + cashSales).toLocaleString()}</span>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-lg">
                  {ICONS.Check}
                </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-10 rounded-[3rem] border border-[#C5A059]/20 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-bl-[4rem]"></div>
          <div>
            <h5 className="font-black text-white text-lg uppercase tracking-widest mb-4">Portabilidad</h5>
            <p className="text-gray-500 font-bold text-xs leading-relaxed">
              Descarga un respaldo completo para llevar tus datos a otra computadora o restaurarlos aquí.
            </p>
          </div>
          <div className="space-y-3 mt-8">
            <button onClick={exportData} className="w-full py-4 bg-[#C5A059] text-black rounded-2xl font-black text-[10px] uppercase hover:bg-white transition-all">Crear Respaldo (.JSON)</button>
            <label className="w-full py-4 bg-black border border-[#C5A059]/20 text-[#C5A059] rounded-2xl font-black text-[10px] uppercase cursor-pointer block text-center hover:bg-[#C5A059] hover:text-black transition-all">
              Restaurar Datos
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111111] p-10 rounded-[3rem] border border-[#C5A059]/10">
          <h4 className="font-black text-white uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
            {ICONS.Settings} Ejecución Independiente
          </h4>
          <p className="text-gray-500 text-xs leading-relaxed mb-6">
            Para que el sistema funcione como un programa de Windows sin barras de navegación, usa el botón "Descargar App de Escritorio". Guarda el archivo en tu escritorio y ábrelo para iniciar.
          </p>
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-black/40 rounded-2xl border border-[#C5A059]/5">
              <span className="text-[8px] font-black text-[#C5A059] uppercase block mb-1">Paso 1</span>
              <p className="text-[10px] text-gray-400 font-bold">Descarga el archivo .bat</p>
            </div>
            <div className="flex-1 p-4 bg-black/40 rounded-2xl border border-[#C5A059]/5">
              <span className="text-[8px] font-black text-[#C5A059] uppercase block mb-1">Paso 2</span>
              <p className="text-[10px] text-gray-400 font-bold">Muévelo a tu Escritorio</p>
            </div>
            <div className="flex-1 p-4 bg-black/40 rounded-2xl border border-[#C5A059]/5">
              <span className="text-[8px] font-black text-[#C5A059] uppercase block mb-1">Paso 3</span>
              <p className="text-[10px] text-gray-400 font-bold">Haz doble clic para abrir</p>
            </div>
          </div>
        </div>

        <div className="bg-[#111111] p-10 rounded-[3rem] border border-[#C5A059]/10 flex flex-col justify-center items-center text-center">
           <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center text-[#C5A059] mb-4">
             {ICONS.Check}
           </div>
           <h5 className="font-black text-white uppercase text-xs tracking-widest mb-2">Sistema Optimizado</h5>
           <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Versión 3.5 Desktop Edition</p>
        </div>
      </div>

      {!caja.isOpen && (
        <div className="bg-[#111111] p-24 rounded-[4rem] border border-[#C5A059]/10 text-center animate-slideUp">
          <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-widest mb-4">Terminal Bloqueada</h3>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.4em] mb-12">Es necesario realizar la apertura de caja para comenzar a vender</p>
          <button onClick={() => setShowCajaModal(true)} className="bg-[#C5A059] text-black px-16 py-6 rounded-3xl font-black uppercase text-sm shadow-2xl hover:bg-white transition-all transform active:scale-95">
            Iniciar Apertura de Caja
          </button>
        </div>
      )}

      {showCajaModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="bg-[#1A1A1A] rounded-[4rem] border border-[#C5A059]/30 shadow-2xl w-full max-w-lg p-16 text-center animate-slideUp">
            <h4 className="text-3xl font-black text-[#C5A059] mb-4 uppercase tracking-tighter">Apertura de Caja</h4>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] mb-12">Efectivo inicial en caja</p>
            <div className="relative mb-12">
              <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-[#C5A059]/30">$</span>
              <input 
                autoFocus
                type="number" 
                onChange={e => setOpenAmount(Number(e.target.value))} 
                className="w-full px-12 py-8 bg-black border border-[#C5A059]/20 rounded-[2.5rem] outline-none font-black text-center text-5xl text-[#C5A059]" 
                placeholder="0" 
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <button onClick={() => setShowCajaModal(false)} className="py-6 font-black text-gray-500 uppercase text-xs tracking-widest">Cancelar</button>
              <button onClick={() => { openCaja(openAmount); setShowCajaModal(false); }} className="bg-[#C5A059] text-black py-6 rounded-3xl font-black uppercase text-xs shadow-xl">Abrir Terminal</button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="bg-[#111111] rounded-[4rem] border border-[#C5A059]/30 shadow-2xl w-full max-w-xl p-16 animate-slideUp">
             <div className="flex justify-between items-start mb-12">
               <div>
                 <h4 className="text-4xl font-black text-[#C5A059] uppercase tracking-tighter">Cierre de Caja</h4>
                 <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Resumen de ventas del turno</p>
               </div>
               <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500">
                 {ICONS.Alert}
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-6 mb-12">
               <div className="bg-black/50 p-8 rounded-3xl border border-[#C5A059]/10">
                 <span className="text-gray-600 font-black uppercase text-[9px] block mb-1">Ventas Totales</span>
                 <span className="text-3xl font-black text-white">${caja.totalSales.toLocaleString()}</span>
               </div>
               <div className="bg-black/50 p-8 rounded-3xl border border-[#C5A059]/10">
                 <span className="text-gray-600 font-black uppercase text-[9px] block mb-1">Efectivo en Caja</span>
                 <span className="text-3xl font-black text-emerald-500">${(caja.openingBalance + cashSales).toLocaleString()}</span>
               </div>
             </div>
             
             <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-3xl mb-12 text-center">
                <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Al cerrar la caja se bloquearán las ventas hasta una nueva apertura</p>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <button onClick={() => setShowReportModal(false)} className="py-6 font-black text-gray-500 uppercase text-xs tracking-widest">Volver</button>
               <button onClick={() => { closeCaja(); setShowReportModal(false); }} className="bg-rose-600 text-white py-6 rounded-3xl font-black uppercase text-xs shadow-xl shadow-rose-600/20">Confirmar Cierre</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
