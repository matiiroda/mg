
import React, { useState, useEffect } from 'react';
import { MOCK_SERVICES, ICONS, COLORS } from '../constants';
import { SaleItem, Sale, Product, CajaSession, TicketConfig } from '../types';
import ThermalTicket from '../components/ThermalTicket';

interface POSViewProps {
  products: Product[];
  caja: CajaSession;
  onConfirmSale: (sale: Sale) => void;
  ticketConfig: TicketConfig;
}

const PAYMENT_LABELS = {
  CASH: 'EFECTIVO',
  CARD: 'TARJETA',
  TRANSFER: 'TRANSFERENCIA'
};

const POSView: React.FC<POSViewProps> = ({ products, caja, onConfirmSale, ticketConfig }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER'>('CASH');
  const [clientName, setClientName] = useState('');
  const [depositValue, setDepositValue] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  useEffect(() => {
    if (isSuccess && lastSale) {
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, lastSale]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalToPay = Math.max(0, total - depositValue);

  const addItem = (item: any, type: 'SERVICE' | 'PRODUCT') => {
    if (!caja.isOpen) return alert('La caja está cerrada.');
    
    const existing = cart.find(c => c.id === item.id && c.type === type);
    const currentQtyInCart = existing ? existing.quantity : 0;

    if (type === 'PRODUCT') {
      const productInStock = products.find(p => p.id === item.id);
      if (productInStock && currentQtyInCart + 1 > productInStock.stock) {
        alert(`Stock insuficiente para "${item.name}". Disponible: ${productInStock.stock}`);
        return;
      }
    }

    if (existing) {
      setCart(cart.map(c => c.id === item.id && c.type === type ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { id: item.id, name: item.name, type, price: item.price, quantity: 1 }]);
    }
  };

  const handleFinalize = () => {
    const sale: Sale = {
      id: Math.random().toString(36).substr(2, 10).toUpperCase(),
      timestamp: new Date().toISOString(),
      items: [...cart],
      total,
      paymentMethod,
      userId: '1',
      clientId: clientName || 'CLIENTE FINAL',
      deposit: depositValue
    };
    onConfirmSale(sale);
    setLastSale(sale);
    setIsSuccess(true);
    setCart([]);
    setClientName('');
    setDepositValue(0);
  };

  const handlePrintManual = () => {
    window.print();
  };

  if (isSuccess && lastSale) {
    return (
      <div className="text-center py-20 animate-fadeIn no-print h-screen flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-8 border border-emerald-500/30">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">COBRO FINALIZADO</h2>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.4em] mb-12">El ticket se ha enviado a la cola de impresión</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => setIsSuccess(false)} 
            className="w-full sm:w-auto bg-[#1A1A1A] text-white border border-[#C5A059]/20 px-12 py-5 rounded-2xl font-black uppercase text-xs hover:bg-[#C5A059]/10 transition-all shadow-xl"
          >
            Nueva Venta
          </button>
          <button 
            onClick={handlePrintManual} 
            className="w-full sm:w-auto bg-[#C5A059] text-black px-12 py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-2xl shadow-[#C5A059]/30 hover:bg-[#E2C284]"
          >
            {ICONS.Print} Re-imprimir Ticket
          </button>
        </div>
        
        <div className="print-only">
          <ThermalTicket 
            {...lastSale} 
            saleId={lastSale.id} 
            date={lastSale.timestamp} 
            clientName={lastSale.clientId} 
            config={ticketConfig}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 no-print">
      <div className="lg:col-span-2 space-y-10">
        <section>
          <h3 className="text-xl font-black text-[#C5A059] uppercase tracking-[0.3em] mb-6">Tratamientos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_SERVICES.map(s => (
              <button key={s.id} onClick={() => addItem(s, 'SERVICE')} className="bg-[#111111] p-6 rounded-3xl border border-[#C5A059]/10 text-left hover:border-[#C5A059] transition-all group hover:bg-[#1A1A1A]">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{s.duration} MIN</p>
                <h4 className="text-lg font-black text-white mt-1 group-hover:text-[#C5A059] transition-colors">{s.name}</h4>
                <p className="text-2xl font-black text-[#C5A059] mt-3">${s.price}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-black text-[#C5A059] uppercase tracking-[0.3em] mb-6">Productos Premium</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map(p => {
              const isOutOfStock = p.stock <= 0;
              return (
                <button 
                  key={p.id} 
                  disabled={isOutOfStock}
                  onClick={() => addItem(p, 'PRODUCT')} 
                  className={`p-6 rounded-3xl border text-left transition-all ${
                    isOutOfStock 
                    ? 'bg-black border-rose-900/20 opacity-40 cursor-not-allowed' 
                    : 'bg-[#111111] border-[#C5A059]/10 hover:border-[#C5A059] hover:bg-[#1A1A1A]'
                  }`}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isOutOfStock ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {isOutOfStock ? 'SIN STOCK' : `STOCK: ${p.stock}`}
                  </p>
                  <h4 className="text-lg font-black text-white mt-1">{p.name}</h4>
                  <p className="text-2xl font-black text-[#C5A059] mt-3">${p.price}</p>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="bg-[#111111] rounded-[3rem] p-8 border border-[#C5A059]/10 h-fit sticky top-10 shadow-2xl">
        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8 border-b border-[#C5A059]/10 pb-6">Detalle de Cobro</h3>
        <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between items-center group animate-fadeIn bg-black/30 p-4 rounded-2xl border border-[#C5A059]/5">
              <div>
                <p className="font-bold text-sm text-gray-200">{item.name}</p>
                <p className="text-[10px] text-gray-500 uppercase font-black">{item.quantity} x ${item.price}</p>
              </div>
              <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-rose-900 hover:text-rose-500 transition-colors text-2xl font-light">&times;</button>
            </div>
          ))}
          {cart.length === 0 && <p className="text-center text-gray-600 font-bold uppercase text-[10px] py-16 tracking-[0.3em] opacity-30">Sin ítems seleccionados</p>}
        </div>

        <div className="space-y-4">
          <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="NOMBRE DEL CLIENTE" className="w-full bg-black border border-[#C5A059]/10 p-5 rounded-2xl outline-none text-white text-xs font-bold focus:border-[#C5A059] transition-all uppercase placeholder-gray-800" />
          
          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest ml-1">Método de Pago</label>
            <div className="flex gap-2">
              {(Object.keys(PAYMENT_LABELS) as Array<keyof typeof PAYMENT_LABELS>).map(m => (
                <button key={m} onClick={() => setPaymentMethod(m)} className={`flex-1 py-4 rounded-xl text-[9px] font-black tracking-tighter border transition-all ${paymentMethod === m ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-lg shadow-[#C5A059]/10' : 'bg-transparent text-gray-600 border-gray-900'}`}>
                  {PAYMENT_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[#C5A059]/10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Total a Pagar</span>
              <span className="text-4xl font-black text-[#C5A059] tracking-tighter">${finalToPay}</span>
            </div>
            <button 
              disabled={cart.length === 0} 
              onClick={handleFinalize} 
              className="w-full py-6 bg-[#C5A059] text-black rounded-2xl font-black uppercase text-sm shadow-2xl shadow-[#C5A059]/20 disabled:opacity-20 hover:bg-[#E2C284] transition-all transform active:scale-95"
            >
              Completar Cobro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSView;
