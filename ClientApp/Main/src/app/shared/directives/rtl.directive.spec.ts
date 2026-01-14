import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RtlDirective } from './rtl.directive';
import { TranslationService } from '../../core/services/translation.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  template: `
    <div appRtl>Default RTL behavior</div>
    <div appRtl="force-ltr">Forced LTR</div>
    <div appRtl="force-rtl">Forced RTL</div>
    <div appRtl="auto">Auto detect</div>
  `,
  standalone: true,
  imports: [RtlDirective]
})
class TestComponent { }

describe('RtlDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    const translationServiceSpy = jasmine.createSpyObj('TranslationService', ['isCurrentLanguageRTL'], {
      isRTL$: new BehaviorSubject(false)
    });

    await TestBed.configureTestingModule({
      imports: [
        TestComponent, 
        RtlDirective,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: TranslationService, useValue: translationServiceSpy }
      ]
    }).compileComponents();

    mockTranslationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply LTR direction by default', () => {
    mockTranslationService.isCurrentLanguageRTL.and.returnValue(false);
    fixture.detectChanges();

    const defaultDiv = fixture.debugElement.query(By.css('div[appRtl=""]'));
    expect(defaultDiv.nativeElement.getAttribute('dir')).toBe('ltr');
    expect(defaultDiv.nativeElement.classList.contains('ltr-layout')).toBe(true);
  });

  it('should force LTR when specified', () => {
    fixture.detectChanges();

    const forcedLtrDiv = fixture.debugElement.query(By.css('div[appRtl="force-ltr"]'));
    expect(forcedLtrDiv.nativeElement.getAttribute('dir')).toBe('ltr');
    expect(forcedLtrDiv.nativeElement.classList.contains('ltr-layout')).toBe(true);
  });

  it('should force RTL when specified', () => {
    fixture.detectChanges();

    const forcedRtlDiv = fixture.debugElement.query(By.css('div[appRtl="force-rtl"]'));
    expect(forcedRtlDiv.nativeElement.getAttribute('dir')).toBe('rtl');
    expect(forcedRtlDiv.nativeElement.classList.contains('rtl-layout')).toBe(true);
  });

  it('should respond to RTL changes', () => {
    const rtlSubject = mockTranslationService.isRTL$ as BehaviorSubject<boolean>;
    mockTranslationService.isCurrentLanguageRTL.and.returnValue(false);
    
    fixture.detectChanges();
    
    const defaultDiv = fixture.debugElement.query(By.css('div[appRtl=""]'));
    expect(defaultDiv.nativeElement.getAttribute('dir')).toBe('ltr');

    // Change to RTL
    mockTranslationService.isCurrentLanguageRTL.and.returnValue(true);
    rtlSubject.next(true);
    fixture.detectChanges();

    expect(defaultDiv.nativeElement.getAttribute('dir')).toBe('rtl');
    expect(defaultDiv.nativeElement.classList.contains('rtl-layout')).toBe(true);
  });
});