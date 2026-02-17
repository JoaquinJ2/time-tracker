import { useState, useEffect, useCallback } from 'react';
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

  // Load records from localStorage on mount
  useEffect(() => {
    const loadedRecords = getRecords();
    setRecords(loadedRecords);
    
    const today = getToday();
    const todayRecord = loadedRecords[today];
    
    if (todayRecord) {
      setTodayEntries(todayRecord.entries);
      setTodayTotal(calculateDayTotal(todayRecord.entries));
    }
    
    setActiveEntry(getActiveEntry(loadedRecords));
  }, []);

  // Update weekly data
  useEffect(() => {
    const last7Days = getLast7Days();
    const data = last7Days.map(date => {
      const dayRecord = records[date];
      const totalMs = dayRecord ? calculateDayTotal(dayRecord.entries) : 0;
      return {
        date,
        hours: Math.round((totalMs / 3600000) * 100) / 100, // Convert to hours with 2 decimals
      };
    });
    setWeeklyData(data);
  }, [records, todayTotal]);

  // Update active entry and today total periodically
  useEffect(() => {
    if (!activeEntry) return;
    
    const interval = setInterval(() => {
      setTodayTotal(calculateDayTotal(todayEntries));
    }, 60000); // Update every minute
    
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
    
    saveRecords(updatedRecords);
    setRecords(updatedRecords);
    setActiveEntry(newEntry);
    setTodayEntries(updatedRecords[today].entries);
    setTodayTotal(calculateDayTotal(updatedRecords[today].entries));
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
      
      saveRecords(updatedRecords);
      setRecords(updatedRecords);
      setTodayEntries(entries);
      setTodayTotal(calculateDayTotal(entries));
    }
    
    setActiveEntry(null);
  }, [activeEntry, records]);

  return {
    records,
    activeEntry,
    todayTotal,
    todayEntries,
    weeklyData,
    clockIn,
    clockOut,
  };
};
