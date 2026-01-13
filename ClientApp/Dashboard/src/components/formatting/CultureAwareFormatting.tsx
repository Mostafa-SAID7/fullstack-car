/**
 * React components for culture-aware data formatting
 * These components automatically format data based on the user's selected culture
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  useCultureFormatting,
  DateFormatOptions,
  NumberFormatOptions,
  CurrencyFormatOptions,
  SupportedCulture
} from '../../utils/cultureFormatting';

// ============================================================================
// DATE FORMATTING COMPONENTS
// ============================================================================

export interface FormattedDateProps {
  date: string | Date | number;
  format?: DateFormatOptions['format'];
  includeTime?: boolean;
  use24Hour?: boolean;
  culture?: SupportedCulture;
  className?: string;
  title?: string; // Tooltip with full date
}

/**
 * Component for displaying culture-aware formatted dates
 */
const FormattedDate: React.FC<FormattedDateProps> = ({
  date,
  format = 'short',
  includeTime = false,
  use24Hour = false,
  culture,
  className,
  title
}) => {
  const { formatDate } = useCultureFormatting(culture);
  
  const formattedDate = formatDate(date, { format, includeTime, use24Hour });
  const tooltipTitle = title || (format !== 'full' ? formatDate(date, { format: 'full' }) : undefined);

  return (
    <span className={className} title={tooltipTitle}>
      {formattedDate}
    </span>
  );
};

export interface RelativeTimeProps {
  date: string | Date | number;
  culture?: SupportedCulture;
  className?: string;
  updateInterval?: number; // Auto-update interval in milliseconds
}

/**
 * Component for displaying relative time (e.g., "2 hours ago")
 */
const RelativeTime: React.FC<RelativeTimeProps> = ({
  date,
  culture,
  className,
  updateInterval = 60000 // Update every minute by default
}) => {
  const { formatRelativeTime } = useCultureFormatting(culture);
  const [formattedTime, setFormattedTime] = React.useState(() => formatRelativeTime(date));

  React.useEffect(() => {
    if (!updateInterval) return;

    const interval = setInterval(() => {
      setFormattedTime(formatRelativeTime(date));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [date, formatRelativeTime, updateInterval]);

  return (
    <span className={className} title={new Date(date).toLocaleString()}>
      {formattedTime}
    </span>
  );
};

// ============================================================================
// NUMBER FORMATTING COMPONENTS
// ============================================================================

export interface FormattedNumberProps {
  value: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  notation?: NumberFormatOptions['notation'];
  culture?: SupportedCulture;
  className?: string;
  compact?: boolean; // Use compact notation (1.2K, 3.4M)
}

/**
 * Component for displaying culture-aware formatted numbers
 */
const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  minimumFractionDigits,
  maximumFractionDigits,
  notation,
  culture,
  className,
  compact = false
}) => {
  const { formatNumber, formatCompactNumber } = useCultureFormatting(culture);
  
  const formattedValue = compact 
    ? formatCompactNumber(value)
    : formatNumber(value, {
        minimumFractionDigits,
        maximumFractionDigits,
        notation
      });

  return (
    <span className={className} title={compact ? formatNumber(value) : undefined}>
      {formattedValue}
    </span>
  );
};

export interface FormattedPercentageProps {
  value: number;
  total?: number;
  decimals?: number;
  culture?: SupportedCulture;
  className?: string;
}

/**
 * Component for displaying culture-aware formatted percentages
 */
const FormattedPercentage: React.FC<FormattedPercentageProps> = ({
  value,
  total,
  decimals = 1,
  culture,
  className
}) => {
  const { formatPercentage } = useCultureFormatting(culture);
  
  const formattedValue = formatPercentage(value, total, decimals);

  return (
    <span className={className}>
      {formattedValue}
    </span>
  );
};

// ============================================================================
// CURRENCY FORMATTING COMPONENTS
// ============================================================================

export interface FormattedCurrencyProps {
  amount: number;
  currency?: string;
  currencyDisplay?: CurrencyFormatOptions['currencyDisplay'];
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  culture?: SupportedCulture;
  className?: string;
  useLocalCurrency?: boolean; // Use culture-specific currency
}

/**
 * Component for displaying culture-aware formatted currency
 */
const FormattedCurrency: React.FC<FormattedCurrencyProps> = ({
  amount,
  currency,
  currencyDisplay = 'symbol',
  minimumFractionDigits,
  maximumFractionDigits,
  culture,
  className,
  useLocalCurrency = false
}) => {
  const { formatCurrency, formatLocalCurrency } = useCultureFormatting(culture);
  
  const formattedValue = useLocalCurrency
    ? formatLocalCurrency(amount)
    : formatCurrency(amount, {
        currency,
        currencyDisplay,
        minimumFractionDigits,
        maximumFractionDigits
      });

  return (
    <span className={className}>
      {formattedValue}
    </span>
  );
};

// ============================================================================
// UTILITY FORMATTING COMPONENTS
// ============================================================================

export interface FormattedFileSizeProps {
  bytes: number;
  decimals?: number;
  culture?: SupportedCulture;
  className?: string;
}

/**
 * Component for displaying formatted file sizes
 */
const FormattedFileSize: React.FC<FormattedFileSizeProps> = ({
  bytes,
  decimals = 2,
  culture,
  className
}) => {
  const { formatFileSize } = useCultureFormatting(culture);
  
  const formattedSize = formatFileSize(bytes, decimals);

  return (
    <span className={className} title={`${bytes} bytes`}>
      {formattedSize}
    </span>
  );
};

export interface FormattedDurationProps {
  seconds: number;
  format?: 'short' | 'long';
  culture?: SupportedCulture;
  className?: string;
}

/**
 * Component for displaying formatted durations
 */
const FormattedDuration: React.FC<FormattedDurationProps> = ({
  seconds,
  format = 'short',
  culture,
  className
}) => {
  const { formatDuration } = useCultureFormatting(culture);
  
  const formattedDuration = formatDuration(seconds, format);

  return (
    <span className={className}>
      {formattedDuration}
    </span>
  );
};

export interface FormattedDataRateProps {
  bytesPerSecond: number;
  culture?: SupportedCulture;
  className?: string;
}

/**
 * Component for displaying formatted data transfer rates
 */
const FormattedDataRate: React.FC<FormattedDataRateProps> = ({
  bytesPerSecond,
  culture,
  className
}) => {
  const { formatDataRate } = useCultureFormatting(culture);
  
  const formattedRate = formatDataRate(bytesPerSecond);

  return (
    <span className={className}>
      {formattedRate}
    </span>
  );
};

// ============================================================================
// COMPOSITE FORMATTING COMPONENTS
// ============================================================================

export interface StatisticCardProps {
  title: string;
  value: number;
  type: 'number' | 'currency' | 'percentage';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  culture?: SupportedCulture;
  className?: string;
  compact?: boolean;
}

/**
 * Composite component for displaying statistics with culture-aware formatting
 */
const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  type,
  trend,
  culture,
  className,
  compact = true
}) => {
  const { t } = useTranslation();
  const { isRTL } = useCultureFormatting(culture);

  const renderValue = () => {
    switch (type) {
      case 'currency':
        return <FormattedCurrency amount={value} culture={culture} useLocalCurrency />;
      case 'percentage':
        return <FormattedPercentage value={value} culture={culture} />;
      default:
        return <FormattedNumber value={value} culture={culture} compact={compact} />;
    }
  };

  const renderTrend = () => {
    if (!trend) return null;

    const trendIcon = trend.isPositive ? '↗' : '↘';
    const trendColor = trend.isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <div className={`flex items-center text-xs ${trendColor} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className={isRTL ? 'ml-1' : 'mr-1'}>{trendIcon}</span>
        <FormattedPercentage value={Math.abs(trend.value)} culture={culture} />
      </div>
    );
  };

  return (
    <div className={`p-4 bg-white rounded-lg shadow ${className}`}>
      <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{renderValue()}</p>
        </div>
        {renderTrend()}
      </div>
    </div>
  );
};

export interface DataTableCellProps {
  value: any;
  type: 'text' | 'number' | 'currency' | 'date' | 'percentage' | 'filesize' | 'duration';
  culture?: SupportedCulture;
  className?: string;
  dateFormat?: DateFormatOptions['format'];
  compact?: boolean;
}

/**
 * Component for formatting data table cells based on data type
 */
const DataTableCell: React.FC<DataTableCellProps> = ({
  value,
  type,
  culture,
  className,
  dateFormat = 'short',
  compact = false
}) => {
  if (value === null || value === undefined) {
    return <span className={`text-muted-foreground ${className}`}>—</span>;
  }

  const renderValue = () => {
    switch (type) {
      case 'number':
        return <FormattedNumber value={value} culture={culture} compact={compact} />;
      case 'currency':
        return <FormattedCurrency amount={value} culture={culture} useLocalCurrency />;
      case 'date':
        return <FormattedDate date={value} format={dateFormat} culture={culture} />;
      case 'percentage':
        return <FormattedPercentage value={value} culture={culture} />;
      case 'filesize':
        return <FormattedFileSize bytes={value} culture={culture} />;
      case 'duration':
        return <FormattedDuration seconds={value} culture={culture} />;
      default:
        return <span>{String(value)}</span>;
    }
  };

  return (
    <span className={className}>
      {renderValue()}
    </span>
  );
};

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export {
  // Date components
  FormattedDate,
  RelativeTime,
  
  // Number components
  FormattedNumber,
  FormattedPercentage,
  
  // Currency components
  FormattedCurrency,
  
  // Utility components
  FormattedFileSize,
  FormattedDuration,
  FormattedDataRate,
  
  // Composite components
  StatisticCard,
  DataTableCell
};

// Default export for convenience
export default {
  FormattedDate,
  RelativeTime,
  FormattedNumber,
  FormattedPercentage,
  FormattedCurrency,
  FormattedFileSize,
  FormattedDuration,
  FormattedDataRate,
  StatisticCard,
  DataTableCell
};