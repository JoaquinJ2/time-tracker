export interface TimeEntry {
  start: number;
  end: number | null;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  entries: TimeEntry[];
}

export interface WorkRecords {
  [date: string]: DayRecord;
}
