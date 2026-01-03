import type { AdvancedAnalytics } from '../../../services/adminService';

interface AnalyticsHeaderProps {
  period: string;
  setPeriod: (period: string) => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ period, setPeriod }) => {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">Analytics</h1>
        <p className="text-muted-foreground/80 font-medium text-lg">Detailed insights and performance metrics</p>
      </div>
      <div className="flex gap-2 bg-muted/50 p-1 rounded-xl">
        {['day', 'week', 'month'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${period === p
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'text-muted-foreground hover:bg-muted'
              }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};