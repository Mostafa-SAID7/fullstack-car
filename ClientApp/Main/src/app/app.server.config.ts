import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig, RenderMode } from '@angular/ssr';
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
        renderMode: RenderMode.Prerender
      },
      {
        path: 'media',
        renderMode: RenderMode.Prerender
      },
      {
        path: 'community',
        renderMode: RenderMode.Prerender
      },
      {
        path: 'marketplace',
        renderMode: RenderMode.Prerender
      },
      {
        path: 'performance-demo',
        renderMode: RenderMode.Server
      },
      {
        path: '**',
        renderMode: RenderMode.Server
      }
    ])
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);