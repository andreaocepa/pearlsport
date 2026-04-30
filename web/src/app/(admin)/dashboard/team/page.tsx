'use client';

import { useState } from 'react';
import { Plus, Settings2, ShieldBan, Trash2, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

// Mock Data
const initialUsers = [
  { id: 'u1', name: 'Admin User', email: 'admin@pearlsport.it', role: 'ADMIN', isActive: true, createdAt: new Date().toISOString() },
  { id: 'u2', name: 'Jane Editor', email: 'jane@pearlsport.it', role: 'EDITOR', isActive: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'u3', name: 'John Writer', email: 'john@pearlsport.it', role: 'WRITER', isActive: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'u4', name: 'Bad Writer', email: 'bad@pearlsport.it', role: 'WRITER', isActive: false, createdAt: new Date(Date.now() - 259200000).toISOString() },
];

export default function AdminTeamPage() {
  const [users, setUsers] = useState(initialUsers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleRoleChange = (id: string, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    toast.success('Role updated successfully');
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newStatus = !u.isActive;
        toast.success(`User ${newStatus ? 'reactivated' : 'deactivated'} successfully`);
        return { ...u, isActive: newStatus };
      }
      return u;
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
      toast.success('User deleted successfully');
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviteModalOpen(false);
    toast.success('Invitation sent successfully');
  };

  return (
    <div>
      <Toaster position="bottom-right" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text tracking-tight">Team Management</h1>
          <p className="text-muted-text">Manage writers, editors, and platform access.</p>
        </div>
        
        <button onClick={() => setIsInviteModalOpen(true)} className="btn-primary flex-shrink-0">
          <Plus size={18} />
          Invite Team Member
        </button>
      </div>

      <div className="card">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-pearl-soft">
          {users.map((user) => (
            <div key={user.id} className="p-4 bg-white hover:bg-pearl-light transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="font-bold text-dark-text text-sm truncate pr-2">
                  {user.name}
                </div>
                {user.isActive ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Active</span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Deactivated</span>
                )}
              </div>
              <p className="text-xs text-muted-text mb-3 truncate">{user.email}</p>
              
              <div className="flex items-center justify-between gap-4 mb-4">
                <select 
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border border-pearl-soft rounded bg-white px-2 py-1.5 text-xs font-bold text-dark-text focus:outline-none focus:border-pearl-red flex-1"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="EDITOR">Editor</option>
                  <option value="WRITER">Writer</option>
                </select>
                <span className="text-[10px] text-muted-text whitespace-nowrap">
                  {format(parseISO(user.createdAt), 'MMM d, yy')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {user.isActive ? (
                  <button onClick={() => toggleStatus(user.id)} className="p-2 text-orange-600 hover:bg-orange-50 bg-warm-white border border-pearl-soft rounded flex-1 flex justify-center items-center gap-2 text-xs font-bold" title="Deactivate">
                    <ShieldBan size={14} /> Deactivate
                  </button>
                ) : (
                  <button onClick={() => toggleStatus(user.id)} className="p-2 text-green-600 hover:bg-green-50 bg-warm-white border border-pearl-soft rounded flex-1 flex justify-center items-center gap-2 text-xs font-bold" title="Reactivate">
                    <Settings2 size={14} /> Reactivate
                  </button>
                )}
                <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 bg-warm-white border border-pearl-soft rounded flex-1 flex justify-center items-center gap-2 text-xs font-bold" title="Delete">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="p-8 text-center text-muted-text">No team members found.</div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-white border-b border-pearl-soft text-xs font-bold text-muted-text uppercase tracking-wider">
                <th className="p-4">Name & Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pearl-soft">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-pearl-light transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-dark-text text-sm truncate max-w-[200px]">{user.name}</p>
                    <p className="text-xs text-muted-text truncate max-w-[200px]">{user.email}</p>
                  </td>
                  <td className="p-4">
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="border border-pearl-soft rounded bg-white px-2 py-1 text-xs font-bold text-dark-text focus:outline-none focus:border-pearl-red"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="EDITOR">Editor</option>
                      <option value="WRITER">Writer</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {user.isActive ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Active</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Deactivated</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-text whitespace-nowrap">
                    {format(parseISO(user.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user.isActive ? (
                        <button onClick={() => toggleStatus(user.id)} className="p-1.5 text-orange-600 hover:bg-orange-50 bg-white border border-pearl-soft rounded" title="Deactivate">
                          <ShieldBan size={14} />
                        </button>
                      ) : (
                        <button onClick={() => toggleStatus(user.id)} className="p-1.5 text-green-600 hover:bg-green-50 bg-white border border-pearl-soft rounded" title="Reactivate">
                          <Settings2 size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 bg-white border border-pearl-soft rounded" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box relative">
            <button 
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute top-4 right-4 text-muted-text hover:text-pearl-red"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-dark-text mb-2">Invite Team Member</h2>
            <p className="text-sm text-muted-text mb-6">Send an email invitation to join the Pearlsport team.</p>
            
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-dark-text mb-1">Full Name</label>
                <input type="text" className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 focus:outline-none focus:border-pearl-red" required placeholder="Jane Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-dark-text mb-1">Email Address</label>
                <input type="email" className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 focus:outline-none focus:border-pearl-red" required placeholder="jane@pearlsport.it" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-dark-text mb-1">Role</label>
                <select className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 focus:outline-none focus:border-pearl-red" defaultValue="WRITER">
                  <option value="ADMIN">Admin (Full Access)</option>
                  <option value="EDITOR">Editor (Publish & Edit All)</option>
                  <option value="WRITER">Writer (Draft Own Articles)</option>
                </select>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                <button type="button" onClick={() => setIsInviteModalOpen(false)} className="btn-outline w-full sm:w-auto justify-center">Cancel</button>
                <button type="submit" className="btn-primary w-full sm:w-auto justify-center">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
