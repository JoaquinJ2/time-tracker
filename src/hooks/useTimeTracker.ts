import { useState, useEffect, useCallback, useRef } from 'react';
import type { WorkRecords, TimeEntry } from '../types';
import {
  getRecords,
  saveRecords,
  getToday,
  getActiveEntry,
  calculateDayTotal,
  getLast7Days,
} from '../utils';

export const useTimeTracker = () => {
  const [records, setRecords] = useState<WorkRecords>({});
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ date: string; hours: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track active entry for interval
  const activeEntryRef = useRef<TimeEntry | null>(null);
  activeEntryRef.current = activeEntry;

  // Load records from localStorage on mount
  useEffect(() => {
    try {
      const loadedRecords = getRecords();
      setRecords(loadedRecords);
      
      const today = getToday();
      const todayRecord = loadedRecords[today];
      
      if (todayRecord) {
        setTodayEntries(todayRecord.entries);
        setTodayTotal(calculateDayTotal(todayRecord.entries));
      }
      
      setActiveEntry(getActiveEntry(loadedRecords));
      setError(null);
    } catch (err) {
      setError('Failed to load records');
      console.error(err);
    }
  }, []);

  // Update weekly data
  useEffect(() => {
    const last7Days = getLast7Days();
    const data = last7Days.map(date => {
      const dayRecord = records[date];
      const totalMs = dayRecord ? calculateDayTotal(dayRecord.entries) : 0;
      return {
        date,
        hours: Math.round((totalMs / 3600000) * 100) / 100,
      };
    });
    setWeeklyData(data);
  }, [records, todayTotal]);

  // Update today total every second when working
  useEffect(() => {
    if (!activeEntry) return;
    
    const interval = setInterval(() => {
      // Calculate using activeEntry for live time
      const total = calculateDayTotal(todayEntries, activeEntryRef.current);
      setTodayTotal(total);
    }, 1000); // Update every second for live timer
    
    return () => clearInterval(interval);
  }, [activeEntry, todayEntries]);

  const clockIn = useCallback(() => {
    const newEntry: TimeEntry = {
      start: Date.now(),
      end: null,
    };
    
    const today = getToday();
    const updatedRecords = { ...records };
    
    if (!updatedRecords[today]) {
      updatedRecords[today] = { date: today, entries: [] };
    }
    
    updatedRecords[today] = {
      ...updatedRecords[today],
      entries: [...updatedRecords[today].entries, newEntry],
    };
    
    const saved = saveRecords(updatedRecords);
    if (!saved) {
      setError('Failed to save records');
      return;
    }
    
    setRecords(updatedRecords);
    setActiveEntry(newEntry);
    setTodayEntries(updatedRecords[today].entries);
    setTodayTotal(calculateDayTotal(updatedRecords[today].entries, newEntry));
    setError(null);
  }, [records]);

  const clockOut = useCallback(() => {
    if (!activeEntry) return;
    
    const today = getToday();
    const updatedRecords = { ...records };
    
    if (updatedRecords[today]) {
      const entries = updatedRecords[today].entries.map(entry =>
        entry.start === activeEntry.start
          ? { ...entry, end: Date.now() }
          : entry
      );
      
      updatedRecords[today] = {
        ...updatedRecords[today],
        entries,
      };
      
      const saved = saveRecords(updatedRecords);
      if (!saved) {
        setError('Failed to save records');
        return;
      }
      
      setRecords(updatedRecords);
      setTodayEntries(entries);
      setTodayTotal(calculateDayTotal(entries));
    }
    
    setActiveEntry(null);
    setError(null);
  }, [activeEntry, records]);

  return {
    records,
    activeEntry,
    todayTotal,
    todayEntries,
    weeklyData,
    clockIn,
    clockOut,
    error,
  };
};
