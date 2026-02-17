import type { WorkRecords, TimeEntry, DayRecord } from '../types';

const STORAGE_KEY = 'time-tracker-records';

const isValidTimeEntry = (entry: unknown): entry is TimeEntry => {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    typeof (entry as TimeEntry).start === 'number' &&
    ((entry as TimeEntry).end === null || typeof (entry as TimeEntry).end === 'number')
  );
};

const isValidDayRecord = (record: unknown): record is DayRecord => {
  if (typeof record !== 'object' || record === null) return false;
  const r = record as DayRecord;
  return (
    typeof r.date === 'string' &&
    Array.isArray(r.entries) &&
    r.entries.every(isValidTimeEntry)
  );
};

const isValidWorkRecords = (data: unknown): data is WorkRecords => {
  if (typeof data !== 'object' || data === null) return false;
  const records = data as WorkRecords;
  return Object.values(records).every(isValidDayRecord);
};

export const getRecords = (): WorkRecords => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};
    
    const parsed = JSON.parse(data);
    if (!isValidWorkRecords(parsed)) {
      console.warn('Invalid data in localStorage, resetting...');
      return {};
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load records from localStorage:', error);
    return {};
  }
};

export const saveRecords = (records: WorkRecords): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Failed to save records to localStorage:', error);
    return false;
  }
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

export const calculateDayTotal = (entries: TimeEntry[], activeEntry?: TimeEntry | null): number => {
  let total = entries.reduce((sum, entry) => {
    if (entry.end === null) {
      return sum + (Date.now() - entry.start);
    }
    return sum + (entry.end - entry.start);
  }, 0);
  
  // Add live time for active entry if not already in entries
  if (activeEntry && !entries.includes(activeEntry)) {
    total += Date.now() - activeEntry.start;
  }
  
  return total;
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
