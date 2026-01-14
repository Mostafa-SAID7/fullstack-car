import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { RtlLayoutComponent } from './rtl-layout.component';
import { RtlService } from '../../../core/services/rtl.service';
import { TranslationService } from '../../../core/services/translation.service';

describe('RtlLayoutComponent', () => {
  let component: RtlLayoutComponent;
  let fixture: ComponentFixture<RtlLayoutComponent>;
  let mockRtlService: jasmine.SpyObj<RtlService>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    const rtlServiceSpy = jasmine.createSpyObj('RtlService', ['getPositionClass', 'getPositionStyles'], {
      layoutDirection$: new BehaviorSubject({
        isRTL: false,
        direction: 'ltr' as const,
        textAlign: 'left' as const,
        floatDirection: 'left' as const,
        marginStart: 'margin-left' as const,
        marginEnd: 'margin-right' as const,
        paddingStart: 'padding-left' as const,
        paddingEnd: 'padding-right' as const,
        borderStart: 'border-left' as const,
        borderEnd: 'border-right' as const
      })
    });

    const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['getCurrentLanguage'], {
      isRTL$: new BehaviorSubject(false),
      currentLanguage$: new BehaviorSubject('en-US')
    });

    await TestBed.configureTestingModule({
      imports: [
        RtlLayoutComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: RtlService, useValue: rtlServiceSpy },
        { provide: TranslationService, useValue: translationServiceSpy }
      ]
    }).compileComponents();

    mockRtlService = TestBed.inject(RtlService) as jasmine.SpyObj<RtlService>;
    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    fixture = TestBed.createComponent(RtlLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with LTR direction', () => {
    fixture.detectChanges();
    expect(component.currentDirection).toBe('ltr');
    expect(component.isRTL).toBe(false);
  });

  it('should update direction when RTL changes', () => {
    const rtlSubject = mockRtlService.layoutDirection$ as BehaviorSubject<any>;
    
    fixture.detectChanges();
    
    // Change to RTL
    rtlSubject.next({
      isRTL: true,
      direction: 'rtl',
      textAlign: 'right',
      floatDirection: 'right',
      marginStart: 'margin-right',
      marginEnd: 'margin-left',
      paddingStart: 'padding-right',
      paddingEnd: 'padding-left',
      borderStart: 'border-right',
      borderEnd: 'border-left'
    });

    fixture.detectChanges();
    
    expect(component.currentDirection).toBe('rtl');
    expect(component.isRTL).toBe(true);
  });

  it('should respect forced direction', () => {
    component.forceDirection = 'rtl';
    fixture.detectChanges();
    
    expect(component.currentDirection).toBe('rtl');
    expect(component.isRTL).toBe(true);
  });

  it('should call RTL service methods', () => {
    mockRtlService.getPositionClass.and.returnValue('text-right');
    mockRtlService.getPositionStyles.and.returnValue({ textAlign: 'right' });

    const cssClass = component.getRtlClass('text-left');
    const styles = component.getRtlStyles({ textAlign: 'left' });

    expect(mockRtlService.getPositionClass).toHaveBeenCalledWith('text-left');
    expect(mockRtlService.getPositionStyles).toHaveBeenCalledWith({ textAlign: 'left' });
    expect(cssClass).toBe('text-right');
    expect(styles).toEqual({ textAlign: 'right' });
  });
});