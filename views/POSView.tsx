
import React, { useState } from 'react';
import { MOCK_SERVICES, ICONS, COLORS } from '../constants';
import { SaleItem, Sale, Product, CajaSession } from '../types';
import ThermalTicket from '../components/ThermalTicket';

interface POSViewProps {
  products: Product[];
  caja: CajaSession;
  onConfirmSale: (sale: Sale) => void;
}

const PAYMENT_LABELS = {
  CASH: 'EFECTIVO',
  CARD: 'TARJETA',
  TRANSFER: 'TRANSFERENCIA'
};

const POSView: React.FC<POSViewProps> = ({ products, caja, onConfirmSale }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER'>('CASH');
  const [clientName, setClientName] = useState('');
  const [depositValue, setDepositValue] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalToPay = Math.max(0, total - depositValue);

  const addItem = (item: any, type: 'SERVICE' | 'PRODUCT') => {
    if (!caja.isOpen) return alert('La caja está cerrada.');
    
    const existing = cart.find(c => c.id === item.id && c.type === type);
    const currentQtyInCart = existing ? existing.quantity : 0;

    // Control de stock para productos
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
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      items: [...cart],
      total,
      paymentMethod,
      userId: '1',
      clientId: clientName,
      deposit: depositValue
    };
    onConfirmSale(sale);
    setLastSale(sale);
    setIsSuccess(true);
    setCart([]);
  };

  if (isSuccess && lastSale) {
    return (
      <div className="text-center py-20 animate-fadeIn">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
          {ICONS.Check}
        </div>
        <h2 className="text-3xl font-black text-white mb-4">COBRO EXITOSO</h2>
        <button onClick={() => setIsSuccess(false)} className="bg-[#C5A059] text-black px-10 py-4 rounded-2xl font-black uppercase text-xs">Nueva Venta</button>
        <div className="print-only"><ThermalTicket {...lastSale} saleId={lastSale.id} date={lastSale.timestamp} /></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
      <div className="lg:col-span-2 space-y-10">
        <section>
          <h3 className="text-xl font-black text-[#C5A059] uppercase tracking-[0.3em] mb-6">Tratamientos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_SERVICES.map(s => (
              <button key={s.id} onClick={() => addItem(s, 'SERVICE')} className="bg-[#1A1A1A] p-6 rounded-3xl border border-[#C5A059]/10 text-left hover:border-[#C5A059] transition-all group">
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
                    : 'bg-[#1A1A1A] border-[#C5A059]/10 hover:border-[#C5A059]'
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

      <div className="bg-[#111111] rounded-[3rem] p-8 border border-[#C5A059]/10 h-fit sticky top-10">
        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8 border-b border-[#C5A059]/10 pb-6">Detalle de Cobro</h3>
        <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between items-center group animate-fadeIn">
              <div>
                <p className="font-bold text-sm text-gray-300">{item.name}</p>
                <p className="text-[10px] text-gray-500">{item.quantity} x ${item.price}</p>
              </div>
              <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-rose-500/50 hover:text-rose-500 transition-colors text-xl font-light">&times;</button>
            </div>
          ))}
          {cart.length === 0 && <p className="text-center text-gray-600 font-bold uppercase text-[10px] py-10 tracking-[0.3em]">Sin ítems seleccionados</p>}
        </div>

        <div className="space-y-4">
          <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="NOMBRE DEL CLIENTE" className="w-full bg-black border border-[#C5A059]/10 p-4 rounded-2xl outline-none text-white text-xs font-bold focus:border-[#C5A059] transition-all" />
          
          <div className="space-y-2">
            <label className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest ml-1">Método de Pago</label>
            <div className="flex gap-2">
              {(Object.keys(PAYMENT_LABELS) as Array<keyof typeof PAYMENT_LABELS>).map(m => (
                <button key={m} onClick={() => setPaymentMethod(m)} className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-tighter border transition-all ${paymentMethod === m ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'bg-transparent text-gray-500 border-gray-800'}`}>
                  {PAYMENT_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[#C5A059]/10">
            <div className="flex justify-between items-end mb-6">
              <span className="text-gray-500 font-bold text-[10px] uppercase">A Pagar</span>
              <span className="text-4xl font-black text-[#C5A059] tracking-tighter">${finalToPay}</span>
            </div>
            <button disabled={cart.length === 0} onClick={handleFinalize} className="w-full py-5 bg-[#C5A059] text-black rounded-2xl font-black uppercase text-sm shadow-xl shadow-[#C5A059]/10 disabled:opacity-20 hover:bg-[#E2C284] transition-all transform active:scale-95">Procesar Venta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSView;
