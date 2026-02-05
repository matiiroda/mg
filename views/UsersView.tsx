
import React, { useState } from 'react';
// Add MOCK_USERS to the imports from constants
import { ICONS, MOCK_USERS } from '../constants';
import { UserRole, User } from '../types';
import Logo from '../components/Logo';

const UsersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', role: UserRole.EMPLOYEE });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...newUser
    };
    setUsers([...users, user]);
    setShowModal(false);
    setNewUser({ name: '', username: '', role: UserRole.EMPLOYEE });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-[#C5A059] tracking-tighter uppercase leading-none">Equipo</h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Gestión de Accesos y Perfiles</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#C5A059] text-black px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#C5A059]/10 flex items-center gap-2 hover:bg-[#E2C284] transition-all transform active:scale-95 text-xs uppercase"
        >
          {ICONS.Plus} Nuevo Empleado
        </button>
      </div>

      <div className="bg-[#111111] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#C5A059]/10">
        <table className="w-full text-left">
          <thead className="bg-black/50 border-b border-[#C5A059]/20">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Nombre</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Usuario</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Rol</th>
              <th className="px-8 py-6 text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C5A059]/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#1A1A1A] transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black border border-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-black text-lg shadow-lg">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-black text-white text-lg tracking-tight">{user.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-gray-400 font-bold tracking-tight">@{user.username}</td>
                <td className="px-8 py-5">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    user.role === UserRole.ADMIN 
                    ? 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20' 
                    : 'bg-black text-gray-500 border-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <button className="text-gray-600 hover:text-[#C5A059] font-black text-[10px] uppercase tracking-widest transition-colors">EDITAR</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-[3.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-slideUp border border-[#C5A059]/20">
            <div className="bg-[#1A1A1A] p-10 border-b border-[#C5A059]/10 text-center">
              <Logo className="w-20 h-20 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-[#C5A059] uppercase tracking-widest">Nuevo Perfil</h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Crear Acceso al Sistema</p>
            </div>
            <form onSubmit={handleAddUser} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Nombre Completo</label>
                <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white placeholder-gray-800" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Usuario de Acceso</label>
                <input required type="text" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl focus:border-[#C5A059] outline-none font-bold text-white placeholder-gray-800" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-[#C5A059] uppercase tracking-widest ml-3">Rol de Sistema</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full px-6 py-4 bg-black border border-[#C5A059]/10 rounded-2xl outline-none font-bold text-white appearance-none">
                  <option value={UserRole.EMPLOYEE} className="bg-black">Empleado</option>
                  <option value={UserRole.ADMIN} className="bg-black">Administrador</option>
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 text-gray-500 font-black uppercase text-[10px] tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 bg-[#C5A059] text-black py-5 rounded-2xl font-black uppercase text-xs shadow-xl shadow-[#C5A059]/10 hover:bg-[#E2C284] transition-all">Crear Perfil</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersView;
