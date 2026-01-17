import { 
  Component, 
  signal, 
  computed, 
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FIDMonitorComponent } from '../fid-monitor/fid-monitor.component';
import { FIDOptimizationService } from '../../../core/services/fid-optimization.service';
import { Subscription } from 'rxjs';

/**
 * FID Demo Component
 * 
 * Demonstrates First Input Delay optimization features:
 * - Interactive performance tests
 * - Real-time FID monitoring
 * - Optimization controls
 * - Performance recommendations
 * - Before/after comparisons
 */
@Component({
  selector: 'app-fid-demo',
  standalone: true,
  imports: [CommonModule, FIDMonitorComponent],
  template: `
    <div class="fid-demo-container p-6 space-y-8">
      <div class="demo-header">
        <h1 class="text-3xl font-bold text-foreground mb-2">
          First Input Delay (FID) Optimization Demo
        </h1>
        <p class="text-muted-foreground mb-6">
          Test and optimize your application's responsiveness to user interactions
        </p>
        
        <!-- FID Monitor -->
        <app-fid-monitor
          [showControls]="true"
          [showDetails]="true"
          [autoOptimize]="false"
          (optimizationToggled)="onOptimizationToggled($event)"
          (metricsReset)="onMetricsReset()"
          (recommendationExecuted)="onRecommendationExecuted($event)">
        </app-fid-monitor>
      </div>

      <!-- Performance Test Controls -->
      <div class="test-controls bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Performance Tests</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Heavy Computation Test -->
          <div class="test-card">
            <h3 class="text-lg font-medium mb-2">Heavy Computation</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Simulate blocking JavaScript execution
            </p>
            <button 
              (click)="runHeavyComputation()"
              [disabled]="isRunningTest()"
              class="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 disabled:opacity-50">
              {{ isRunningTest() ? 'Running...' : 'Run Heavy Task' }}
            </button>
          </div>

          <!-- DOM Manipulation Test -->
          <div class="test-card">
            <h3 class="text-lg font-medium mb-2">DOM Manipulation</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Test DOM updates and layout thrashing
            </p>
            <button 
              (click)="runDOMManipulation()"
              [disabled]="isRunningTest()"
              class="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50">
              {{ isRunningTest() ? 'Running...' : 'Manipulate DOM' }}
            </button>
          </div>

          <!-- Event Flood Test -->
          <div class="test-card">
            <h3 class="text-lg font-medium mb-2">Event Flooding</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Simulate rapid user interactions
            </p>
            <button 
              (click)="runEventFlood()"
              [disabled]="isRunningTest()"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ isRunningTest() ? 'Running...' : 'Flood Events' }}
            </button>
          </div>

          <!-- Memory Allocation Test -->
          <div class="test-card">
            <h3 class="text-lg font-medium mb-2">Memory Allocation</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Test garbage collection impact
            </p>
            <button 
              (click)="runMemoryAllocation()"
              [disabled]="isRunningTest()"
              class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50">
              {{ isRunningTest() ? 'Running...' : 'Allocate Memory' }}
            </button>
          </div>

          <!-- Async Operations Test -->
          <div class="test-card">
            <h3 class="text-lg font-medium mb-2">Async Operations</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Test Promise and async/await impact
            </p>
            <button 
              (click)="runAsyncOperations()"
              [disabled]="isRunningTest()"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
              {{ isRunningTest() ? 'Running...' : 'Run Async Tasks' }}
            </button>
          </div>

          <!-- Combined Stress Test -->
          <div class="test-card">
            <h3 class="text-lg font-medium mb-2">Stress Test</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Combined performance stress test
            </p>
            <button 
              (click)="runStressTest()"
              [disabled]="isRunningTest()"
              class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">
              {{ isRunningTest() ? 'Running...' : 'Stress Test' }}
            </button>
          </div>
        </div>

        <!-- Test Results -->
        @if (testResults().length > 0) {
          <div class="test-results mt-6">
            <h3 class="text-lg font-semibold mb-3">Test Results</h3>
            <div class="space-y-2">
              @for (result of testResults(); track result.id) {
                <div class="result-item flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <div>
                    <span class="font-medium">{{ result.testName }}</span>
                    <span class="text-sm text-muted-foreground ml-2">{{ result.timestamp | date:'short' }}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold" [class]="getResultClass(result.fid)">
                      {{ result.fid.toFixed(1) }}ms
                    </div>
                    <div class="text-xs text-muted-foreground">
                      {{ result.duration.toFixed(0) }}ms duration
                    </div>
                  </div>
                </div>
              }
            </div>
            
            <button 
              (click)="clearResults()"
              class="mt-3 px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
              Clear Results
            </button>
          </div>
        }
      </div>

      <!-- Interactive Elements for Testing -->
      <div class="interactive-elements bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Interactive Test Elements</h2>
        <p class="text-muted-foreground mb-6">
          Click, type, and interact with these elements to generate FID measurements
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Input Elements -->
          <div class="element-group">
            <h3 class="text-lg font-medium mb-3">Input Elements</h3>
            <div class="space-y-3">
              <input 
                type="text" 
                placeholder="Type here to test input delay..."
                (input)="onInputTest($event)"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              
              <textarea 
                placeholder="Multi-line text input..."
                (input)="onTextareaTest($event)"
                rows="3"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none">
              </textarea>
              
              <select 
                (change)="onSelectTest($event)"
                class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select an option...</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>
          </div>

          <!-- Button Elements -->
          <div class="element-group">
            <h3 class="text-lg font-medium mb-3">Button Elements</h3>
            <div class="grid grid-cols-2 gap-3">
              <button 
                (click)="onButtonTest('primary')"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Primary Button
              </button>
              
              <button 
                (click)="onButtonTest('secondary')"
                class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                Secondary Button
              </button>
              
              <button 
                (click)="onButtonTest('outline')"
                class="px-4 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Outline Button
              </button>
              
              <button 
                (click)="onButtonTest('ghost')"
                class="px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                Ghost Button
              </button>
            </div>
          </div>
        </div>

        <!-- Click Counter -->
        <div class="click-counter mt-6 p-4 bg-muted/50 rounded-lg text-center">
          <div class="text-2xl font-bold text-foreground mb-2">{{ clickCount() }}</div>
          <div class="text-sm text-muted-foreground mb-3">Total Interactions</div>
          <button 
            (click)="incrementCounter()"
            class="px-6 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors">
            Click Me!
          </button>
        </div>
      </div>

      <!-- Optimization Techniques -->
      <div class="optimization-techniques bg-card border border-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">FID Optimization Techniques</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="technique-card">
            <h3 class="text-lg font-medium text-green-600 mb-3">✅ Good Practices</h3>
            <ul class="space-y-2 text-sm">
              <li>• Use OnPush change detection strategy</li>
              <li>• Break up long-running JavaScript tasks</li>
              <li>• Implement event delegation</li>
              <li>• Use requestIdleCallback for non-critical work</li>
              <li>• Throttle and debounce user inputs</li>
              <li>• Optimize third-party scripts</li>
              <li>• Use web workers for heavy computations</li>
              <li>• Implement code splitting</li>
            </ul>
          </div>
          
          <div class="technique-card">
            <h3 class="text-lg font-medium text-red-600 mb-3">❌ Avoid These</h3>
            <ul class="space-y-2 text-sm">
              <li>• Blocking the main thread with heavy tasks</li>
              <li>• Synchronous DOM manipulations</li>
              <li>• Excessive event listeners</li>
              <li>• Large JavaScript bundles</li>
              <li>• Unoptimized third-party scripts</li>
              <li>• Memory leaks and excessive GC</li>
              <li>• Nested setTimeout/setInterval</li>
              <li>• Synchronous network requests</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Performance Metrics History -->
      @if (metricsHistory().length > 0) {
        <div class="metrics-history bg-card border border-border rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Performance History</h2>
          
          <div class="metrics-chart">
            <!-- Simple text-based chart -->
            <div class="chart-header grid grid-cols-4 gap-4 mb-2 text-sm font-medium text-muted-foreground">
              <div>Time</div>
              <div>FID (ms)</div>
              <div>Status</div>
              <div>Optimization</div>
            </div>
            
            @for (metric of metricsHistory().slice(-10); track metric.timestamp) {
              <div class="chart-row grid grid-cols-4 gap-4 py-2 border-b border-border last:border-b-0 text-sm">
                <div>{{ metric.timestamp | date:'HH:mm:ss' }}</div>
                <div [class]="getResultClass(metric.currentFID)">
                  {{ metric.currentFID.toFixed(1) }}
                </div>
                <div [class]="getStatusClass(metric.currentFID)">
                  {{ getFIDStatus(metric.currentFID) }}
                </div>
                <div class="text-xs">
                  Score: {{ metric.optimizationScore }}
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .fid-demo-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .test-card {
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .element-group {
      background: hsl(var(--muted))/30%;
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .technique-card {
      background: hsl(var(--muted))/20%;
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .result-good {
      color: #16a34a;
    }

    .result-needs-improvement {
      color: #d97706;
    }

    .result-poor {
      color: #dc2626;
    }

    .status-good {
      color: #16a34a;
      font-weight: 500;
    }

    .status-needs-improvement {
      color: #d97706;
      font-weight: 500;
    }

    .status-poor {
      color: #dc2626;
      font-weight: 500;
    }

    .click-counter {
      user-select: none;
    }

    .chart-row:hover {
      background: hsl(var(--muted))/50%;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .fid-demo-container {
        padding: 1rem;
      }

      .grid.grid-cols-3 {
        grid-template-columns: 1fr;
      }

      .grid.grid-cols-2 {
        grid-template-columns: 1fr;
      }
    }

    /* Animation for test running state */
    button:disabled {
      position: relative;
      overflow: hidden;
    }

    button:disabled::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% { left: -100%; }
      100% { left: 100%; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FIDDemoComponent implements OnInit, OnDestroy {
  private fidService = inject(FIDOptimizationService);
  private subscription = new Subscription();

  // Signals for reactive state
  isRunningTest = signal<boolean>(false);
  clickCount = signal<number>(0);
  testResults = signal<Array<{
    id: string;
    testName: string;
    fid: number;
    duration: number;
    timestamp: Date;
  }>>([]);
  metricsHistory = signal<Array<any>>([]);

  ngOnInit(): void {
    // Subscribe to FID metrics for history
    this.subscription.add(
      this.fidService.getMetricsObservable().subscribe(metrics => {
        if (metrics.currentFID > 0) {
          const history = this.metricsHistory();
          history.push({
            ...metrics,
            timestamp: new Date()
          });
          
          // Keep only last 50 entries
          if (history.length > 50) {
            history.shift();
          }
          
          this.metricsHistory.set([...history]);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Run heavy computation test
   */
  async runHeavyComputation(): Promise<void> {
    this.isRunningTest.set(true);
    const startTime = performance.now();

    try {
      // Simulate heavy computation
      let result = 0;
      for (let i = 0; i < 10000000; i++) {
        result += Math.random() * Math.sin(i) * Math.cos(i);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      this.addTestResult('Heavy Computation', duration, startTime);
      
      console.log('Heavy computation result:', result);
    } finally {
      this.isRunningTest.set(false);
    }
  }

  /**
   * Run DOM manipulation test
   */
  async runDOMManipulation(): Promise<void> {
    this.isRunningTest.set(true);
    const startTime = performance.now();

    try {
      // Create and manipulate DOM elements
      const container = document.createElement('div');
      document.body.appendChild(container);

      for (let i = 0; i < 1000; i++) {
        const element = document.createElement('div');
        element.textContent = `Element ${i}`;
        element.style.width = `${Math.random() * 100}px`;
        element.style.height = `${Math.random() * 100}px`;
        element.style.backgroundColor = `hsl(${Math.random() * 360}, 50%, 50%)`;
        container.appendChild(element);
      }

      // Force layout
      container.offsetHeight;

      // Clean up
      setTimeout(() => {
        document.body.removeChild(container);
      }, 100);

      const endTime = performance.now();
      const duration = endTime - startTime;

      this.addTestResult('DOM Manipulation', duration, startTime);
    } finally {
      this.isRunningTest.set(false);
    }
  }

  /**
   * Run event flood test
   */
  async runEventFlood(): Promise<void> {
    this.isRunningTest.set(true);
    const startTime = performance.now();

    try {
      // Simulate rapid events
      const button = document.createElement('button');
      document.body.appendChild(button);

      let eventCount = 0;
      const handleClick = () => {
        eventCount++;
        // Simulate some processing
        for (let i = 0; i < 1000; i++) {
          Math.random();
        }
      };

      button.addEventListener('click', handleClick);

      // Fire many events rapidly
      for (let i = 0; i < 100; i++) {
        button.click();
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }

      document.body.removeChild(button);

      const endTime = performance.now();
      const duration = endTime - startTime;

      this.addTestResult('Event Flooding', duration, startTime);
      
      console.log('Events processed:', eventCount);
    } finally {
      this.isRunningTest.set(false);
    }
  }

  /**
   * Run memory allocation test
   */
  async runMemoryAllocation(): Promise<void> {
    this.isRunningTest.set(true);
    const startTime = performance.now();

    try {
      // Allocate large amounts of memory
      const arrays: number[][] = [];
      
      for (let i = 0; i < 100; i++) {
        const largeArray = new Array(10000).fill(0).map(() => Math.random());
        arrays.push(largeArray);
        
        // Yield control occasionally
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }

      // Force garbage collection if available
      if ('gc' in window) {
        (window as any).gc();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      this.addTestResult('Memory Allocation', duration, startTime);
      
      console.log('Arrays created:', arrays.length);
    } finally {
      this.isRunningTest.set(false);
    }
  }

  /**
   * Run async operations test
   */
  async runAsyncOperations(): Promise<void> {
    this.isRunningTest.set(true);
    const startTime = performance.now();

    try {
      // Create many async operations
      const promises = [];
      
      for (let i = 0; i < 50; i++) {
        const promise = new Promise(resolve => {
          setTimeout(() => {
            // Simulate some work
            let result = 0;
            for (let j = 0; j < 10000; j++) {
              result += Math.random();
            }
            resolve(result);
          }, Math.random() * 10);
        });
        promises.push(promise);
      }

      await Promise.all(promises);

      const endTime = performance.now();
      const duration = endTime - startTime;

      this.addTestResult('Async Operations', duration, startTime);
    } finally {
      this.isRunningTest.set(false);
    }
  }

  /**
   * Run combined stress test
   */
  async runStressTest(): Promise<void> {
    this.isRunningTest.set(true);
    const startTime = performance.now();

    try {
      // Combine multiple stress factors
      await Promise.all([
        this.runHeavyComputation(),
        this.runDOMManipulation(),
        this.runMemoryAllocation()
      ]);

      const endTime = performance.now();
      const duration = endTime - startTime;

      this.addTestResult('Stress Test', duration, startTime);
    } finally {
      this.isRunningTest.set(false);
    }
  }

  /**
   * Handle input test
   */
  onInputTest(event: Event): void {
    const target = event.target as HTMLInputElement;
    console.log('Input test:', target.value.length, 'characters');
    
    // Simulate some processing
    for (let i = 0; i < 1000; i++) {
      Math.random();
    }
  }

  /**
   * Handle textarea test
   */
  onTextareaTest(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    console.log('Textarea test:', target.value.length, 'characters');
    
    // Simulate some processing
    for (let i = 0; i < 2000; i++) {
      Math.random();
    }
  }

  /**
   * Handle select test
   */
  onSelectTest(event: Event): void {
    const target = event.target as HTMLSelectElement;
    console.log('Select test:', target.value);
    
    // Simulate some processing
    for (let i = 0; i < 500; i++) {
      Math.random();
    }
  }

  /**
   * Handle button test
   */
  onButtonTest(type: string): void {
    console.log('Button test:', type);
    
    // Simulate some processing based on button type
    const iterations = type === 'primary' ? 5000 : 2000;
    for (let i = 0; i < iterations; i++) {
      Math.random();
    }
  }

  /**
   * Increment click counter
   */
  incrementCounter(): void {
    this.clickCount.update(count => count + 1);
    
    // Simulate some processing
    for (let i = 0; i < 1000; i++) {
      Math.random();
    }
  }

  /**
   * Add test result
   */
  private addTestResult(testName: string, duration: number, startTime: number): void {
    const currentMetrics = this.fidService.getCurrentMetrics();
    
    const result = {
      id: `${Date.now()}-${Math.random()}`,
      testName,
      fid: currentMetrics.currentFID || duration,
      duration,
      timestamp: new Date()
    };

    this.testResults.update(results => [result, ...results]);
  }

  /**
   * Clear test results
   */
  clearResults(): void {
    this.testResults.set([]);
  }

  /**
   * Get result class based on FID value
   */
  getResultClass(fid: number): string {
    if (fid <= 100) return 'result-good';
    if (fid <= 300) return 'result-needs-improvement';
    return 'result-poor';
  }

  /**
   * Get status class based on FID value
   */
  getStatusClass(fid: number): string {
    if (fid <= 100) return 'status-good';
    if (fid <= 300) return 'status-needs-improvement';
    return 'status-poor';
  }

  /**
   * Get FID status text
   */
  getFIDStatus(fid: number): string {
    if (fid <= 100) return 'Good';
    if (fid <= 300) return 'Needs Improvement';
    return 'Poor';
  }

  /**
   * Handle optimization toggle
   */
  onOptimizationToggled(enabled: boolean): void {
    console.log('FID optimization toggled:', enabled);
  }

  /**
   * Handle metrics reset
   */
  onMetricsReset(): void {
    console.log('FID metrics reset');
    this.metricsHistory.set([]);
  }

  /**
   * Handle recommendation execution
   */
  onRecommendationExecuted(recommendation: any): void {
    console.log('Recommendation executed:', recommendation);
  }
}