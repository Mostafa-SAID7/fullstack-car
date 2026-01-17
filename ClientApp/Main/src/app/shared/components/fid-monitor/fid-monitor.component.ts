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
import { FIDOptimizationService, FIDMetrics } from '../../../core/services/fid-optimization.service';
import { Subscription } from 'rxjs';

/**
 * FID Monitor Component
 * 
 * Displays First Input Delay metrics and optimization status:
 * - Real-time FID measurements
 * - Performance recommendations
 * - Optimization controls
 * - Visual indicator
 */
@Component({
  selector: 'app-fid-monitor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fid-monitor" [class]="containerClasses()">
      <!-- Header -->
      <div class="monitor-header">
        <div class="metric-title">
          <div class="metric-icon" [class]="iconClasses()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </div>
          <h3 class="title">First Input Delay</h3>
        </div>
        
        @if (showControls) {
          <div class="monitor-controls">
            <button 
              (click)="toggleOptimization()"
              [class]="optimizationButtonClasses()"
              [disabled]="isOptimizing()">
              {{ optimizationButtonText() }}
            </button>
            
            <button 
              (click)="resetMetrics()"
              class="reset-button"
              title="Reset metrics">
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

      <!-- Main Metrics Display -->
      <div class="metrics-display">
        <div class="primary-metric">
          <div class="metric-value" [class]="scoreClasses()">
            {{ formatFIDValue() }}
            <span class="metric-unit">ms</span>
          </div>
          <div class="metric-label">Current FID</div>
        </div>

        <div class="secondary-metrics">
          <div class="metric-item">
            <div class="metric-value-small">{{ fidMetrics().averageFID.toFixed(1) }}ms</div>
            <div class="metric-label-small">Average</div>
          </div>
          
          <div class="metric-item">
            <div class="metric-value-small">{{ fidMetrics().maxFID.toFixed(1) }}ms</div>
            <div class="metric-label-small">Max</div>
          </div>
          
          <div class="metric-item">
            <div class="metric-value-small">{{ fidMetrics().sampleCount }}</div>
            <div class="metric-label-small">Samples</div>
          </div>
        </div>
      </div>

      <!-- Performance Status -->
      <div class="performance-status">
        <div class="status-indicator" [class]="statusClasses()">
          <div class="status-dot"></div>
          <span class="status-text">{{ performanceStatus() }}</span>
        </div>
        
        <div class="optimization-status">
          @if (isOptimizationEnabled()) {
            <span class="optimization-active">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              Optimization Active
            </span>
          } @else {
            <span class="optimization-inactive">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Optimization Disabled
            </span>
          }
        </div>
      </div>

      <!-- Detailed Metrics (expandable) -->
      @if (showDetails) {
        <div class="detailed-metrics">
          <div class="metrics-grid">
            <div class="metric-detail">
              <div class="detail-label">Input Events</div>
              <div class="detail-value">{{ fidMetrics().inputEventCount }}</div>
            </div>
            
            <div class="metric-detail">
              <div class="detail-label">Processing Time</div>
              <div class="detail-value">{{ fidMetrics().averageProcessingTime.toFixed(1) }}ms</div>
            </div>
            
            <div class="metric-detail">
              <div class="detail-label">Main Thread Blocked</div>
              <div class="detail-value">{{ fidMetrics().mainThreadBlockedTime.toFixed(1) }}ms</div>
            </div>
            
            <div class="metric-detail">
              <div class="detail-label">Optimization Score</div>
              <div class="detail-value">{{ fidMetrics().optimizationScore }}/100</div>
            </div>
          </div>

          <!-- Performance Recommendations -->
          @if (recommendations().length > 0) {
            <div class="recommendations">
              <h4 class="recommendations-title">Performance Recommendations</h4>
              <ul class="recommendations-list">
                @for (recommendation of recommendations(); track recommendation.id) {
                  <li class="recommendation-item" [class]="'priority-' + recommendation.priority">
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
                      @if (recommendation.action) {
                        <button 
                          (click)="executeRecommendation(recommendation)"
                          class="recommendation-action">
                          {{ recommendation.action }}
                        </button>
                      }
                    </div>
                  </li>
                }
              </ul>
            </div>
          }
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
    .fid-monitor {
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 0.5rem;
      padding: 1rem;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .fid-monitor.compact {
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
      transition: all 0.2s ease;
    }

    .metric-icon.good {
      background: #dcfce7;
      color: #16a34a;
    }

    .metric-icon.needs-improvement {
      background: #fef3c7;
      color: #d97706;
    }

    .metric-icon.poor {
      background: #fee2e2;
      color: #dc2626;
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

    .optimization-button {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .optimization-button.enabled {
      background: #16a34a;
      color: white;
    }

    .optimization-button.enabled:hover {
      background: #15803d;
    }

    .optimization-button.disabled {
      background: #6b7280;
      color: white;
    }

    .optimization-button.disabled:hover {
      background: #4b5563;
    }

    .optimization-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .reset-button {
      padding: 0.5rem;
      background: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .reset-button:hover {
      background: hsl(var(--secondary))/80%;
    }

    .metrics-display {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 1rem;
    }

    .primary-metric {
      text-align: center;
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 0.25rem;
      transition: color 0.3s ease;
    }

    .metric-value.good {
      color: #16a34a;
    }

    .metric-value.needs-improvement {
      color: #d97706;
    }

    .metric-value.poor {
      color: #dc2626;
    }

    .metric-unit {
      font-size: 1rem;
      font-weight: 400;
      opacity: 0.7;
    }

    .metric-label {
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
      font-weight: 500;
    }

    .secondary-metrics {
      display: flex;
      gap: 1.5rem;
    }

    .metric-item {
      text-align: center;
    }

    .metric-value-small {
      font-size: 1.25rem;
      font-weight: 600;
      color: hsl(var(--foreground));
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .metric-label-small {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
      font-weight: 500;
    }

    .performance-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      background: hsl(var(--muted))/50%;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      transition: background-color 0.3s ease;
    }

    .status-indicator.good .status-dot {
      background: #16a34a;
    }

    .status-indicator.needs-improvement .status-dot {
      background: #d97706;
    }

    .status-indicator.poor .status-dot {
      background: #dc2626;
    }

    .status-text {
      font-size: 0.875rem;
      font-weight: 500;
      color: hsl(var(--foreground));
    }

    .optimization-status {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
    }

    .optimization-active {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #16a34a;
      font-weight: 500;
    }

    .optimization-inactive {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #6b7280;
      font-weight: 500;
    }

    .detailed-metrics {
      border-top: 1px solid hsl(var(--border));
      padding-top: 1rem;
      margin-top: 1rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .metric-detail {
      text-align: center;
      padding: 0.75rem;
      background: hsl(var(--muted))/30%;
      border-radius: 0.375rem;
    }

    .detail-label {
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .detail-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: hsl(var(--foreground));
    }

    .recommendations {
      margin-top: 1.5rem;
    }

    .recommendations-title {
      font-size: 1rem;
      font-weight: 600;
      color: hsl(var(--foreground));
      margin-bottom: 0.75rem;
    }

    .recommendations-list {
      list-style: none;
      padding: 0;
      margin: 0;
      space-y: 0.75rem;
    }

    .recommendation-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      background: hsl(var(--muted))/20%;
      border-radius: 0.375rem;
      border-left: 3px solid transparent;
      margin-bottom: 0.75rem;
    }

    .recommendation-item.priority-high {
      border-left-color: #dc2626;
    }

    .recommendation-item.priority-medium {
      border-left-color: #d97706;
    }

    .recommendation-item.priority-low {
      border-left-color: #16a34a;
    }

    .recommendation-icon {
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

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
      margin-bottom: 0.5rem;
    }

    .recommendation-action {
      padding: 0.375rem 0.75rem;
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border: none;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .recommendation-action:hover {
      background: hsl(var(--primary))/90%;
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
      margin-top: 1rem;
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
      .metrics-display {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .secondary-metrics {
        justify-content: center;
      }

      .performance-status {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
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

    /* Dark mode adjustments */
    .dark .metric-icon.good {
      background: #16a34a/20%;
      color: #22c55e;
    }

    .dark .metric-icon.needs-improvement {
      background: #d97706/20%;
      color: #f59e0b;
    }

    .dark .metric-icon.poor {
      background: #dc2626/20%;
      color: #ef4444;
    }

    /* High contrast mode */
    .high-contrast .fid-monitor {
      border: 2px solid;
    }

    .high-contrast .metric-value.good {
      color: #00ff00;
    }

    .high-contrast .metric-value.needs-improvement {
      color: #ffff00;
    }

    .high-contrast .metric-value.poor {
      color: #ff0000;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .metric-value,
      .status-dot,
      .toggle-details svg {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FIDMonitorComponent implements OnInit, OnDestroy {
  @Input() showControls: boolean = true;
  @Input() showDetails: boolean = false;
  @Input() compact: boolean = false;
  @Input() autoOptimize: boolean = false;

  @Output() optimizationToggled = new EventEmitter<boolean>();
  @Output() metricsReset = new EventEmitter<void>();
  @Output() recommendationExecuted = new EventEmitter<any>();

  private fidService = inject(FIDOptimizationService);
  private subscription = new Subscription();

  // Signals for reactive state
  fidMetrics = signal<FIDMetrics>({
    currentFID: 0,
    averageFID: 0,
    maxFID: 0,
    sampleCount: 0,
    inputEventCount: 0,
    averageProcessingTime: 0,
    mainThreadBlockedTime: 0,
    optimizationScore: 100,
    timestamp: Date.now()
  });

  isOptimizationEnabled = signal<boolean>(false);
  isOptimizing = signal<boolean>(false);
  showDetailsSignal = signal<boolean>(this.showDetails);

  // Computed values
  containerClasses = computed(() => {
    const classes = ['fid-monitor'];
    if (this.compact) classes.push('compact');
    return classes.join(' ');
  });

  iconClasses = computed(() => {
    const fid = this.fidMetrics().currentFID;
    if (fid <= 100) return 'good';
    if (fid <= 300) return 'needs-improvement';
    return 'poor';
  });

  scoreClasses = computed(() => {
    const fid = this.fidMetrics().currentFID;
    if (fid <= 100) return 'good';
    if (fid <= 300) return 'needs-improvement';
    return 'poor';
  });

  statusClasses = computed(() => {
    const fid = this.fidMetrics().currentFID;
    if (fid <= 100) return 'good';
    if (fid <= 300) return 'needs-improvement';
    return 'poor';
  });

  performanceStatus = computed(() => {
    const fid = this.fidMetrics().currentFID;
    if (fid <= 100) return 'Good';
    if (fid <= 300) return 'Needs Improvement';
    return 'Poor';
  });

  optimizationButtonClasses = computed(() => {
    const classes = ['optimization-button'];
    classes.push(this.isOptimizationEnabled() ? 'enabled' : 'disabled');
    return classes.join(' ');
  });

  optimizationButtonText = computed(() => {
    if (this.isOptimizing()) return 'Optimizing...';
    return this.isOptimizationEnabled() ? 'Disable Optimization' : 'Enable Optimization';
  });

  formatFIDValue = computed(() => {
    const fid = this.fidMetrics().currentFID;
    if (fid === 0) return '—';
    return fid < 1 ? fid.toFixed(2) : fid.toFixed(0);
  });

  recommendations = computed(() => {
    return this.fidService.getRecommendations();
  });

  ngOnInit(): void {
    // Subscribe to FID metrics
    this.subscription.add(
      this.fidService.getMetricsObservable().subscribe(metrics => {
        this.fidMetrics.set(metrics);
      })
    );

    // Subscribe to optimization status
    this.subscription.add(
      this.fidService.getOptimizationStatus().subscribe(status => {
        this.isOptimizationEnabled.set(status.enabled);
        this.isOptimizing.set(status.optimizing);
      })
    );

    // Auto-enable optimization if requested
    if (this.autoOptimize) {
      this.fidService.enableOptimization();
    }

    // Initialize details state
    this.showDetailsSignal.set(this.showDetails);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleOptimization(): void {
    const currentState = this.isOptimizationEnabled();
    
    if (currentState) {
      this.fidService.disableOptimization();
    } else {
      this.fidService.enableOptimization();
    }
    
    this.optimizationToggled.emit(!currentState);
  }

  resetMetrics(): void {
    this.fidService.resetMetrics();
    this.metricsReset.emit();
  }

  toggleDetails(): void {
    this.showDetailsSignal.update(show => !show);
  }

  executeRecommendation(recommendation: any): void {
    this.fidService.executeRecommendation(recommendation.id);
    this.recommendationExecuted.emit(recommendation);
  }
}