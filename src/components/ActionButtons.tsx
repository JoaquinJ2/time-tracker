import { Play, Square } from 'lucide-react';

interface ActionButtonsProps {
  isWorking: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
}

export const ActionButtons = ({ isWorking, onClockIn, onClockOut }: ActionButtonsProps) => {
  return (
    <div className="flex gap-4 justify-center">
      {!isWorking ? (
        <button
          onClick={onClockIn}
          className="flex items-center gap-3 px-10 py-5 bg-green-500 hover:bg-green-600 text-white text-xl font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Play size={28} fill="currentColor" />
          Entrar
        </button>
      ) : (
        <button
          onClick={onClockOut}
          className="flex items-center gap-3 px-10 py-5 bg-red-500 hover:bg-red-600 text-white text-xl font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Square size={28} fill="currentColor" />
          Salir
        </button>
      )}
    </div>
  );
};
