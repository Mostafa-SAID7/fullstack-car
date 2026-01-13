/**
 * Tests for culture-aware formatting utilities
 * Validates that formatting works correctly across different cultures
 */

import { 
  formatDate, 
  formatNumber, 
  formatCurrency, 
  formatPercentage,
  formatFileSize,
  formatDuration,
  getCurrentCulture,
  getCultureConfig,
  isRTLCulture,
  legacyFormatDate,
  legacyFormatNumber,
  legacyFormatCurrency
} from '../cultureFormatting';

// Mock i18n for testing
jest.mock('../../i18n', () => ({
  language: 'en-US'
}));

describe('Culture-aware formatting utilities', () => {
  describe('formatDate', () => {
    const testDate = new Date('2024-01-15T10:30:00Z');

    it('should format dates in English (en-US)', () => {
      const result = formatDate(testDate, { culture: 'en-US', format: 'short' });
      expect(result).toMatch(/Jan 15, 2024/);
    });

    it('should format dates in Arabic (ar-EG)', () => {
      const result = formatDate(testDate, { culture: 'ar-EG', format: 'short' });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle invalid dates gracefully', () => {
      const result = formatDate('invalid-date', { culture: 'en-US' });
      expect(result).toBe('Invalid Date');
    });

    it('should format relative time correctly', () => {
      const oneHourAgo = new Date(Date.now() - 3600000);
      const result = formatDate(oneHourAgo, { format: 'relative', culture: 'en-US' });
      expect(result).toMatch(/hour/);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers in English (en-US)', () => {
      const result = formatNumber(1234567.89, { culture: 'en-US' });
      expect(result).toBe('1,234,567.89');
    });

    it('should format compact numbers', () => {
      const result = formatNumber(1234567, { 
        culture: 'en-US', 
        notation: 'compact',
        compactDisplay: 'short'
      });
      expect(result).toMatch(/1\.2[0-9]*M|1M/);
    });

    it('should handle invalid numbers gracefully', () => {
      const result = formatNumber(NaN, { culture: 'en-US' });
      expect(result).toBe('0');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in USD for en-US', () => {
      const result = formatCurrency(1234.56, { culture: 'en-US', currency: 'USD' });
      expect(result).toBe('$1,234.56');
    });

    it('should format currency in EGP for ar-EG', () => {
      const result = formatCurrency(1234.56, { culture: 'ar-EG', currency: 'EGP' });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle invalid amounts gracefully', () => {
      const result = formatCurrency(NaN, { culture: 'en-US' });
      expect(result).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      const result = formatPercentage(75, undefined, 'en-US', 1);
      expect(result).toBe('75.0%');
    });

    it('should calculate percentage from value and total', () => {
      const result = formatPercentage(75, 100, 'en-US', 1);
      expect(result).toBe('75.0%');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toMatch(/1(\.\d+)? KB/);
      expect(formatFileSize(1048576)).toMatch(/1(\.\d+)? MB/);
      expect(formatFileSize(1073741824)).toMatch(/1(\.\d+)? GB/);
    });
  });

  describe('formatDuration', () => {
    it('should format durations in short format', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(3665)).toBe('1:01:05');
    });

    it('should format durations in long format', () => {
      const result = formatDuration(3665, 'en-US', 'long');
      expect(result).toMatch(/1 hour, 1 minute, 5 seconds/);
    });
  });

  describe('Culture configuration', () => {
    it('should return correct culture config for en-US', () => {
      const config = getCultureConfig('en-US');
      expect(config.name).toBe('English (United States)');
      expect(config.isRTL).toBe(false);
      expect(config.currency).toBe('USD');
    });

    it('should return correct culture config for ar-EG', () => {
      const config = getCultureConfig('ar-EG');
      expect(config.name).toBe('العربية (مصر)');
      expect(config.isRTL).toBe(true);
      expect(config.currency).toBe('EGP');
    });

    it('should detect RTL cultures correctly', () => {
      expect(isRTLCulture('en-US')).toBe(false);
      expect(isRTLCulture('ar-EG')).toBe(true);
      expect(isRTLCulture('ar-AE')).toBe(true);
      expect(isRTLCulture('ar-SA')).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle unsupported cultures gracefully', () => {
      // Should fallback to en-US for unsupported cultures
      const result = formatNumber(1234, { culture: 'xx-XX' as any });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle formatting errors gracefully', () => {
      // Test with extreme values that might cause formatting errors
      const result = formatCurrency(Number.MAX_SAFE_INTEGER, { culture: 'en-US' });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});

describe('Legacy compatibility', () => {
  it('should maintain backward compatibility with existing format functions', () => {
    // These tests ensure that existing code using the old format functions still works
    const testDate = new Date('2024-01-15T10:30:00Z');
    expect(legacyFormatDate(testDate, 'MMM dd, yyyy')).toBeDefined();
    expect(legacyFormatNumber(1234.56, 2)).toBeDefined();
    expect(legacyFormatCurrency(1234.56, 'USD')).toBeDefined();
  });
});