
import React from 'react';
import { SaleItem, TicketConfig } from '../types';

interface ThermalTicketProps {
  saleId: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string;
  date: string;
  clientName?: string;
  deposit?: number;
  config?: TicketConfig;
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
  deposit = 0,
  config
}) => {
  const finalTotal = total - deposit;
  const paymentLabel = PAYMENT_LABELS_ES[paymentMethod as keyof typeof PAYMENT_LABELS_ES] || paymentMethod;

  // Estilos ultra-minimalistas para impresoras térmicas (solo blanco y negro puro)
  return (
    <div className="thermal-ticket" style={{ backgroundColor: 'white', color: 'black' }}>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>{config?.businessName.toUpperCase() || 'MG CONTROL'}</h2>
        <p style={{ fontSize: '11px', margin: '2px 0' }}>{config?.slogan || ''}</p>
        <p style={{ fontSize: '10px', margin: '0' }}>{config?.address || ''}</p>
        <p style={{ fontSize: '10px', margin: '0' }}>TEL: {config?.phone || ''}</p>
      </div>
      
      <div style={{ borderTop: '1px dashed black', margin: '10px 0' }}></div>
      
      <div style={{ fontSize: '10px' }}>
        <p style={{ margin: '2px 0' }}>FECHA: {new Date(date).toLocaleString()}</p>
        <p style={{ margin: '2px 0' }}>TICKET: #{saleId}</p>
        <p style={{ margin: '2px 0' }}>CLIENTE: {clientName?.toUpperCase() || 'CONSUMIDOR FINAL'}</p>
      </div>

      <div style={{ borderTop: '1px dashed black', margin: '10px 0' }}></div>

      <div style={{ marginBottom: '10px' }}>
        <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid black' }}>
              <th style={{ textAlign: 'left' }}>ITEM</th>
              <th style={{ textAlign: 'right' }}>SUB</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ padding: '4px 0' }}>{item.quantity}x {item.name.toUpperCase()}</td>
                <td style={{ textAlign: 'right' }}>${(item.price * item.quantity).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ borderTop: '1px solid black', paddingTop: '5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold' }}>
          <span>TOTAL:</span>
          <span>${total.toFixed(0)}</span>
        </div>
        {deposit > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span>SEÑA:</span>
            <span>-${deposit.toFixed(0)}</span>
          </div>
        )}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '5px', 
          fontSize: '16px', 
          fontWeight: 'bold',
          border: '2px solid black',
          padding: '4px'
        }} className="total-box">
          <span>A PAGAR:</span>
          <span>${finalTotal.toFixed(0)}</span>
        </div>
        
        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', marginTop: '10px' }}>
          PAGO: {paymentLabel.toUpperCase()}
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px dashed black', paddingTop: '10px', fontSize: '10px' }}>
        <p style={{ margin: '0' }}>{config?.footerMessage.toUpperCase() || '¡GRACIAS!'}</p>
        <p style={{ margin: '5px 0' }}>{config?.website || ''}</p>
        <p style={{ marginTop: '10px', fontSize: '8px' }}>*** NO VALIDO COMO FACTURA ***</p>
      </div>
    </div>
  );
};

export default ThermalTicket;
