'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Mock Data
const mockFixtures = Array.from({ length: 10 }).map((_, i) => ({
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
  const [filter, setFilter] = useState('all');

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-text tracking-tight">Fixtures & Results</h1>
          <p className="text-muted-text">Manage match schedules and enter final scores.</p>
        </div>
        
        <button className="btn-primary">
          <Plus size={18} />
          Add Fixture
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-pearl-soft bg-warm-white flex items-center gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-pearl-soft rounded-md bg-white px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-pearl-red"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="live">Live</option>
          </select>
          <select className="border border-pearl-soft rounded-md bg-white px-3 py-2 text-sm text-dark-text focus:outline-none focus:border-pearl-red">
            <option value="all">All Sports</option>
            <option value="football">Football</option>
            <option value="athletics">Athletics</option>
          </select>
        </div>

        <div className="overflow-x-auto">
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
              {mockFixtures.map((fixture) => (
                <tr key={fixture.id} className="hover:bg-pearl-light transition-colors group">
                  <td className="p-4 text-sm text-dark-text font-medium">
                    {format(parseISO(fixture.kickoffTime), 'dd MMM yyyy, HH:mm')}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-dark-text text-sm">
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
                      <button className="p-1.5 text-muted-text hover:text-pearl-red bg-white border border-pearl-soft rounded" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 text-muted-text hover:text-red-600 bg-white border border-pearl-soft rounded" title="Delete">
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
