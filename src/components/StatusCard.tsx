import { Clock } from 'lucide-react';
import type { TimeEntry } from '../types';
import { formatDuration } from '../utils';

interface StatusCardProps {
  isWorking: boolean;
  currentEntry: TimeEntry | null;
  todayTotal: number;
}

export const StatusCard = ({ isWorking, currentEntry, todayTotal }: StatusCardProps) => {
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
    </div>
  );
};
