
import React, { useState, useMemo } from 'react';
import { ICONS } from '../constants';
import { Product, Service, SheetConfig } from '../types';

interface InventoryViewProps {
  products: Product[];
  services: Service[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddService: (service: Service) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
  onSync: (id: string) => Promise<boolean>;
  config: SheetConfig;
  onUpdateConfig: (config: SheetConfig) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ 
  products, 
  services,
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onAddService,
  onUpdateService,
  onDeleteService,
  onSync, 
  config, 
  onUpdateConfig 
}) => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'SERVICES'>('PRODUCTS');
  const [showModal, setShowModal] = useState(false);
  const [showSyncPanel, setShowSyncPanel] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tempSheetId, setTempSheetId] = useState(config.sheetId);
  const [tempSyncUrl, setTempSyncUrl] = useState(config.syncUrl || '');
  const [editingItem, setEditingItem] = useState<Product | Service | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    value: 0, // stock o duracion
    minStock: 5,
    category: 'General'
  });

  const handleOpenModal = (item?: Product | Service) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        value: 'stock' in item ? item.stock : item.duration,
        minStock: 'minStock' in item ? item.minStock : 5,
        category: item.category
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        price: 0,
        value: activeTab === 'PRODUCTS' ? 0 : 60,
        minStock: 5,
        category: activeTab === 'PRODUCTS' ? 'Insumos' : 'Corporal'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemId = editingItem ? editingItem.id : Math.random().toString(36).substr(2, 9);

    if (activeTab === 'PRODUCTS') {
      const productData: Product = {
        id: itemId,
        name: formData.name,
        price: formData.price,
        stock: formData.value,
        minStock: formData.minStock,
        category: formData.category
      };
      editingItem ? onUpdateProduct(productData) : onAddProduct(productData);
    } else {
      const serviceData: Service = {
        id: itemId,
        name: formData.name,
        price: formData.price,
        duration: formData.value,
        category: formData.category
      };
      editingItem ? onUpdateService(serviceData) : onAddService(serviceData);
    }
    setShowModal(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    const success = await onSync(tempSheetId);
    setIsSyncing(false);
    if (success) {
      alert('Catálogo actualizado (Productos y Servicios) desde Google Sheets.');
    } else {
      alert('Error: Asegúrate de que el documento esté publicado en la web como CSV.');
    }
  };

  const saveConfig = () => {
    onUpdateConfig({ 
      ...config, 
      sheetId: tempSheetId, 
      syncUrl: tempSyncUrl 
    });
    alert('Configuración de sincronización guardada.');
  };

  const toggleAutoSync = () => {
    onUpdateConfig({ ...config, isAutoSync: !config.isAutoSync });
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      activeTab === 'PRODUCTS' ? onDeleteProduct(id) : onDeleteService(id);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#C5A059] tracking-tighter uppercase leading-none">Gestión Catálogo</h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Control de Productos y Servicios</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowSyncPanel(!showSyncPanel)}
            className={`px-8 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2 transition-all text-xs uppercase border ${
              config.sheetId 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
              : 'bg-black border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10'
            }`}
          >
            <span className={isSyncing ? 'animate-spin' : ''}>
              {config.sheetId ? 'Vínculo Sheet Activo' : 'Vincular Sheet'}
            </span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#C5A059] text-black px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#C5A059]/10 flex items-center gap-2 hover:bg-[#E2C284] transition-all transform active:scale-95 text-xs uppercase"
          >
            {ICONS.Plus} Nuevo {activeTab === 'PRODUCTS' ? 'Producto' : 'Servicio'}
          </button>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex gap-2 bg-[#111111] p-2 rounded-[2rem] border border-[#C5A059]/10 w-full md:w-fit">
        <button 
          onClick={() => setActiveTab('PRODUCTS')}
          className={`px-12 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'PRODUCTS' ? 'bg-[#C5A059] text-black' : 'text-gray-500 hover:text-white'}`}
        >
          Productos
        </button>
        <button 
          onClick={() => setActiveTab('SERVICES')}
          className={`px-12 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'SERVICES' ? 'bg-[#C5A059] text-black' : 'text-gray-500 hover:text-white'}`}
        >
          Servicios
        </button>
      </div>

      {showSyncPanel && (
        <div className="bg-[#1A1A1A] border border-[#C5A059]/20 p-8 rounded-[2.5rem] animate-slideUp space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">ID de Planilla (Lectura)</label>
              <input 
                type="text" 
                value={tempSheetId} 
                onChange={e => setTempSheetId(e.target.value)} 
                placeholder="ID de la URL del Sheet"
                className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">URL de Script (Escritura)</label>
              <input 
                type="text" 
                value={tempSyncUrl} 
                onChange={e => setTempSyncUrl(e.target.value)} 
                placeholder="https://script.google.com/macros/s/..."
                className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white text-xs"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div 
                    onClick={toggleAutoSync}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${config.isAutoSync ? 'bg-emerald-500' : 'bg-gray-800'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.isAutoSync ? 'left-7' : 'left-1'}`}></div>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronización Automática</span>
                </div>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">
                  Última: {config.lastSync ? new Date(config.lastSync).toLocaleTimeString() : 'Nunca'}
                </p>
             </div>
             <div className="flex gap-4">
                <button 
                  onClick={saveConfig}
                  className="bg-white/5 text-gray-400 px-8 py-3 rounded-xl font-black uppercase text-[10px] hover:bg-white/10"
                >
                  Guardar Configuración
                </button>
                <button 
                  onClick={handleSync}
                  disabled={isSyncing || !tempSheetId}
                  className="bg-[#C5A059] text-black px-10 py-3 rounded-xl font-black uppercase text-[10px] disabled:opacity-50 hover:bg-white transition-all shadow-xl shadow-[#C5A059]/10"
                >
                  {isSyncing ? 'Sincronizando...' : 'Forzar Lectura'}
                </button>
             </div>
          </div>
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
             <p className="text-blue-400 text-[9px] font-bold uppercase leading-relaxed">
               Asegúrate de que tu planilla tenga la columna <b>TIPO</b> (PRODUCTO o SERVICIO). El campo <b>VALOR</b> actuará como Stock o Duración según el caso.
             </p>
          </div>
        </div>
      )}

      <div className="bg-[#111111] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#C5A059]/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/50 border-b border-[#C5A059]/20">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Nombre</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Categoría</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Precio</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">
                  {activeTab === 'PRODUCTS' ? 'Stock' : 'Duración'}
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Estado</th>
                <th className="px-8 py-6 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/5">
              {activeTab === 'PRODUCTS' ? (
                products.length === 0 ? (
                  <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-700 font-black uppercase">No hay productos registrados</td></tr>
                ) : (
                  products.map((p) => {
                    const isLowStock = p.stock <= p.minStock;
                    return (
                      <tr key={p.id} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="px-8 py-6 font-black text-white text-lg">{p.name}</td>
                        <td className="px-8 py-6">
                          <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-black text-[#C5A059] border border-[#C5A059]/10">{p.category}</span>
                        </td>
                        <td className="px-8 py-6 font-black text-[#C5A059] text-lg">${p.price}</td>
                        <td className="px-8 py-6 font-black text-white text-lg">{p.stock} <span className="text-[9px] text-gray-500 uppercase">unid.</span></td>
                        <td className="px-8 py-6">
                           <span className={`flex items-center gap-1.5 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg border ${isLowStock ? 'text-rose-500 bg-rose-500/5 border-rose-500/10' : 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10'}`}>
                             {isLowStock ? ICONS.Alert : ICONS.Check} {isLowStock ? 'Stock Bajo' : 'En Stock'}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-4">
                            <button onClick={() => handleOpenModal(p)} className="text-gray-500 hover:text-white uppercase font-black text-[9px]">Editar</button>
                            <button onClick={() => handleDelete(p.id)} className="text-rose-900 hover:text-rose-500 uppercase font-black text-[9px]">Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )
              ) : (
                services.length === 0 ? (
                  <tr><td colSpan={6} className="px-8 py-20 text-center text-gray-700 font-black uppercase">No hay servicios registrados</td></tr>
                ) : (
                  services.map((s) => (
                    <tr key={s.id} className="hover:bg-[#1A1A1A] transition-colors">
                      <td className="px-8 py-6 font-black text-white text-lg">{s.name}</td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-black text-[#C5A059] border border-[#C5A059]/10">{s.category}</span>
                      </td>
                      <td className="px-8 py-6 font-black text-[#C5A059] text-lg">${s.price}</td>
                      <td className="px-8 py-6 font-black text-white text-lg">{s.duration} <span className="text-[9px] text-gray-500 uppercase">min.</span></td>
                      <td className="px-8 py-6">
                         <span className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/10">Activo</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-4">
                          <button onClick={() => handleOpenModal(s)} className="text-gray-500 hover:text-white uppercase font-black text-[9px]">Editar</button>
                          <button onClick={() => handleDelete(s.id)} className="text-rose-900 hover:text-rose-500 uppercase font-black text-[9px]">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-[3.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp border border-[#C5A059]/20">
            <div className="bg-[#1A1A1A] p-10 border-b border-[#C5A059]/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]/60">Editor de Catálogo</span>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-[#C5A059] text-3xl leading-none">&times;</button>
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{editingItem ? 'Editar Registro' : `Nuevo ${activeTab === 'PRODUCTS' ? 'Producto' : 'Servicio'}`}</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Nombre</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white" placeholder="Nombre completo" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Precio ($)</label>
                  <input required type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Categoría</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">{activeTab === 'PRODUCTS' ? 'Stock Actual' : 'Duración (min)'}</label>
                  <input required type="number" value={formData.value || ''} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white" />
                </div>
                {activeTab === 'PRODUCTS' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Stock Mínimo</label>
                    <input required type="number" value={formData.minStock || ''} onChange={e => setFormData({...formData, minStock: Number(e.target.value)})} className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white" />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 font-black text-gray-500 uppercase tracking-widest text-[10px]">Cancelar</button>
                <button type="submit" className="flex-[2] bg-[#C5A059] text-black py-5 rounded-2xl font-black text-xs uppercase shadow-xl shadow-[#C5A059]/10 hover:bg-[#E2C284] transition-all">Confirmar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
