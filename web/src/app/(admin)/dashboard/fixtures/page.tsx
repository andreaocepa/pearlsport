'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

// Mock Data
const initialMockFixtures = Array.from({ length: 10 }).map((_, i) => ({
  id: `f${i}`,
  competitionName: 'Lango Super League',
  sportName: 'Football',
  homeTeamName: `Home Team ${i}`,
  awayTeamName: `Away Team ${i}`,
  kickoffTime: new Date(Date.now() + (i - 2) * 24 * 60 * 60 * 1000).toISOString(),
  status: i < 2 ? 'COMPLETED' : 'UPCOMING',
  homeScore: i < 2 ? 2 : null,
  awayScore: i < 2 ? 1 : null,
}));

export default function AdminFixturesPage() {
  const [fixtures, setFixtures] = useState(initialMockFixtures);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFixture, setEditingFixture] = useState<any>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fixture?')) {
      setFixtures(fixtures.filter((f) => f.id !== id));
      toast.success('Fixture deleted successfully');
    }
  };

  const handleSaveFixture = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setEditingFixture(null);
    toast.success(editingFixture ? 'Fixture updated successfully' : 'Fixture created successfully');
  };

  const openEditModal = (fixture: any) => {
    setEditingFixture(fixture);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingFixture(null);
    setIsModalOpen(true);
  };

  const filteredFixtures = fixtures.filter((fixture) => {
    const matchesStatus = statusFilter === 'all' || fixture.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSport = sportFilter === 'all' || fixture.sportName.toLowerCase() === sportFilter.toLowerCase();
    return matchesStatus && matchesSport;
  });

  return (
    <div>
      <Toaster position="bottom-right" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text tracking-tight">Fixtures & Results</h1>
          <p className="text-muted-text">Manage match schedules and enter final scores.</p>
        </div>
        
        <button onClick={openAddModal} className="btn-primary flex-shrink-0">
          <Plus size={18} />
          Add Fixture
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-pearl-soft bg-warm-white flex flex-col sm:flex-row items-center gap-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto border border-pearl-soft rounded-md bg-white px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-pearl-red"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="live">Live</option>
          </select>
          <select 
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="w-full sm:w-auto border border-pearl-soft rounded-md bg-white px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-pearl-red"
          >
            <option value="all">All Sports</option>
            <option value="football">Football</option>
            <option value="athletics">Athletics</option>
          </select>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-pearl-soft">
          {filteredFixtures.map((fixture) => (
            <div key={fixture.id} className="p-4 bg-white hover:bg-pearl-light transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-muted-text bg-warm-white px-2 py-1 rounded">
                  {fixture.competitionName} • {fixture.sportName}
                </span>
                {fixture.status === 'COMPLETED' ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    {fixture.status}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    {fixture.status}
                  </span>
                )}
              </div>
              <p className="font-bold text-dark-text text-sm mb-1 text-center mt-3">
                {fixture.homeTeamName} 
                <span className="mx-2 text-pearl-red font-black">
                  {fixture.status === 'COMPLETED' ? `${fixture.homeScore} - ${fixture.awayScore}` : 'vs'}
                </span>
                {fixture.awayTeamName}
              </p>
              <p className="text-xs text-muted-text mb-4 text-center">
                {format(parseISO(fixture.kickoffTime), 'dd MMM yyyy, HH:mm')}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => openEditModal(fixture)} className="p-2 text-muted-text hover:text-pearl-red bg-warm-white border border-pearl-soft rounded flex-1 flex justify-center" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(fixture.id)} className="p-2 text-muted-text hover:text-red-600 bg-warm-white border border-pearl-soft rounded flex-1 flex justify-center" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filteredFixtures.length === 0 && (
            <div className="p-8 text-center text-muted-text">No fixtures found.</div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-white border-b border-pearl-soft text-xs font-bold text-muted-text uppercase tracking-wider">
                <th className="p-4">Date & Time</th>
                <th className="p-4">Match</th>
                <th className="p-4">Competition</th>
                <th className="p-4">Status / Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pearl-soft">
              {filteredFixtures.map((fixture) => (
                <tr key={fixture.id} className="hover:bg-pearl-light transition-colors group">
                  <td className="p-4 text-sm text-dark-text font-medium whitespace-nowrap">
                    {format(parseISO(fixture.kickoffTime), 'dd MMM yyyy, HH:mm')}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-dark-text text-sm whitespace-nowrap">
                      {fixture.homeTeamName} vs {fixture.awayTeamName}
                    </p>
                    <p className="text-xs text-muted-text">{fixture.sportName}</p>
                  </td>
                  <td className="p-4 text-sm text-muted-text">
                    {fixture.competitionName}
                  </td>
                  <td className="p-4">
                    {fixture.status === 'COMPLETED' ? (
                      <span className="font-bold text-lg text-dark-text">
                        {fixture.homeScore} - {fixture.awayScore}
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        {fixture.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(fixture)} className="p-1.5 text-muted-text hover:text-pearl-red bg-white border border-pearl-soft rounded" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(fixture.id)} className="p-1.5 text-muted-text hover:text-red-600 bg-white border border-pearl-soft rounded" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFixtures.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-text">
                    No fixtures found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-text hover:text-pearl-red"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-dark-text mb-6">
              {editingFixture ? 'Edit Fixture' : 'Add New Fixture'}
            </h2>
            
            <form onSubmit={handleSaveFixture} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-1">Home Team</label>
                  <input type="text" className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 focus:outline-none focus:border-pearl-red" required defaultValue={editingFixture?.homeTeamName} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-1">Away Team</label>
                  <input type="text" className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 focus:outline-none focus:border-pearl-red" required defaultValue={editingFixture?.awayTeamName} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-dark-text mb-1">Competition</label>
                <input type="text" className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 focus:outline-none focus:border-pearl-red" required defaultValue={editingFixture?.competitionName} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-1">Date & Time</label>
                  <input type="datetime-local" className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 focus:outline-none focus:border-pearl-red" required defaultValue={editingFixture ? format(parseISO(editingFixture.kickoffTime), "yyyy-MM-dd'T'HH:mm") : ''} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-1">Status</label>
                  <select className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 focus:outline-none focus:border-pearl-red" defaultValue={editingFixture?.status || 'UPCOMING'}>
                    <option value="UPCOMING">Upcoming</option>
                    <option value="LIVE">Live</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {editingFixture?.status === 'COMPLETED' && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-pearl-soft">
                  <div>
                    <label className="block text-sm font-bold text-dark-text mb-1">Home Score</label>
                    <input type="number" min="0" className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 focus:outline-none focus:border-pearl-red" defaultValue={editingFixture?.homeScore} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-dark-text mb-1">Away Score</label>
                    <input type="number" min="0" className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 focus:outline-none focus:border-pearl-red" defaultValue={editingFixture?.awayScore} />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary">Save Fixture</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
