# Main Frontend User Interface - Design Specification

## Architecture Overview

The Main Frontend User Interface follows modern Angular 19 architecture with standalone components, signals-based state management, and performance-optimized patterns. The application integrates shadcn/ui components, Tailwind CSS, and HugeIcons to deliver a responsive, accessible, and high-performance user experience.

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  Angular 19 App       │  Shadcn/UI        │  Modern UI/UX       │
│  - Standalone Comps   │  - Component Lib  │  - Responsive Design │
│  - Control Flow       │  - Design System  │  - Dark/Light Theme  │
│  - Angular Signals    │  - Accessibility  │  - PWA Features      │
│  - SSR Optimization   │  - Form Controls  │  - Mobile First      │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                         State Management                        │
├─────────────────────────────────────────────────────────────────┤
│  Angular Signals     │  RxJS Streams      │  Local Storage      │
│  - Reactive State     │  - HTTP Requests   │  - User Preferences │
│  - Computed Values    │  - Real-time Data  │  - Cache Management │
│  - Effect Management  │  - Event Handling  │  - Offline Data     │
│  - Signal Stores      │  - Stream Operators│  - Session State    │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                         Service Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  HTTP Services        │  Real-time        │  Utility Services    │
│  - API Integration    │  - SignalR Hub    │  - SEO Service       │
│  - Auth Service       │  - Notifications  │  - Analytics Service │
│  - Media Service      │  - Live Updates   │  - Theme Service     │
│  - Analytics Service  │  - Chat/Messaging │  - PWA Service       │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  Build & Optimization │  Performance      │  Development Tools   │
│  - Angular CLI        │  - Lazy Loading   │  - Hot Reload        │
│  - Vite/Webpack       │  - Code Splitting │  - Dev Server        │
│  - Tree Shaking       │  - Bundle Analysis│  - Source Maps       │
│  - Service Workers    │  - Image Optimize │  - Testing Tools     │
└─────────────────────────────────────────────────────────────────┘
```

## Angular 19 Modern Architecture

### Standalone Components and Control Flow

```typescript
// Modern Angular 19 component with new control flow
@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [CommonModule, ShadcnButtonComponent, HugeIconsModule],
  template: `
    <div class="media-player-container">
      @if (isLoading()) {
        <div class="loading-skeleton">
          <div class="animate-pulse bg-gray-200 rounded-lg h-64"></div>
        </div>
      } @else if (mediaItem()) {
        <div class="media-content">
          @switch (mediaItem()?.type) {
            @case ('video') {
              <video-player 
                [src]="mediaItem()?.url" 
                [poster]="mediaItem()?.thumbnail"
                (play)="onMediaPlay()"
                (pause)="onMediaPause()" />
            }
            @case ('podcast') {
              <audio-player 
                [src]="mediaItem()?.url" 
                [artwork]="mediaItem()?.artwork"
                (play)="onMediaPlay()"
                (pause)="onMediaPause()" />
            }
            @default {
              <div class="unsupported-media">
                <huge-icon name="file-unknown" class="w-16 h-16 text-gray-400" />
                <p>Unsupported media type</p>
              </div>
            }
          }
        </div>
      } @else {
        <div class="empty-state">
          <huge-icon name="media-empty" class="w-24 h-24 text-gray-300" />
          <h3 class="text-lg font-semibold text-gray-600 mt-4">No media selected</h3>
          <p class="text-gray-500">Choose a video or podcast to start playing</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent {
  // Angular Signals for reactive state management
  private mediaService = inject(MediaService);
  private analyticsService = inject(AnalyticsService);
  
  // Input signals
  mediaId = input<string>();
  autoPlay = input<boolean>(false);
  
  // State signals
  mediaItem = signal<MediaItem | null>(null);
  isLoading = signal<boolean>(false);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  
  // Computed signals
  progress = computed(() => {
    const current = this.currentTime();
    const total = this.duration();
    return total > 0 ? (current / total) * 100 : 0;
  });
  
  constructor() {
    // Effect to load media when mediaId changes
    effect(() => {
      const id = this.mediaId();
      if (id) {
        this.loadMedia(id);
      }
    });
  }
  
  private async loadMedia(id: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const media = await this.mediaService.getMediaById(id);
      this.mediaItem.set(media);
      this.analyticsService.trackEvent('media_loaded', {
        mediaId: id,
        mediaType: media.type,
        title: media.title
      });
    } catch (error) {
      console.error('Failed to load media:', error);
      this.mediaItem.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }
}
```
### Shadcn/UI Integration for Angular

```typescript
// Shadcn Button Component adapted for Angular
@Component({
  selector: 'shadcn-button',
  standalone: true,
  template: `
    <button 
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="onClick()">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ShadcnButtonComponent {
  variant = input<'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'>('default');
  size = input<'default' | 'sm' | 'lg' | 'icon'>('default');
  disabled = input<boolean>(false);
  
  click = output<Event>();
  
  buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
    
    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'underline-offset-4 hover:underline text-primary'
    };
    
    const sizeClasses = {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3 rounded-md',
      lg: 'h-11 px-8 rounded-md',
      icon: 'h-10 w-10'
    };
    
    return `${baseClasses} ${variantClasses[this.variant()]} ${sizeClasses[this.size()]}`;
  });
  
  onClick(): void {
    if (!this.disabled()) {
      this.click.emit();
    }
  }
}

// Shadcn Card Component
@Component({
  selector: 'shadcn-card',
  standalone: true,
  template: `
    <div [class]="cardClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class ShadcnCardComponent {
  variant = input<'default' | 'outline'>('default');
  
  cardClasses = computed(() => {
    const baseClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm';
    const variantClasses = {
      default: '',
      outline: 'border-2'
    };
    
    return `${baseClasses} ${variantClasses[this.variant()]}`;
  });
}

// Shadcn Input Component
@Component({
  selector: 'shadcn-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input 
      [class]="inputClasses()"
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [(ngModel)]="value"
      (input)="onInput($event)"
      (blur)="onBlur()"
      (focus)="onFocus()" />
  `
})
export class ShadcnInputComponent {
  type = input<string>('text');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  
  value = model<string>('');
  
  inputChange = output<string>();
  inputBlur = output<void>();
  inputFocus = output<void>();
  
  inputClasses = computed(() => {
    return 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  });
  
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.inputChange.emit(target.value);
  }
  
  onBlur(): void {
    this.inputBlur.emit();
  }
  
  onFocus(): void {
    this.inputFocus.emit();
  }
}
```

## Tailwind CSS Responsive Design System

### Design Tokens and Theme Configuration

```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
  ],
};
```

### Responsive Layout Components

```typescript
// Responsive Grid Layout Component
@Component({
  selector: 'app-responsive-grid',
  standalone: true,
  template: `
    <div [class]="gridClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class ResponsiveGridComponent {
  columns = input<number>(1);
  gap = input<string>('4');
  responsive = input<boolean>(true);
  
  gridClasses = computed(() => {
    const baseClasses = 'grid';
    const gapClass = `gap-${this.gap()}`;
    
    if (this.responsive()) {
      // Responsive grid that adapts to screen size
      return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-${this.columns()} ${gapClass}`;
    } else {
      return `${baseClasses} grid-cols-${this.columns()} ${gapClass}`;
    }
  });
}

// Mobile-First Navigation Component
@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [CommonModule, HugeIconsModule, ShadcnButtonComponent],
  template: `
    <nav class="bg-background border-b border-border">
      <!-- Mobile Header -->
      <div class="lg:hidden flex items-center justify-between p-4">
        <div class="flex items-center space-x-2">
          <img src="/assets/logo.svg" alt="Logo" class="h-8 w-8" />
          <span class="font-bold text-lg">Community Car</span>
        </div>
        <shadcn-button 
          variant="ghost" 
          size="icon"
          (click)="toggleMobileMenu()">
          <huge-icon 
            [name]="isMobileMenuOpen() ? 'x' : 'menu'" 
            class="w-6 h-6" />
        </shadcn-button>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden lg:flex items-center justify-between px-6 py-4">
        <div class="flex items-center space-x-8">
          <div class="flex items-center space-x-2">
            <img src="/assets/logo.svg" alt="Logo" class="h-8 w-8" />
            <span class="font-bold text-xl">Community Car</span>
          </div>
          
          <div class="flex space-x-6">
            @for (item of navigationItems(); track item.id) {
              <a 
                [href]="item.href"
                [class]="getLinkClasses(item.active)"
                class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <huge-icon [name]="item.icon" class="w-4 h-4" />
                <span>{{ item.label }}</span>
              </a>
            }
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <shadcn-button variant="ghost" size="icon" (click)="toggleTheme()">
            <huge-icon 
              [name]="isDarkMode() ? 'sun' : 'moon'" 
              class="w-5 h-5" />
          </shadcn-button>
          
          <shadcn-button variant="outline">
            <huge-icon name="user" class="w-4 h-4 mr-2" />
            Profile
          </shadcn-button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      @if (isMobileMenuOpen()) {
        <div class="lg:hidden border-t border-border bg-background">
          <div class="px-4 py-2 space-y-1">
            @for (item of navigationItems(); track item.id) {
              <a 
                [href]="item.href"
                [class]="getMobileLinkClasses(item.active)"
                class="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors"
                (click)="closeMobileMenu()">
                <huge-icon [name]="item.icon" class="w-5 h-5" />
                <span>{{ item.label }}</span>
              </a>
            }
          </div>
        </div>
      }
    </nav>
  `
})
export class MobileNavigationComponent {
  private themeService = inject(ThemeService);
  
  isMobileMenuOpen = signal<boolean>(false);
  isDarkMode = computed(() => this.themeService.currentTheme() === 'dark');
  
  navigationItems = signal([
    { id: 'home', label: 'Home', href: '/', icon: 'home', active: true },
    { id: 'media', label: 'Media', href: '/media', icon: 'play-circle', active: false },
    { id: 'community', label: 'Community', href: '/community', icon: 'users', active: false },
    { id: 'marketplace', label: 'Marketplace', href: '/marketplace', icon: 'shopping-cart', active: false },
    { id: 'ai-chat', label: 'AI Chat', href: '/ai-chat', icon: 'message-circle', active: false }
  ]);
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
  }
  
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  getLinkClasses(active: boolean): string {
    return active 
      ? 'text-primary bg-primary/10 hover:bg-primary/20'
      : 'text-muted-foreground hover:text-foreground hover:bg-accent';
  }
  
  getMobileLinkClasses(active: boolean): string {
    return active
      ? 'text-primary bg-primary/10'
      : 'text-muted-foreground hover:text-foreground hover:bg-accent';
  }
}
```

## HugeIcons Integration and Icon System

```typescript
// HugeIcons Service for centralized icon management
@Injectable({
  providedIn: 'root'
})
export class IconService {
  private iconRegistry = new Map<string, string>();
  
  constructor() {
    this.registerCommonIcons();
  }
  
  private registerCommonIcons(): void {
    // Media icons
    this.iconRegistry.set('play', 'play-circle');
    this.iconRegistry.set('pause', 'pause-circle');
    this.iconRegistry.set('stop', 'stop-circle');
    this.iconRegistry.set('volume', 'volume-high');
    this.iconRegistry.set('volume-mute', 'volume-x');
    
    // Navigation icons
    this.iconRegistry.set('home', 'home-01');
    this.iconRegistry.set('search', 'search-01');
    this.iconRegistry.set('menu', 'menu-01');
    this.iconRegistry.set('close', 'cancel-01');
    this.iconRegistry.set('back', 'arrow-left-01');
    
    // Social icons
    this.iconRegistry.set('like', 'heart');
    this.iconRegistry.set('share', 'share-01');
    this.iconRegistry.set('comment', 'message-circle-01');
    this.iconRegistry.set('bookmark', 'bookmark-01');
    
    // User icons
    this.iconRegistry.set('user', 'user');
    this.iconRegistry.set('users', 'users-01');
    this.iconRegistry.set('profile', 'user-circle');
    this.iconRegistry.set('settings', 'settings-01');
    
    // System icons
    this.iconRegistry.set('loading', 'loading-01');
    this.iconRegistry.set('error', 'alert-circle');
    this.iconRegistry.set('success', 'check-circle');
    this.iconRegistry.set('warning', 'alert-triangle');
  }
  
  getIcon(name: string): string {
    return this.iconRegistry.get(name) || name;
  }
  
  registerIcon(alias: string, iconName: string): void {
    this.iconRegistry.set(alias, iconName);
  }
}

// HugeIcon Component with accessibility and performance optimization
@Component({
  selector: 'huge-icon',
  standalone: true,
  template: `
    <i 
      [class]="iconClasses()"
      [attr.aria-label]="ariaLabel() || name()"
      [attr.role]="role()"
      [style.color]="color()"
      [style.font-size]="size() + 'px'">
    </i>
  `
})
export class HugeIconComponent {
  private iconService = inject(IconService);
  
  name = input.required<string>();
  size = input<number>(24);
  color = input<string>('');
  variant = input<'outline' | 'filled' | 'duotone'>('outline');
  ariaLabel = input<string>('');
  role = input<string>('img');
  
  iconClasses = computed(() => {
    const iconName = this.iconService.getIcon(this.name());
    const variantSuffix = this.variant() === 'outline' ? '' : `-${this.variant()}`;
    return `hugeicons-${iconName}${variantSuffix}`;
  });
}
```
## Performance Optimization Architecture

### Lazy Loading and Code Splitting

```typescript
// App routing with lazy loading
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Home - Community Car'
  },
  {
    path: 'media',
    loadChildren: () => import('./features/media/media.routes').then(m => m.mediaRoutes),
    title: 'Media - Community Car'
  },
  {
    path: 'community',
    loadChildren: () => import('./features/community/community.routes').then(m => m.communityRoutes),
    title: 'Community - Community Car'
  },
  {
    path: 'marketplace',
    loadChildren: () => import('./features/marketplace/marketplace.routes').then(m => m.marketplaceRoutes),
    title: 'Marketplace - Community Car'
  },
  {
    path: 'ai-chat',
    loadComponent: () => import('./features/ai-chat/ai-chat.component').then(m => m.AiChatComponent),
    title: 'AI Chat - Community Car'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found - Community Car'
  }
];

// Virtual scrolling for large lists
@Component({
  selector: 'app-virtual-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport 
      [itemSize]="itemHeight()" 
      [class]="containerClasses()">
      @for (item of items(); track item.id; let i = $index) {
        <div 
          *cdkVirtualFor="let item of items(); trackBy: trackByFn"
          [class]="itemClasses()">
          <ng-container 
            [ngTemplateOutlet]="itemTemplate()"
            [ngTemplateOutletContext]="{ $implicit: item, index: i }">
          </ng-container>
        </div>
      }
    </cdk-virtual-scroll-viewport>
  `
})
export class VirtualListComponent<T> {
  items = input.required<T[]>();
  itemHeight = input<number>(80);
  itemTemplate = input.required<TemplateRef<any>>();
  trackByFn = input<TrackByFunction<T>>((index, item: any) => item.id || index);
  
  containerClasses = computed(() => {
    return 'h-96 w-full border border-border rounded-md';
  });
  
  itemClasses = computed(() => {
    return 'flex items-center p-4 border-b border-border last:border-b-0';
  });
}
```

## SEO and Analytics Integration

### SEO Service with Meta Management

```typescript
// SEO Service for dynamic meta tag management
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private document = inject(DOCUMENT);
  
  updatePageSeo(seoData: SeoData): void {
    // Update title
    this.title.setTitle(seoData.title);
    
    // Update meta description
    this.meta.updateTag({ name: 'description', content: seoData.description });
    
    // Update Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: seoData.title });
    this.meta.updateTag({ property: 'og:description', content: seoData.description });
    this.meta.updateTag({ property: 'og:image', content: seoData.image || '' });
    this.meta.updateTag({ property: 'og:url', content: seoData.url || this.document.location.href });
    this.meta.updateTag({ property: 'og:type', content: seoData.type || 'website' });
    
    // Update Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seoData.title });
    this.meta.updateTag({ name: 'twitter:description', content: seoData.description });
    this.meta.updateTag({ name: 'twitter:image', content: seoData.image || '' });
    
    // Update canonical URL
    this.updateCanonicalUrl(seoData.url || this.document.location.href);
    
    // Add structured data
    if (seoData.structuredData) {
      this.addStructuredData(seoData.structuredData);
    }
  }
  
  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
  
  private addStructuredData(data: any): void {
    let script: HTMLScriptElement | null = this.document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}

// Analytics Service with Google Analytics 4
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private gtag: any;
  
  constructor() {
    this.initializeGoogleAnalytics();
  }
  
  private initializeGoogleAnalytics(): void {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script);
    
    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    this.gtag = function() {
      (window as any).dataLayer.push(arguments);
    };
    this.gtag('js', new Date());
    this.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: document.title,
      page_location: window.location.href
    });
  }
  
  trackPageView(url: string, title: string): void {
    this.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: title,
      page_location: url
    });
  }
  
  trackEvent(eventName: string, parameters: any = {}): void {
    this.gtag('event', eventName, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label,
      value: parameters.value,
      ...parameters
    });
  }
  
  trackUserEngagement(action: string, target: string, value?: number): void {
    this.trackEvent('user_engagement', {
      engagement_action: action,
      engagement_target: target,
      engagement_value: value,
      category: 'user_interaction'
    });
  }
  
  trackMediaEvent(action: 'play' | 'pause' | 'complete', mediaId: string, mediaType: 'video' | 'podcast'): void {
    this.trackEvent(`media_${action}`, {
      media_id: mediaId,
      media_type: mediaType,
      category: 'media_interaction'
    });
  }
}
```

## Progressive Web App (PWA) Implementation

### Service Worker and PWA Configuration

```typescript
// PWA Service for managing Progressive Web App features
@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private swUpdate = inject(SwUpdate);
  private swPush = inject(SwPush);
  
  private updateAvailable = signal<boolean>(false);
  private isOnline = signal<boolean>(navigator.onLine);
  
  constructor() {
    this.initializePwaFeatures();
    this.setupOnlineStatusTracking();
  }
  
  private initializePwaFeatures(): void {
    if (this.swUpdate.isEnabled) {
      // Check for updates
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          this.updateAvailable.set(true);
          this.showUpdateNotification();
        }
      });
      
      // Check for updates every 6 hours
      interval(6 * 60 * 60 * 1000).subscribe(() => {
        this.swUpdate.checkForUpdate();
      });
    }
  }
  
  private setupOnlineStatusTracking(): void {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }
  
  async updateApplication(): Promise<void> {
    if (this.updateAvailable()) {
      await this.swUpdate.activateUpdate();
      window.location.reload();
    }
  }
  
  // Getters for reactive state
  getUpdateAvailable() {
    return this.updateAvailable.asReadonly();
  }
  
  getOnlineStatus() {
    return this.isOnline.asReadonly();
  }
}

// Offline indicator component
@Component({
  selector: 'app-offline-indicator',
  standalone: true,
  imports: [CommonModule, HugeIconComponent],
  template: `
    @if (!isOnline()) {
      <div class="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground p-2 text-center z-50">
        <div class="flex items-center justify-center space-x-2">
          <huge-icon name="wifi-off" class="w-4 h-4" />
          <span class="text-sm font-medium">You're offline. Some features may not be available.</span>
        </div>
      </div>
    }
  `
})
export class OfflineIndicatorComponent {
  private pwaService = inject(PwaService);
  
  isOnline = this.pwaService.getOnlineStatus();
}
```

## Feature Module Architecture

### Media Feature Module

```typescript
// Media routes with lazy loading
export const mediaRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/media-dashboard/media-dashboard.component').then(m => m.MediaDashboardComponent),
    title: 'Media Dashboard'
  },
  {
    path: 'videos',
    loadComponent: () => import('./pages/video-list/video-list.component').then(m => m.VideoListComponent),
    title: 'Videos'
  },
  {
    path: 'videos/:id',
    loadComponent: () => import('./pages/video-detail/video-detail.component').then(m => m.VideoDetailComponent),
    title: 'Video Player'
  },
  {
    path: 'podcasts',
    loadComponent: () => import('./pages/podcast-list/podcast-list.component').then(m => m.PodcastListComponent),
    title: 'Podcasts'
  },
  {
    path: 'podcasts/:id',
    loadComponent: () => import('./pages/podcast-detail/podcast-detail.component').then(m => m.PodcastDetailComponent),
    title: 'Podcast Player'
  }
];

// Media service with caching and offline support
@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private http = inject(HttpClient);
  private cache = new Map<string, any>();
  
  async getMediaById(id: string): Promise<MediaItem> {
    // Check cache first
    const cacheKey = `media_${id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    try {
      const media = await firstValueFrom(
        this.http.get<MediaItem>(`/api/v7/media/${id}`)
      );
      
      // Cache the result
      this.cache.set(cacheKey, media);
      
      return media;
    } catch (error) {
      // Try to get from offline storage
      const offlineData = localStorage.getItem(cacheKey);
      if (offlineData) {
        return JSON.parse(offlineData);
      }
      throw error;
    }
  }
  
  async getMediaList(params: MediaListParams): Promise<PagedResult<MediaItem>> {
    return firstValueFrom(
      this.http.get<PagedResult<MediaItem>>('/api/v7/media', { params: params as any })
    );
  }
  
  async toggleFavorite(mediaId: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`/api/v7/media/${mediaId}/favorite`, {})
    );
  }
}
```

This design specification provides a comprehensive technical foundation for building the Main Frontend User Interface with Angular 19, shadcn/ui components, Tailwind CSS, and HugeIcons. The architecture emphasizes performance, accessibility, SEO optimization, and modern web standards while maintaining a user-focused experience.