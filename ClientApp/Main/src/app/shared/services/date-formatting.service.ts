import { Injectable, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';

export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full' | 'shortDate' | 'mediumDate' | 'longDate' | 'fullDate' | 'shortTime' | 'mediumTime' | 'longTime' | 'fullTime';
  relative?: boolean;
  fallbackFormat?: 'short' | 'medium' | 'long';
  locale?: string;
}

export interface RelativeTimeThresholds {
  minute: number;
  hour: number;
  day: number;
  week: number;
  month: number;
  year: number;
}

/**
 * Service for culture-aware date formatting
 * Provides methods for formatting dates according to the current application culture
 */
@Injectable({
  providedIn: 'root'
})
export class DateFormattingService {
  private translationService = inject(TranslationService);
  private translateService = inject(TranslateService);

  private readonly defaultThresholds: RelativeTimeThresholds = {
    minute: 60 * 1000,           // 1 minute
    hour: 60 * 60 * 1000,        // 1 hour
    day: 24 * 60 * 60 * 1000,    // 1 day
    week: 7 * 24 * 60 * 60 * 1000, // 1 week
    month: 30 * 24 * 60 * 60 * 1000, // 30 days
    year: 365 * 24 * 60 * 60 * 1000  // 365 days
  };

  /**
   * Format a date according to the current culture
   */
  formatDate(
    date: Date | string | number | null | undefined,
    options: DateFormatOptions = {}
  ): string {
    if (!date) {
      return '';
    }

    const parsedDate = this.parseDate(date);
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return '';
    }

    const {
      format = 'medium',
      relative = false,
      fallbackFormat = 'medium',
      locale
    } = options;

    if (relative) {
      return this.formatRelativeTime(parsedDate, fallbackFormat);
    }

    return this.formatAbsoluteDate(parsedDate, format, locale);
  }

  /**
   * Format a date as relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(
    date: Date | string | number,
    fallbackFormat: 'short' | 'medium' | 'long' = 'medium'
  ): string {
    const parsedDate = this.parseDate(date);
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return '';
    }

    const now = new Date();
    const diffInMs = now.getTime() - parsedDate.getTime();

    // Handle future dates
    if (diffInMs < 0) {
      return this.formatFutureTime(Math.abs(diffInMs));
    }

    return this.formatPastTime(diffInMs, parsedDate, fallbackFormat);
  }

  /**
   * Format an absolute date according to the specified format
   */
  formatAbsoluteDate(
    date: Date | string | number,
    format: string = 'medium',
    locale?: string
  ): string {
    const parsedDate = this.parseDate(date);
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return '';
    }

    const targetLocale = locale || this.translationService.getCurrentLanguage().code;
    const formatOptions = this.getFormatOptions(format);

    try {
      return new Intl.DateTimeFormat(targetLocale, formatOptions).format(parsedDate);
    } catch (error) {
      console.warn('Date formatting error:', error);
      // Fallback to English
      return new Intl.DateTimeFormat('en-US', formatOptions).format(parsedDate);
    }
  }

  /**
   * Get a smart date format that chooses between relative and absolute based on age
   */
  formatSmartDate(
    date: Date | string | number,
    options: {
      relativeThreshold?: number; // in days
      absoluteFormat?: string;
      fallbackFormat?: 'short' | 'medium' | 'long';
    } = {}
  ): string {
    const parsedDate = this.parseDate(date);
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return '';
    }

    const {
      relativeThreshold = 7, // Default: use relative time for dates within 7 days
      absoluteFormat = 'mediumDate',
      fallbackFormat = 'medium'
    } = options;

    const now = new Date();
    const diffInMs = Math.abs(now.getTime() - parsedDate.getTime());
    const diffInDays = diffInMs / (24 * 60 * 60 * 1000);

    if (diffInDays <= relativeThreshold) {
      return this.formatRelativeTime(parsedDate, fallbackFormat);
    } else {
      return this.formatAbsoluteDate(parsedDate, absoluteFormat);
    }
  }

  /**
   * Format a date range
   */
  formatDateRange(
    startDate: Date | string | number,
    endDate: Date | string | number,
    format: string = 'mediumDate'
  ): string {
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return '';
    }

    const locale = this.translationService.getCurrentLanguage().code;
    const formatOptions = this.getFormatOptions(format);

    try {
      const formatter = new Intl.DateTimeFormat(locale, formatOptions);
      const startFormatted = formatter.format(start);
      const endFormatted = formatter.format(end);

      // Use localized range separator
      const separator = this.translateService.instant('date.rangeSeparator') || ' - ';
      return `${startFormatted}${separator}${endFormatted}`;
    } catch (error) {
      console.warn('Date range formatting error:', error);
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    }
  }

  /**
   * Get the current locale for date formatting
   */
  getCurrentLocale(): string {
    return this.translationService.getCurrentLanguage().code;
  }

  /**
   * Check if the current locale uses RTL text direction
   */
  isRTL(): boolean {
    return this.translationService.isCurrentLanguageRTL();
  }

  private parseDate(value: Date | string | number): Date {
    if (value instanceof Date) {
      return value;
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value);
    }
    
    return new Date();
  }

  private formatPastTime(
    diffInMs: number,
    originalDate: Date,
    fallbackFormat: 'short' | 'medium' | 'long'
  ): string {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // Just now (less than 1 minute)
    if (diffInMinutes < 1) {
      return this.translateService.instant('time.justNow');
    }

    // Minutes ago
    if (diffInMinutes < 60) {
      return this.translateService.instant('time.minutesAgo', { count: diffInMinutes });
    }

    // Hours ago
    if (diffInHours < 24) {
      return this.translateService.instant('time.hoursAgo', { count: diffInHours });
    }

    // Days ago
    if (diffInDays < 7) {
      if (diffInDays === 1) {
        return this.translateService.instant('time.yesterday');
      }
      return this.translateService.instant('time.daysAgo', { count: diffInDays });
    }

    // Weeks ago
    if (diffInWeeks < 4) {
      return this.translateService.instant('time.weeksAgo', { count: diffInWeeks });
    }

    // Months ago
    if (diffInMonths < 12) {
      return this.translateService.instant('time.monthsAgo', { count: diffInMonths });
    }

    // Years ago
    if (diffInYears >= 1) {
      return this.translateService.instant('time.yearsAgo', { count: diffInYears });
    }

    // Fallback to absolute date for very old dates
    return this.formatAbsoluteDate(originalDate, fallbackFormat);
  }

  private formatFutureTime(diffInMs: number): string {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // In minutes
    if (diffInMinutes < 60) {
      return this.translateService.instant('time.inMinutes', { count: diffInMinutes });
    }

    // In hours
    if (diffInHours < 24) {
      return this.translateService.instant('time.inHours', { count: diffInHours });
    }

    // In days
    if (diffInDays === 1) {
      return this.translateService.instant('time.tomorrow');
    }
    
    return this.translateService.instant('time.inDays', { count: diffInDays });
  }

  private getFormatOptions(format: string): Intl.DateTimeFormatOptions {
    switch (format) {
      case 'short':
        return {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        };
      
      case 'medium':
        return {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        };
      
      case 'long':
        return {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit'
        };
      
      case 'full':
        return {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        };
      
      case 'shortDate':
        return {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric'
        };
      
      case 'mediumDate':
        return {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        };
      
      case 'longDate':
        return {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
      
      case 'fullDate':
        return {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
      
      case 'shortTime':
        return {
          hour: 'numeric',
          minute: '2-digit'
        };
      
      case 'mediumTime':
        return {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit'
        };
      
      case 'longTime':
        return {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        };
      
      case 'fullTime':
        return {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'long'
        };
      
      default:
        return {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        };
    }
  }
}