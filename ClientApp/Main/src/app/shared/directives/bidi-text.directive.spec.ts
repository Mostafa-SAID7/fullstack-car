import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BidiTextDirective } from './bidi-text.directive';
import { RtlService } from '../../core/services/rtl.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  template: `
    <div appBidiText>Mixed English and العربية text</div>
    <div appBidiText="force-auto">Auto detect text</div>
    <div appBidiText="isolate">Isolated text</div>
  `,
  standalone: true,
  imports: [BidiTextDirective]
})
class TestComponent { }

describe('BidiTextDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let mockRtlService: jasmine.SpyObj<RtlService>;

  beforeEach(async () => {
    const rtlServiceSpy = jasmine.createSpyObj('RtlService', ['detectTextDirection', 'applyBidirectionalText']);

    await TestBed.configureTestingModule({
      imports: [
        TestComponent, 
        BidiTextDirective,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: RtlService, useValue: rtlServiceSpy }
      ]
    }).compileComponents();

    mockRtlService = TestBed.inject(RtlService) as jasmine.SpyObj<RtlService>;
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply bidirectional text handling', () => {
    mockRtlService.detectTextDirection.and.returnValue('rtl');
    fixture.detectChanges();

    expect(mockRtlService.detectTextDirection).toHaveBeenCalled();
  });

  it('should apply isolation mode', () => {
    fixture.detectChanges();

    const isolateDiv = fixture.debugElement.query(By.css('div[appBidiText="isolate"]'));
    const styles = window.getComputedStyle(isolateDiv.nativeElement);
    
    // Note: In a real browser environment, this would check for unicode-bidi: isolate
    expect(isolateDiv.nativeElement.classList.contains('bidi-isolate')).toBe(true);
  });

  it('should handle auto detection mode', () => {
    mockRtlService.detectTextDirection.and.returnValue('ltr');
    fixture.detectChanges();

    const autoDiv = fixture.debugElement.query(By.css('div[appBidiText="force-auto"]'));
    expect(autoDiv.nativeElement.getAttribute('dir')).toBe('ltr');
  });
});