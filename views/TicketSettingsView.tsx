
import React from 'react';
import { TicketConfig, SaleItem } from '../types';
import ThermalTicket from '../components/ThermalTicket';

interface TicketSettingsViewProps {
  config: TicketConfig;
  setConfig: (config: TicketConfig) => void;
}

const MOCK_ITEMS: SaleItem[] = [
  { id: '1', name: 'Tratamiento Facial', type: 'SERVICE', price: 2500, quantity: 1 },
  { id: '2', name: 'Crema Hidratante', type: 'PRODUCT', price: 1200, quantity: 2 }
];

const TicketSettingsView: React.FC<TicketSettingsViewProps> = ({ config, setConfig }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <div>
        <h2 className="text-4xl font-black text-[#C5A059] tracking-tighter uppercase leading-none">Diseño de Ticket</h2>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Configuración Legal y Comercial</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Formulario */}
        <div className="bg-[#111111] p-10 rounded-[3rem] border border-[#C5A059]/10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Nombre del Negocio</label>
            <input 
              name="businessName"
              value={config.businessName}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white text-xs uppercase"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Eslogan / Subtítulo</label>
            <input 
              name="slogan"
              value={config.slogan}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Dirección</label>
              <input 
                name="address"
                value={config.address}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Localidad</label>
              <input 
                name="location"
                value={config.location}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Teléfono / WhatsApp</label>
              <input 
                name="phone"
                value={config.phone}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Sitio Web</label>
              <input 
                name="website"
                value={config.website}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Mensaje al Pie</label>
            <textarea 
              name="footerMessage"
              value={config.footerMessage}
              onChange={handleChange}
              rows={3}
              className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white text-xs resize-none"
            />
          </div>

          <div className="pt-4">
             <div className="p-4 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-2xl">
               <p className="text-[#C5A059] text-[9px] font-black uppercase tracking-widest text-center">Los cambios se guardan automáticamente al escribir</p>
             </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center">
          <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6">Vista Previa de Impresión</p>
          <div className="bg-white p-4 shadow-2xl rounded-sm">
            <ThermalTicket 
              config={config}
              saleId="EXAMPLE-001"
              items={MOCK_ITEMS}
              total={4900}
              paymentMethod="CASH"
              date={new Date().toISOString()}
              clientName="CLIENTE DE PRUEBA"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSettingsView;
