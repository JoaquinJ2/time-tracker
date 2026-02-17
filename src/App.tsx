import { useState, useEffect } from 'react';
import { useTimeTracker } from './hooks/useTimeTracker';
import { StatusCard } from './components/StatusCard';
import { ActionButtons } from './components/ActionButtons';
import { EntriesList } from './components/EntriesList';
import { WeeklyChart } from './components/WeeklyChart';
import { Moon, Sun } from 'lucide-react';

function getInitialDarkMode(): boolean {
  // Try localStorage first
  try {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch {
    // If localStorage is invalid, ignore and fall through to system preference
  }
  
  // Fallback to system preference
  if (typeof window !== 'undefined') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
  
  return false;
}

function App() {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  // Sync dark mode class on mount and when state changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync initial state on mount
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          document.documentElement.classList.add('dark');
        }
      } catch {
        // Ignore invalid JSON
      }
    }
  }, []);

  const {
    activeEntry,
    todayTotal,
    todayEntries,
    weeklyData,
    clockIn,
    clockOut,
  } = useTimeTracker();

  const isWorking = activeEntry !== null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">⏱️ Control Horario</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Registra tu jornada laboral</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-600" />}
          </button>
        </div>

        {/* Status Card */}
        <StatusCard
          isWorking={isWorking}
          currentEntry={activeEntry}
          todayTotal={todayTotal}
          workHoursPerDay={8}
          darkMode={darkMode}
        />

        {/* Action Buttons */}
        <ActionButtons
          isWorking={isWorking}
          onClockIn={clockIn}
          onClockOut={clockOut}
          darkMode={darkMode}
        />

        {/* Today's Entries */}
        <EntriesList entries={todayEntries} darkMode={darkMode} />

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;
