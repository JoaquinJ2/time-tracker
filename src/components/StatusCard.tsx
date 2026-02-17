import { Clock } from 'lucide-react';
import { useMemo } from 'react';
import type { TimeEntry } from '../types';
import { formatDuration } from '../utils';

const DEFAULT_WORK_HOURS = 8;

interface StatusCardProps {
  isWorking: boolean;
  currentEntry: TimeEntry | null;
  todayTotal: number;
  workHoursPerDay?: number;
}

export const StatusCard = ({ 
  isWorking, 
  currentEntry, 
  todayTotal, 
  workHoursPerDay = DEFAULT_WORK_HOURS 
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          isWorking 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {isWorking ? '🟢 Trabajando' : '⚪ No trabajando'}
        </span>
        {currentEntry && (
          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={16} />
            <span className="text-sm">Entrada: {new Date(currentEntry.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>
      
      <div className="text-center py-4">
        <div className="text-5xl font-bold text-gray-800">
          {formatDuration(todayTotal)}
        </div>
        <div className="text-gray-500 mt-2">Total hoy</div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progreso</span>
          <span className="font-medium">{isNaN(progress) ? 0 : Math.max(progress, 0).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              isOvertime ? 'bg-red-500' : progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(isNaN(progress) ? 0 : progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Hours Info */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <div className="text-lg font-semibold text-gray-800">{DEFAULT_WORK_HOURS}h</div>
          <div className="text-xs text-gray-500">Objetivo</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <div className={`text-lg font-semibold ${isOvertime ? 'text-red-600' : 'text-blue-600'}`}>
            {isOvertime ? formatDuration(overtime) : formatDuration(Math.max(0, remainingDisplay))}
          </div>
          <div className="text-xs text-gray-500">{isOvertime ? 'Extra' : 'Restante'}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <div className={`text-lg font-semibold ${isOvertime ? 'text-red-600' : 'text-gray-400'}`}>
            {isOvertime ? `+${formatDuration(overtime)}` : '0m'}
          </div>
          <div className="text-xs text-gray-500">Horas extra</div>
        </div>
      </div>
    </div>
  );
};
