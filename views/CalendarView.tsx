
import React, { useState, useMemo } from 'react';
import { ICONS, MOCK_SERVICES, MOCK_USERS } from '../constants';
import { Appointment } from '../types';

const CalendarView: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'month'>('month');

  const [formData, setFormData] = useState({
    clientName: '',
    serviceId: MOCK_SERVICES[0].id,
    staffId: MOCK_USERS[1].id,
    time: '10:00',
    deposit: 0,
    notes: ''
  });

  const currentMonthDate = new Date(selectedDate);
  const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [daysInMonth, firstDayOfMonth]);

  const handleOpenModal = (app?: Appointment) => {
    if (app) {
      setEditingId(app.id);
      setFormData({
        clientName: app.clientName,
        serviceId: app.serviceId,
        staffId: app.staffId,
        time: new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        deposit: app.deposit,
        notes: app.notes || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        clientName: '',
        serviceId: MOCK_SERVICES[0].id,
        staffId: MOCK_USERS[1].id,
        time: '10:00',
        deposit: 0,
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const service = MOCK_SERVICES.find(s => s.id === formData.serviceId);
    const staff = MOCK_USERS.find(u => u.id === formData.staffId);
    
    const appointmentData: Appointment = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      clientId: 'c-' + Math.random(),
      clientName: formData.clientName,
      serviceId: formData.serviceId,
      staffId: formData.staffId,
      staffName: staff?.name || '',
      date: `${selectedDate}T${formData.time}:00`,
      deposit: Number(formData.deposit),
      total: service?.price || 0,
      status: 'PENDING',
      notes: formData.notes
    };

    if (editingId) {
      setAppointments(appointments.map(a => a.id === editingId ? appointmentData : a));
    } else {
      setAppointments([...appointments, appointmentData]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingId) {
      setAppointments(appointments.filter(a => a.id !== editingId));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#C5A059] tracking-tighter uppercase">Agenda</h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Gestión de Turnos y Especialistas</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#1A1A1A] p-1 rounded-2xl border border-[#C5A059]/10">
            <button 
              onClick={() => setViewMode('month')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase transition-all ${viewMode === 'month' ? 'bg-[#C5A059] text-black shadow-lg' : 'text-gray-500 hover:text-[#C5A059]'}`}
            >
              Mes
            </button>
            <button 
              onClick={() => setViewMode('day')}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase transition-all ${viewMode === 'day' ? 'bg-[#C5A059] text-black shadow-lg' : 'text-gray-500 hover:text-[#C5A059]'}`}
            >
              Día
            </button>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#C5A059] text-black px-8 py-4 rounded-2xl font-black shadow-xl shadow-[#C5A059]/10 flex items-center gap-2 hover:bg-[#E2C284] transition-all transform active:scale-95 text-xs uppercase"
          >
            {ICONS.Plus} Agendar Turno
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111111] p-8 rounded-[2.5rem] shadow-2xl border border-[#C5A059]/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-[#C5A059] uppercase tracking-widest text-sm">
                {currentMonthDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setMonth(d.getMonth() - 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }}
                  className="p-2 bg-black border border-[#C5A059]/10 text-[#C5A059] rounded-xl hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  &larr;
                </button>
                <button 
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setMonth(d.getMonth() + 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }}
                  className="p-2 bg-black border border-[#C5A059]/10 text-[#C5A059] rounded-xl hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  &rarr;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {['D','L','M','X','J','V','S'].map(d => (
                <span key={d} className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} className="h-10"></div>;
                const dateStr = `${currentMonthDate.getFullYear()}-${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const hasAppointments = appointments.some(a => a.date.startsWith(dateStr));
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all relative ${
                      isSelected 
                      ? 'bg-[#C5A059] text-black shadow-lg scale-110 z-10' 
                      : 'hover:bg-black hover:text-[#C5A059] text-gray-400'
                    }`}
                  >
                    {day}
                    {hasAppointments && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-[#C5A059] rounded-full"></span>}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="bg-[#C5A059] p-8 rounded-[2.5rem] shadow-xl text-black">
            <h4 className="font-black mb-2 flex items-center gap-2 uppercase text-xs tracking-widest">
              {ICONS.Calendar} Resumen Diario
            </h4>
            <div className="text-4xl font-black tracking-tighter">{appointments.filter(a => a.date.startsWith(selectedDate)).length}</div>
            <p className="text-black/60 font-bold text-[10px] uppercase tracking-widest mt-1">Turnos para hoy</p>
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#111111] rounded-[2.5rem] shadow-2xl border border-[#C5A059]/5 overflow-hidden">
          <div className="bg-black/40 p-8 border-b border-[#C5A059]/10 flex items-center justify-between">
            <h3 className="text-xl font-black text-[#C5A059] uppercase tracking-widest">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
          </div>
          
          <div className="p-8 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {appointments
              .filter(a => a.date.startsWith(selectedDate))
              .sort((a, b) => a.date.localeCompare(b.date))
              .map(app => (
                <div 
                  key={app.id} 
                  onClick={() => handleOpenModal(app)}
                  className="bg-black/30 border border-[#C5A059]/10 p-6 rounded-[2rem] shadow-sm hover:border-[#C5A059]/40 hover:bg-[#1A1A1A] transition-all group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center bg-[#C5A059] text-black px-4 py-2 rounded-2xl shadow-lg">
                      <span className="text-lg font-black">{new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-[9px] uppercase font-black text-black/60 tracking-tighter leading-none">HORA</span>
                    </div>
                    <div>
                      <h5 className="font-black text-white text-xl group-hover:text-[#C5A059] transition-colors">{app.clientName}</h5>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[9px] font-black text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 px-3 py-1 rounded-full uppercase tracking-widest">
                          {MOCK_SERVICES.find(s => s.id === app.serviceId)?.name}
                        </span>
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                          Con: {app.staffName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    {app.deposit > 0 && (
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-500/5 px-3 py-1 rounded-lg">
                        {ICONS.Check} Seña: ${app.deposit}
                      </div>
                    )}
                    <span className="text-[#C5A059]/20 group-hover:text-[#C5A059] transition-all font-black text-3xl leading-none">&rarr;</span>
                  </div>
                </div>
              ))}
              
            {appointments.filter(a => a.date.startsWith(selectedDate)).length === 0 && (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-700">
                <div className="mb-4 opacity-10 scale-150">{ICONS.Calendar}</div>
                <p className="font-black uppercase tracking-[0.4em] text-xs">Sin turnos agendados</p>
                <button onClick={() => handleOpenModal()} className="mt-4 text-[#C5A059] text-[10px] font-black uppercase tracking-widest hover:underline">Crear primera reserva</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-[3.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp border border-[#C5A059]/20">
            <div className="bg-[#1A1A1A] p-10 border-b border-[#C5A059]/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]/60">
                  {editingId ? 'Editando Registro' : 'Nueva Reserva'}
                </span>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-[#C5A059] text-3xl leading-none">&times;</button>
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{editingId ? 'Modificar Turno' : 'Agendar Cita'}</h3>
            </div>
            
            <form onSubmit={handleSaveAppointment} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-[#C5A059] uppercase mb-2 tracking-widest ml-3">Nombre del Cliente</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.clientName} 
                    onChange={e => setFormData({...formData, clientName: e.target.value})} 
                    className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white placeholder-gray-800" 
                    placeholder="Ej: Laura Rossi" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#C5A059] uppercase mb-2 tracking-widest ml-3">Hora</label>
                  <input 
                    required 
                    type="time" 
                    value={formData.time} 
                    onChange={e => setFormData({...formData, time: e.target.value})} 
                    className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#C5A059] uppercase mb-2 tracking-widest ml-3">Seña ($)</label>
                  <input 
                    type="number" 
                    value={formData.deposit || ''} 
                    onChange={e => setFormData({...formData, deposit: Number(e.target.value)})} 
                    className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white placeholder-0" 
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-[#C5A059] uppercase mb-2 tracking-widest ml-3">Tratamiento / Servicio</label>
                  <select 
                    value={formData.serviceId} 
                    onChange={e => setFormData({...formData, serviceId: e.target.value})} 
                    className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl outline-none font-bold text-white appearance-none"
                  >
                    {MOCK_SERVICES.map(s => <option key={s.id} value={s.id} className="bg-black">{s.name} - ${s.price}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-[#C5A059] uppercase mb-2 tracking-widest ml-3">Especialista Responsable</label>
                  <select 
                    value={formData.staffId} 
                    onChange={e => setFormData({...formData, staffId: e.target.value})} 
                    className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl outline-none font-bold text-white appearance-none"
                  >
                    {MOCK_USERS.map(u => <option key={u.id} value={u.id} className="bg-black">{u.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6">
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleDelete}
                    className="flex-1 py-5 border border-rose-500/20 text-rose-500 rounded-2xl font-black uppercase text-xs hover:bg-rose-500/5 transition-all"
                  >
                    Eliminar
                  </button>
                )}
                <button 
                  type="submit" 
                  className="flex-[2] bg-[#C5A059] text-black py-5 rounded-2xl font-black shadow-xl shadow-[#C5A059]/10 hover:bg-[#E2C284] transition-all transform active:scale-95 uppercase text-xs"
                >
                  {editingId ? 'Guardar Cambios' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
