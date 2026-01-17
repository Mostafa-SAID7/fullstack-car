import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface StructuredDataItem {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export interface ArticleData {
  headline: string;
  description: string;
  image?: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  publisher: {
    name: string;
    logo: string;
  };
  url: string;
  wordCount?: number;
  articleSection?: string;
  keywords?: string[];
}

export interface VideoData {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl: string;
  embedUrl?: string;
  publisher: {
    name: string;
    logo: string;
  };
  creator?: string;
  keywords?: string[];
}

export interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
}

/**
 * Structured Data Service
 * 
 * Manages JSON-LD structured data for better search engine understanding:
 * - Organization schema
 * - Article schema
 * - Video schema
 * - Breadcrumb schema
 * - Product schema
 * - FAQ schema
 * - Review schema
 */
@Injectable({
  providedIn: 'root'
})
export class StructuredDataService {
  private document = inject(DOCUMENT);
  
  private activeStructuredData = new BehaviorSubject<StructuredDataItem[]>([]);
  private structuredDataElements = new Map<string, HTMLScriptElement>();

  public readonly activeStructuredData$ = this.activeStructuredData.asObservable();

  private defaultOrganization: OrganizationData = {
    name: 'Community Car',
    url: 'https://communitycar.com',
    logo: 'https://communitycar.com/assets/images/logo.png',
    description: 'A community-driven media streaming platform for discovering, sharing, and enjoying amazing content.',
    contactPoint: {
      telephone: '+1-555-0123',
      contactType: 'Customer Service',
      email: 'support@communitycar.com'
    },
    sameAs: [
      'https://twitter.com/communitycar',
      'https://facebook.com/communitycar',
      'https://instagram.com/communitycar'
    ]
  };

  constructor() {
    this.addOrganizationSchema(this.defaultOrganization);
  }

  /**
   * Add organization schema
   */
  addOrganizationSchema(data: OrganizationData): void {
    const schema: StructuredDataItem = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: {
        '@type': 'ImageObject',
        url: data.logo
      },
      description: data.description
    };

    if (data.contactPoint) {
      schema.contactPoint = {
        '@type': 'ContactPoint',
        telephone: data.contactPoint.telephone,
        contactType: data.contactPoint.contactType,
        email: data.contactPoint.email
      };
    }

    if (data.sameAs) {
      schema.sameAs = data.sameAs;
    }

    if (data.address) {
      schema.address = {
        '@type': 'PostalAddress',
        streetAddress: data.address.streetAddress,
        addressLocality: data.address.addressLocality,
        addressRegion: data.address.addressRegion,
        postalCode: data.address.postalCode,
        addressCountry: data.address.addressCountry
      };
    }

    this.addStructuredData('organization', schema);
  }

  /**
   * Add article schema
   */
  addArticleSchema(data: ArticleData): void {
    const schema: StructuredDataItem = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      author: {
        '@type': 'Person',
        name: data.author
      },
      publisher: {
        '@type': 'Organization',
        name: data.publisher.name,
        logo: {
          '@type': 'ImageObject',
          url: data.publisher.logo
        }
      },
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished,
      url: data.url,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': data.url
      }
    };

    if (data.image) {
      schema.image = {
        '@type': 'ImageObject',
        url: data.image
      };
    }

    if (data.wordCount) {
      schema.wordCount = data.wordCount;
    }

    if (data.articleSection) {
      schema.articleSection = data.articleSection;
    }

    if (data.keywords) {
      schema.keywords = data.keywords;
    }

    this.addStructuredData('article', schema);
  }

  /**
   * Add video schema
   */
  addVideoSchema(data: VideoData): void {
    const schema: StructuredDataItem = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: data.name,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      uploadDate: data.uploadDate,
      duration: data.duration,
      contentUrl: data.contentUrl,
      publisher: {
        '@type': 'Organization',
        name: data.publisher.name,
        logo: {
          '@type': 'ImageObject',
          url: data.publisher.logo
        }
      }
    };

    if (data.embedUrl) {
      schema.embedUrl = data.embedUrl;
    }

    if (data.creator) {
      schema.creator = {
        '@type': 'Person',
        name: data.creator
      };
    }

    if (data.keywords) {
      schema.keywords = data.keywords;
    }

    this.addStructuredData('video', schema);
  }

  /**
   * Add breadcrumb schema
   */
  addBreadcrumbSchema(items: BreadcrumbItem[]): void {
    const schema: StructuredDataItem = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map(item => ({
        '@type': 'ListItem',
        position: item.position,
        name: item.name,
        item: item.url
      }))
    };

    this.addStructuredData('breadcrumb', schema);
  }

  /**
   * Add website schema
   */
  addWebsiteSchema(data: { name: string; url: string; description: string; searchUrl?: string }): void {
    const schema: StructuredDataItem = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: data.name,
      url: data.url,
      description: data.description
    };

    if (data.searchUrl) {
      schema.potentialAction = {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: data.searchUrl
        },
        'query-input': 'required name=search_term_string'
      };
    }

    this.addStructuredData('website', schema);
  }

  /**
   * Add FAQ schema
   */
  addFAQSchema(faqs: Array<{ question: string; answer: string }>): void {
    const schema: StructuredDataItem = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    this.addStructuredData('faq', schema);
  }

  /**
   * Add product schema
   */
  addProductSchema(data: {
    name: string;
    description: string;
    image: string;
    brand: string;
    price: number;
    currency: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    condition: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
    sku?: string;
    reviews?: Array<{
      author: string;
      rating: number;
      reviewBody: string;
      datePublished: string;
    }>;
  }): void {
    const schema: StructuredDataItem = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      image: data.image,
      brand: {
        '@type': 'Brand',
        name: data.brand
      },
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: data.currency,
        availability: `https://schema.org/${data.availability}`,
        itemCondition: `https://schema.org/${data.condition}`
      }
    };

    if (data.sku) {
      schema.sku = data.sku;
    }

    if (data.reviews && data.reviews.length > 0) {
      schema.review = data.reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5
        },
        reviewBody: review.reviewBody,
        datePublished: review.datePublished
      }));

      // Calculate aggregate rating
      const avgRating = data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length;
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: data.reviews.length,
        bestRating: 5
      };
    }

    this.addStructuredData('product', schema);
  }

  /**
   * Add event schema
   */
  addEventSchema(data: {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    location: {
      name: string;
      address: string;
    };
    organizer: string;
    image?: string;
    offers?: {
      price: number;
      currency: string;
      url: string;
    };
  }): void {
    const schema: StructuredDataItem = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      location: {
        '@type': 'Place',
        name: data.location.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.location.address
        }
      },
      organizer: {
        '@type': 'Organization',
        name: data.organizer
      }
    };

    if (data.endDate) {
      schema.endDate = data.endDate;
    }

    if (data.image) {
      schema.image = data.image;
    }

    if (data.offers) {
      schema.offers = {
        '@type': 'Offer',
        price: data.offers.price,
        priceCurrency: data.offers.currency,
        url: data.offers.url
      };
    }

    this.addStructuredData('event', schema);
  }

  /**
   * Add local business schema
   */
  addLocalBusinessSchema(data: {
    name: string;
    description: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    telephone: string;
    email?: string;
    url: string;
    openingHours?: string[];
    priceRange?: string;
    image?: string;
  }): void {
    const schema: StructuredDataItem = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: data.name,
      description: data.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address.streetAddress,
        addressLocality: data.address.addressLocality,
        addressRegion: data.address.addressRegion,
        postalCode: data.address.postalCode,
        addressCountry: data.address.addressCountry
      },
      telephone: data.telephone,
      url: data.url
    };

    if (data.email) {
      schema.email = data.email;
    }

    if (data.openingHours) {
      schema.openingHours = data.openingHours;
    }

    if (data.priceRange) {
      schema.priceRange = data.priceRange;
    }

    if (data.image) {
      schema.image = data.image;
    }

    this.addStructuredData('local-business', schema);
  }

  /**
   * Add generic structured data
   */
  addStructuredData(id: string, data: StructuredDataItem): void {
    // Remove existing structured data with the same ID
    this.removeStructuredData(id);

    // Create new script element
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    script.id = `structured-data-${id}`;

    // Add to document head
    this.document.head.appendChild(script);

    // Store reference
    this.structuredDataElements.set(id, script);

    // Update active structured data
    this.updateActiveStructuredData();

    console.log(`📊 Structured data added: ${data['@type']} (${id})`);
  }

  /**
   * Remove structured data by ID
   */
  removeStructuredData(id: string): void {
    const element = this.structuredDataElements.get(id);
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
      this.structuredDataElements.delete(id);
      this.updateActiveStructuredData();
      console.log(`🗑️ Structured data removed: ${id}`);
    }
  }

  /**
   * Remove all structured data
   */
  removeAllStructuredData(): void {
    this.structuredDataElements.forEach((element, id) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    this.structuredDataElements.clear();
    this.updateActiveStructuredData();
    console.log('🗑️ All structured data removed');
  }

  /**
   * Get all active structured data
   */
  getActiveStructuredData(): StructuredDataItem[] {
    return this.activeStructuredData.value;
  }

  /**
   * Get structured data observable
   */
  getStructuredDataObservable(): Observable<StructuredDataItem[]> {
    return this.activeStructuredData$;
  }

  /**
   * Update active structured data list
   */
  private updateActiveStructuredData(): void {
    const activeData: StructuredDataItem[] = [];
    
    this.structuredDataElements.forEach(element => {
      try {
        const data = JSON.parse(element.textContent || '{}');
        activeData.push(data);
      } catch (error) {
        console.warn('Failed to parse structured data:', error);
      }
    });

    this.activeStructuredData.next(activeData);
  }

  /**
   * Validate structured data
   */
  validateStructuredData(data: StructuredDataItem): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    if (!data['@context']) {
      errors.push('@context is required');
    }

    if (!data['@type']) {
      errors.push('@type is required');
    }

    // Type-specific validation
    switch (data['@type']) {
      case 'Article':
        if (!data.headline) errors.push('Article requires headline');
        if (!data.author) errors.push('Article requires author');
        if (!data.datePublished) errors.push('Article requires datePublished');
        break;

      case 'VideoObject':
        if (!data.name) errors.push('VideoObject requires name');
        if (!data.thumbnailUrl) errors.push('VideoObject requires thumbnailUrl');
        if (!data.uploadDate) errors.push('VideoObject requires uploadDate');
        break;

      case 'Product':
        if (!data.name) errors.push('Product requires name');
        if (!data.offers) errors.push('Product requires offers');
        break;

      case 'Organization':
        if (!data.name) errors.push('Organization requires name');
        if (!data.url) errors.push('Organization requires url');
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate breadcrumb from current route
   */
  generateBreadcrumbFromRoute(route: string): BreadcrumbItem[] {
    const segments = route.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', url: '/', position: 1 }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const name = this.formatSegmentName(segment);
      breadcrumbs.push({
        name,
        url: currentPath,
        position: index + 2
      });
    });

    return breadcrumbs;
  }

  /**
   * Format route segment for breadcrumb display
   */
  private formatSegmentName(segment: string): string {
    const segmentMap: Record<string, string> = {
      'media': 'Media',
      'community': 'Community',
      'marketplace': 'Marketplace',
      'performance-demo': 'Performance Demo',
      'auth': 'Authentication',
      'login': 'Login',
      'register': 'Register'
    };

    return segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  /**
   * Get structured data count by type
   */
  getStructuredDataCount(): Record<string, number> {
    const counts: Record<string, number> = {};
    
    this.activeStructuredData.value.forEach(data => {
      const type = data['@type'];
      counts[type] = (counts[type] || 0) + 1;
    });

    return counts;
  }

  /**
   * Export structured data for testing
   */
  exportStructuredData(): string {
    return JSON.stringify(this.activeStructuredData.value, null, 2);
  }
}