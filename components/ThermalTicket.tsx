
import React from 'react';
import { SaleItem } from '../types';

interface ThermalTicketProps {
  saleId: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  date: string;
  clientName?: string;
  deposit?: number;
}

const PAYMENT_LABELS_ES = {
  CASH: 'EFECTIVO',
  CARD: 'TARJETA',
  TRANSFER: 'TRANSFERENCIA'
};

const ThermalTicket: React.FC<ThermalTicketProps> = ({ 
  saleId, 
  items, 
  total, 
  paymentMethod, 
  date, 
  clientName,
  deposit = 0
}) => {
  const finalTotal = total - deposit;
  const paymentLabel = PAYMENT_LABELS_ES[paymentMethod as keyof typeof PAYMENT_LABELS_ES] || paymentMethod;

  return (
    <div className="thermal-ticket bg-white mx-auto border border-dashed border-gray-400 p-4 w-[80mm]">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold uppercase">MG CONTROL</h2>
        <p className="text-sm">Estética Corporal</p>
        <p className="text-xs">Calle Ficticia 123, Ciudad</p>
        <p className="text-xs">Tel: +54 9 11 2233-4455</p>
      </div>
      
      <div className="border-t border-b border-black py-2 mb-2 text-xs">
        <p>Fecha: {new Date(date).toLocaleString()}</p>
        <p>Ticket #: {saleId.slice(0, 8).toUpperCase()}</p>
        {clientName && <p>Cliente: {clientName}</p>}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs font-bold mb-1 border-b border-gray-300">
          <span>DESCRIPCIÓN</span>
          <span>SUBTOTAL</span>
        </div>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-xs py-1">
            <span>{item.quantity}x {item.name.slice(0, 15)}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-black pt-2 text-xs">
        <div className="flex justify-between">
          <span>TOTAL:</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
        {deposit > 0 && (
          <div className="flex justify-between text-gray-700">
            <span>SEÑA ENTREGADA:</span>
            <span>-${deposit.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between mt-1 text-sm font-bold border-t border-black pt-1">
          <span>A PAGAR:</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
        <p className="mt-2 font-bold">Pago: {paymentLabel}</p>
      </div>

      <div className="text-center mt-6 text-xs italic">
        <p>¡Gracias por su visita!</p>
        <p>Conserve este ticket</p>
      </div>
    </div>
  );
};

export default ThermalTicket;
