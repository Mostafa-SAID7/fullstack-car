import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.server.config';

/**
 * Bootstrap Angular Application for Server-Side Rendering
 * 
 * This is the entry point for SSR, using the server-specific configuration
 * that includes server rendering providers and route prerendering setup.
 */
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;