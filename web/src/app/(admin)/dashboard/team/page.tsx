'use client';

import { useState } from 'react';
import { Plus, Settings2, ShieldBan, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Mock Data
const mockUsers = [
  { id: 'u1', name: 'Admin User', email: 'admin@pearlsport.it', role: 'ADMIN', isActive: true, createdAt: new Date().toISOString() },
  { id: 'u2', name: 'Jane Editor', email: 'jane@pearlsport.it', role: 'EDITOR', isActive: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'u3', name: 'John Writer', email: 'john@pearlsport.it', role: 'WRITER', isActive: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'u4', name: 'Bad Writer', email: 'bad@pearlsport.it', role: 'WRITER', isActive: false, createdAt: new Date(Date.now() - 259200000).toISOString() },
];

export default function AdminTeamPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text tracking-tight">Team Management</h1>
          <p className="text-muted-text">Manage writers, editors, and platform access.</p>
        </div>
        
        <button className="btn-primary">
          <Plus size={18} />
          Invite Team Member
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
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
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-pearl-light transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-dark-text text-sm">{user.name}</p>
                    <p className="text-xs text-muted-text">{user.email}</p>
                  </td>
                  <td className="p-4">
                    <select 
                      defaultValue={user.role}
                      className="border border-pearl-soft rounded bg-white px-2 py-1 text-xs font-bold text-dark-text focus:outline-none focus:border-pearl-red"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="EDITOR">Editor</option>
                      <option value="WRITER">Writer</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {user.isActive ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Active</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Deactivated</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-text">
                    {format(parseISO(user.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user.isActive ? (
                        <button className="p-1.5 text-orange-600 hover:bg-orange-50 bg-white border border-pearl-soft rounded" title="Deactivate">
                          <ShieldBan size={14} />
                        </button>
                      ) : (
                        <button className="p-1.5 text-green-600 hover:bg-green-50 bg-white border border-pearl-soft rounded" title="Reactivate">
                          <Settings2 size={14} />
                        </button>
                      )}
                      <button className="p-1.5 text-red-600 hover:bg-red-50 bg-white border border-pearl-soft rounded" title="Delete">
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
    </div>
  );
}
