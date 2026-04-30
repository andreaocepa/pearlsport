'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Trophy } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

const initialMockFixtures = Array.from({ length: 10 }).map((_, i) => ({
  id: `f${i}`,
  competitionName: 'Lango Super League',
  sportName: 'Football',
  homeTeamName: `Home Team ${i}`,
  awayTeamName: `Away Team ${i}`,
  venue: 'Lira Town Stadium',
  kickoffTime: new Date(Date.now() + (i - 2) * 24 * 60 * 60 * 1000).toISOString(),
  status: i < 2 ? 'COMPLETED' : i === 2 ? 'LIVE' : 'UPCOMING',
  homeScore: i < 2 ? 2 : null,
  awayScore: i < 2 ? 1 : null,
}));

const statusColors: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  LIVE: 'bg-red-100 text-red-700 animate-pulse',
  UPCOMING: 'bg-gray-100 text-gray-600',
};

const emptyFixture = {
  id: '',
  competitionName: '',
  sportName: 'Football',
  homeTeamName: '',
  awayTeamName: '',
  venue: '',
  kickoffTime: '',
  status: 'UPCOMING',
  homeScore: null as number | null,
  awayScore: null as number | null,
};

export default function AdminFixturesPage() {
  const [fixtures, setFixtures] = useState(initialMockFixtures);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<typeof emptyFixture>(emptyFixture);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this fixture?')) {
      setFixtures(fixtures.filter((f) => f.id !== id));
      toast.success('Fixture deleted');
    }
  };

  const openAddModal = () => {
    setForm({ ...emptyFixture, id: `f-new-${Date.now()}` });
    setIsModalOpen(true);
  };

  const openEditModal = (fixture: typeof emptyFixture) => {
    setForm({ ...fixture });
    setIsModalOpen(true);
  };

  const handleFormChange = (field: string, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = fixtures.some((f) => f.id === form.id);
    if (isEdit) {
      setFixtures(fixtures.map((f) => (f.id === form.id ? { ...form } : f)));
      toast.success('Fixture updated');
    } else {
      setFixtures([form, ...fixtures]);
      toast.success('Fixture added');
    }
    setIsModalOpen(false);
  };

  const filteredFixtures = fixtures.filter((f) => {
    const matchesStatus = statusFilter === 'all' || f.status.toLowerCase() === statusFilter;
    const matchesSport = sportFilter === 'all' || f.sportName.toLowerCase() === sportFilter;
    return matchesStatus && matchesSport;
  });

  return (
    <div>
      <Toaster position="bottom-right" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text tracking-tight">Fixtures &amp; Results</h1>
          <p className="text-muted-text">Manage match schedules and enter final scores.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex-shrink-0">
          <Plus size={18} /> Add Fixture
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-pearl-soft bg-warm-white flex flex-col sm:flex-row items-center gap-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto border border-pearl-soft rounded-md bg-white px-3 py-2 text-sm focus:outline-none focus:border-pearl-red">
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
          </select>
          <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)}
            className="w-full sm:w-auto border border-pearl-soft rounded-md bg-white px-3 py-2 text-sm focus:outline-none focus:border-pearl-red">
            <option value="all">All Sports</option>
            <option value="football">Football</option>
            <option value="athletics">Athletics</option>
            <option value="basketball">Basketball</option>
            <option value="rugby">Rugby</option>
          </select>
          <span className="text-xs text-muted-text ml-auto hidden sm:block">{filteredFixtures.length} fixture(s)</span>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-pearl-soft">
          {filteredFixtures.map((f) => (
            <div key={f.id} className="p-4 bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-text">{f.competitionName} · {f.sportName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[f.status] || 'bg-gray-100 text-gray-600'}`}>{f.status}</span>
              </div>
              <p className="font-bold text-dark-text text-sm text-center my-2">
                {f.homeTeamName}
                <span className="mx-2 text-pearl-red font-black">
                  {f.status === 'COMPLETED' ? `${f.homeScore} - ${f.awayScore}` : 'vs'}
                </span>
                {f.awayTeamName}
              </p>
              <p className="text-xs text-muted-text text-center mb-3">
                {format(parseISO(f.kickoffTime), 'dd MMM yyyy, HH:mm')} · {f.venue}
              </p>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(f as any)} className="flex-1 p-2 text-xs font-bold text-muted-text hover:text-pearl-red bg-warm-white border border-pearl-soft rounded flex justify-center items-center gap-1">
                  <Edit2 size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(f.id)} className="flex-1 p-2 text-xs font-bold text-red-600 hover:bg-red-50 bg-warm-white border border-pearl-soft rounded flex justify-center items-center gap-1">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
          {filteredFixtures.length === 0 && <div className="p-8 text-center text-muted-text">No fixtures found.</div>}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-white border-b border-pearl-soft text-xs font-bold text-muted-text uppercase tracking-wider">
                <th className="p-4">Date &amp; Time</th>
                <th className="p-4">Match</th>
                <th className="p-4">Competition</th>
                <th className="p-4">Venue</th>
                <th className="p-4">Status / Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pearl-soft">
              {filteredFixtures.map((f) => (
                <tr key={f.id} className="hover:bg-pearl-light transition-colors group">
                  <td className="p-4 text-sm text-dark-text font-medium whitespace-nowrap">
                    {format(parseISO(f.kickoffTime), 'dd MMM yyyy, HH:mm')}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-dark-text text-sm whitespace-nowrap">{f.homeTeamName} vs {f.awayTeamName}</p>
                    <p className="text-xs text-muted-text">{f.sportName}</p>
                  </td>
                  <td className="p-4 text-sm text-muted-text">{f.competitionName}</td>
                  <td className="p-4 text-sm text-muted-text">{f.venue}</td>
                  <td className="p-4">
                    {f.status === 'COMPLETED' ? (
                      <span className="font-bold text-lg text-dark-text flex items-center gap-1">
                        <Trophy size={14} className="text-yellow-500" />
                        {f.homeScore} – {f.awayScore}
                      </span>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${statusColors[f.status]}`}>{f.status}</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(f as any)} className="p-1.5 text-muted-text hover:text-pearl-red bg-white border border-pearl-soft rounded" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="p-1.5 text-red-500 hover:bg-red-50 bg-white border border-pearl-soft rounded" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFixtures.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-text">No fixtures found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-text hover:text-pearl-red">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-dark-text mb-6">
              {fixtures.some((f) => f.id === form.id) ? 'Edit Fixture' : 'Add New Fixture'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-1">Home Team *</label>
                  <input type="text" required value={form.homeTeamName}
                    onChange={(e) => handleFormChange('homeTeamName', e.target.value)}
                    className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red"
                    placeholder="e.g. Lira FC" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-1">Away Team *</label>
                  <input type="text" required value={form.awayTeamName}
                    onChange={(e) => handleFormChange('awayTeamName', e.target.value)}
                    className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red"
                    placeholder="e.g. Gulu United" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-1">Competition *</label>
                  <input type="text" required value={form.competitionName}
                    onChange={(e) => handleFormChange('competitionName', e.target.value)}
                    className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red"
                    placeholder="e.g. Lango Super League" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-1">Sport *</label>
                  <select value={form.sportName} onChange={(e) => handleFormChange('sportName', e.target.value)}
                    className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red">
                    <option>Football</option>
                    <option>Athletics</option>
                    <option>Basketball</option>
                    <option>Rugby</option>
                    <option>Boxing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-dark-text mb-1">Venue</label>
                <input type="text" value={form.venue}
                  onChange={(e) => handleFormChange('venue', e.target.value)}
                  className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red"
                  placeholder="e.g. Lira Town Stadium" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-1">Kickoff Date &amp; Time *</label>
                  <input type="datetime-local" required
                    value={form.kickoffTime ? format(parseISO(form.kickoffTime), "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => handleFormChange('kickoffTime', e.target.value ? new Date(e.target.value).toISOString() : '')}
                    className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-dark-text mb-1">Match Status *</label>
                  <select value={form.status} onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full bg-warm-white border border-pearl-soft rounded-md px-3 py-2 text-sm focus:outline-none focus:border-pearl-red">
                    <option value="UPCOMING">Upcoming</option>
                    <option value="LIVE">Live</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {/* Score inputs appear dynamically when status is COMPLETED or LIVE */}
              {(form.status === 'COMPLETED' || form.status === 'LIVE') && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-pearl-light rounded-md border border-pearl-soft">
                  <div>
                    <label className="block text-sm font-bold text-dark-text mb-1">
                      {form.homeTeamName || 'Home'} Score
                    </label>
                    <input type="number" min="0" max="99"
                      value={form.homeScore ?? ''}
                      onChange={(e) => handleFormChange('homeScore', e.target.value === '' ? null : Number(e.target.value))}
                      className="w-full bg-white border border-pearl-soft rounded-md px-3 py-2 text-sm text-center font-bold text-xl focus:outline-none focus:border-pearl-red"
                      placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-dark-text mb-1">
                      {form.awayTeamName || 'Away'} Score
                    </label>
                    <input type="number" min="0" max="99"
                      value={form.awayScore ?? ''}
                      onChange={(e) => handleFormChange('awayScore', e.target.value === '' ? null : Number(e.target.value))}
                      className="w-full bg-white border border-pearl-soft rounded-md px-3 py-2 text-sm text-center font-bold text-xl focus:outline-none focus:border-pearl-red"
                      placeholder="0" />
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline w-full sm:w-auto justify-center">Cancel</button>
                <button type="submit" className="btn-primary w-full sm:w-auto justify-center">Save Fixture</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
