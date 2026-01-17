import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';

/**
 * Server-Side Rendering Configuration
 * 
 * Extends the main application configuration with SSR-specific providers:
 * - Server rendering support
 * - Route prerendering configuration
 * - Server-specific optimizations
 */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig([
      {
        path: '',
        renderMode: 'prerender'
      },
      {
        path: 'media',
        renderMode: 'prerender'
      },
      {
        path: 'community',
        renderMode: 'prerender'
      },
      {
        path: 'marketplace',
        renderMode: 'prerender'
      },
      {
        path: 'performance-demo',
        renderMode: 'server-side-render'
      },
      {
        path: '**',
        renderMode: 'server-side-render'
      }
    ])
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);