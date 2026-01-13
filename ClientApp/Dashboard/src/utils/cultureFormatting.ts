/**
 * Culture-aware formatting utilities for the Dashboard application
 * Provides comprehensive date, number, and currency formatting based on user's selected culture
 * Supports: en-US, ar-EG, ar-AE, ar-SA with proper RTL considerations
 */

import i18n from '../i18n';

// Supported cultures configuration
export const SUPPORTED_CULTURES = {
  'en-US': {
    name: 'English (United States)',
    flag: '🇺🇸',
    isRTL: false,
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h'
  },
  'ar-EG': {
    name: 'العربية (مصر)',
    flag: '🇪🇬',
    isRTL: true,
    currency: 'EGP',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '12h'
  },
  'ar-AE': {
    name: 'العربية (الإمارات)',
    flag: '🇦🇪',
    isRTL: true,
    currency: 'AED',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '12h'
  },
  'ar-SA': {
    name: 'العربية (السعودية)',
    flag: '🇸🇦',
    isRTL: true,
    currency: 'SAR',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '12h'
  }
} as const;

export type SupportedCulture = keyof typeof SUPPORTED_CULTURES;

/**
 * Get current culture from i18n or fallback to en-US
 */
export const getCurrentCulture = (): SupportedCulture => {
  const currentLang = i18n.language || 'en-US';
  return (Object.keys(SUPPORTED_CULTURES) as SupportedCulture[]).includes(currentLang as SupportedCulture)
    ? (currentLang as SupportedCulture)
    : 'en-US';
};

/**
 * Get culture configuration for a specific culture
 */
export const getCultureConfig = (culture?: SupportedCulture) => {
  const targetCulture = culture || getCurrentCulture();
  return SUPPORTED_CULTURES[targetCulture];
};

/**
 * Check if current or specified culture is RTL
 */
export const isRTLCulture = (culture?: SupportedCulture): boolean => {
  return getCultureConfig(culture).isRTL;
};

// ============================================================================
// DATE FORMATTING UTILITIES
// ============================================================================

export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full' | 'relative' | 'time' | 'datetime';
  culture?: SupportedCulture;
  includeTime?: boolean;
  use24Hour?: boolean;
}

/**
 * Format date according to culture-specific conventions
 */
export const formatDate = (
  date: string | Date | number,
  options: DateFormatOptions = {}
): string => {
  const {
    format = 'short',
    culture = getCurrentCulture(),
    includeTime = false,
    use24Hour = false
  } = options;

  const dateObj = new Date(date);
  
  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDate:', date);
    return 'Invalid Date';
  }

  const cultureConfig = getCultureConfig(culture);

  try {
    switch (format) {
      case 'short':
        return new Intl.DateTimeFormat(culture, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          ...(includeTime && {
            hour: '2-digit',
            minute: '2-digit',
            hour12: !use24Hour && cultureConfig.timeFormat === '12h'
          })
        }).format(dateObj);

      case 'medium':
        return new Intl.DateTimeFormat(culture, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          ...(includeTime && {
            hour: '2-digit',
            minute: '2-digit',
            hour12: !use24Hour && cultureConfig.timeFormat === '12h'
          })
        }).format(dateObj);

      case 'long':
        return new Intl.DateTimeFormat(culture, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          ...(includeTime && {
            hour: '2-digit',
            minute: '2-digit',
            hour12: !use24Hour && cultureConfig.timeFormat === '12h'
          })
        }).format(dateObj);

      case 'full':
        return new Intl.DateTimeFormat(culture, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: !use24Hour && cultureConfig.timeFormat === '12h',
          timeZoneName: 'short'
        }).format(dateObj);

      case 'time':
        return new Intl.DateTimeFormat(culture, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: !use24Hour && cultureConfig.timeFormat === '12h'
        }).format(dateObj);

      case 'datetime':
        return new Intl.DateTimeFormat(culture, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: !use24Hour && cultureConfig.timeFormat === '12h'
        }).format(dateObj);

      case 'relative':
        return formatRelativeTime(dateObj, culture);

      default:
        return new Intl.DateTimeFormat(culture).format(dateObj);
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateObj.toLocaleDateString();
  }
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (
  date: string | Date | number,
  culture: SupportedCulture = getCurrentCulture()
): string => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  try {
    // Use Intl.RelativeTimeFormat for proper localization
    const rtf = new Intl.RelativeTimeFormat(culture, { numeric: 'auto' });

    const absDiff = Math.abs(diffInSeconds);
    const isPast = diffInSeconds > 0;

    if (absDiff < 60) {
      return rtf.format(isPast ? -absDiff : absDiff, 'second');
    } else if (absDiff < 3600) {
      const minutes = Math.floor(absDiff / 60);
      return rtf.format(isPast ? -minutes : minutes, 'minute');
    } else if (absDiff < 86400) {
      const hours = Math.floor(absDiff / 3600);
      return rtf.format(isPast ? -hours : hours, 'hour');
    } else if (absDiff < 2592000) {
      const days = Math.floor(absDiff / 86400);
      return rtf.format(isPast ? -days : days, 'day');
    } else if (absDiff < 31536000) {
      const months = Math.floor(absDiff / 2592000);
      return rtf.format(isPast ? -months : months, 'month');
    } else {
      const years = Math.floor(absDiff / 31536000);
      return rtf.format(isPast ? -years : years, 'year');
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    // Fallback to simple English relative time
    const absDiff = Math.abs(diffInSeconds);
    if (absDiff < 60) return 'just now';
    if (absDiff < 3600) return `${Math.floor(absDiff / 60)}m ago`;
    if (absDiff < 86400) return `${Math.floor(absDiff / 3600)}h ago`;
    if (absDiff < 2592000) return `${Math.floor(absDiff / 86400)}d ago`;
    return formatDate(dateObj, { format: 'short', culture });
  }
};

// ============================================================================
// NUMBER FORMATTING UTILITIES
// ============================================================================

export interface NumberFormatOptions {
  culture?: SupportedCulture;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  compactDisplay?: 'short' | 'long';
}

/**
 * Format numbers according to culture-specific conventions
 */
export const formatNumber = (
  value: number,
  options: NumberFormatOptions = {}
): string => {
  const {
    culture = getCurrentCulture(),
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    useGrouping = true,
    notation = 'standard',
    compactDisplay = 'short'
  } = options;

  if (typeof value !== 'number' || isNaN(value)) {
    console.warn('Invalid number provided to formatNumber:', value);
    return '0';
  }

  try {
    return new Intl.NumberFormat(culture, {
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping,
      notation,
      compactDisplay
    }).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
};

/**
 * Format large numbers with compact notation (e.g., 1.2K, 3.4M)
 */
export const formatCompactNumber = (
  value: number,
  culture: SupportedCulture = getCurrentCulture()
): string => {
  return formatNumber(value, {
    culture,
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  });
};

/**
 * Format percentage values
 */
export const formatPercentage = (
  value: number,
  total?: number,
  culture: SupportedCulture = getCurrentCulture(),
  decimals: number = 1
): string => {
  let percentage: number;
  
  if (total !== undefined) {
    percentage = total === 0 ? 0 : (value / total);
  } else {
    percentage = value / 100; // Assume value is already a percentage
  }

  try {
    return new Intl.NumberFormat(culture, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(percentage);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${(percentage * 100).toFixed(decimals)}%`;
  }
};

// ============================================================================
// CURRENCY FORMATTING UTILITIES
// ============================================================================

export interface CurrencyFormatOptions {
  culture?: SupportedCulture;
  currency?: string;
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format currency according to culture-specific conventions
 */
export const formatCurrency = (
  amount: number,
  options: CurrencyFormatOptions = {}
): string => {
  const culture = options.culture || getCurrentCulture();
  const cultureConfig = getCultureConfig(culture);
  
  const {
    currency = cultureConfig.currency,
    currencyDisplay = 'symbol',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;

  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn('Invalid amount provided to formatCurrency:', amount);
    return formatNumber(0, { culture });
  }

  try {
    return new Intl.NumberFormat(culture, {
      style: 'currency',
      currency,
      currencyDisplay,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    // Fallback to basic number formatting with currency code
    return `${formatNumber(amount, { culture })} ${currency}`;
  }
};

/**
 * Format currency with automatic culture-specific currency selection
 */
export const formatLocalCurrency = (
  amount: number,
  culture: SupportedCulture = getCurrentCulture()
): string => {
  const cultureConfig = getCultureConfig(culture);
  return formatCurrency(amount, {
    culture,
    currency: cultureConfig.currency
  });
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get appropriate number format for file sizes
 */
export const formatFileSize = (
  bytes: number,
  culture: SupportedCulture = getCurrentCulture(),
  decimals: number = 2
): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = bytes / Math.pow(k, i);
  const formattedValue = formatNumber(value, {
    culture,
    maximumFractionDigits: decimals
  });

  return `${formattedValue} ${sizes[i]}`;
};

/**
 * Format duration in seconds to human-readable format
 */
export const formatDuration = (
  seconds: number,
  culture: SupportedCulture = getCurrentCulture(),
  format: 'short' | 'long' = 'short'
): string => {
  if (seconds < 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (format === 'long') {
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    if (remainingSeconds > 0 || parts.length === 0) {
      parts.push(`${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`);
    }
    return parts.join(', ');
  }

  // Short format
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `0:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Format data transfer rates (e.g., MB/s, GB/s)
 */
export const formatDataRate = (
  bytesPerSecond: number,
  culture: SupportedCulture = getCurrentCulture()
): string => {
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
  let value = bytesPerSecond;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  const formattedValue = formatNumber(value, {
    culture,
    maximumFractionDigits: value < 10 ? 2 : 1
  });

  return `${formattedValue} ${units[unitIndex]}`;
};

// ============================================================================
// REACT HOOKS FOR CULTURE-AWARE FORMATTING
// ============================================================================

/**
 * React hook for culture-aware formatting utilities
 */
export const useCultureFormatting = (culture?: SupportedCulture) => {
  const targetCulture = culture || getCurrentCulture();
  const cultureConfig = getCultureConfig(targetCulture);

  return {
    culture: targetCulture,
    config: cultureConfig,
    isRTL: cultureConfig.isRTL,
    
    // Date formatting
    formatDate: (date: string | Date | number, options?: Omit<DateFormatOptions, 'culture'>) =>
      formatDate(date, { ...options, culture: targetCulture }),
    
    formatRelativeTime: (date: string | Date | number) =>
      formatRelativeTime(date, targetCulture),
    
    // Number formatting
    formatNumber: (value: number, options?: Omit<NumberFormatOptions, 'culture'>) =>
      formatNumber(value, { ...options, culture: targetCulture }),
    
    formatCompactNumber: (value: number) =>
      formatCompactNumber(value, targetCulture),
    
    formatPercentage: (value: number, total?: number, decimals?: number) =>
      formatPercentage(value, total, targetCulture, decimals),
    
    // Currency formatting
    formatCurrency: (amount: number, options?: Omit<CurrencyFormatOptions, 'culture'>) =>
      formatCurrency(amount, { ...options, culture: targetCulture }),
    
    formatLocalCurrency: (amount: number) =>
      formatLocalCurrency(amount, targetCulture),
    
    // Utility formatting
    formatFileSize: (bytes: number, decimals?: number) =>
      formatFileSize(bytes, targetCulture, decimals),
    
    formatDuration: (seconds: number, format?: 'short' | 'long') =>
      formatDuration(seconds, targetCulture, format),
    
    formatDataRate: (bytesPerSecond: number) =>
      formatDataRate(bytesPerSecond, targetCulture)
  };
};

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

/**
 * Legacy compatibility - update existing helpers.tsx functions to use culture-aware formatting
 * These functions maintain the same API but now use culture-aware formatting internally
 */

// Re-export with culture awareness for backward compatibility
export const legacyFormatDate = (date: string | Date, format: string = 'MMM dd, yyyy'): string => {
  const culture = getCurrentCulture();
  
  // Map legacy format strings to new format options
  const formatMap: Record<string, DateFormatOptions> = {
    'MMM dd, yyyy': { format: 'short' },
    'MMMM dd, yyyy': { format: 'medium' },
    'MMM dd, yyyy HH:mm': { format: 'datetime' },
    'HH:mm': { format: 'time' },
    'yyyy-MM-dd': { format: 'short' } // Will be handled specially
  };

  if (format === 'yyyy-MM-dd') {
    // Special case for ISO date format
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0];
  }

  const options = formatMap[format] || { format: 'short' };
  return formatDate(date, { ...options, culture });
};

export const legacyFormatNumber = (num: number, decimals: number = 0): string => {
  return formatNumber(num, {
    culture: getCurrentCulture(),
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const legacyFormatCurrency = (amount: number, currency: string = 'USD'): string => {
  return formatCurrency(amount, {
    culture: getCurrentCulture(),
    currency
  });
};