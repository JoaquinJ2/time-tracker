import { useTimeTracker } from './hooks/useTimeTracker';
import { StatusCard } from './components/StatusCard';
import { ActionButtons } from './components/ActionButtons';
import { EntriesList } from './components/EntriesList';
import { WeeklyChart } from './components/WeeklyChart';

function App() {
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">⏱️ Control Horario</h1>
          <p className="text-gray-500 mt-2">Registra tu jornada laboral</p>
        </div>

        {/* Status Card */}
        <StatusCard
          isWorking={isWorking}
          currentEntry={activeEntry}
          todayTotal={todayTotal}
          workHoursPerDay={8}
        />

        {/* Action Buttons */}
        <ActionButtons
          isWorking={isWorking}
          onClockIn={clockIn}
          onClockOut={clockOut}
        />

        {/* Today's Entries */}
        <EntriesList entries={todayEntries} />

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} />
      </div>
    </div>
  );
}

export default App;
