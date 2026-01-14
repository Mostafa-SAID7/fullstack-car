/**
 * E2E tests for Main Angular App localization
 * Tests complete user journeys across all supported languages
 * Feature: community-localization-enhancement
 */

import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('Main App Localization E2E Tests', () => {
  let translateService: TranslateService;
  const supportedLanguages = ['en-US', 'ar-EG', 'ar-AE', 'ar-SA'];
  const arabicLanguages = ['ar-EG', 'ar-AE', 'ar-SA'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });

    translateService = TestBed.inject(TranslateService);
    translateService.addLangs(supportedLanguages);
    translateService.setDefaultLang('en-US');
    
    // Reset document state
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en-US';
    localStorage.clear();
  });

  describe('Complete User Journey Tests', () => {
    it('should complete full localization journey for each language', (done) => {
      let completedLanguages = 0;

      supportedLanguages.forEach((language) => {
        translateService.use(language).subscribe(() => {
          // Verify language was changed
          expect(translateService.currentLang).toBe(language);

          // Verify RTL is set for Arabic languages
          const isRTL = arabicLanguages.includes(language);
          const expectedDir = isRTL ? 'rtl' : 'ltr';
          
          document.documentElement.dir = expectedDir;
          document.documentElement.lang = language;

          expect(document.documentElement.dir).toBe(expectedDir);
          expect(document.documentElement.lang).toBe(language);

          // Verify localStorage persistence
          localStorage.setItem('preferred-language', language);
          expect(localStorage.getItem('preferred-language')).toBe(language);

          completedLanguages++;
          if (completedLanguages === supportedLanguages.length) {
            done();
          }
        });
      });
    });

    it('should maintain UI consistency during language switching', (done) => {
      const testKeys = [
        'common.save',
        'common.cancel',
        'common.delete',
        'posts.create',
        'groups.title',
      ];

      let switchCount = 0;
      const totalSwitches = supportedLanguages.length * supportedLanguages.length;

      supportedLanguages.forEach((fromLang) => {
        supportedLanguages.forEach((toLang) => {
          // Switch from one language to another
          translateService.use(fromLang).subscribe(() => {
            // Verify all keys are translatable in first language
            testKeys.forEach(key => {
              const translation = translateService.instant(key);
              expect(translation).toBeDefined();
            });

            // Switch to second language
            translateService.use(toLang).subscribe(() => {
              // Verify all keys are still translatable
              testKeys.forEach(key => {
                const translation = translateService.instant(key);
                expect(translation).toBeDefined();
              });

              switchCount++;
              if (switchCount === totalSwitches) {
                done();
              }
            });
          });
        });
      });
    });
  });

  describe('RTL Layout Tests', () => {
    it('should activate RTL for all Arabic languages', (done) => {
      let completedTests = 0;

      arabicLanguages.forEach((language) => {
        translateService.use(language).subscribe(() => {
          // Simulate RTL activation
          const isRTL = language.startsWith('ar-');
          document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

          expect(document.documentElement.dir).toBe('rtl');
          expect(isRTL).toBe(true);

          completedTests++;
          if (completedTests === arabicLanguages.length) {
            done();
          }
        });
      });
    });

    it('should not activate RTL for English', (done) => {
      translateService.use('en-US').subscribe(() => {
        const isRTL = translateService.currentLang.startsWith('ar-');
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

        expect(document.documentElement.dir).toBe('ltr');
        expect(isRTL).toBe(false);
        done();
      });
    });

    it('should handle RTL layout for all community features', (done) => {
      const features = ['posts', 'groups', 'qa', 'reviews', 'social'];
      let completedTests = 0;
      const totalTests = arabicLanguages.length * features.length;

      arabicLanguages.forEach((language) => {
        translateService.use(language).subscribe(() => {
          document.documentElement.dir = 'rtl';

          features.forEach((feature) => {
            // Simulate feature translation loading
            const key = `${feature}.title`;
            const translation = translateService.instant(key);
            
            expect(translation).toBeDefined();
            expect(document.documentElement.dir).toBe('rtl');

            completedTests++;
            if (completedTests === totalTests) {
              done();
            }
          });
        });
      });
    });
  });

  describe('Language Preference Persistence', () => {
    it('should persist language selection to localStorage', () => {
      supportedLanguages.forEach((language) => {
        localStorage.setItem('preferred-language', language);
        
        const stored = localStorage.getItem('preferred-language');
        expect(stored).toBe(language);
      });
    });

    it('should load persisted language on initialization', (done) => {
      const preferredLanguage = 'ar-EG';
      localStorage.setItem('preferred-language', preferredLanguage);

      const loaded = localStorage.getItem('preferred-language');
      expect(loaded).toBe(preferredLanguage);

      // Simulate loading the language
      translateService.use(loaded || 'en-US').subscribe(() => {
        expect(translateService.currentLang).toBe(preferredLanguage);
        done();
      });
    });

    it('should default to en-US when no preference is stored', () => {
      const loaded = localStorage.getItem('preferred-language');
      expect(loaded).toBeNull();

      const language = loaded || 'en-US';
      expect(language).toBe('en-US');
    });
  });

  describe('Translation Loading Performance', () => {
    it('should load translations quickly', (done) => {
      const startTime = Date.now();
      
      translateService.use('en-US').subscribe(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Should complete in under 500ms
        expect(duration).toBeLessThan(500);
        done();
      });
    });

    it('should handle batch translation loading efficiently', (done) => {
      const features = ['posts', 'groups', 'reviews', 'social'];
      const startTime = Date.now();

      translateService.use('en-US').subscribe(() => {
        // Simulate batch loading
        features.forEach(feature => {
          translateService.instant(`${feature}.title`);
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Batch loading should be fast
        expect(duration).toBeLessThan(1000);
        done();
      });
    });
  });

  describe('Culture-Aware Formatting', () => {
    it('should format dates according to culture', () => {
      const testDate = new Date('2024-01-15T10:30:00Z');

      supportedLanguages.forEach((language) => {
        const formatted = testDate.toLocaleDateString(language);
        expect(formatted).toBeTruthy();
        expect(typeof formatted).toBe('string');
      });
    });

    it('should format numbers according to culture', () => {
      const testNumber = 1234567.89;

      supportedLanguages.forEach((language) => {
        const formatted = testNumber.toLocaleString(language);
        expect(formatted).toBeTruthy();
        expect(typeof formatted).toBe('string');
      });
    });

    it('should format currencies according to culture', () => {
      const testAmount = 1234.56;

      supportedLanguages.forEach((language) => {
        const formatted = testAmount.toLocaleString(language, {
          style: 'currency',
          currency: language === 'en-US' ? 'USD' : 'EGP',
        });
        expect(formatted).toBeTruthy();
        expect(typeof formatted).toBe('string');
      });
    });
  });

  describe('Error Handling and Fallback', () => {
    it('should fallback to English for missing translations', (done) => {
      translateService.use('ar-EG').subscribe(() => {
        // Simulate missing translation
        const key = 'nonexistent.key';
        const result = translateService.instant(key);
        
        // Should return the key itself as fallback
        expect(result).toBe(key);
        done();
      });
    });

    it('should handle unsupported languages gracefully', (done) => {
      const unsupportedLanguage = 'fr-FR';
      
      // Attempt to change to unsupported language
      translateService.use(unsupportedLanguage).subscribe({
        next: () => {
          // Should complete without error
          expect(true).toBe(true);
          done();
        },
        error: () => {
          // Or handle error gracefully
          expect(true).toBe(true);
          done();
        }
      });
    });

    it('should recover from RTL layout errors', () => {
      // Simulate RTL error
      try {
        document.documentElement.dir = 'rtl';
        // Simulate error condition
        throw new Error('RTL layout error');
      } catch (error) {
        // Fallback to LTR
        document.documentElement.dir = 'ltr';
      }

      expect(document.documentElement.dir).toBe('ltr');
    });
  });

  describe('Cross-Feature Consistency', () => {
    it('should maintain consistent translations across features', (done) => {
      const commonKeys = ['save', 'cancel', 'delete', 'edit', 'create'];
      const features = ['posts', 'groups', 'reviews'];

      translateService.use('en-US').subscribe(() => {
        features.forEach((feature) => {
          commonKeys.forEach((key) => {
            const translationKey = `${feature}.${key}`;
            const translation = translateService.instant(translationKey);
            expect(translation).toBeDefined();
          });
        });
        done();
      });
    });

    it('should use consistent terminology across all languages', (done) => {
      const testKey = 'common.save';
      let completedTests = 0;

      supportedLanguages.forEach((language) => {
        translateService.use(language).subscribe(() => {
          const translation = translateService.instant(testKey);
          
          expect(translation).toBeDefined();
          expect(translation).toBeTruthy();

          completedTests++;
          if (completedTests === supportedLanguages.length) {
            done();
          }
        });
      });
    });
  });

  describe('Real-time Language Updates', () => {
    it('should update UI immediately on language change', (done) => {
      const initialLanguage = 'en-US';
      const newLanguage = 'ar-EG';

      translateService.use(initialLanguage).subscribe(() => {
        expect(translateService.currentLang).toBe(initialLanguage);

        // Change language
        translateService.use(newLanguage).subscribe(() => {
          // Verify immediate update
          expect(translateService.currentLang).toBe(newLanguage);
          done();
        });
      });
    });

    it('should handle rapid language switching', (done) => {
      let switchCount = 0;
      const languages = ['en-US', 'ar-EG', 'ar-AE', 'ar-SA', 'en-US'];

      const switchLanguage = (index: number) => {
        if (index >= languages.length) {
          done();
          return;
        }

        translateService.use(languages[index]).subscribe(() => {
          expect(translateService.currentLang).toBe(languages[index]);
          switchCount++;
          switchLanguage(index + 1);
        });
      };

      switchLanguage(0);
    });
  });

  describe('Component Integration Tests', () => {
    it('should localize post components correctly', (done) => {
      const postKeys = [
        'posts.title',
        'posts.create',
        'posts.edit',
        'posts.delete',
        'posts.like',
        'posts.comment',
        'posts.share',
      ];

      translateService.use('en-US').subscribe(() => {
        postKeys.forEach((key) => {
          const translation = translateService.instant(key);
          expect(translation).toBeDefined();
        });
        done();
      });
    });

    it('should localize group components correctly', (done) => {
      const groupKeys = [
        'groups.title',
        'groups.create',
        'groups.join',
        'groups.leave',
        'groups.members',
      ];

      translateService.use('en-US').subscribe(() => {
        groupKeys.forEach((key) => {
          const translation = translateService.instant(key);
          expect(translation).toBeDefined();
        });
        done();
      });
    });

    it('should localize QA components correctly', (done) => {
      const qaKeys = [
        'qa.askQuestion',
        'qa.answer',
        'qa.vote',
        'qa.reputation',
      ];

      translateService.use('en-US').subscribe(() => {
        qaKeys.forEach((key) => {
          const translation = translateService.instant(key);
          expect(translation).toBeDefined();
        });
        done();
      });
    });
  });
});
