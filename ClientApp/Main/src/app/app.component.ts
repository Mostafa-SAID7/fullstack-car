import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from './core/services/layout.service';
import { ThemeService } from './core/services/theme.service';
import { RtlService } from './core/services/rtl.service';

/**
 * Root Application Component
 * 
 * Modern Angular 19 component using:
 * - Standalone component architecture
 * - Angular Signals for reactive state management
 * - Dependency injection with inject() function
 * - Effects for side effect management
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Services injected using modern inject() function
  layoutService = inject(LayoutService);
  private themeService = inject(ThemeService);
  private rtlService = inject(RtlService);

  // Angular Signals for reactive state
  title = signal('Media Streaming Platform');
  isInitialized = signal(false);
  
  // Computed signal derived from other signals
  appStatus = computed(() => {
    return this.isInitialized() ? 'ready' : 'initializing';
  });

  constructor() {
    // Effect to log app status changes
    effect(() => {
      console.log(`App status: ${this.appStatus()}`);
    });
  }

  ngOnInit(): void {
    // Initialize RTL service - this will set up document-level RTL support
    // The RTL service automatically subscribes to translation service changes
    console.log('RTL Service initialized');
    
    // Mark app as initialized
    this.isInitialized.set(true);
  }
}