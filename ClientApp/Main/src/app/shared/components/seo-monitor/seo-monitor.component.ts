import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  signal, 
  computed, 
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService, SeoData, SeoMetrics } from '../../../core/services/seo.service';
import { Subscription } from 'rxjs';

/**
 * SEO Monitor Component
 * 
 * Displays SEO metrics and optimization status:
 * - Current meta tags information
 * - SEO validation results
 * - Performance recommendations
 * - Real-time SEO monitoring
 */
@Component({
  selector: 'app-seo-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="seo-monitor" [class]="containerClasses()">
      <!-- Header -->
      <div class="monitor-header">
        <div class="metric-title">
          <div class="metric-icon" [class]="iconClasses()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="21 21l-4.35-4.35"/>
            </svg>
          </div>
          <h3 class="title">SEO Optimization</h3>
        </div>
        
        @if (showControls) {
          <div class="monitor-controls">
            <button 
              (click)="validateSeo()"
              class="validate-button"
              title="Validate SEO">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              Validate
            </button>
            
            <button 
              (click)="refreshMetrics()"
              class="refresh-button"
              title="Refresh metrics">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
              </svg>
            </button>
          </div>
        }
      </div>

      <!-- SEO Score -->
      <div class="seo-score">
        <div class="score-circle" [class]="scoreClasses()">
          <div class="score-value">{{ seoScore() }}</div>
          <div class="score-label">SEO Score</div>
        </div>
        
        <div class="score-details">
          <div class="score-item">
            <div class="score-item-value" [class]="getTitleScoreClass()">
              {{ currentSeoData().title.length }}
            </div>
            <div class="score-item-label">Title Length</div>
          </div>
          
          <div class="score-item">
            <div class="score-item-value" [class]="getDescriptionScoreClass()">
              {{ currentSeoData().description.length }}
            </div>
            <div class="score-item-label">Description Length</div>
          </div>
          
          <div class="score-item">
            <div class="score-item-value text-foreground">
              {{ seoMetrics().metaTagsCount }}
            </div>
            <div class="score-item-label">Meta Tags</div>
          </div>
        </div>
      </div>

      <!-- Current SEO Data -->
      <div class="current-seo-data">
        <h4 class="section-title">Current Page SEO</h4>
        
        <div class="seo-field">
          <div class="field-label">Title</div>
          <div class="field-value" [class]="getTitleScoreClass()">
            {{ currentSeoData().title }}
          </div>
          <div class="field-info">{{ currentSeoData().title.length }}/60 characters</div>
        </div>
        
        <div class="seo-field">
          <div class="field-label">Description</div>
          <div class="field-value" [class]="getDescriptionScoreClass()">
            {{ currentSeoData().description }}
          </div>
          <div class="field-info">{{ currentSeoData().description.length }}/160 characters</div>
        </div>
        
        @if (currentSeoData().keywords) {
          <div class="seo-field">
            <div class="field-label">Keywords</div>
            <div class="field-value">{{ currentSeoData().keywords }}</div>
          </div>
        }
        
        @if (currentSeoData().canonical || currentSeoData().url) {
          <div class="seo-field">
            <div class="field-label">Canonical URL</div>
            <div class="field-value url">{{ currentSeoData().canonical || currentSeoData().url }}</div>
          </div>
        }
      </div>

      <!-- SEO Metrics -->
      @if (showDetails) {
        <div class="seo-metrics">
          <h4 class="section-title">SEO Metrics</h4>
          
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">{{ seoMetrics().openGraphTagsCount }}</div>
              <div class="metric-label">Open Graph Tags</div>
              <div class="metric-status" [class]="seoMetrics().openGraphTagsCount >= 4 ? 'good' : 'needs-improvement'">
                {{ seoMetrics().openGraphTagsCount >= 4 ? 'Good' : 'Needs More' }}
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-value">{{ seoMetrics().twitterTagsCount }}</div>
              <div class="metric-label">Twitter Tags</div>
              <div class="metric-status" [class]="seoMetrics().twitterTagsCount >= 3 ? 'good' : 'needs-improvement'">
                {{ seoMetrics().twitterTagsCount >= 3 ? 'Good' : 'Needs More' }}
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-value">{{ seoMetrics().structuredDataCount }}</div>
              <div class="metric-label">Structured Data</div>
              <div class="metric-status" [class]="seoMetrics().structuredDataCount > 0 ? 'good' : 'needs-improvement'">
                {{ seoMetrics().structuredDataCount > 0 ? 'Present' : 'Missing' }}
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-value">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  @if (seoMetrics().hasCanonical) {
                    <path d="M9 12l2 2 4-4"/>
                    <circle cx="12" cy="12" r="10"/>
                  } @else {
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  }
                </svg>
              </div>
              <div class="metric-label">Canonical URL</div>
              <div class="metric-status" [class]="seoMetrics().hasCanonical ? 'good' : 'needs-improvement'">
                {{ seoMetrics().hasCanonical ? 'Present' : 'Missing' }}
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Validation Results -->
      @if (validationResults().length > 0) {
        <div class="validation-results">
          <h4 class="section-title">SEO Issues</h4>
          
          <div class="issues-list">
            @for (issue of validationResults(); track issue) {
              <div class="issue-item">
                <div class="issue-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div class="issue-text">{{ issue }}</div>
              </div>
            }
          </div>
        </div>
      }

      <!-- SEO Recommendations -->
      @if (showRecommendations && recommendations().length > 0) {
        <div class="seo-recommendations">
          <h4 class="section-title">Recommendations</h4>
          
          <div class="recommendations-list">
            @for (recommendation of recommendations(); track recommendation.id) {
              <div class="recommendation-item" [class]="'priority-' + recommendation.priority">
                <div class="recommendation-icon">
                  @switch (recommendation.priority) {
                    @case ('high') {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    }
                    @case ('medium') {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    }
                    @default {
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                    }
                  }
                </div>
                <div class="recommendation-content">
                  <div class="recommendation-title">{{ recommendation.title }}</div>
                  <div class="recommendation-description">{{ recommendation.description }}</div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Toggle Details Button -->
      <button 
        (click)="toggleDetails()"
        class="toggle-details"
        [attr.aria-expanded]="showDetails">
        <span>{{ showDetails ? 'Hide' : 'Show' }} Details</span>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
          [class.rotated]="showDetails">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .seo-monitor {
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 0.5rem;
      padding: 1rem;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .seo-monitor.compact {
      padding: 0.75rem;
    }

    .monitor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .metric-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .metric-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 0.375rem;
      background: #3b82f6;
      color: white;
    }

    .title {
      font-size: 1.125rem;
      font-weight: 600;
      color: hsl(var(--foreground));
      margin: 0;
    }

    .monitor-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .validate-button,
    .refresh-button {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0.75rem;
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .validate-button:hover,
    .refresh-button:hover {
      background: hsl(var(--primary))/90%;
    }

    .refresh-button {
      padding: 0.5rem;
      background: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
    }

    .refresh-button:hover {
      background: hsl(var(--secondary))/80%;
    }

    .seo-score {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: hsl(var(--muted))/30%;
      border-radius: 0.5rem;
    }

    .score-circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      border: 4px solid;
      transition: all 0.3s ease;
    }

    .score-circle.excellent {
      border-color: #10b981;
      background: #10b981/10%;
    }

    .score-circle.good {
      border-color: #3b82f6;
      background: #3b82f6/10%;
    }

    .score-circle.needs-improvement {
      border-color: #f59e0b;
      background: #f59e0b/10%;
    }

    .score-circle.poor {
      border-color: #ef4444;
      background: #ef4444/10%;
    }

    .score-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: hsl(var(--foreground));
    }

    .score-label {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
      font-weight: 500;
    }

    .score-details {
      display: flex;
      gap: 1.5rem;
      flex: 1;
    }

    .score-item {
      text-align: center;
    }

    .score-item-value {
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .score-item-value.good {
      color: #10b981;
    }

    .score-item-value.needs-improvement {
      color: #f59e0b;
    }

    .score-item-value.poor {
      color: #ef4444;
    }

    .score-item-label {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
      font-weight: 500;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 600;
      color: hsl(var(--foreground));
      margin-bottom: 0.75rem;
    }

    .current-seo-data {
      margin-bottom: 1.5rem;
    }

    .seo-field {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: hsl(var(--muted))/20%;
      border-radius: 0.375rem;
    }

    .field-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(var(--foreground));
      margin-bottom: 0.25rem;
    }

    .field-value {
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
      line-height: 1.4;
      margin-bottom: 0.25rem;
    }

    .field-value.url {
      font-family: monospace;
      word-break: break-all;
    }

    .field-info {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
    }

    .seo-metrics {
      margin-bottom: 1.5rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .metric-card {
      text-align: center;
      padding: 1rem;
      background: hsl(var(--muted))/20%;
      border-radius: 0.375rem;
      border: 1px solid hsl(var(--border));
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: hsl(var(--foreground));
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .metric-label {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .metric-status {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
    }

    .metric-status.good {
      background: #10b981/20%;
      color: #10b981;
    }

    .metric-status.needs-improvement {
      background: #f59e0b/20%;
      color: #f59e0b;
    }

    .validation-results,
    .seo-recommendations {
      margin-bottom: 1.5rem;
    }

    .issues-list,
    .recommendations-list {
      space-y: 0.5rem;
    }

    .issue-item,
    .recommendation-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      background: hsl(var(--muted))/20%;
      border-radius: 0.375rem;
      border-left: 3px solid transparent;
      margin-bottom: 0.5rem;
    }

    .issue-item {
      border-left-color: #f59e0b;
    }

    .recommendation-item.priority-high {
      border-left-color: #ef4444;
    }

    .recommendation-item.priority-medium {
      border-left-color: #f59e0b;
    }

    .recommendation-item.priority-low {
      border-left-color: #10b981;
    }

    .issue-icon,
    .recommendation-icon {
      flex-shrink: 0;
      margin-top: 0.125rem;
      color: #f59e0b;
    }

    .recommendation-icon {
      color: inherit;
    }

    .issue-text,
    .recommendation-content {
      flex: 1;
    }

    .recommendation-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: hsl(var(--foreground));
      margin-bottom: 0.25rem;
    }

    .recommendation-description {
      font-size: 0.8125rem;
      color: hsl(var(--muted-foreground));
      line-height: 1.4;
    }

    .toggle-details {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem;
      background: transparent;
      border: 1px solid hsl(var(--border));
      border-radius: 0.375rem;
      color: hsl(var(--muted-foreground));
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .toggle-details:hover {
      background: hsl(var(--muted))/50%;
      color: hsl(var(--foreground));
    }

    .toggle-details svg {
      transition: transform 0.2s ease;
    }

    .toggle-details svg.rotated {
      transform: rotate(180deg);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .seo-score {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .score-details {
        justify-content: center;
      }

      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .monitor-header {
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeoMonitorComponent implements OnInit, OnDestroy {
  @Input() showControls: boolean = true;
  @Input() showDetails: boolean = false;
  @Input() showRecommendations: boolean = true;
  @Input() compact: boolean = false;

  @Output() seoValidated = new EventEmitter<{ isValid: boolean; issues: string[] }>();
  @Output() metricsRefreshed = new EventEmitter<void>();

  private seoService = inject(SeoService);
  private subscription = new Subscription();

  // Signals for reactive state
  currentSeoData = signal<SeoData>(this.seoService.getCurrentSeoData());
  seoMetrics = signal<SeoMetrics>(this.seoService.getSeoMetrics());
  validationResults = signal<string[]>([]);
  showDetailsSignal = signal<boolean>(this.showDetails);

  // Computed values
  containerClasses = computed(() => {
    const classes = ['seo-monitor'];
    if (this.compact) classes.push('compact');
    return classes.join(' ');
  });

  iconClasses = computed(() => {
    return 'metric-icon';
  });

  seoScore = computed(() => {
    const titleScore = this.getTitleScore();
    const descriptionScore = this.getDescriptionScore();
    const metaTagsScore = Math.min(100, this.seoMetrics().metaTagsCount * 5);
    const structuredDataScore = this.seoMetrics().structuredDataCount > 0 ? 20 : 0;
    const canonicalScore = this.seoMetrics().hasCanonical ? 10 : 0;

    const totalScore = Math.round(
      (titleScore + descriptionScore + metaTagsScore + structuredDataScore + canonicalScore) / 5
    );

    return Math.min(100, totalScore);
  });

  scoreClasses = computed(() => {
    const score = this.seoScore();
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  });

  recommendations = computed(() => {
    const recs: Array<{ id: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }> = [];
    const data = this.currentSeoData();
    const metrics = this.seoMetrics();

    // Title recommendations
    if (data.title.length > 60) {
      recs.push({
        id: 'title-too-long',
        title: 'Title Too Long',
        description: 'Keep your title under 60 characters for better search engine display.',
        priority: 'high'
      });
    } else if (data.title.length < 10) {
      recs.push({
        id: 'title-too-short',
        title: 'Title Too Short',
        description: 'Make your title at least 10 characters for better SEO.',
        priority: 'medium'
      });
    }

    // Description recommendations
    if (data.description.length > 160) {
      recs.push({
        id: 'description-too-long',
        title: 'Description Too Long',
        description: 'Keep your meta description under 160 characters.',
        priority: 'high'
      });
    } else if (data.description.length < 50) {
      recs.push({
        id: 'description-too-short',
        title: 'Description Too Short',
        description: 'Make your description at least 50 characters for better SEO.',
        priority: 'medium'
      });
    }

    // Structured data recommendation
    if (metrics.structuredDataCount === 0) {
      recs.push({
        id: 'missing-structured-data',
        title: 'Add Structured Data',
        description: 'Add JSON-LD structured data to help search engines understand your content.',
        priority: 'medium'
      });
    }

    // Canonical URL recommendation
    if (!metrics.hasCanonical) {
      recs.push({
        id: 'missing-canonical',
        title: 'Add Canonical URL',
        description: 'Add a canonical URL to prevent duplicate content issues.',
        priority: 'low'
      });
    }

    // Open Graph recommendations
    if (metrics.openGraphTagsCount < 4) {
      recs.push({
        id: 'incomplete-og',
        title: 'Incomplete Open Graph',
        description: 'Add more Open Graph tags for better social media sharing.',
        priority: 'low'
      });
    }

    return recs;
  });

  ngOnInit(): void {
    // Subscribe to SEO data changes
    this.subscription.add(
      this.seoService.currentSeoData$.subscribe(data => {
        this.currentSeoData.set(data);
      })
    );

    // Subscribe to SEO metrics changes
    this.subscription.add(
      this.seoService.getSeoMetricsObservable().subscribe(metrics => {
        this.seoMetrics.set(metrics);
      })
    );

    // Initialize details state
    this.showDetailsSignal.set(this.showDetails);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  validateSeo(): void {
    const validation = this.seoService.validateSeoData(this.currentSeoData());
    this.validationResults.set(validation.issues);
    this.seoValidated.emit(validation);
  }

  refreshMetrics(): void {
    // Force refresh of metrics
    const currentData = this.seoService.getCurrentSeoData();
    this.seoService.updatePageSeo(currentData);
    this.metricsRefreshed.emit();
  }

  toggleDetails(): void {
    this.showDetailsSignal.update(show => !show);
  }

  getTitleScoreClass(): string {
    const length = this.currentSeoData().title.length;
    if (length >= 10 && length <= 60) return 'good';
    if (length > 60 || length < 10) return 'poor';
    return 'needs-improvement';
  }

  getDescriptionScoreClass(): string {
    const length = this.currentSeoData().description.length;
    if (length >= 50 && length <= 160) return 'good';
    if (length > 160 || length < 50) return 'poor';
    return 'needs-improvement';
  }

  private getTitleScore(): number {
    const length = this.currentSeoData().title.length;
    if (length >= 10 && length <= 60) return 100;
    if (length > 60) return Math.max(0, 100 - (length - 60) * 2);
    return Math.max(0, length * 10);
  }

  private getDescriptionScore(): number {
    const length = this.currentSeoData().description.length;
    if (length >= 50 && length <= 160) return 100;
    if (length > 160) return Math.max(0, 100 - (length - 160));
    return Math.max(0, length * 2);
  }
}