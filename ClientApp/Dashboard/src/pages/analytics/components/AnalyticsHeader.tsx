
interface AnalyticsHeaderProps {
  period: string;
  setPeriod: (period: string) => void;
}

import { BarChart3 } from 'lucide-react';

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ period, setPeriod }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-card/80 border border-border/50 p-6 md:p-8 shadow-xl">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-42 h-42 md:w-56 md:h-56 bg-blue-500/5 rounded-full blur-2xl md:blur-3xl -translate-y-21 md:-translate-y-28 -translate-x-21 md:-translate-x-28" />
      <div className="absolute bottom-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-purple-500/5 rounded-full blur-xl md:blur-2xl translate-y-18 md:translate-y-24 translate-x-18 md:translate-x-24" />

      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
            <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <div className="w-16 h-1 md:w-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-3" />
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Comprehensive insights and performance metrics for data-driven decisions
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground font-medium">Live Data</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3 bg-card/50 backdrop-blur-sm border border-border/30 p-1 rounded-2xl shadow-lg w-full md:w-auto">
          {['day', 'week', 'month'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex-1 md:flex-none ${
                period === p
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};