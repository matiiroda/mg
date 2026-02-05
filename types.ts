
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
}

export interface SaleItem {
  id: string;
  name: string;
  type: 'SERVICE' | 'PRODUCT';
  price: number;
  quantity: number;
}

export interface Sale {
  id: string;
  timestamp: string;
  items: SaleItem[];
  total: number;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER';
  userId: string;
  clientId: string;
  deposit: number;
}

export interface CajaSession {
  isOpen: boolean;
  openedAt: string | null;
  closedAt?: string;
  openingBalance: number;
  totalSales: number;
  sessionSales: Sale[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  staffId: string;
  staffName: string;
  date: string;
  deposit: number;
  total: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface SheetConfig {
  sheetId: string;
  lastSync: string | null;
  isAutoSync: boolean;
}
