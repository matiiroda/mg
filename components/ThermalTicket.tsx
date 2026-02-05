
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

const DEFAULT_CONFIG: TicketConfig = {
  businessName: 'MG CONTROL',
  slogan: 'Estética Corporal de Lujo',
  address: 'Av. Siempre Viva 742',
  location: 'Buenos Aires, Argentina',
  phone: '+54 9 11 1234-5678',
  website: 'www.mgcontrol.com.ar',
  footerMessage: '¡GRACIAS POR TU PREFERENCIA!'
};

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
  config = DEFAULT_CONFIG
}) => {
  const finalTotal = total - deposit;
  const paymentLabel = PAYMENT_LABELS_ES[paymentMethod as keyof typeof PAYMENT_LABELS_ES] || paymentMethod;

  const hrStyle: React.CSSProperties = {
    border: 'none',
    borderTop: '2px dashed #000000',
    margin: '10px 0',
    width: '100%'
  };

  const boldLabelStyle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: '11px',
    color: '#000000'
  };

  return (
    <div className="thermal-ticket">
      {/* Encabezado Principal */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 2px 0', letterSpacing: '-1px', color: '#000000' }}>
          {config.businessName.toUpperCase()}
        </h2>
        <p style={{ margin: '0', fontWeight: 700, fontSize: '12px', color: '#000000' }}>
          {config.slogan.toUpperCase()}
        </p>
        <div style={{ fontSize: '11px', marginTop: '8px', fontWeight: 600, color: '#000000' }}>
          <p style={{ margin: '1px 0' }}>{config.address}</p>
          <p style={{ margin: '1px 0' }}>{config.location}</p>
          <p style={{ margin: '1px 0', fontWeight: 900 }}>WHATSAPP: {config.phone}</p>
        </div>
      </div>
      
      <div style={hrStyle}></div>
      
      {/* Datos del Ticket */}
      <div style={{ padding: '2px 0', marginBottom: '10px', fontSize: '11px', fontWeight: 700 }}>
        <p style={{ margin: '4px 0' }}><span style={boldLabelStyle}>FECHA:</span> {new Date(date).toLocaleString('es-AR')}</p>
        <p style={{ margin: '4px 0' }}><span style={boldLabelStyle}>TICKET:</span> #{saleId}</p>
        <p style={{ margin: '4px 0' }}><span style={boldLabelStyle}>CLIENTE:</span> {clientName?.toUpperCase() || 'CONSUMIDOR FINAL'}</p>
      </div>

      <div style={hrStyle}></div>

      {/* Lista de Items */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, marginBottom: '8px', fontSize: '11px', borderBottom: '1.5px solid #000' }}>
          <span>DETALLE</span>
          <span>SUBTOTAL</span>
        </div>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '12px', fontWeight: 700 }}>
            <span style={{ maxWidth: '75%', lineHeight: '1.1' }}>
              {item.quantity}x {item.name.toUpperCase()}
            </span>
            <span style={{ fontWeight: 900 }}>${(item.price * item.quantity).toFixed(0)}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '2px solid #000', paddingTop: '10px', marginTop: '5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
          <span>VALOR SERVICIOS:</span>
          <span>${total.toFixed(0)}</span>
        </div>
        
        {deposit > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '2px' }}>
            <span>SEÑA ENTREGADA:</span>
            <span>-${deposit.toFixed(0)}</span>
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '8px', 
          fontSize: '20px', 
          fontWeight: 900, 
          backgroundColor: '#000', 
          color: '#FFF !important',
          padding: '5px 8px',
          borderRadius: '4px'
        }}>
          <span style={{ color: '#FFF !important' }}>TOTAL:</span>
          <span style={{ color: '#FFF !important' }}>${finalTotal.toFixed(0)}</span>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <p style={{ 
            display: 'inline-block',
            border: '1.5px solid #000',
            padding: '4px 15px',
            fontWeight: 900, 
            fontSize: '13px',
            textTransform: 'uppercase'
          }}>
            PAGO: {paymentLabel}
          </p>
        </div>
      </div>

      {/* Pie de Ticket */}
      <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '11px', borderTop: '2px dashed #000', paddingTop: '15px' }}>
        <p style={{ margin: '0', fontWeight: 900, letterSpacing: '1px' }}>{config.footerMessage.toUpperCase()}</p>
        <p style={{ margin: '8px 0 0 0', fontWeight: 700, textDecoration: 'underline' }}>{config.website.toLowerCase()}</p>
        <div style={{ marginTop: '15px', fontSize: '10px', fontWeight: 800 }}>
          *** NO VALIDO COMO FACTURA ***
        </div>
      </div>
    </div>
  );
};

export default ThermalTicket;
