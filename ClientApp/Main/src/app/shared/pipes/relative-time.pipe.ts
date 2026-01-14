import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Culture-aware relative time formatting pipe
 * Formats dates as relative time (e.g., "2 hours ago", "yesterday") according to the current culture
 */
@Pipe({
  name: 'relativeTime',
  standalone: true,
  pure: false // Make it impure to react to language changes
})
export class RelativeTimePipe implements PipeTransform {
  private translationService = inject(TranslationService);
  private translateService = inject(TranslateService);

  transform(
    value: Date | string | number | null | undefined,
    fallbackFormat: 'short' | 'medium' | 'long' = 'medium'
  ): string {
    if (!value) {
      return '';
    }

    const date = this.parseDate(value);
    if (!date || isNaN(date.getTime())) {
      return '';
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    // For very recent times (less than 1 minute)
    if (diffInMinutes < 1) {
      return this.translateService.instant('time.justNow');
    }

    // For times within the last hour
    if (diffInMinutes < 60) {
      return this.translateService.instant('time.minutesAgo', { count: diffInMinutes });
    }

    // For times within the last day
    if (diffInHours < 24) {
      return this.translateService.instant('time.hoursAgo', { count: diffInHours });
    }

    // For times within the last week
    if (diffInDays < 7) {
      if (diffInDays === 1) {
        return this.translateService.instant('time.yesterday');
      }
      return this.translateService.instant('time.daysAgo', { count: diffInDays });
    }

    // For times within the last month
    if (diffInWeeks < 4) {
      return this.translateService.instant('time.weeksAgo', { count: diffInWeeks });
    }

    // For times within the last year
    if (diffInMonths < 12) {
      return this.translateService.instant('time.monthsAgo', { count: diffInMonths });
    }

    // For times older than a year
    if (diffInYears >= 1) {
      return this.translateService.instant('time.yearsAgo', { count: diffInYears });
    }

    // Fallback to formatted date for very old dates
    return this.formatFallbackDate(date, fallbackFormat);
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

  private formatFallbackDate(date: Date, format: string): string {
    const currentLanguage = this.translationService.getCurrentLanguage();
    const locale = currentLanguage.code;

    try {
      const formatOptions = this.getFormatOptions(format);
      return new Intl.DateTimeFormat(locale, formatOptions).format(date);
    } catch (error) {
      console.warn('Fallback date formatting error:', error);
      // Ultimate fallback
      return date.toLocaleDateString('en-US');
    }
  }

  private getFormatOptions(format: string): Intl.DateTimeFormatOptions {
    switch (format) {
      case 'short':
        return {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric'
        };
      
      case 'long':
        return {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
      
      case 'medium':
      default:
        return {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        };
    }
  }
}