
import React, { useState, useEffect, useMemo } from 'react';
import { ICONS } from '../constants';
import { SaleItem, Sale, Product, CajaSession, TicketConfig, Service } from '../types';
import ThermalTicket from '../components/ThermalTicket';

interface POSViewProps {
  products: Product[];
  services: Service[];
  caja: CajaSession;
  onConfirmSale: (sale: Sale) => void;
  ticketConfig: TicketConfig;
}

const PAYMENT_LABELS = {
  CASH: 'EFECTIVO',
  CARD: 'TARJETA',
  TRANSFER: 'TRANSFERENCIA'
};

const POSView: React.FC<POSViewProps> = ({ products, services, caja, onConfirmSale, ticketConfig }) => {
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'PRODUCTS'>('SERVICES');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER'>('CASH');
  const [clientName, setClientName] = useState('');
  const [depositValue, setDepositValue] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  const serviceCategories = useMemo(() => ['TODOS', ...new Set(services.map(s => s.category))], [services]);
  const productCategories = useMemo(() => ['TODOS', ...new Set(products.map(p => p.category))], [products]);

  const currentCategories = activeTab === 'SERVICES' ? serviceCategories : productCategories;

  useEffect(() => {
    setSelectedCategory('TODOS');
  }, [activeTab]);

  // Manejador de impresión optimizado
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (isSuccess && lastSale) {
      // Pequeño delay para asegurar renderizado del ticket oculto
      const timer = setTimeout(() => {
        handlePrint();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, lastSale]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalToPay = Math.max(0, total - depositValue);

  const getAvailableStock = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    const inCart = cart.find(c => c.id === productId && c.type === 'PRODUCT')?.quantity || 0;
    return Math.max(0, product.stock - inCart);
  };

  const addItem = (item: Service | Product, type: 'SERVICE' | 'PRODUCT') => {
    if (!caja.isOpen) return alert('Debes abrir caja primero en Inicio.');
    
    if (type === 'PRODUCT') {
      const available = getAvailableStock(item.id);
      if (available <= 0) {
        alert(`Stock agotado.`);
        return;
      }
    }

    const existing = cart.find(c => c.id === item.id && c.type === type);
    if (existing) {
      setCart(cart.map(c => c.id === item.id && c.type === type ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { 
        id: item.id, 
        name: item.name, 
        type, 
        category: item.category,
        price: item.price, 
        quantity: 1 
      }]);
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

  const filteredItems = useMemo(() => {
    if (activeTab === 'SERVICES') {
      return selectedCategory === 'TODOS' ? services : services.filter(s => s.category === selectedCategory);
    } else {
      return selectedCategory === 'TODOS' ? products : products.filter(p => p.category === selectedCategory);
    }
  }, [activeTab, selectedCategory, products, services]);

  if (isSuccess && lastSale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] no-print animate-fadeIn">
        <div className="w-20 h-20 bg-[#C5A059]/20 text-[#C5A059] rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">COBRO EXITOSO</h2>
        <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.4em] mb-10">Ticket enviado a impresora</p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <button onClick={() => setIsSuccess(false)} className="flex-1 bg-[#1A1A1A] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-[#C5A059]/20">Nueva Venta</button>
          <button onClick={handlePrint} className="flex-1 bg-[#C5A059] text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
            {ICONS.Print} Re-imprimir
          </button>
        </div>
        
        {/* Renderizado del ticket oculto para el navegador */}
        <div className="print-only">
          <ThermalTicket {...lastSale} saleId={lastSale.id} date={lastSale.timestamp} clientName={lastSale.clientId} config={ticketConfig} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-0 md:p-4 no-print main-content">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex gap-2 bg-[#111111] p-1.5 rounded-full border border-[#C5A059]/10">
          <button onClick={() => setActiveTab('SERVICES')} className={`flex-1 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'SERVICES' ? 'bg-[#C5A059] text-black' : 'text-gray-500'}`}>Servicios</button>
          <button onClick={() => setActiveTab('PRODUCTS')} className={`flex-1 py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'PRODUCTS' ? 'bg-[#C5A059] text-black' : 'text-gray-500'}`}>Productos</button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
          {currentCategories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2.5 rounded-full border text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]' : 'border-gray-800 text-gray-600'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredItems.map(item => (
            <button key={item.id} onClick={() => addItem(item, activeTab === 'PRODUCTS' ? 'PRODUCT' : 'SERVICE')} className="p-4 bg-[#111111] border border-[#C5A059]/10 rounded-[1.5rem] text-left hover:border-[#C5A059] transition-all active:scale-95 group">
              <span className="text-[7px] font-black text-[#C5A059]/60 uppercase tracking-widest">{item.category}</span>
              <h4 className="text-sm font-black text-white group-hover:text-[#C5A059] transition-colors line-clamp-2 min-h-[2.5rem] leading-tight">{item.name}</h4>
              <p className="text-xl font-black text-[#C5A059] mt-2 tracking-tighter">${item.price}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] rounded-[2.5rem] p-6 border border-[#C5A059]/10 h-fit sticky top-4 shadow-2xl">
        <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 pb-4 border-b border-[#C5A059]/10">Resumen</h3>
        
        <div className="space-y-3 mb-8 max-h-[30vh] overflow-y-auto custom-scrollbar">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-[#C5A059]/5">
              <div className="flex-1">
                <p className="font-bold text-xs text-gray-200">{item.name}</p>
                <p className="text-[8px] text-gray-500 uppercase font-black">{item.quantity} x ${item.price}</p>
              </div>
              <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="text-rose-900 px-3 text-xl font-light">&times;</button>
            </div>
          ))}
          {cart.length === 0 && <p className="text-center text-gray-700 font-black uppercase text-[8px] py-10 tracking-[0.3em]">Carrito Vacío</p>}
        </div>

        <div className="space-y-4">
          <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="CLIENTE (OPCIONAL)" className="w-full bg-black border border-[#C5A059]/10 p-4 rounded-xl outline-none text-white text-[10px] font-black uppercase" />
          
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PAYMENT_LABELS) as Array<keyof typeof PAYMENT_LABELS>).map(m => (
              <button key={m} onClick={() => setPaymentMethod(m)} className={`py-3 rounded-xl text-[7px] font-black tracking-tighter border transition-all ${paymentMethod === m ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'text-gray-600 border-gray-900'}`}>
                {PAYMENT_LABELS[m]}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-[#C5A059]/10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-bold text-[9px] uppercase">A Pagar</span>
              <span className="text-3xl font-black text-[#C5A059] tracking-tighter">${finalToPay}</span>
            </div>
            <button 
              disabled={cart.length === 0} 
              onClick={handleFinalize} 
              className="w-full py-5 bg-[#C5A059] text-black rounded-2xl font-black uppercase text-xs shadow-xl disabled:opacity-20"
            >
              Confirmar Cobro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSView;
