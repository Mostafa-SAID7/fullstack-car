import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CultureDatePipe } from '../../pipes/culture-date.pipe';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { DateFormattingService } from '../../services/date-formatting.service';
import { TranslationService } from '../../../core/services/translation.service';

/**
 * Demo component to showcase culture-aware date formatting
 * This component demonstrates the new date formatting capabilities
 */
@Component({
  selector: 'app-date-formatting-demo',
  standalone: true,
  imports: [CommonModule, TranslateModule, CultureDatePipe, RelativeTimePipe],
  template: `
    <div class="p-6 space-y-6">
      <h2 class="text-2xl font-bold mb-4">Culture-Aware Date Formatting Demo</h2>
      
      <!-- Current Language Info -->
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 class="font-semibold mb-2">Current Language Settings</h3>
        <p><strong>Language:</strong> {{ currentLanguage.name }} ({{ currentLanguage.code }})</p>
        <p><strong>RTL:</strong> {{ currentLanguage.isRTL ? 'Yes' : 'No' }}</p>
        <p><strong>Locale:</strong> {{ dateFormattingService.getCurrentLocale() }}</p>
      </div>

      <!-- Sample Dates -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Absolute Date Formatting -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h3 class="font-semibold mb-3">Absolute Date Formats</h3>
          <div class="space-y-2 text-sm">
            <div><strong>Short:</strong> {{ sampleDate | cultureDate:'short' }}</div>
            <div><strong>Medium:</strong> {{ sampleDate | cultureDate:'medium' }}</div>
            <div><strong>Long:</strong> {{ sampleDate | cultureDate:'long' }}</div>
            <div><strong>Full:</strong> {{ sampleDate | cultureDate:'full' }}</div>
            <div><strong>Short Date:</strong> {{ sampleDate | cultureDate:'shortDate' }}</div>
            <div><strong>Medium Date:</strong> {{ sampleDate | cultureDate:'mediumDate' }}</div>
            <div><strong>Long Date:</strong> {{ sampleDate | cultureDate:'longDate' }}</div>
            <div><strong>Full Date:</strong> {{ sampleDate | cultureDate:'fullDate' }}</div>
          </div>
        </div>

        <!-- Relative Time Formatting -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <h3 class="font-semibold mb-3">Relative Time Formats</h3>
          <div class="space-y-2 text-sm">
            <div><strong>Just now:</strong> {{ justNow | relativeTime }}</div>
            <div><strong>5 minutes ago:</strong> {{ fiveMinutesAgo | relativeTime }}</div>
            <div><strong>2 hours ago:</strong> {{ twoHoursAgo | relativeTime }}</div>
            <div><strong>Yesterday:</strong> {{ yesterday | relativeTime }}</div>
            <div><strong>Last week:</strong> {{ lastWeek | relativeTime }}</div>
            <div><strong>Last month:</strong> {{ lastMonth | relativeTime }}</div>
            <div><strong>Last year:</strong> {{ lastYear | relativeTime }}</div>
          </div>
        </div>
      </div>

      <!-- Service Methods Demo -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <h3 class="font-semibold mb-3">Service Methods</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 class="font-medium mb-2">Smart Date Formatting</h4>
            <div class="space-y-1">
              <div><strong>Recent:</strong> {{ getSmartDate(twoHoursAgo) }}</div>
              <div><strong>Old:</strong> {{ getSmartDate(lastMonth) }}</div>
            </div>
          </div>
          <div>
            <h4 class="font-medium mb-2">Date Range</h4>
            <div>{{ getDateRange(lastWeek, sampleDate) }}</div>
          </div>
        </div>
      </div>

      <!-- Language Switching Demo -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h3 class="font-semibold mb-3">Language Switching</h3>
        <p class="text-sm mb-3">Switch languages to see how dates are formatted differently:</p>
        <div class="flex flex-wrap gap-2">
          <button 
            *ngFor="let lang of supportedLanguages"
            (click)="switchLanguage(lang.code)"
            [class.bg-blue-500]="currentLanguage.code === lang.code"
            [class.text-white]="currentLanguage.code === lang.code"
            class="px-3 py-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
            {{ lang.flag }} {{ lang.name }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class DateFormattingDemoComponent implements OnInit {
  // Sample dates for demonstration
  sampleDate = new Date('2024-01-15T14:30:00Z');
  justNow = new Date(Date.now() - 30 * 1000); // 30 seconds ago
  fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  lastYear = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

  currentLanguage = this.translationService.getCurrentLanguage();
  supportedLanguages = this.translationService.supportedLanguages;

  constructor(
    public dateFormattingService: DateFormattingService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    // Subscribe to language changes to update the current language display
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = this.translationService.getCurrentLanguage();
    });
  }

  async switchLanguage(languageCode: string): Promise<void> {
    await this.translationService.changeLanguage(languageCode);
  }

  getSmartDate(date: Date): string {
    return this.dateFormattingService.formatSmartDate(date);
  }

  getDateRange(startDate: Date, endDate: Date): string {
    return this.dateFormattingService.formatDateRange(startDate, endDate);
  }
}