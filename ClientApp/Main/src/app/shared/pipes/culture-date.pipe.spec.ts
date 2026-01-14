import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CultureDatePipe } from './culture-date.pipe';
import { TranslationService } from '../../core/services/translation.service';

describe('CultureDatePipe', () => {
  let pipe: CultureDatePipe;
  let translationService: jasmine.SpyObj<TranslationService>;

  beforeEach(() => {
    const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['getCurrentLanguage']);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: TranslationService, useValue: translationServiceSpy }
      ]
    });

    translationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    pipe = new CultureDatePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null value', () => {
    translationService.getCurrentLanguage.and.returnValue({ code: 'en-US', name: 'English', flag: '🇺🇸', isRTL: false });
    
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should format date in English locale', () => {
    translationService.getCurrentLanguage.and.returnValue({ code: 'en-US', name: 'English', flag: '🇺🇸', isRTL: false });
    
    const testDate = new Date('2024-01-15T10:30:00Z');
    const result = pipe.transform(testDate, 'shortDate');
    
    expect(result).toContain('1/15/24');
  });

  it('should format date in Arabic locale', () => {
    translationService.getCurrentLanguage.and.returnValue({ code: 'ar-EG', name: 'العربية (مصر)', flag: '🇪🇬', isRTL: true });
    
    const testDate = new Date('2024-01-15T10:30:00Z');
    const result = pipe.transform(testDate, 'shortDate');
    
    // Arabic date formatting should be different from English
    expect(result).toBeDefined();
    expect(result).not.toBe('');
  });

  it('should handle string dates', () => {
    translationService.getCurrentLanguage.and.returnValue({ code: 'en-US', name: 'English', flag: '🇺🇸', isRTL: false });
    
    const result = pipe.transform('2024-01-15T10:30:00Z', 'shortDate');
    
    expect(result).toContain('1/15/24');
  });

  it('should handle invalid dates gracefully', () => {
    translationService.getCurrentLanguage.and.returnValue({ code: 'en-US', name: 'English', flag: '🇺🇸', isRTL: false });
    
    const result = pipe.transform('invalid-date');
    
    expect(result).toBe('');
  });

  it('should fallback to English on formatting error', () => {
    translationService.getCurrentLanguage.and.returnValue({ code: 'invalid-locale', name: 'Invalid', flag: '❌', isRTL: false });
    
    const testDate = new Date('2024-01-15T10:30:00Z');
    const result = pipe.transform(testDate, 'shortDate');
    
    // Should still return a formatted date (fallback to en-US)
    expect(result).toBeDefined();
    expect(result).not.toBe('');
  });
});