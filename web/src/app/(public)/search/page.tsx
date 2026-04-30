'use client';

import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl">
        <h1 className="font-bold text-3xl md:text-5xl text-dark-text tracking-tight mb-8 text-center">
          Search Pearlsport
        </h1>

        <form onSubmit={handleSearch} className="relative mb-12">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for news, teams, players..."
            className="w-full bg-warm-white border-2 border-pearl-soft rounded-full py-4 pl-6 pr-16 text-lg text-dark-text focus:outline-none focus:border-pearl-red focus:bg-white transition-all shadow-sm"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 w-12 bg-pearl-red text-white rounded-full flex items-center justify-center hover:bg-pearl-deep transition-colors"
          >
            <SearchIcon size={20} />
          </button>
        </form>

        {/* Results Area */}
        {hasSearched && (
          <div>
            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-pearl-soft border-t-pearl-red rounded-full animate-spin" />
              </div>
            ) : (
              <div>
                <p className="text-muted-text font-bold mb-6">Found 2 results for "{query}"</p>
                
                <div className="space-y-6">
                  {/* Mock Result 1 */}
                  <Link href="/football/lira-fc-secures-thrilling-victory" className="block card p-6 group">
                    <div className="text-xs font-bold text-pearl-red uppercase tracking-wider mb-2">Football • Match Report</div>
                    <h3 className="font-bold text-xl text-dark-text mb-2 group-hover:text-pearl-red transition-colors">
                      Lira FC Secures Thrilling Last-Minute Victory in Regional Derby
                    </h3>
                    <p className="text-muted-text text-sm">
                      A 94th-minute header from captain Otim Emmanuel sent the home crowd into raptures as Lira FC defeated rivals Apach FC 2-1...
                    </p>
                  </Link>

                  {/* Mock Result 2 */}
                  <Link href="/athletics/championships-highlight-local-talent" className="block card p-6 group">
                    <div className="text-xs font-bold text-pearl-red uppercase tracking-wider mb-2">Athletics • News</div>
                    <h3 className="font-bold text-xl text-dark-text mb-2 group-hover:text-pearl-red transition-colors">
                      Athletics Championships Highlight Local Talent in Lango Region
                    </h3>
                    <p className="text-muted-text text-sm">
                      Several promising young athletes caught the eye of national scouts during the weekend track and field events...
                    </p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
