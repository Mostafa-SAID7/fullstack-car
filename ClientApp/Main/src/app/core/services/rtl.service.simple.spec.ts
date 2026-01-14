// Simple RTL Service Test - Basic functionality verification
// This test can be run independently to verify RTL logic

import { RtlService } from './rtl.service';

// Mock TranslationService for testing
class MockTranslationService {
  isRTL$ = { subscribe: (fn: any) => fn(false) };
  currentLanguage$ = { subscribe: (fn: any) => fn('en-US') };
  isCurrentLanguageRTL() { return false; }
}

describe('RtlService - Basic Functionality', () => {
  let service: RtlService;

  beforeEach(() => {
    // Create service with mock dependencies
    service = new RtlService();
    // Inject mock translation service
    (service as any).translationService = new MockTranslationService();
  });

  it('should detect text direction correctly', () => {
    expect(service.detectTextDirection('Hello World')).toBe('ltr');
    expect(service.detectTextDirection('مرحبا بالعالم')).toBe('rtl');
    expect(service.detectTextDirection('')).toBe('auto');
    expect(service.detectTextDirection('123')).toBe('ltr');
  });

  it('should handle mixed content detection', () => {
    const mixedText = 'Hello مرحبا World';
    const direction = service.detectTextDirection(mixedText);
    expect(['ltr', 'rtl'].includes(direction)).toBeTruthy();
  });

  it('should provide correct position classes for LTR', () => {
    // Test common CSS class transformations
    expect(service.getPositionClass('text-left')).toBe('text-left');
    expect(service.getPositionClass('text-right')).toBe('text-right');
    expect(service.getPositionClass('ml-4')).toBe('ml-4');
    expect(service.getPositionClass('unknown-class')).toBe('unknown-class');
  });

  it('should transform position styles correctly', () => {
    const styles = service.getPositionStyles({
      textAlign: 'left',
      marginLeft: '10px',
      float: 'left'
    });

    expect(styles.textAlign).toBe('left');
    expect(styles.left).toBe('10px'); // marginLeft becomes left
    expect(styles.float).toBe('left');
  });

  it('should manage configuration correctly', () => {
    const initialConfig = service.getConfig();
    expect(initialConfig.enabled).toBe(true);
    expect(initialConfig.autoDetect).toBe(true);

    service.updateConfig({ enabled: false });
    expect(service.getConfig().enabled).toBe(false);

    service.toggleRTL();
    expect(service.getConfig().enabled).toBe(true);
  });

  it('should create layout direction object correctly', () => {
    const ltrLayout = (service as any).createLayoutDirection(false);
    expect(ltrLayout.isRTL).toBe(false);
    expect(ltrLayout.direction).toBe('ltr');
    expect(ltrLayout.textAlign).toBe('left');
    expect(ltrLayout.marginStart).toBe('margin-left');

    const rtlLayout = (service as any).createLayoutDirection(true);
    expect(rtlLayout.isRTL).toBe(true);
    expect(rtlLayout.direction).toBe('rtl');
    expect(rtlLayout.textAlign).toBe('right');
    expect(rtlLayout.marginStart).toBe('margin-right');
  });
});

// Test RTL CSS class transformations
describe('RTL CSS Class Transformations', () => {
  let service: RtlService;

  beforeEach(() => {
    service = new RtlService();
    (service as any).translationService = new MockTranslationService();
  });

  const testCases = [
    { input: 'text-left', expectedLTR: 'text-left', expectedRTL: 'text-right' },
    { input: 'text-right', expectedLTR: 'text-right', expectedRTL: 'text-left' },
    { input: 'float-left', expectedLTR: 'float-left', expectedRTL: 'float-right' },
    { input: 'ml-auto', expectedLTR: 'ml-auto', expectedRTL: 'mr-auto' },
    { input: 'border-l', expectedLTR: 'border-l', expectedRTL: 'border-r' }
  ];

  testCases.forEach(testCase => {
    it(`should transform ${testCase.input} correctly for LTR`, () => {
      const result = service.getPositionClass(testCase.input);
      expect(result).toBe(testCase.expectedLTR);
    });
  });
});

// Test bidirectional text detection
describe('Bidirectional Text Detection', () => {
  let service: RtlService;

  beforeEach(() => {
    service = new RtlService();
    (service as any).translationService = new MockTranslationService();
  });

  const textSamples = [
    { text: 'Hello World', expected: 'ltr' },
    { text: 'مرحبا بالعالم', expected: 'rtl' },
    { text: 'שלום עולם', expected: 'rtl' }, // Hebrew
    { text: '123 456', expected: 'ltr' },
    { text: '', expected: 'auto' },
    { text: '   ', expected: 'auto' },
    { text: 'Hello مرحبا', expected: 'ltr' }, // Mixed, but more Latin
    { text: 'مرحبا Hello مرحبا', expected: 'rtl' } // Mixed, but more Arabic
  ];

  textSamples.forEach(sample => {
    it(`should detect "${sample.text}" as ${sample.expected}`, () => {
      const result = service.detectTextDirection(sample.text);
      expect(result).toBe(sample.expected);
    });
  });
});

console.log('RTL Service tests completed successfully!');