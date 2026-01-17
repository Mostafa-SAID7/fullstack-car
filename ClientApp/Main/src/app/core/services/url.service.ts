import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UrlSlug {
  original: string;
  slug: string;
  category?: string;
  id?: string;
}

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternateUrls?: Array<{ hreflang: string; href: string }>;
}

/**
 * URL Service
 * 
 * Manages SEO-friendly URL structure:
 * - Clean, descriptive URL generation
 * - URL slug creation and management
 * - Sitemap generation
 * - URL canonicalization
 * - Route parameter handling
 */
@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private router = inject(Router);
  private location = inject(Location);

  private urlSlugs = new BehaviorSubject<UrlSlug[]>([]);
  private sitemapEntries = new BehaviorSubject<SitemapEntry[]>([]);

  public readonly urlSlugs$ = this.urlSlugs.asObservable();
  public readonly sitemapEntries$ = this.sitemapEntries.asObservable();

  private slugCache = new Map<string, string>();
  private reverseSlugCache = new Map<string, string>();

  constructor() {
    this.initializeDefaultSitemap();
  }

  /**
   * Initialize default sitemap entries
   */
  private initializeDefaultSitemap(): void {
    const defaultEntries: SitemapEntry[] = [
      {
        url: '/',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: '/media',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9
      },
      {
        url: '/community',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.8
      },
      {
        url: '/marketplace',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7
      }
    ];

    this.sitemapEntries.next(defaultEntries);
  }

  /**
   * Generate SEO-friendly slug from text
   */
  generateSlug(text: string, options?: {
    maxLength?: number;
    separator?: string;
    lowercase?: boolean;
    removeStopWords?: boolean;
  }): string {
    const opts = {
      maxLength: 60,
      separator: '-',
      lowercase: true,
      removeStopWords: true,
      ...options
    };

    // Check cache first
    const cacheKey = `${text}-${JSON.stringify(opts)}`;
    if (this.slugCache.has(cacheKey)) {
      return this.slugCache.get(cacheKey)!;
    }

    let slug = text;

    // Convert to lowercase
    if (opts.lowercase) {
      slug = slug.toLowerCase();
    }

    // Remove stop words if enabled
    if (opts.removeStopWords) {
      const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
      const words = slug.split(/\s+/);
      slug = words.filter(word => !stopWords.includes(word.toLowerCase())).join(' ');
    }

    // Replace special characters and spaces
    slug = slug
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
      .replace(/\s+/g, opts.separator) // Replace spaces with separator
      .replace(new RegExp(`${opts.separator}+`, 'g'), opts.separator) // Remove duplicate separators
      .replace(new RegExp(`^${opts.separator}+|${opts.separator}+$`, 'g'), ''); // Remove leading/trailing separators

    // Truncate if too long
    if (slug.length > opts.maxLength) {
      slug = slug.substring(0, opts.maxLength);
      // Ensure we don't cut off in the middle of a word
      const lastSeparator = slug.lastIndexOf(opts.separator);
      if (lastSeparator > opts.maxLength * 0.8) {
        slug = slug.substring(0, lastSeparator);
      }
    }

    // Cache the result
    this.slugCache.set(cacheKey, slug);
    this.reverseSlugCache.set(slug, text);

    return slug;
  }

  /**
   * Generate content URL with SEO-friendly structure
   */
  generateContentUrl(content: {
    id: string;
    title: string;
    category: string;
    type: 'article' | 'video' | 'podcast' | 'product';
    publishedDate?: Date;
  }): string {
    const slug = this.generateSlug(content.title);
    const categorySlug = this.generateSlug(content.category);
    
    // Create SEO-friendly URL structure
    let url = '';
    
    switch (content.type) {
      case 'article':
        url = `/articles/${categorySlug}/${slug}-${content.id}`;
        break;
      case 'video':
        url = `/videos/${categorySlug}/${slug}-${content.id}`;
        break;
      case 'podcast':
        url = `/podcasts/${categorySlug}/${slug}-${content.id}`;
        break;
      case 'product':
        url = `/products/${categorySlug}/${slug}-${content.id}`;
        break;
      default:
        url = `/content/${categorySlug}/${slug}-${content.id}`;
    }

    // Store slug mapping
    const urlSlug: UrlSlug = {
      original: content.title,
      slug,
      category: categorySlug,
      id: content.id
    };

    const currentSlugs = this.urlSlugs.value;
    const existingIndex = currentSlugs.findIndex(s => s.id === content.id);
    
    if (existingIndex >= 0) {
      currentSlugs[existingIndex] = urlSlug;
    } else {
      currentSlugs.push(urlSlug);
    }
    
    this.urlSlugs.next(currentSlugs);

    return url;
  }

  /**
   * Generate user profile URL
   */
  generateUserUrl(user: { id: string; username: string; displayName?: string }): string {
    const slug = this.generateSlug(user.username || user.displayName || `user-${user.id}`);
    return `/users/${slug}`;
  }

  /**
   * Generate category URL
   */
  generateCategoryUrl(category: { id: string; name: string; type?: string }): string {
    const slug = this.generateSlug(category.name);
    const baseUrl = category.type ? `/${category.type}` : '/categories';
    return `${baseUrl}/${slug}`;
  }

  /**
   * Generate tag URL
   */
  generateTagUrl(tag: string): string {
    const slug = this.generateSlug(tag);
    return `/tags/${slug}`;
  }

  /**
   * Extract ID from SEO URL
   */
  extractIdFromUrl(url: string): string | null {
    // Extract ID from URLs like /articles/category/title-123
    const match = url.match(/-([a-zA-Z0-9]+)$/);
    return match ? match[1] : null;
  }

  /**
   * Extract slug from URL
   */
  extractSlugFromUrl(url: string): string | null {
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];
    
    // Remove ID from slug if present
    const match = lastSegment.match(/^(.+)-[a-zA-Z0-9]+$/);
    return match ? match[1] : lastSegment;
  }

  /**
   * Resolve slug to original text
   */
  resolveSlugToOriginal(slug: string): string | null {
    return this.reverseSlugCache.get(slug) || null;
  }

  /**
   * Add sitemap entry
   */
  addSitemapEntry(entry: SitemapEntry): void {
    const currentEntries = this.sitemapEntries.value;
    const existingIndex = currentEntries.findIndex(e => e.url === entry.url);
    
    if (existingIndex >= 0) {
      currentEntries[existingIndex] = entry;
    } else {
      currentEntries.push(entry);
    }
    
    this.sitemapEntries.next(currentEntries);
  }

  /**
   * Remove sitemap entry
   */
  removeSitemapEntry(url: string): void {
    const currentEntries = this.sitemapEntries.value;
    const filteredEntries = currentEntries.filter(e => e.url !== url);
    this.sitemapEntries.next(filteredEntries);
  }

  /**
   * Generate XML sitemap
   */
  generateXMLSitemap(): string {
    const entries = this.sitemapEntries.value;
    const baseUrl = this.getBaseUrl();
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
    xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    
    entries.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${entry.url}</loc>\n`;
      xml += `    <lastmod>${entry.lastModified}</lastmod>\n`;
      xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;
      
      // Add alternate language URLs if available
      if (entry.alternateUrls) {
        entry.alternateUrls.forEach(alt => {
          xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />\n`;
        });
      }
      
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    return xml;
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(): string {
    const baseUrl = this.getBaseUrl();
    
    let robotsTxt = 'User-agent: *\n';
    robotsTxt += 'Allow: /\n';
    robotsTxt += 'Disallow: /admin/\n';
    robotsTxt += 'Disallow: /api/\n';
    robotsTxt += 'Disallow: /debug/\n';
    robotsTxt += 'Disallow: /performance-demo/\n';
    robotsTxt += '\n';
    robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n`;
    
    return robotsTxt;
  }

  /**
   * Get canonical URL for current page
   */
  getCanonicalUrl(): string {
    const baseUrl = this.getBaseUrl();
    const path = this.location.path();
    return `${baseUrl}${path}`;
  }

  /**
   * Get base URL
   */
  private getBaseUrl(): string {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return 'https://communitycar.com'; // Default for SSR
  }

  /**
   * Navigate to SEO-friendly URL
   */
  navigateToSeoUrl(url: string): Promise<boolean> {
    return this.router.navigateByUrl(url);
  }

  /**
   * Get current URL segments
   */
  getCurrentUrlSegments(): string[] {
    const path = this.location.path();
    return path.split('/').filter(segment => segment);
  }

  /**
   * Build breadcrumb from current URL
   */
  buildBreadcrumbFromUrl(): Array<{ name: string; url: string }> {
    const segments = this.getCurrentUrlSegments();
    const breadcrumbs = [{ name: 'Home', url: '/' }];
    
    let currentPath = '';
    segments.forEach(segment => {
      currentPath += `/${segment}`;
      const name = this.formatSegmentForBreadcrumb(segment);
      breadcrumbs.push({ name, url: currentPath });
    });
    
    return breadcrumbs;
  }

  /**
   * Format URL segment for breadcrumb display
   */
  private formatSegmentForBreadcrumb(segment: string): string {
    // Try to resolve from slug cache first
    const original = this.resolveSlugToOriginal(segment);
    if (original) {
      return original;
    }
    
    // Extract title from slug-id format
    const match = segment.match(/^(.+)-[a-zA-Z0-9]+$/);
    const cleanSegment = match ? match[1] : segment;
    
    // Convert slug back to readable format
    return cleanSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Validate URL structure
   */
  validateUrl(url: string): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check URL length
    if (url.length > 255) {
      issues.push('URL is too long (over 255 characters)');
    }
    
    // Check for invalid characters
    if (!/^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]*$/.test(url)) {
      issues.push('URL contains invalid characters');
    }
    
    // Check for consecutive hyphens
    if (url.includes('--')) {
      issues.push('URL contains consecutive hyphens');
    }
    
    // Check for trailing hyphens
    if (url.endsWith('-')) {
      issues.push('URL ends with hyphen');
    }
    
    // Check for uppercase letters (should be lowercase for SEO)
    if (/[A-Z]/.test(url)) {
      issues.push('URL contains uppercase letters (should be lowercase)');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Get URL suggestions for improvement
   */
  getUrlSuggestions(url: string): string[] {
    const suggestions: string[] = [];
    const validation = this.validateUrl(url);
    
    if (!validation.isValid) {
      // Suggest fixes based on issues
      validation.issues.forEach(issue => {
        if (issue.includes('uppercase')) {
          suggestions.push(`Use lowercase: ${url.toLowerCase()}`);
        }
        if (issue.includes('consecutive hyphens')) {
          suggestions.push(`Remove consecutive hyphens: ${url.replace(/--+/g, '-')}`);
        }
        if (issue.includes('trailing hyphens')) {
          suggestions.push(`Remove trailing hyphen: ${url.replace(/-+$/, '')}`);
        }
      });
    }
    
    return suggestions;
  }

  /**
   * Get all URL slugs
   */
  getAllUrlSlugs(): UrlSlug[] {
    return this.urlSlugs.value;
  }

  /**
   * Get all sitemap entries
   */
  getAllSitemapEntries(): SitemapEntry[] {
    return this.sitemapEntries.value;
  }

  /**
   * Clear slug cache
   */
  clearSlugCache(): void {
    this.slugCache.clear();
    this.reverseSlugCache.clear();
  }

  /**
   * Get URL analytics data
   */
  getUrlAnalytics(): {
    totalUrls: number;
    avgUrlLength: number;
    slugsGenerated: number;
    sitemapEntries: number;
  } {
    const entries = this.sitemapEntries.value;
    const slugs = this.urlSlugs.value;
    
    const totalLength = entries.reduce((sum, entry) => sum + entry.url.length, 0);
    
    return {
      totalUrls: entries.length,
      avgUrlLength: entries.length > 0 ? Math.round(totalLength / entries.length) : 0,
      slugsGenerated: slugs.length,
      sitemapEntries: entries.length
    };
  }
}