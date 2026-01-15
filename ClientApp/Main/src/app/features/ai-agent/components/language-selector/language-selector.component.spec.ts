import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectorComponent } from './language-selector.component';
import { LanguageService, Language } from '../../services/language.service';
import { BehaviorSubject } from 'rxjs';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let languageService: jasmine.SpyObj<LanguageService>;
  let currentLanguageSubject: BehaviorSubject<string>;

  const mockLanguages: Language[] = [
    { code: 'en-US', name: 'English (US)', nativeName: 'English', direction: 'ltr' },
    { code: 'ar-EG', name: 'Arabic (Egypt)', nativeName: 'العربية (مصر)', direction: 'rtl' },
    { code: 'ar-AE', name: 'Arabic (UAE)', nativeName: 'العربية (الإمارات)', direction: 'rtl' },
    { code: 'ar-SA', name: 'Arabic (Saudi)', nativeName: 'العربية (السعودية)', direction: 'rtl' }
  ];

  beforeEach(async () => {
    currentLanguageSubject = new BehaviorSubject<string>('en-US');

    const languageServiceSpy = jasmine.createSpyObj('LanguageService', [
      'getSupportedLanguages',
      'getCurrentLanguageDetails',
      'getCurrentLanguage$',
      'setLanguage',
      'getLanguageDetails'
    ]);

    languageServiceSpy.getSupportedLanguages.and.returnValue(mockLanguages);
    languageServiceSpy.getCurrentLanguageDetails.and.returnValue(mockLanguages[0]);
    languageServiceSpy.getCurrentLanguage$.and.returnValue(currentLanguageSubject.asObservable());
    languageServiceSpy.getLanguageDetails.and.callFake((code: string) => {
      return mockLanguages.find(lang => lang.code === code) || mockLanguages[0];
    });

    await TestBed.configureTestingModule({
      imports: [LanguageSelectorComponent],
      providers: [
        { provide: LanguageService, useValue: languageServiceSpy }
      ]
    }).compileComponents();

    languageService = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with supported languages', () => {
      fixture.detectChanges();
      expect(component.languages.length).toBe(4);
      expect(component.languages).toEqual(mockLanguages);
    });

    it('should initialize with current language', () => {
      fixture.detectChanges();
      expect(component.currentLanguage).toEqual(mockLanguages[0]);
      expect(component.currentLanguage?.code).toBe('en-US');
    });

    it('should initialize with dropdown closed', () => {
      fixture.detectChanges();
      expect(component.showDropdown).toBe(false);
    });

    it('should call language service on init', () => {
      fixture.detectChanges();
      expect(languageService.getSupportedLanguages).toHaveBeenCalled();
      expect(languageService.getCurrentLanguageDetails).toHaveBeenCalled();
      expect(languageService.getCurrentLanguage$).toHaveBeenCalled();
    });
  });

  describe('Language Subscription', () => {
    it('should subscribe to language changes', () => {
      fixture.detectChanges();
      expect(languageService.getCurrentLanguage$).toHaveBeenCalled();
    });

    it('should update current language when service emits change', () => {
      fixture.detectChanges();
      expect(component.currentLanguage?.code).toBe('en-US');

      currentLanguageSubject.next('ar-EG');
      fixture.detectChanges();

      expect(languageService.getLanguageDetails).toHaveBeenCalledWith('ar-EG');
      expect(component.currentLanguage?.code).toBe('ar-EG');
    });

    it('should handle multiple language changes', () => {
      fixture.detectChanges();

      currentLanguageSubject.next('ar-EG');
      fixture.detectChanges();
      expect(component.currentLanguage?.code).toBe('ar-EG');

      currentLanguageSubject.next('ar-AE');
      fixture.detectChanges();
      expect(component.currentLanguage?.code).toBe('ar-AE');

      currentLanguageSubject.next('en-US');
      fixture.detectChanges();
      expect(component.currentLanguage?.code).toBe('en-US');
    });
  });

  describe('Dropdown Toggle', () => {
    it('should toggle dropdown open', () => {
      fixture.detectChanges();
      expect(component.showDropdown).toBe(false);

      component.toggleDropdown();
      expect(component.showDropdown).toBe(true);
    });

    it('should toggle dropdown closed', () => {
      fixture.detectChanges();
      component.showDropdown = true;

      component.toggleDropdown();
      expect(component.showDropdown).toBe(false);
    });

    it('should toggle multiple times', () => {
      fixture.detectChanges();
      
      component.toggleDropdown();
      expect(component.showDropdown).toBe(true);
      
      component.toggleDropdown();
      expect(component.showDropdown).toBe(false);
      
      component.toggleDropdown();
      expect(component.showDropdown).toBe(true);
    });
  });

  describe('Language Selection', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should select English language', () => {
      const englishLang = mockLanguages[0];
      component.selectLanguage(englishLang);

      expect(languageService.setLanguage).toHaveBeenCalledWith('en-US');
      expect(component.showDropdown).toBe(false);
    });

    it('should select Arabic Egypt language', () => {
      const arabicEgyptLang = mockLanguages[1];
      component.selectLanguage(arabicEgyptLang);

      expect(languageService.setLanguage).toHaveBeenCalledWith('ar-EG');
      expect(component.showDropdown).toBe(false);
    });

    it('should select Arabic UAE language', () => {
      const arabicUAELang = mockLanguages[2];
      component.selectLanguage(arabicUAELang);

      expect(languageService.setLanguage).toHaveBeenCalledWith('ar-AE');
      expect(component.showDropdown).toBe(false);
    });

    it('should select Arabic Saudi language', () => {
      const arabicSaudiLang = mockLanguages[3];
      component.selectLanguage(arabicSaudiLang);

      expect(languageService.setLanguage).toHaveBeenCalledWith('ar-SA');
      expect(component.showDropdown).toBe(false);
    });

    it('should close dropdown after selection', () => {
      component.showDropdown = true;
      component.selectLanguage(mockLanguages[1]);

      expect(component.showDropdown).toBe(false);
    });

    it('should call setLanguage with correct code', () => {
      mockLanguages.forEach(lang => {
        component.selectLanguage(lang);
        expect(languageService.setLanguage).toHaveBeenCalledWith(lang.code);
      });
    });
  });

  describe('Close Dropdown', () => {
    it('should close dropdown', () => {
      fixture.detectChanges();
      component.showDropdown = true;

      component.closeDropdown();
      expect(component.showDropdown).toBe(false);
    });

    it('should do nothing if already closed', () => {
      fixture.detectChanges();
      component.showDropdown = false;

      component.closeDropdown();
      expect(component.showDropdown).toBe(false);
    });
  });

  describe('Language Flag Display', () => {
    it('should return US flag for en-US', () => {
      const flag = component.getLanguageFlag('en-US');
      expect(flag).toBe('🇺🇸');
    });

    it('should return Egypt flag for ar-EG', () => {
      const flag = component.getLanguageFlag('ar-EG');
      expect(flag).toBe('🇪🇬');
    });

    it('should return UAE flag for ar-AE', () => {
      const flag = component.getLanguageFlag('ar-AE');
      expect(flag).toBe('🇦🇪');
    });

    it('should return Saudi flag for ar-SA', () => {
      const flag = component.getLanguageFlag('ar-SA');
      expect(flag).toBe('🇸🇦');
    });

    it('should return globe icon for unknown language', () => {
      const flag = component.getLanguageFlag('unknown');
      expect(flag).toBe('🌐');
    });

    it('should handle empty string', () => {
      const flag = component.getLanguageFlag('');
      expect(flag).toBe('🌐');
    });
  });

  describe('Language Properties', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have correct language names', () => {
      expect(component.languages[0].name).toBe('English (US)');
      expect(component.languages[1].name).toBe('Arabic (Egypt)');
      expect(component.languages[2].name).toBe('Arabic (UAE)');
      expect(component.languages[3].name).toBe('Arabic (Saudi)');
    });

    it('should have correct native names', () => {
      expect(component.languages[0].nativeName).toBe('English');
      expect(component.languages[1].nativeName).toBe('العربية (مصر)');
      expect(component.languages[2].nativeName).toBe('العربية (الإمارات)');
      expect(component.languages[3].nativeName).toBe('العربية (السعودية)');
    });

    it('should have correct text direction', () => {
      expect(component.languages[0].direction).toBe('ltr');
      expect(component.languages[1].direction).toBe('rtl');
      expect(component.languages[2].direction).toBe('rtl');
      expect(component.languages[3].direction).toBe('rtl');
    });

    it('should identify LTR languages', () => {
      const ltrLanguages = component.languages.filter(lang => lang.direction === 'ltr');
      expect(ltrLanguages.length).toBe(1);
      expect(ltrLanguages[0].code).toBe('en-US');
    });

    it('should identify RTL languages', () => {
      const rtlLanguages = component.languages.filter(lang => lang.direction === 'rtl');
      expect(rtlLanguages.length).toBe(3);
      expect(rtlLanguages.every(lang => lang.code.startsWith('ar-'))).toBe(true);
    });
  });

  describe('Current Language Display', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display current language code', () => {
      expect(component.currentLanguage?.code).toBe('en-US');
    });

    it('should display current language name', () => {
      expect(component.currentLanguage?.name).toBe('English (US)');
    });

    it('should display current language native name', () => {
      expect(component.currentLanguage?.nativeName).toBe('English');
    });

    it('should update display when language changes', () => {
      currentLanguageSubject.next('ar-EG');
      fixture.detectChanges();

      expect(component.currentLanguage?.code).toBe('ar-EG');
      expect(component.currentLanguage?.name).toBe('Arabic (Egypt)');
      expect(component.currentLanguage?.nativeName).toBe('العربية (مصر)');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null current language', () => {
      languageService.getCurrentLanguageDetails.and.returnValue(null as any);
      fixture.detectChanges();

      expect(component.currentLanguage).toBeNull();
    });

    it('should handle empty languages array', () => {
      languageService.getSupportedLanguages.and.returnValue([]);
      fixture.detectChanges();

      expect(component.languages.length).toBe(0);
    });

    it('should handle language change to unsupported code', () => {
      fixture.detectChanges();
      languageService.getLanguageDetails.and.returnValue(mockLanguages[0]);

      currentLanguageSubject.next('unsupported-code');
      fixture.detectChanges();

      expect(languageService.getLanguageDetails).toHaveBeenCalledWith('unsupported-code');
    });
  });

  describe('User Interaction Flow', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should complete full selection flow', () => {
      // Open dropdown
      component.toggleDropdown();
      expect(component.showDropdown).toBe(true);

      // Select language
      component.selectLanguage(mockLanguages[1]);
      expect(languageService.setLanguage).toHaveBeenCalledWith('ar-EG');
      expect(component.showDropdown).toBe(false);

      // Verify language changed
      currentLanguageSubject.next('ar-EG');
      fixture.detectChanges();
      expect(component.currentLanguage?.code).toBe('ar-EG');
    });

    it('should handle cancel selection', () => {
      // Open dropdown
      component.toggleDropdown();
      expect(component.showDropdown).toBe(true);

      // Close without selecting
      component.closeDropdown();
      expect(component.showDropdown).toBe(false);
      expect(languageService.setLanguage).not.toHaveBeenCalled();
    });

    it('should handle multiple open/close cycles', () => {
      // Open
      component.toggleDropdown();
      expect(component.showDropdown).toBe(true);

      // Close
      component.closeDropdown();
      expect(component.showDropdown).toBe(false);

      // Open again
      component.toggleDropdown();
      expect(component.showDropdown).toBe(true);

      // Select
      component.selectLanguage(mockLanguages[2]);
      expect(component.showDropdown).toBe(false);
    });
  });

  describe('Multilingual Support', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should support all 4 required languages', () => {
      const requiredCodes = ['en-US', 'ar-EG', 'ar-AE', 'ar-SA'];
      const supportedCodes = component.languages.map(lang => lang.code);

      requiredCodes.forEach(code => {
        expect(supportedCodes).toContain(code);
      });
    });

    it('should have unique language codes', () => {
      const codes = component.languages.map(lang => lang.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });

    it('should have non-empty names for all languages', () => {
      component.languages.forEach(lang => {
        expect(lang.name).toBeTruthy();
        expect(lang.name.length).toBeGreaterThan(0);
      });
    });

    it('should have non-empty native names for all languages', () => {
      component.languages.forEach(lang => {
        expect(lang.nativeName).toBeTruthy();
        expect(lang.nativeName.length).toBeGreaterThan(0);
      });
    });

    it('should have valid direction for all languages', () => {
      component.languages.forEach(lang => {
        expect(['ltr', 'rtl']).toContain(lang.direction);
      });
    });
  });
});
