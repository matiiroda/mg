
import React, { useState } from 'react';
import { ICONS, COLORS } from '../constants';
import { CajaSession } from '../types';
import Logo from '../components/Logo';

interface DashboardProps {
  caja: CajaSession;
  openCaja: (amount: number) => void;
  closeCaja: () => void;
}

const DashboardView: React.FC<DashboardProps> = ({ caja, openCaja, closeCaja }) => {
  const [showCajaModal, setShowCajaModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [openAmount, setOpenAmount] = useState(0);

  const cashSales = caja.sessionSales.filter(s => s.paymentMethod === 'CASH').reduce((acc, s) => acc + (s.total - (s.deposit || 0)), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Logo className="w-12 h-12" />
          <div>
            <h2 className="text-4xl font-black text-[#C5A059] tracking-tighter leading-none">PANEL DE CONTROL</h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-1">Estética Corporal de Lujo</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#1A1A1A] px-6 py-4 rounded-2xl border border-[#C5A059]/10 flex items-center gap-4">
            <span className={`w-3 h-3 rounded-full ${caja.isOpen ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></span>
            <span className="text-xs font-black text-gray-300 uppercase">Caja: {caja.isOpen ? 'ABIERTA' : 'CERRADA'}</span>
          </div>
          {caja.isOpen ? (
            <button onClick={() => setShowReportModal(true)} className="bg-[#C5A059] text-black px-8 py-4 rounded-2xl font-black text-sm uppercase shadow-lg shadow-[#C5A059]/20">GESTIONAR CAJA</button>
          ) : (
            <button onClick={() => setShowCajaModal(true)} className="bg-[#C5A059] text-black px-8 py-4 rounded-2xl font-black text-sm uppercase shadow-lg shadow-[#C5A059]/20 transition-all hover:bg-[#E2C284]">ABRIR CAJA</button>
          )}
        </div>
      </header>

      {caja.isOpen ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#C5A059]/10">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Saldo Inicial</p>
            <h4 className="text-3xl font-black text-[#C5A059] tracking-tighter">${caja.openingBalance}</h4>
          </div>
          <div className="bg-[#1A1A1A] p-8 rounded-[2.5rem] border border-[#C5A059]/10">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Ventas del Turno</p>
            <h4 className="text-3xl font-black text-white tracking-tighter">${caja.totalSales}</h4>
          </div>
          <div className="bg-[#C5A059] p-8 rounded-[2.5rem] text-black">
            <p className="text-black/50 text-[10px] font-black uppercase tracking-widest mb-2">Efectivo Estimado</p>
            <h4 className="text-3xl font-black tracking-tighter">${caja.openingBalance + cashSales}</h4>
          </div>
        </div>
      ) : (
        <div className="bg-[#111111] p-20 rounded-[3rem] border border-[#C5A059]/10 text-center">
          <div className="bg-[#C5A059]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#C5A059]/20">
            <Logo className="w-12 h-12 opacity-50" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-4">La caja está cerrada</h3>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] max-w-xs mx-auto mb-10">Inicie un nuevo turno para comenzar a registrar ventas y servicios.</p>
          <button onClick={() => setShowCajaModal(true)} className="bg-[#C5A059] text-black px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-xl shadow-[#C5A059]/20 hover:bg-[#E2C284] transition-all">Abrir Caja Ahora</button>
        </div>
      )}

      {/* Se eliminó la sección de Gráfico Mensual por solicitud del usuario */}

      {showCajaModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-[3rem] border border-[#C5A059]/20 shadow-2xl w-full max-w-sm overflow-hidden animate-slideUp">
            <div className="p-10 text-center">
              <Logo className="w-16 h-16 mx-auto mb-6" />
              <h4 className="text-2xl font-black text-[#C5A059] mb-6 uppercase tracking-widest">Apertura de Turno</h4>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Monto Inicial en Efectivo</p>
              <input type="number" onChange={e => setOpenAmount(Number(e.target.value))} className="w-full px-8 py-5 bg-black border border-[#C5A059]/10 rounded-full outline-none font-black text-center text-3xl mb-8 text-[#C5A059]" placeholder="0" />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowCajaModal(false)} className="py-4 font-black text-gray-500 uppercase text-[10px] tracking-widest">Cancelar</button>
                <button onClick={() => { openCaja(openAmount); setShowCajaModal(false); }} className="bg-[#C5A059] text-black py-4 rounded-2xl font-black uppercase text-xs shadow-lg shadow-[#C5A059]/20">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-[3rem] border border-[#C5A059]/20 shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
             <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h4 className="text-2xl font-black text-[#C5A059] uppercase tracking-tighter">Resumen de Turno</h4>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Control de Cierre</p>
                  </div>
                  <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="flex justify-between py-3 border-b border-[#C5A059]/10">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Apertura</span>
                    <span className="font-black text-white">${caja.openingBalance}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#C5A059]/10">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Ventas Totales</span>
                    <span className="font-black text-[#C5A059]">${caja.totalSales}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#C5A059]/10">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Efectivo en Caja</span>
                    <span className="font-black text-emerald-500">${caja.openingBalance + cashSales}</span>
                  </div>
                </div>

                <button 
                  onClick={() => { closeCaja(); setShowReportModal(false); }} 
                  className="w-full bg-rose-500 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl shadow-rose-500/10 hover:bg-rose-600 transition-all"
                >
                  Cerrar Turno Definitivamente
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
