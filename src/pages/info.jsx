import React, { useState, useMemo } from 'react';
import { damLevels,Names } from '../DamData';
function alertValue(level) {
  if (level > 90) {
    return 'red';
  }
  if (level > 75 && level <= 90) {
    return 'red';
  }
  if (level > 50 && level <= 75) {
    return 'blue';
  }
  return 'grey';
}



const DAM_LIST = Object.entries(Names).map(([upperKey, displayName]) => {
  const normalized = upperKey
    .toLowerCase()
    .replace(/\s*\(.*\)/, '')   // strip out “(… )”
    .replace(/\s+/g, '_');      // replace spaces with underscores
  return {
    lookupKey:   normalized,  // e.g. “pamba”, “ponmudi”, “kakki”
    displayName,              // e.g. “Pamba”, “Ponmudi”, “Anathode”
  };
});

export default function Info() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy]     = useState('name'); // “name” or “level”

  // 4) Filter + sort DAM_LIST
  const filteredAndSorted = useMemo(() => {
    // 4a) Filter by searchTerm (case-insensitive substring):
    let list = DAM_LIST.filter(({ displayName }) =>
      displayName.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    // 4b) Sort either by name (A→Z) or by descending water‐level
    list.sort((a, b) => {
      if (sortBy === 'level') {
        const LA = damLevels[a.lookupKey]   ?? 0;
        const LB = damLevels[b.lookupKey]   ?? 0;
        return LB - LA; // descending water‐level
      } else {
        return a.displayName.localeCompare(b.displayName);
      }
    });

    return list;
  }, [searchTerm, sortBy]);


  function badgeBgClass(alertColor) {
    switch (alertColor) {
      case 'red':  return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'grey': return 'bg-gray-500';
      default:     return 'bg-gray-500';
    }
  }

  return (
    <div className="flex flex-col h-full max-h-screen bg-gray-50">
      <div className="flex flex-col h-[125px] p-4 shadow-md sticky top-0 bg-white z-10">
        <input
          className="mb-2 p-2 rounded border border-gray-300"
          type="text"
          placeholder="Search dam..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          className="border-2 rounded bg-white text-black p-2 hover:bg-blue-700 hover:text-white transition"
          onClick={() =>
            setSortBy((prev) => (prev === 'name' ? 'level' : 'name'))
          }
        >
          {sortBy === 'name' ? 'Sort by: Name (A→Z)' : 'Sort by: Storage Percnt.'}
        </button>
      </div>        
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <ul className='space-y-4'>
          {filteredAndSorted.map(({ lookupKey, displayName }, index) => {
            const level      = damLevels[lookupKey]    ?? 0;

            const alertColor = alertValue(level); 


            const borderClass = `border-2 border-${alertColor}-500`;
            const badgeClass  = `absolute -top-2 left-3 ${badgeBgClass( // position of alterbox
              alertColor
            )} text-white uppercase text-xs font-bold px-3 py-1 rounded-br-md rounded-bl-md rounded-tl-md rounded-tr-md`;

            return (
              <li key={index}>
                <div
                  className={`relative bg-white rounded-xl shadow-sm p-4 ${borderClass}`}
                >

                  <div className={badgeClass}>
                    {alertColor}
                  </div>

                  <div className="flex justify-between items-center">

                    <div className="">
                      <div className="text-lg font-semibold text-gray-900">
                        {displayName}
                      </div>
                      
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {level.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Storage %
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}

          {filteredAndSorted.length === 0 && (
            <li className="text-center text-gray-500 py-8">
              No dams found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

