
interface AnalyticsHeaderProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
}

import { BarChart3, RefreshCw, Download, Calendar } from 'lucide-react';
import { Button } from '../../../components/forms/buttons/Button';
import { useState } from 'react';

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  startDate,
  endDate,
  onDateChange,
  onRefresh,
  onExport,
  loading
}) => {
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const dateRanges = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'Last year', days: 365 },
    { label: 'Custom', custom: true }
  ];

  const handleDateRangeSelect = (range: typeof dateRanges[0]) => {
    if (range.custom) {
      setShowCustomDatePicker(!showCustomDatePicker);
      return;
    }

    setShowCustomDatePicker(false);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (range.days || 7));

    onDateChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  };

  const getCurrentRangeLabel = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 7) return 'Last 7 days';
    if (diffDays === 30) return 'Last 30 days';
    if (diffDays === 90) return 'Last 90 days';
    if (diffDays === 365) return 'Last year';
    return 'Custom';
  };

  return (
    <div className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-lg">

      <div>
        {/* Title Section */}
        <div className="flex items-center gap-4 md:gap-6 mb-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
            <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              Site Analytics
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground font-medium">Live Data</span>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Date Range Section */}
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Date Range:</span>
              <span className="text-sm font-semibold text-foreground">{getCurrentRangeLabel()}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {dateRanges.map((range) => (
                  <Button
                    key={range.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateRangeSelect(range)}
                    className={`text-xs whitespace-nowrap ${getCurrentRangeLabel() === range.label && !range.custom
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : range.custom && showCustomDatePicker
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'hover:bg-muted/50'
                      }`}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>

              {/* Custom Date Picker */}
              {showCustomDatePicker && (
                <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">From:</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => onDateChange(e.target.value, endDate)}
                      className="px-3 py-1 border border-border rounded text-sm bg-background"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">To:</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => onDateChange(startDate, e.target.value)}
                      className="px-3 py-1 border border-border rounded text-sm bg-background"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              variant="outline"
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};