import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RtlService } from '../../../core/services/rtl.service';
import { TranslationService } from '../../../core/services/translation.service';
import { RtlLayoutComponent } from '../rtl-layout/rtl-layout.component';
import { RtlDirective } from '../../directives/rtl.directive';
import { BidiTextDirective } from '../../directives/bidi-text.directive';
import { RtlClassPipe } from '../../pipes/rtl-class.pipe';
import { RtlStylePipe } from '../../pipes/rtl-style.pipe';

/**
 * RTL Demo Component
 * 
 * Demonstrates RTL functionality and provides testing interface
 * This component can be used for development and testing purposes
 */
@Component({
  selector: 'app-rtl-demo',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RtlLayoutComponent,
    RtlDirective,
    BidiTextDirective,
    RtlClassPipe,
    RtlStylePipe
  ],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">RTL Support Demo</h1>
      
      <!-- Language Switcher -->
      <div class="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">Language Switcher</h2>
        <div class="flex gap-2">
          <button 
            *ngFor="let lang of supportedLanguages"
            (click)="switchLanguage(lang.code)"
            class="px-4 py-2 rounded border"
            [class.bg-blue-500]="isCurrentLanguage(lang.code)"
            [class.text-white]="isCurrentLanguage(lang.code)"
            [class.bg-white]="!isCurrentLanguage(lang.code)">
            {{ lang.flag }} {{ lang.name }}
          </button>
        </div>
      </div>

      <!-- RTL Layout Demo -->
      <app-rtl-layout class="mb-8">
        <div class="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <h2 class="text-lg font-semibold mb-4">RTL Layout Container</h2>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white">1</div>
            <div class="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-white">2</div>
            <div class="w-12 h-12 bg-red-500 rounded flex items-center justify-center text-white">3</div>
            <div class="flex-1 text-center">
              <p>This content automatically adjusts for RTL languages</p>
            </div>
          </div>
        </div>
      </app-rtl-layout>

      <!-- Bidirectional Text Demo -->
      <div class="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">Bidirectional Text</h2>
        <div class="space-y-4">
          <div appBidiText class="p-2 border rounded">
            Mixed content: Hello مرحبا World عالم!
          </div>
          <div appBidiText="force-auto" class="p-2 border rounded">
            Auto-detected: مرحبا بك في موقعنا الإلكتروني
          </div>
          <div appBidiText="isolate" class="p-2 border rounded">
            Isolated: English text with العربية embedded
          </div>
        </div>
      </div>

      <!-- RTL Directive Demo -->
      <div class="mb-8 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">RTL Directive</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div appRtl class="p-4 border rounded">
            <h3 class="font-semibold">Auto RTL</h3>
            <p>This content follows global RTL setting</p>
          </div>
          <div appRtl="force-ltr" class="p-4 border rounded">
            <h3 class="font-semibold">Forced LTR</h3>
            <p>This content is always left-to-right</p>
          </div>
        </div>
      </div>

      <!-- RTL Class Pipe Demo -->
      <div class="mb-8 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">RTL Class Pipe</h2>
        <div [class]="'flex items-center gap-4 text-left ml-4' | rtlClass">
          <div class="w-8 h-8 bg-purple-500 rounded"></div>
          <span>Classes automatically adjusted for RTL</span>
        </div>
      </div>

      <!-- RTL Style Pipe Demo -->
      <div class="mb-8 p-4 bg-pink-50 dark:bg-pink-900 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">RTL Style Pipe</h2>
        <div [ngStyle]="{ 'text-align': 'left', 'margin-left': '20px', 'float': 'left' } | rtlStyle">
          Styles automatically adjusted for RTL
        </div>
      </div>

      <!-- RTL Service Info -->
      <div class="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">RTL Service Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Current Language:</strong> {{ currentLanguage }}
          </div>
          <div>
            <strong>Is RTL:</strong> {{ isRTL }}
          </div>
          <div>
            <strong>Direction:</strong> {{ layoutDirection?.direction }}
          </div>
          <div>
            <strong>Text Align:</strong> {{ layoutDirection?.textAlign }}
          </div>
        </div>
      </div>

      <!-- Icon Mirroring Demo -->
      <div class="mb-8 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">Icon Mirroring</h2>
        <div class="flex items-center gap-4">
          <i class="fas fa-arrow-left text-2xl rtl-mirror"></i>
          <i class="fas fa-arrow-right text-2xl rtl-mirror"></i>
          <i class="fas fa-chevron-left text-2xl rtl-mirror"></i>
          <i class="fas fa-chevron-right text-2xl rtl-mirror"></i>
          <span>Icons that mirror in RTL</span>
        </div>
      </div>

      <!-- Form Demo -->
      <div class="mb-8 p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">Form Elements</h2>
        <div class="space-y-4">
          <input 
            type="text" 
            placeholder="Enter text here / أدخل النص هنا"
            class="w-full p-2 border rounded">
          <textarea 
            placeholder="Multi-line text / نص متعدد الأسطر"
            class="w-full p-2 border rounded h-20"></textarea>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rtl-mirror {
      transition: transform 0.3s ease;
    }
  `]
})
export class RtlDemoComponent {
  private rtlService = inject(RtlService);
  private translationService = inject(TranslationService);

  supportedLanguages = this.translationService.supportedLanguages;
  currentLanguage = '';
  isRTL = false;
  layoutDirection: any = null;

  constructor() {
    // Subscribe to language changes
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });

    this.translationService.isRTL$.subscribe(isRTL => {
      this.isRTL = isRTL;
    });

    this.rtlService.layoutDirection$.subscribe(layout => {
      this.layoutDirection = layout;
    });
  }

  async switchLanguage(languageCode: string): Promise<void> {
    await this.translationService.changeLanguage(languageCode);
  }

  isCurrentLanguage(languageCode: string): boolean {
    return this.currentLanguage === languageCode;
  }
}