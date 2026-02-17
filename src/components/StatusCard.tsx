import { Clock, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import type { TimeEntry } from '../types';
import { formatDuration } from '../utils';

const DEFAULT_WORK_HOURS = 8;

interface StatusCardProps {
  isWorking: boolean;
  currentEntry: TimeEntry | null;
  todayTotal: number;
  workHoursPerDay?: number;
  darkMode?: boolean;
}

export const StatusCard = ({ 
  isWorking, 
  currentEntry, 
  todayTotal, 
  workHoursPerDay = DEFAULT_WORK_HOURS,
  darkMode = false
}: StatusCardProps) => {
  const safeWorkHours = Math.max(workHoursPerDay, 0.1);
  const workHoursMs = safeWorkHours * 60 * 60 * 1000;
  
  const progressData = useMemo(() => {
    const remaining = workHoursMs - todayTotal;
    const isOvertime = remaining < 0;
    const overtime = isOvertime ? Math.abs(remaining) : 0;
    const remainingDisplay = isOvertime ? 0 : remaining;
    const progress = Math.min((todayTotal / workHoursMs) * 100, 100);
    
    return { remaining, isOvertime, overtime, remainingDisplay, progress };
  }, [todayTotal, workHoursMs]);

  const { isOvertime, overtime, remainingDisplay, progress } = progressData;

  return (
    <div className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-6 shadow-lg ${darkMode ? 'border-gray-700' : 'border-white/20'}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          isWorking 
            ? 'bg-green-100 text-green-700' 
            : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
        }`}>
          {isWorking ? '🟢 Trabajando' : '⚪ No trabajando'}
        </span>
        {currentEntry && (
          <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Clock size={16} />
            <span className="text-sm">Entrada: {new Date(currentEntry.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>
      
      <div className="text-center py-4">
        <div className={`text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {formatDuration(todayTotal)}
        </div>
        <div className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total hoy</div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Progreso</span>
          <span className="font-medium">{isNaN(progress) ? 0 : Math.max(progress, 0).toFixed(0)}%</span>
        </div>
        <div className={`w-full rounded-full h-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              isOvertime ? 'bg-red-500' : progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(isNaN(progress) ? 0 : progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Hours Info */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className={`text-center p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{DEFAULT_WORK_HOURS}h</div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Objetivo</div>
        </div>
        <div className={`text-center p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className={`text-lg font-semibold ${isOvertime ? 'text-blue-400' : darkMode ? 'text-white' : 'text-gray-800'}`}>
            {formatDuration(Math.max(0, remainingDisplay))}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Restante</div>
        </div>
      </div>

      {/* Overtime - Always visible, prominent */}
      <div className={`mt-4 p-4 rounded-xl border-2 ${
        isOvertime 
          ? 'bg-red-900/30 border-red-500' 
          : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-center gap-2">
          {isOvertime ? (
            <AlertCircle className="text-red-500" size={24} />
          ) : (
            <Clock className={darkMode ? 'text-gray-500' : 'text-gray-400'} size={24} />
          )}
          <div className="text-center">
            <div className={`text-2xl font-bold ${isOvertime ? 'text-red-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatDuration(overtime)}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Horas Extra</div>
          </div>
        </div>
      </div>
    </div>
  );
};
