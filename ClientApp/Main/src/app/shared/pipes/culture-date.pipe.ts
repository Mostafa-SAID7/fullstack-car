import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

/**
 * Culture-aware date formatting pipe
 * Formats dates according to the current application culture
 */
@Pipe({
  name: 'cultureDate',
  standalone: true,
  pure: false // Make it impure to react to language changes
})
export class CultureDatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(
    value: Date | string | number | null | undefined,
    format: 'short' | 'medium' | 'long' | 'full' | 'shortDate' | 'mediumDate' | 'longDate' | 'fullDate' | 'shortTime' | 'mediumTime' | 'longTime' | 'fullTime' = 'medium'
  ): string {
    if (!value) {
      return '';
    }

    const date = this.parseDate(value);
    if (!date || isNaN(date.getTime())) {
      return '';
    }

    const currentLanguage = this.translationService.getCurrentLanguage();
    const locale = currentLanguage.code;

    try {
      return this.formatDate(date, format, locale);
    } catch (error) {
      console.warn('Date formatting error:', error);
      // Fallback to default formatting
      return this.formatDate(date, format, 'en-US');
    }
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

  private formatDate(date: Date, format: string, locale: string): string {
    const formatOptions = this.getFormatOptions(format);
    
    return new Intl.DateTimeFormat(locale, formatOptions).format(date);
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