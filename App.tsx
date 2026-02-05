
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import CalendarView from './views/CalendarView';
import POSView from './views/POSView';
import UsersView from './views/UsersView';
import InventoryView from './views/InventoryView';
import ReportsView from './views/ReportsView';
import TicketSettingsView from './views/TicketSettingsView';
import Logo from './components/Logo';
import { UserRole, User, Product, CajaSession, Sale, SheetConfig, TicketConfig } from './types';
import { MOCK_USERS, MOCK_PRODUCTS } from './constants';

const DEFAULT_TICKET: TicketConfig = {
  businessName: 'MG CONTROL',
  slogan: 'Estética Corporal de Lujo',
  address: 'Av. Siempre Viva 742',
  location: 'Buenos Aires, Argentina',
  phone: '+54 9 11 1234-5678',
  website: 'www.mgcontrol.com.ar',
  footerMessage: '¡GRACIAS POR TU PREFERENCIA!'
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // Persistencia de Usuarios
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mg_users');
    return saved ? JSON.parse(saved) : MOCK_USERS.map(u => ({ ...u, password: 'admin' }));
  });

  // Persistencia de Productos
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mg_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  // Persistencia de Historial de Ventas Total
  const [allSales, setAllSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('mg_all_sales');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistencia de Configuración de Ticket
  const [ticketConfig, setTicketConfig] = useState<TicketConfig>(() => {
    const saved = localStorage.getItem('mg_ticket_config');
    return saved ? JSON.parse(saved) : DEFAULT_TICKET;
  });

  const [caja, setCaja] = useState<CajaSession>({
    isOpen: false,
    openedAt: null,
    openingBalance: 0,
    totalSales: 0,
    sessionSales: []
  });

  const [sheetConfig, setSheetConfig] = useState<SheetConfig>({
    sheetId: '',
    lastSync: null,
    isAutoSync: false
  });

  useEffect(() => {
    localStorage.setItem('mg_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mg_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mg_all_sales', JSON.stringify(allSales));
  }, [allSales]);

  useEffect(() => {
    localStorage.setItem('mg_ticket_config', JSON.stringify(ticketConfig));
  }, [ticketConfig]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginData.username);
    const validPass = user?.password || '1234';
    
    if (user && loginData.password === validPass) {
      setCurrentUser(user);
      setError('');
    } else {
      setError('Usuario o clave incorrectos.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  const openCaja = (amount: number) => {
    setCaja({
      isOpen: true,
      openedAt: new Date().toISOString(),
      openingBalance: amount,
      totalSales: 0,
      sessionSales: []
    });
  };

  const closeCaja = () => {
    setCaja(prev => ({ ...prev, isOpen: false, closedAt: new Date().toISOString() }));
  };

  const recordSale = (sale: Sale) => {
    setAllSales(prev => [...prev, sale]);
    setCaja(prev => ({ 
      ...prev, 
      totalSales: prev.totalSales + (sale.total - (sale.deposit || 0)),
      sessionSales: [...prev.sessionSales, sale]
    }));

    setProducts(currentProducts => 
      currentProducts.map(p => {
        const soldItem = sale.items.find(item => item.id === p.id && item.type === 'PRODUCT');
        if (soldItem) return { ...p, stock: Math.max(0, p.stock - soldItem.quantity) };
        return p;
      })
    );
  };

  const syncFromSheet = async (sheetId: string) => {
    if (!sheetId) return;
    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      const response = await fetch(url);
      const csvText = await response.text();
      const rows = csvText.split('\n').slice(1);
      const parsedProducts: Product[] = rows.map(row => {
        const [id, name, price, stock, minStock, category] = row.split(',').map(cell => cell.trim().replace(/"/g, ''));
        return {
          id: id || Math.random().toString(36).substr(2, 9),
          name: name || 'Producto sin nombre',
          price: parseFloat(price) || 0,
          stock: parseInt(stock) || 0,
          minStock: parseInt(minStock) || 0,
          category: category || 'General'
        };
      }).filter(p => p.name !== 'Producto sin nombre');

      if (parsedProducts.length > 0) {
        setProducts(parsedProducts);
        setSheetConfig(prev => ({ ...prev, sheetId, lastSync: new Date().toISOString() }));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error syncing with sheet:", err);
      return false;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C5A059] rounded-full blur-[200px] opacity-10 -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8E6F3E] rounded-full blur-[150px] opacity-10 -ml-32 -mb-32"></div>

        <div className="w-full max-w-md bg-[#111111] rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-12 z-10 animate-slideUp border border-[#C5A059]/20">
          <div className="text-center mb-10">
            <Logo className="w-24 h-24 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]" />
            <h1 className="text-4xl font-black text-[#C5A059] tracking-tighter mb-1">MG</h1>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.5em]">CONTROL BEAUTY</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-4">Usuario</label>
              <input 
                required
                type="text" 
                autoComplete="username"
                value={loginData.username}
                onChange={e => setLoginData({...loginData, username: e.target.value})}
                className="w-full px-8 py-5 bg-[#1A1A1A] border border-[#C5A059]/10 rounded-full focus:border-[#C5A059] outline-none transition-all font-bold text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-4">Clave</label>
              <input 
                required
                type="password" 
                autoComplete="current-password"
                value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-8 py-5 bg-[#1A1A1A] border border-[#C5A059]/10 rounded-full focus:border-[#C5A059] outline-none transition-all font-bold text-white"
              />
            </div>

            {error && <div className="p-4 bg-rose-500/10 text-rose-400 rounded-2xl text-[10px] font-black text-center border border-rose-500/20">{error}</div>}

            <button type="submit" className="w-full py-6 bg-[#C5A059] text-black rounded-full font-black text-lg shadow-xl shadow-[#C5A059]/20 hover:bg-[#E2C284] transition-all transform active:scale-95">
              INICIAR SESIÓN
            </button>
            <p className="text-center text-[9px] text-gray-700 font-black uppercase tracking-widest">v2.2 - Personalización de Ticket</p>
          </form>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView caja={caja} openCaja={openCaja} closeCaja={closeCaja} />;
      case 'calendar': return <CalendarView />;
      case 'pos': return <POSView products={products} caja={caja} onConfirmSale={recordSale} ticketConfig={ticketConfig} />;
      case 'inventory': return <InventoryView products={products} onAdd={p => setProducts([...products, p])} onUpdate={p => setProducts(products.map(x => x.id === p.id ? p : x))} onDelete={id => setProducts(products.filter(x => x.id !== id))} onSync={syncFromSheet} config={sheetConfig} />;
      case 'reports': return <ReportsView sales={allSales} ticketConfig={ticketConfig} />;
      case 'ticket_settings': return <TicketSettingsView config={ticketConfig} setConfig={setTicketConfig} />;
      case 'users': return <UsersView users={users} setUsers={setUsers} />;
      default: return <DashboardView caja={caja} openCaja={openCaja} closeCaja={closeCaja} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <div className="no-print">
        <Sidebar activeView={activeView} setActiveView={setActiveView} userRole={currentUser.role} onLogout={handleLogout} />
      </div>
      <main className="flex-1 transition-all duration-300 md:ml-64">
        <div className="max-w-7xl mx-auto py-10 px-6 md:px-12">
          {renderView()}
        </div>
      </main>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
