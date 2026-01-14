import { TestBed } from '@angular/core/testing';
import { RtlService } from './rtl.service';
import { TranslationService } from './translation.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('RtlService', () => {
  let service: RtlService;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(() => {
    const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['isCurrentLanguageRTL'], {
      isRTL$: new BehaviorSubject(false),
      currentLanguage$: new BehaviorSubject('en-US')
    });

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        RtlService,
        { provide: TranslationService, useValue: translationServiceSpy }
      ]
    });

    service = TestBed.inject(RtlService);
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default config', () => {
    const config = service.getConfig();
    expect(config.enabled).toBe(true);
    expect(config.autoDetect).toBe(true);
    expect(config.mirrorIcons).toBe(true);
  });

  it('should detect text direction correctly', () => {
    expect(service.detectTextDirection('Hello World')).toBe('ltr');
    expect(service.detectTextDirection('مرحبا بالعالم')).toBe('rtl');
    expect(service.detectTextDirection('')).toBe('auto');
  });

  it('should get position class correctly for LTR', () => {
    mockTranslationService.isCurrentLanguageRTL.and.returnValue(false);
    
    expect(service.getPositionClass('text-left')).toBe('text-left');
    expect(service.getPositionClass('text-right')).toBe('text-right');
    expect(service.getPositionClass('ml-4')).toBe('ml-4');
  });

  it('should transform position styles correctly', () => {
    mockTranslationService.isCurrentLanguageRTL.and.returnValue(false);
    
    const styles = service.getPositionStyles({
      textAlign: 'left',
      marginLeft: '10px'
    });

    expect(styles.textAlign).toBe('left');
    expect(styles.left).toBe('10px');
  });

  it('should update config correctly', () => {
    service.updateConfig({ enabled: false });
    expect(service.getConfig().enabled).toBe(false);
  });

  it('should toggle RTL correctly', () => {
    const initialEnabled = service.getConfig().enabled;
    service.toggleRTL();
    expect(service.getConfig().enabled).toBe(!initialEnabled);
  });
});