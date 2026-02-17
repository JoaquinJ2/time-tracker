import { formatTime, formatDuration, calculateDayTotal } from '../utils';
import type { TimeEntry } from '../types';

interface EntriesListProps {
  entries: TimeEntry[];
}

export const EntriesList = ({ entries }: EntriesListProps) => {
  if (entries.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Intervalos de hoy</h2>
        <p className="text-gray-500 text-center py-4">No hay registros hoy</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Intervalos de hoy ({entries.length})
      </h2>
      <div className="space-y-3">
        {entries.map((entry, index) => {
          const duration = entry.end 
            ? entry.end - entry.start 
            : Date.now() - entry.start;
          
          return (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500 font-medium">#{index + 1}</span>
                <span className="text-gray-700">
                  {formatTime(entry.start)} - {entry.end ? formatTime(entry.end) : 'Actual'}
                </span>
              </div>
              <span className="font-semibold text-gray-800">
                {formatDuration(duration)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
        <span className="font-semibold text-gray-700">Total del día:</span>
        <span className="font-bold text-gray-800">{formatDuration(calculateDayTotal(entries))}</span>
      </div>
    </div>
  );
};
