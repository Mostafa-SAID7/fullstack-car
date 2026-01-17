import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

/**
 * Bootstrap Angular 19 Application
 * 
 * Modern Angular 19 application using:
 * - Standalone components architecture
 * - Centralized application configuration
 * - Functional interceptors
 * - Angular Signals for state management
 */
bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    console.log('Angular 19 application bootstrapped successfully');
  })
  .catch(err => {
    console.error('Failed to bootstrap Angular application:', err);
  });
