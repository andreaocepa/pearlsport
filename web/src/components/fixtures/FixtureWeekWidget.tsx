'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Fixture } from '@/types';
import { cn, formatKickoff } from '@/lib/utils';

// Mock data type, normally fetched via API
interface FixtureWeekWidgetProps {
  initialFixtures?: Fixture[];
}

export default function FixtureWeekWidget({ initialFixtures = [] }: FixtureWeekWidgetProps) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const [activeDate, setActiveDate] = useState(today);

  // Generate 7 days for the tabs
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  // Filter fixtures for the active date
  const activeDateString = format(activeDate, 'yyyy-MM-dd');
  const activeFixtures = initialFixtures.filter(
    (f) => f.kickoffTime.startsWith(activeDateString)
  );

  return (
    <div className="card w-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-pearl-soft p-4 flex items-center justify-between">
        <h3 className="font-bold text-dark-text">This Week's Fixtures</h3>
        <div className="flex gap-2 text-muted-text">
          <button className="hover:text-pearl-red transition-colors" aria-label="Previous Week">
            <ChevronLeft size={20} />
          </button>
          <button className="hover:text-pearl-red transition-colors" aria-label="Next Week">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="bg-warm-white border-b border-pearl-soft p-2 flex overflow-x-auto hide-scrollbar">
        {weekDays.map((date) => {
          const isSelected = format(date, 'yyyy-MM-dd') === activeDateString;
          const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => setActiveDate(date)}
              className={cn(
                "flex-1 min-w-[4rem] py-2 px-1 rounded-md flex flex-col items-center justify-center transition-all duration-200",
                isSelected ? "bg-pearl-red text-white shadow-sm" : "text-muted-text hover:bg-pearl-light hover:text-pearl-red",
                isToday && !isSelected && "font-bold text-dark-text"
              )}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider mb-1">
                {format(date, 'EEE')}
              </span>
              <span className="text-lg font-bold leading-none">
                {format(date, 'd')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fixtures List */}
      <div className="p-0 flex flex-col flex-grow max-h-[400px] overflow-y-auto">
        {activeFixtures.length > 0 ? (
          <div className="divide-y divide-pearl-soft">
            {activeFixtures.map((fixture) => (
              <div 
                key={fixture.id} 
                className={cn(
                  "p-4 hover:bg-pearl-light transition-colors flex items-center justify-between group",
                  fixture.sport.slug !== 'football' && "opacity-80"
                )}
              >
                <div className="flex-1 flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-muted-text font-bold mb-1 group-hover:text-pearl-red transition-colors">
                    {fixture.competition.name} • {fixture.sport.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-dark-text text-right flex-1 truncate">
                      {fixture.homeTeam.name}
                    </span>
                    
                    {/* VS or Score Chip */}
                    {fixture.status === 'COMPLETED' ? (
                      <span className="vs-chip min-w-[3rem] text-center">
                        {fixture.homeScore} - {fixture.awayScore}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-muted-text min-w-[3rem] text-center bg-warm-white px-2 py-1 rounded">
                        {formatKickoff(fixture.kickoffTime)}
                      </span>
                    )}
                    
                    <span className="font-bold text-sm text-dark-text flex-1 truncate">
                      {fixture.awayTeam.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-muted-text">
            <span className="block text-4xl mb-2 opacity-20">⚽️</span>
            <p className="text-sm">No fixtures scheduled for {format(activeDate, 'MMMM d')}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
