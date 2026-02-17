import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatDate } from '../utils';

interface WeeklyChartProps {
  data: { date: string; hours: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg border">
        <p className="font-medium text-gray-800">{formatDate(label)}</p>
        <p className="text-green-600 font-semibold">{payload[0].value}h</p>
      </div>
    );
  }
  return null;
};

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const hasData = data.some(d => d.hours > 0);

  if (!hasData) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Horas trabajadas (últimos 7 días)</h2>
        <p className="text-gray-500 text-center py-8">No hay datos esta semana</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Horas trabajadas (últimos 7 días)</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value + 'T00:00:00');
                return date.toLocaleDateString('es-ES', { weekday: 'short' });
              }}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              unit="h"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.hours > 0 ? '#22c55e' : '#e5e7eb'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
