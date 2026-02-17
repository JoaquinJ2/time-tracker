import { formatTime, formatDuration, calculateDayTotal } from '../utils';
import type { TimeEntry } from '../types';

interface EntriesListProps {
  entries: TimeEntry[];
  darkMode?: boolean;
}

export const EntriesList = ({ entries, darkMode = false }: EntriesListProps) => {
  if (entries.length === 0) {
    return (
      <div className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 shadow-lg ${darkMode ? 'border-gray-700' : 'border-white/20'}`}>
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Intervalos de hoy</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-4`}>No hay registros hoy</p>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 shadow-lg ${darkMode ? 'border-gray-700' : 'border-white/20'}`}>
      <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
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
              className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <div className="flex items-center gap-4">
                <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>#{index + 1}</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {formatTime(entry.start)} - {entry.end ? formatTime(entry.end) : 'Actual'}
                </span>
              </div>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {formatDuration(duration)}
              </span>
            </div>
          );
        })}
      </div>
      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} flex justify-between`}>
        <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total del día:</span>
        <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatDuration(calculateDayTotal(entries))}</span>
      </div>
    </div>
  );
};
