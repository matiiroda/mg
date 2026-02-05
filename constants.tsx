
import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Printer,
  FileText,
  Download,
  TrendingUp
} from 'lucide-react';
import { UserRole, User, Service, Product } from './types';
import Logo from './components/Logo';

export const COLORS = {
  gold: '#C5A059',
  goldLight: '#E2C284',
  goldDark: '#8E6F3E',
  bg: '#0A0A0A',
  surface: '#1A1A1A'
};

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Calendar: <Calendar size={20} />,
  POS: <ShoppingCart size={20} />,
  Inventory: <Package size={20} />,
  Users: <Users size={20} />,
  Reports: <FileText size={20} />,
  Trending: <TrendingUp size={20} />,
  Settings: <Settings size={20} />,
  Logout: <LogOut size={20} />,
  Plus: <Plus size={20} />,
  Search: <Search size={20} />,
  Check: <CheckCircle size={20} />,
  Alert: <AlertTriangle size={20} />,
  Print: <Printer size={20} />,
  Download: <Download size={20} />,
  Logo: <Logo className="w-6 h-6" />
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin MG', username: 'admin', role: UserRole.ADMIN },
  { id: '2', name: 'Laura Gomez', username: 'laura', role: UserRole.EMPLOYEE },
];

export const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Masaje Reductor', price: 2500, duration: 60 },
  { id: 's2', name: 'Limpieza Facial Profunda', price: 1800, duration: 45 },
  { id: 's3', name: 'Drenaje Linfático', price: 3000, duration: 90 },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Crema Exfoliante 500g', price: 1200, stock: 15, minStock: 5, category: 'Insumos' },
];
