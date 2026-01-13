import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslationService, FeatureTranslationStatus, TranslationUpdate } from './translation.service';

@Component({
  selector: 'app-translation-demo',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="translation-demo p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Enhanced Translation Service Demo</h2>
      
      <!-- Current Language Info -->
      <div class="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 class="text-lg font-semibold mb-2">Current Language</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <strong>Language:</strong> {{ currentLanguage.name }} ({{ currentLanguage.code }})
            <span class="ml-2">{{ currentLanguage.flag }}</span>
          </div>
          <div>
            <strong>RTL:</strong> {{ isRTL ? 'Yes' : 'No' }}
          </div>
        </div>
      </div>

      <!-- Language Switcher -->
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="text-lg font-semibold mb-2">Language Switcher</h3>
        <div class="flex flex-wrap gap-2">
          <button 
            *ngFor="let lang of supportedLanguages"
            (click)="changeLanguage(lang.code)"
            [class]="'px-4 py-2 rounded border ' + (currentLanguage.code === lang.code ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100')"
            [disabled]="isLoading"
          >
            {{ lang.flag }} {{ lang.name }}
          </button>
        </div>
        <div *ngIf="isLoading" class="mt-2 text-blue-600">
          Loading translations...
        </div>
      </div>

      <!-- Translation Statistics -->
      <div class="bg-green-50 p-4 rounded-lg mb-6">
        <h3 class="text-lg font-semibold mb-2">Translation Statistics</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong>Features Loaded:</strong> {{ stats.featuresLoaded }}
          </div>
          <div>
            <strong>Features Loading:</strong> {{ stats.featuresLoading }}
          </div>
          <div>
            <strong>Features with Errors:</strong> {{ stats.featuresWithErrors }}
          </div>
          <div>
            <strong>Real-time Enabled:</strong> {{ stats.realTimeEnabled ? 'Yes' : 'No' }}
          </div>
        </div>
      </div>

      <!-- Feature Status -->
      <div class="bg-yellow-50 p-4 rounded-lg mb-6">
        <h3 class="text-lg font-semibold mb-2">Feature Translation Status</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
          <div 
            *ngFor="let status of featureStatus" 
            [class]="'p-2 rounded border ' + getStatusClass(status)"
          >
            <div class="font-medium">{{ status.feature }}</div>
            <div class="text-xs">
              {{ status.loaded ? 'Loaded' : status.loading ? 'Loading...' : status.error ? 'Error' : 'Not loaded' }}
            </div>
            <div *ngIf="status.lastUpdated" class="text-xs text-gray-500">
              Updated: {{ status.lastUpdated | date:'short' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Real-time Controls -->
      <div class="bg-purple-50 p-4 rounded-lg mb-6">
        <h3 class="text-lg font-semibold mb-2">Real-time Translation Updates</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          <button 
            (click)="enableRealTime()"
            [disabled]="realTimeConfig.enabled"
            class="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
          >
            Enable Real-time
          </button>
          <button 
            (click)="disableRealTime()"
            [disabled]="!realTimeConfig.enabled"
            class="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            Disable Real-time
          </button>
          <button 
            (click)="refreshAllTranslations()"
            class="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Refresh All
          </button>
        </div>
        <div class="text-sm">
          <div><strong>Status:</strong> {{ realTimeConfig.enabled ? 'Enabled' : 'Disabled' }}</div>
          <div><strong>Poll Interval:</strong> {{ realTimeConfig.pollInterval }}ms</div>
          <div><strong>Features:</strong> {{ realTimeConfig.features.join(', ') }}</div>
        </div>
      </div>

      <!-- Recent Updates -->
      <div class="bg-indigo-50 p-4 rounded-lg mb-6">
        <h3 class="text-lg font-semibold mb-2">Recent Translation Updates</h3>
        <div *ngIf="recentUpdates.length === 0" class="text-gray-500 text-sm">
          No recent updates
        </div>
        <div *ngFor="let update of recentUpdates" class="text-sm border-b border-indigo-200 py-2">
          <div><strong>{{ update.feature }}</strong> - {{ update.key }}</div>
          <div class="text-xs text-gray-600">{{ update.timestamp | date:'medium' }}</div>
        </div>
      </div>

      <!-- Sample Translations -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">Sample Translations</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div><strong>Posts:</strong></div>
            <div>{{ 'posts.title' | translate }}</div>
            <div>{{ 'posts.create' | translate }}</div>
          </div>
          <div>
            <div><strong>Common:</strong></div>
            <div>{{ 'common.save' | translate }}</div>
            <div>{{ 'common.cancel' | translate }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .translation-demo {
      font-family: system-ui, -apple-system, sans-serif;
    }
  `]
})
export class TranslationDemoComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroy$ = new Subject<void>();

  currentLanguage = this.translationService.getCurrentLanguage();
  supportedLanguages = this.translationService.supportedLanguages;
  isRTL = false;
  isLoading = false;
  featureStatus: FeatureTranslationStatus[] = [];
  stats = this.translationService.getTranslationStats();
  realTimeConfig = this.translationService.getRealTimeConfig();
  recentUpdates: TranslationUpdate[] = [];

  ngOnInit(): void {
    // Subscribe to language changes
    this.translationService.currentLanguage$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentLanguage = this.translationService.getCurrentLanguage();
      this.updateStats();
    });

    // Subscribe to RTL changes
    this.translationService.isRTL$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isRTL => {
      this.isRTL = isRTL;
    });

    // Subscribe to loading state
    this.translationService.isLoading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    // Subscribe to feature status changes
    this.translationService.featureStatus$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => {
      this.featureStatus = status.filter(s => s.culture === this.currentLanguage.code);
      this.updateStats();
    });

    // Subscribe to translation updates
    this.translationService.translationUpdates$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(update => {
      this.recentUpdates.unshift(update);
      // Keep only last 10 updates
      if (this.recentUpdates.length > 10) {
        this.recentUpdates = this.recentUpdates.slice(0, 10);
      }
    });

    this.updateStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async changeLanguage(languageCode: string): Promise<void> {
    await this.translationService.changeLanguage(languageCode);
  }

  enableRealTime(): void {
    this.translationService.enableRealTimeUpdates({
      pollInterval: 30000,
      features: ['posts', 'groups', 'qa', 'reviews']
    });
    this.realTimeConfig = this.translationService.getRealTimeConfig();
  }

  disableRealTime(): void {
    this.translationService.disableRealTimeUpdates();
    this.realTimeConfig = this.translationService.getRealTimeConfig();
  }

  async refreshAllTranslations(): Promise<void> {
    await this.translationService.refreshAllTranslations();
  }

  getStatusClass(status: FeatureTranslationStatus): string {
    if (status.error) return 'bg-red-100 border-red-300';
    if (status.loading) return 'bg-yellow-100 border-yellow-300';
    if (status.loaded) return 'bg-green-100 border-green-300';
    return 'bg-gray-100 border-gray-300';
  }

  private updateStats(): void {
    this.stats = this.translationService.getTranslationStats();
  }
}