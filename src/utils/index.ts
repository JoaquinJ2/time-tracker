import type { WorkRecords, TimeEntry } from '../types';

const STORAGE_KEY = 'time-tracker-records';

export const getRecords = (): WorkRecords => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveRecords = (records: WorkRecords): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getActiveEntry = (records: WorkRecords): TimeEntry | null => {
  const today = getToday();
  const todayRecord = records[today];
  
  if (!todayRecord || todayRecord.entries.length === 0) {
    return null;
  }
  
  // Find the last entry that doesn't have an end time
  const activeEntries = todayRecord.entries.filter(e => e.end === null);
  return activeEntries.length > 0 ? activeEntries[activeEntries.length - 1] : null;
};

export const calculateDayTotal = (entries: TimeEntry[]): number => {
  return entries.reduce((total, entry) => {
    if (entry.end === null) {
      // If entry is still active, count up to now
      return total + (Date.now() - entry.start);
    }
    return total + (entry.end - entry.start);
  }, 0);
};

export const formatDuration = (ms: number): string => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getLast7Days = (): string[] => {
  const days: string[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  
  return days;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};
