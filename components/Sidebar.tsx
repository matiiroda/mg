
import React from 'react';
import { ICONS, COLORS } from '../constants';
import { UserRole } from '../types';
import Logo from './Logo';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userRole: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, userRole, onLogout }) => {
  const menuItems = [
    { id: 'pos', name: 'Caja / Venta', icon: ICONS.POS, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
    { id: 'dashboard', name: 'Dashboard', icon: ICONS.Dashboard, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
    { id: 'calendar', name: 'Agenda', icon: ICONS.Calendar, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
    { id: 'inventory', name: 'Stock', icon: ICONS.Inventory, roles: [UserRole.ADMIN, UserRole.EMPLOYEE] },
    { id: 'reports', name: 'Reportes', icon: ICONS.Reports, roles: [UserRole.ADMIN] },
    { id: 'ticket_settings', name: 'Ajustes Ticket', icon: ICONS.Settings, roles: [UserRole.ADMIN] },
    { id: 'users', name: 'Empleados', icon: ICONS.Users, roles: [UserRole.ADMIN] },
  ];

  return (
    <aside className="w-64 bg-[#0F0F0F] text-white h-screen fixed left-0 top-0 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-20 border-r border-[#C5A059]/10">
      <div className="p-8 border-b border-[#C5A059]/10">
        <div className="flex items-center gap-4">
          <Logo className="w-10 h-10 drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]" />
          <div className="flex flex-col">
            <h1 className="text-xl font-black leading-none tracking-tighter text-[#C5A059]">
              MG <span className="font-light text-gray-500 uppercase text-[9px] tracking-[0.3em] block mt-1">CONTROL</span>
            </h1>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 mt-8 px-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            if (!item.roles.includes(userRole)) return null;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                    isActive 
                    ? 'bg-[#C5A059] text-black shadow-[0_10px_20px_rgba(197,160,89,0.2)] scale-[1.02]' 
                    : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-[#C5A059]'
                  }`}
                >
                  <span className={isActive ? 'text-black' : 'text-[#C5A059]'}>{item.icon}</span>
                  <span className="font-bold text-sm uppercase tracking-wider">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-[#C5A059]/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-5 py-4 text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/5 rounded-2xl transition-all font-bold text-sm uppercase"
        >
          {ICONS.Logout}
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
