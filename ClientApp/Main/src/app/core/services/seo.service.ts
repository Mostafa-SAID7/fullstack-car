import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StructuredDataService } from './structured-data.service';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  structuredData?: any;
  canonical?: string;
  robots?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
}

export interface SeoMetrics {
  metaTagsCount: number;
  openGraphTagsCount: number;
  twitterTagsCount: number;
  structuredDataCount: number;
  hasCanonical: boolean;
  hasRobots: boolean;
  titleLength: number;
  descriptionLength: number;
  lastUpdated: Date;
}

/**
 * SEO Service
 * 
 * Manages dynamic meta tags, Open Graph, Twitter Cards, and structured data:
 * - Dynamic meta tag updates
 * - Open Graph protocol support
 * - Twitter Card optimization
 * - Canonical URL management
 * - JSON-LD structured data
 * - SEO metrics tracking
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private document = inject(DOCUMENT);
  private router = inject(Router);
  private structuredDataService = inject(StructuredDataService);

  private defaultSeoData: SeoData = {
    title: 'Community Car - Media Streaming Platform',
    description: 'Discover, stream, and share amazing content with our community-driven media platform.',
    keywords: 'media, streaming, community, videos, podcasts, social',
    image: '/assets/images/og-default.jpg',
    type: 'website',
    siteName: 'Community Car',
    locale: 'en_US',
    author: 'Community Car Team',
    twitterCard: 'summary_large_image',
    twitterSite: '@communitycar',
    robots: 'index, follow'
  };

  private currentSeoData = new BehaviorSubject<SeoData>(this.defaultSeoData);
  private seoMetrics = new BehaviorSubject<SeoMetrics>({
    metaTagsCount: 0,
    openGraphTagsCount: 0,
    twitterTagsCount: 0,
    structuredDataCount: 0,
    hasCanonical: false,
    hasRobots: false,
    titleLength: 0,
    descriptionLength: 0,
    lastUpdated: new Date()
  });

  public readonly currentSeoData$ = this.currentSeoData.asObservable();
  public readonly seoMetrics$ = this.seoMetrics.asObservable();

  constructor() {
    this.initializeDefaultSeo();
    this.setupRouteTracking();
    this.initializeWebsiteSchema();
  }

  /**
   * Initialize default SEO tags
   */
  private initializeDefaultSeo(): void {
    this.updatePageSeo(this.defaultSeoData);
  }

  /**
   * Setup automatic SEO updates on route changes
   */
  private setupRouteTracking(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.handleRouteChange(event.url);
      });
  }

  /**
   * Initialize website schema
   */
  private initializeWebsiteSchema(): void {
    this.structuredDataService.addWebsiteSchema({
      name: this.defaultSeoData.siteName || 'Community Car',
      url: this.getFullUrl('/'),
      description: this.defaultSeoData.description,
      searchUrl: this.getFullUrl('/search?q={search_term_string}')
    });
  }

  /**
   * Handle route changes and update SEO accordingly
   */
  private handleRouteChange(url: string): void {
    const routeBasedSeo = this.getRouteBasedSeo(url);
    if (routeBasedSeo) {
      this.updatePageSeo(routeBasedSeo);
    }

    // Update breadcrumb structured data
    const breadcrumbs = this.structuredDataService.generateBreadcrumbFromRoute(url);
    if (breadcrumbs.length > 1) {
      this.structuredDataService.addBreadcrumbSchema(breadcrumbs);
    }
  }

  /**
   * Get SEO data based on route
   */
  private getRouteBasedSeo(url: string): SeoData | null {
    const routeSeoMap: Record<string, Partial<SeoData>> = {
      '/': {
        title: 'Home - Community Car',
        description: 'Discover trending content and connect with our vibrant community.',
        type: 'website'
      },
      '/media': {
        title: 'Media Library - Community Car',
        description: 'Browse our extensive collection of videos, podcasts, and media content.',
        type: 'website',
        section: 'Media'
      },
      '/community': {
        title: 'Community - Community Car',
        description: 'Join discussions, share content, and connect with fellow community members.',
        type: 'website',
        section: 'Community'
      },
      '/marketplace': {
        title: 'Marketplace - Community Car',
        description: 'Discover and purchase amazing products from our community marketplace.',
        type: 'website',
        section: 'Marketplace'
      },
      '/performance-demo': {
        title: 'Performance Demo - Community Car',
        description: 'Experience our Core Web Vitals optimization techniques and performance monitoring.',
        type: 'website',
        section: 'Demo',
        robots: 'noindex, nofollow'
      }
    };

    const routeData = routeSeoMap[url];
    if (routeData) {
      return { ...this.defaultSeoData, ...routeData, url: this.getFullUrl(url) };
    }

    return null;
  }

  /**
   * Update page SEO with comprehensive meta tags
   */
  updatePageSeo(seoData: SeoData): void {
    const fullSeoData = { ...this.defaultSeoData, ...seoData };
    
    // Update title
    this.title.setTitle(fullSeoData.title);

    // Basic meta tags
    this.updateBasicMetaTags(fullSeoData);
    
    // Open Graph tags
    this.updateOpenGraphTags(fullSeoData);
    
    // Twitter Card tags
    this.updateTwitterCardTags(fullSeoData);
    
    // Additional SEO tags
    this.updateAdditionalSeoTags(fullSeoData);
    
    // Canonical URL
    this.updateCanonicalUrl(fullSeoData.canonical || fullSeoData.url);
    
    // Structured data
    if (fullSeoData.structuredData) {
      this.structuredDataService.addStructuredData('page', fullSeoData.structuredData);
    }

    // Update current data and metrics
    this.currentSeoData.next(fullSeoData);
    this.updateSeoMetrics();

    console.log('🔍 SEO updated:', fullSeoData.title);
  }

  /**
   * Update basic meta tags
   */
  private updateBasicMetaTags(seoData: SeoData): void {
    this.meta.updateTag({ name: 'description', content: seoData.description });
    
    if (seoData.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seoData.keywords });
    }
    
    if (seoData.author) {
      this.meta.updateTag({ name: 'author', content: seoData.author });
    }
    
    if (seoData.robots) {
      this.meta.updateTag({ name: 'robots', content: seoData.robots });
    }

    // Viewport and charset (if not already set)
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });
    this.meta.updateTag({ charset: 'utf-8' });
  }

  /**
   * Update Open Graph meta tags
   */
  private updateOpenGraphTags(seoData: SeoData): void {
    this.meta.updateTag({ property: 'og:title', content: seoData.title });
    this.meta.updateTag({ property: 'og:description', content: seoData.description });
    this.meta.updateTag({ property: 'og:type', content: seoData.type || 'website' });
    
    if (seoData.url) {
      this.meta.updateTag({ property: 'og:url', content: seoData.url });
    }
    
    if (seoData.image) {
      this.meta.updateTag({ property: 'og:image', content: this.getFullUrl(seoData.image) });
      this.meta.updateTag({ property: 'og:image:alt', content: seoData.title });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }
    
    if (seoData.siteName) {
      this.meta.updateTag({ property: 'og:site_name', content: seoData.siteName });
    }
    
    if (seoData.locale) {
      this.meta.updateTag({ property: 'og:locale', content: seoData.locale });
    }
    
    if (seoData.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: seoData.publishedTime });
    }
    
    if (seoData.modifiedTime) {
      this.meta.updateTag({ property: 'article:modified_time', content: seoData.modifiedTime });
    }
    
    if (seoData.section) {
      this.meta.updateTag({ property: 'article:section', content: seoData.section });
    }
    
    if (seoData.tags && seoData.tags.length > 0) {
      seoData.tags.forEach(tag => {
        this.meta.updateTag({ property: 'article:tag', content: tag });
      });
    }
  }

  /**
   * Update Twitter Card meta tags
   */
  private updateTwitterCardTags(seoData: SeoData): void {
    this.meta.updateTag({ name: 'twitter:card', content: seoData.twitterCard || 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seoData.title });
    this.meta.updateTag({ name: 'twitter:description', content: seoData.description });
    
    if (seoData.image) {
      this.meta.updateTag({ name: 'twitter:image', content: this.getFullUrl(seoData.image) });
      this.meta.updateTag({ name: 'twitter:image:alt', content: seoData.title });
    }
    
    if (seoData.twitterSite) {
      this.meta.updateTag({ name: 'twitter:site', content: seoData.twitterSite });
    }
    
    if (seoData.twitterCreator) {
      this.meta.updateTag({ name: 'twitter:creator', content: seoData.twitterCreator });
    }
  }

  /**
   * Update additional SEO meta tags
   */
  private updateAdditionalSeoTags(seoData: SeoData): void {
    // Theme color
    this.meta.updateTag({ name: 'theme-color', content: '#3b82f6' });
    
    // Mobile app tags
    this.meta.updateTag({ name: 'apple-mobile-web-app-capable', content: 'yes' });
    this.meta.updateTag({ name: 'apple-mobile-web-app-status-bar-style', content: 'default' });
    this.meta.updateTag({ name: 'apple-mobile-web-app-title', content: seoData.siteName || 'Community Car' });
    
    // Microsoft tiles
    this.meta.updateTag({ name: 'msapplication-TileColor', content: '#3b82f6' });
    this.meta.updateTag({ name: 'msapplication-config', content: '/browserconfig.xml' });
    
    // Favicon links (if not already present)
    this.ensureFaviconLinks();
  }

  /**
   * Ensure favicon links are present
   */
  private ensureFaviconLinks(): void {
    const faviconLinks = [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' }
    ];

    faviconLinks.forEach(linkData => {
      if (!this.document.querySelector(`link[rel="${linkData.rel}"]`)) {
        const link = this.document.createElement('link');
        Object.entries(linkData).forEach(([key, value]) => {
          link.setAttribute(key, value);
        });
        this.document.head.appendChild(link);
      }
    });
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url?: string): void {
    if (!url) return;

    let canonicalLink = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonicalLink);
    }
    
    canonicalLink.setAttribute('href', this.getFullUrl(url));
  }

  /**
   * Update structured data (JSON-LD)
   */
  private updateStructuredData(data: any): void {
    // Remove existing structured data
    const existingScript = this.document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  /**
   * Update SEO metrics
   */
  private updateSeoMetrics(): void {
    const metaTags = this.document.querySelectorAll('meta');
    const openGraphTags = this.document.querySelectorAll('meta[property^="og:"]');
    const twitterTags = this.document.querySelectorAll('meta[name^="twitter:"]');
    const structuredDataScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    const canonicalLink = this.document.querySelector('link[rel="canonical"]');
    const robotsTag = this.document.querySelector('meta[name="robots"]');
    
    const currentData = this.currentSeoData.value;

    const metrics: SeoMetrics = {
      metaTagsCount: metaTags.length,
      openGraphTagsCount: openGraphTags.length,
      twitterTagsCount: twitterTags.length,
      structuredDataCount: structuredDataScripts.length,
      hasCanonical: !!canonicalLink,
      hasRobots: !!robotsTag,
      titleLength: currentData.title.length,
      descriptionLength: currentData.description.length,
      lastUpdated: new Date()
    };

    this.seoMetrics.next(metrics);
  }

  /**
   * Get full URL from relative path
   */
  private getFullUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    
    const baseUrl = this.document.location.origin;
    return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
  }

  /**
   * Public API: Update SEO for specific content
   */
  updateContentSeo(contentData: {
    title: string;
    description: string;
    image?: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    type?: 'article' | 'video' | 'audio' | 'website';
  }): void {
    const seoData: SeoData = {
      ...this.currentSeoData.value,
      ...contentData,
      url: this.document.location.href,
      structuredData: this.generateContentStructuredData(contentData)
    };

    this.updatePageSeo(seoData);
  }

  /**
   * Generate structured data for content
   */
  private generateContentStructuredData(contentData: any): any {
    const baseStructuredData: any = {
      '@context': 'https://schema.org',
      '@type': this.getSchemaType(contentData.type),
      name: contentData.title,
      description: contentData.description,
      url: this.document.location.href,
      publisher: {
        '@type': 'Organization',
        name: 'Community Car',
        logo: {
          '@type': 'ImageObject',
          url: this.getFullUrl('/assets/images/logo.png')
        }
      }
    };

    if (contentData.image) {
      baseStructuredData['image'] = {
        '@type': 'ImageObject',
        url: this.getFullUrl(contentData.image)
      };
    }

    if (contentData.author) {
      baseStructuredData['author'] = {
        '@type': 'Person',
        name: contentData.author
      };
    }

    if (contentData.publishedTime) {
      baseStructuredData['datePublished'] = contentData.publishedTime;
    }

    if (contentData.modifiedTime) {
      baseStructuredData['dateModified'] = contentData.modifiedTime;
    }

    return baseStructuredData;
  }

  /**
   * Get Schema.org type based on content type
   */
  private getSchemaType(type?: string): string {
    const typeMap: Record<string, string> = {
      'article': 'Article',
      'video': 'VideoObject',
      'audio': 'AudioObject',
      'website': 'WebPage'
    };

    return typeMap[type || 'website'] || 'WebPage';
  }

  /**
   * Public API: Get current SEO data
   */
  getCurrentSeoData(): SeoData {
    return this.currentSeoData.value;
  }

  /**
   * Public API: Get SEO metrics
   */
  getSeoMetrics(): SeoMetrics {
    return this.seoMetrics.value;
  }

  /**
   * Public API: Get SEO metrics observable
   */
  getSeoMetricsObservable(): Observable<SeoMetrics> {
    return this.seoMetrics$;
  }

  /**
   * Public API: Generate sitemap data
   */
  generateSitemapData(): any[] {
    const routes = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/media', priority: 0.9, changefreq: 'daily' },
      { url: '/community', priority: 0.8, changefreq: 'daily' },
      { url: '/marketplace', priority: 0.7, changefreq: 'weekly' }
    ];

    return routes.map(route => ({
      ...route,
      url: this.getFullUrl(route.url),
      lastmod: new Date().toISOString()
    }));
  }

  /**
   * Public API: Validate SEO data
   */
  validateSeoData(seoData: SeoData): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Title validation
    if (!seoData.title) {
      issues.push('Title is required');
    } else if (seoData.title.length > 60) {
      issues.push('Title should be under 60 characters');
    } else if (seoData.title.length < 10) {
      issues.push('Title should be at least 10 characters');
    }

    // Description validation
    if (!seoData.description) {
      issues.push('Description is required');
    } else if (seoData.description.length > 160) {
      issues.push('Description should be under 160 characters');
    } else if (seoData.description.length < 50) {
      issues.push('Description should be at least 50 characters');
    }

    // Image validation
    if (seoData.image && !seoData.image.startsWith('http') && !seoData.image.startsWith('/')) {
      issues.push('Image URL should be absolute or start with /');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Public API: Reset to default SEO
   */
  resetToDefault(): void {
    this.updatePageSeo(this.defaultSeoData);
  }
}