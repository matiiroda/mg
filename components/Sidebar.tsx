
import React from 'react';
import { ICONS } from '../constants';
import { UserRole } from '../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, userRole, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Panel Principal', icon: ICONS.Dashboard, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
    { id: 'pos', name: 'Punto de Venta', icon: ICONS.POS, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
    { id: 'inventory', name: 'Inventario / Stock', icon: ICONS.Inventory, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
    { id: 'reports', name: 'Reportes de Venta', icon: ICONS.Reports, roles: [UserRole.ADMIN] },
    { id: 'users', name: 'Gestión Personal', icon: ICONS.Users, roles: [UserRole.ADMIN] },
    { id: 'ticket_settings', name: 'Configurar Ticket', icon: ICONS.Settings, roles: [UserRole.ADMIN] },
  ];

  return (
    <aside className="w-72 bg-[#0F0F0F] text-white h-screen fixed left-0 top-0 flex flex-col z-20 border-r border-[#C5A059]/10 shadow-[20px_0_40px_rgba(0,0,0,0.8)]">
      <div className="p-10 border-b border-[#C5A059]/10">
        <h1 className="text-4xl font-black leading-none tracking-tighter text-[#C5A059]">
          MG <span className="font-light text-gray-500 uppercase text-[10px] tracking-[0.4em] block mt-1">CONTROL</span>
        </h1>
        <div className="mt-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Sistema Activo</span>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (!item.roles.includes(userRole)) return null;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-200 group ${
                    isActive 
                    ? 'bg-[#C5A059] text-black shadow-[0_10px_20px_rgba(197,160,89,0.2)] scale-[1.02]' 
                    : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-[#C5A059]'
                  }`}
                >
                  <span className={`${isActive ? 'text-black' : 'text-[#C5A059] group-hover:scale-110 transition-transform'}`}>
                    {item.icon}
                  </span>
                  <span className="font-black text-[11px] uppercase tracking-widest">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-8 border-t border-[#C5A059]/10 bg-black/20">
        <button 
          onClick={onLogout} 
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-black text-[11px] uppercase tracking-widest"
        >
          {ICONS.Logout} <span>Cerrar Sesión</span>
        </button>
        <p className="text-center text-[8px] text-gray-700 font-black mt-6 uppercase tracking-widest">Versión 3.0 Desktop</p>
      </div>
    </aside>
  );
};

export default Sidebar;
