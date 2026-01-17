import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ContentAnalysis {
  headingStructure: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h4Count: number;
    h5Count: number;
    h6Count: number;
    hasProperHierarchy: boolean;
    issues: string[];
  };
  imageOptimization: {
    totalImages: number;
    imagesWithAlt: number;
    imagesWithoutAlt: number;
    imagesWithTitle: number;
    lazyLoadedImages: number;
    optimizationScore: number;
    issues: string[];
  };
  semanticStructure: {
    hasMainElement: boolean;
    hasNavElement: boolean;
    hasHeaderElement: boolean;
    hasFooterElement: boolean;
    hasAsideElement: boolean;
    hasArticleElements: boolean;
    hasSectionElements: boolean;
    semanticScore: number;
    issues: string[];
  };
  contentQuality: {
    wordCount: number;
    readabilityScore: number;
    keywordDensity: Record<string, number>;
    hasUniqueContent: boolean;
    contentScore: number;
    issues: string[];
  };
  technicalSEO: {
    hasCanonical: boolean;
    hasMetaDescription: boolean;
    hasMetaKeywords: boolean;
    hasOpenGraph: boolean;
    hasTwitterCards: boolean;
    hasStructuredData: boolean;
    technicalScore: number;
    issues: string[];
  };
  overallScore: number;
  lastAnalyzed: Date;
}

/**
 * Content Optimization Service
 * 
 * Optimizes content for search engines:
 * - Semantic HTML structure analysis
 * - Heading hierarchy optimization
 * - Image alt text and optimization
 * - Content quality analysis
 * - Readability scoring
 * - Keyword density analysis
 */
@Injectable({
  providedIn: 'root'
})
export class ContentOptimizationService {
  private document = inject(DOCUMENT);

  private contentAnalysis = new BehaviorSubject<ContentAnalysis | null>(null);
  public readonly contentAnalysis$ = this.contentAnalysis.asObservable();

  private stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
  ]);

  constructor() {
    // Auto-analyze content on service initialization
    setTimeout(() => this.analyzeCurrentPage(), 1000);
  }

  /**
   * Analyze current page content
   */
  analyzeCurrentPage(): ContentAnalysis {
    const analysis: ContentAnalysis = {
      headingStructure: this.analyzeHeadingStructure(),
      imageOptimization: this.analyzeImageOptimization(),
      semanticStructure: this.analyzeSemanticStructure(),
      contentQuality: this.analyzeContentQuality(),
      technicalSEO: this.analyzeTechnicalSEO(),
      overallScore: 0,
      lastAnalyzed: new Date()
    };

    // Calculate overall score
    analysis.overallScore = this.calculateOverallScore(analysis);

    this.contentAnalysis.next(analysis);
    
    console.log('📊 Content analysis completed:', analysis);
    
    return analysis;
  }

  /**
   * Analyze heading structure
   */
  private analyzeHeadingStructure(): ContentAnalysis['headingStructure'] {
    const headings = {
      h1: this.document.querySelectorAll('h1'),
      h2: this.document.querySelectorAll('h2'),
      h3: this.document.querySelectorAll('h3'),
      h4: this.document.querySelectorAll('h4'),
      h5: this.document.querySelectorAll('h5'),
      h6: this.document.querySelectorAll('h6')
    };

    const counts = {
      h1Count: headings.h1.length,
      h2Count: headings.h2.length,
      h3Count: headings.h3.length,
      h4Count: headings.h4.length,
      h5Count: headings.h5.length,
      h6Count: headings.h6.length
    };

    const issues: string[] = [];
    let hasProperHierarchy = true;

    // Check for single H1
    if (counts.h1Count === 0) {
      issues.push('Missing H1 tag - every page should have exactly one H1');
      hasProperHierarchy = false;
    } else if (counts.h1Count > 1) {
      issues.push('Multiple H1 tags found - use only one H1 per page');
      hasProperHierarchy = false;
    }

    // Check heading hierarchy
    const allHeadings = this.document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    allHeadings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && currentLevel !== 1) {
        issues.push('First heading should be H1');
        hasProperHierarchy = false;
      }
      
      if (currentLevel > previousLevel + 1) {
        issues.push(`Heading hierarchy skip detected: ${heading.tagName} follows H${previousLevel}`);
        hasProperHierarchy = false;
      }
      
      // Check for empty headings
      if (!heading.textContent?.trim()) {
        issues.push(`Empty ${heading.tagName} found`);
      }
      
      previousLevel = currentLevel;
    });

    return {
      ...counts,
      hasProperHierarchy,
      issues
    };
  }

  /**
   * Analyze image optimization
   */
  private analyzeImageOptimization(): ContentAnalysis['imageOptimization'] {
    const images = this.document.querySelectorAll('img');
    const issues: string[] = [];
    
    let imagesWithAlt = 0;
    let imagesWithTitle = 0;
    let lazyLoadedImages = 0;

    images.forEach((img, index) => {
      const alt = img.getAttribute('alt');
      const title = img.getAttribute('title');
      const loading = img.getAttribute('loading');
      const src = img.getAttribute('src');

      // Check alt text
      if (alt !== null) {
        if (alt.trim()) {
          imagesWithAlt++;
        } else {
          issues.push(`Image ${index + 1} has empty alt attribute`);
        }
      } else {
        issues.push(`Image ${index + 1} missing alt attribute`);
      }

      // Check title attribute
      if (title && title.trim()) {
        imagesWithTitle++;
      }

      // Check lazy loading
      if (loading === 'lazy') {
        lazyLoadedImages++;
      }

      // Check image format and optimization
      if (src) {
        if (!src.includes('.webp') && !src.includes('.avif')) {
          issues.push(`Image ${index + 1} could use modern format (WebP/AVIF)`);
        }
      }

      // Check dimensions
      if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
        issues.push(`Image ${index + 1} missing width/height attributes (may cause CLS)`);
      }
    });

    const totalImages = images.length;
    const imagesWithoutAlt = totalImages - imagesWithAlt;
    
    // Calculate optimization score
    let optimizationScore = 0;
    if (totalImages > 0) {
      optimizationScore = Math.round(
        ((imagesWithAlt / totalImages) * 40) +
        ((lazyLoadedImages / totalImages) * 30) +
        ((imagesWithTitle / totalImages) * 20) +
        (issues.length === 0 ? 10 : Math.max(0, 10 - issues.length))
      );
    }

    return {
      totalImages,
      imagesWithAlt,
      imagesWithoutAlt,
      imagesWithTitle,
      lazyLoadedImages,
      optimizationScore,
      issues
    };
  }

  /**
   * Analyze semantic HTML structure
   */
  private analyzeSemanticStructure(): ContentAnalysis['semanticStructure'] {
    const elements = {
      main: this.document.querySelectorAll('main'),
      nav: this.document.querySelectorAll('nav'),
      header: this.document.querySelectorAll('header'),
      footer: this.document.querySelectorAll('footer'),
      aside: this.document.querySelectorAll('aside'),
      article: this.document.querySelectorAll('article'),
      section: this.document.querySelectorAll('section')
    };

    const issues: string[] = [];

    // Check for required semantic elements
    const hasMainElement = elements.main.length > 0;
    const hasNavElement = elements.nav.length > 0;
    const hasHeaderElement = elements.header.length > 0;
    const hasFooterElement = elements.footer.length > 0;
    const hasAsideElement = elements.aside.length > 0;
    const hasArticleElements = elements.article.length > 0;
    const hasSectionElements = elements.section.length > 0;

    if (!hasMainElement) {
      issues.push('Missing <main> element - should contain primary content');
    } else if (elements.main.length > 1) {
      issues.push('Multiple <main> elements found - use only one per page');
    }

    if (!hasNavElement) {
      issues.push('Missing <nav> element - should contain navigation links');
    }

    if (!hasHeaderElement) {
      issues.push('Missing <header> element - should contain page header');
    }

    if (!hasFooterElement) {
      issues.push('Missing <footer> element - should contain page footer');
    }

    // Check for proper ARIA landmarks
    const landmarks = this.document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
    if (landmarks.length === 0) {
      issues.push('Consider adding ARIA landmark roles for better accessibility');
    }

    // Calculate semantic score
    const semanticElements = [
      hasMainElement,
      hasNavElement,
      hasHeaderElement,
      hasFooterElement,
      hasAsideElement,
      hasArticleElements,
      hasSectionElements
    ];
    
    const semanticScore = Math.round(
      (semanticElements.filter(Boolean).length / semanticElements.length) * 100
    );

    return {
      hasMainElement,
      hasNavElement,
      hasHeaderElement,
      hasFooterElement,
      hasAsideElement,
      hasArticleElements,
      hasSectionElements,
      semanticScore,
      issues
    };
  }

  /**
   * Analyze content quality
   */
  private analyzeContentQuality(): ContentAnalysis['contentQuality'] {
    const mainContent = this.document.querySelector('main') || this.document.body;
    const textContent = mainContent?.textContent || '';
    
    const issues: string[] = [];
    
    // Word count
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    if (wordCount < 300) {
      issues.push('Content is too short - aim for at least 300 words');
    }

    // Keyword density analysis
    const keywordDensity = this.calculateKeywordDensity(textContent);
    
    // Check for keyword stuffing
    Object.entries(keywordDensity).forEach(([keyword, density]) => {
      if (density > 3) {
        issues.push(`Keyword "${keyword}" may be over-optimized (${density.toFixed(1)}% density)`);
      }
    });

    // Readability score (simplified Flesch Reading Ease)
    const readabilityScore = this.calculateReadabilityScore(textContent);
    
    if (readabilityScore < 30) {
      issues.push('Content may be too difficult to read - consider simplifying');
    }

    // Check for unique content (basic duplicate detection)
    const hasUniqueContent = this.checkContentUniqueness(textContent);
    if (!hasUniqueContent) {
      issues.push('Content may be duplicated or too similar to other pages');
    }

    // Calculate content score
    let contentScore = 0;
    if (wordCount >= 300) contentScore += 25;
    if (readabilityScore >= 60) contentScore += 25;
    if (hasUniqueContent) contentScore += 25;
    if (Object.keys(keywordDensity).length > 0) contentScore += 25;

    return {
      wordCount,
      readabilityScore,
      keywordDensity,
      hasUniqueContent,
      contentScore,
      issues
    };
  }

  /**
   * Analyze technical SEO
   */
  private analyzeTechnicalSEO(): ContentAnalysis['technicalSEO'] {
    const issues: string[] = [];

    // Check canonical URL
    const canonical = this.document.querySelector('link[rel="canonical"]');
    const hasCanonical = !!canonical;
    if (!hasCanonical) {
      issues.push('Missing canonical URL');
    }

    // Check meta description
    const metaDescription = this.document.querySelector('meta[name="description"]');
    const hasMetaDescription = !!metaDescription?.getAttribute('content');
    if (!hasMetaDescription) {
      issues.push('Missing meta description');
    } else {
      const descLength = metaDescription.getAttribute('content')?.length || 0;
      if (descLength > 160) {
        issues.push('Meta description too long (over 160 characters)');
      } else if (descLength < 50) {
        issues.push('Meta description too short (under 50 characters)');
      }
    }

    // Check meta keywords (optional but can be useful)
    const metaKeywords = this.document.querySelector('meta[name="keywords"]');
    const hasMetaKeywords = !!metaKeywords?.getAttribute('content');

    // Check Open Graph tags
    const ogTags = this.document.querySelectorAll('meta[property^="og:"]');
    const hasOpenGraph = ogTags.length >= 3; // At least title, description, image
    if (!hasOpenGraph) {
      issues.push('Incomplete Open Graph tags for social sharing');
    }

    // Check Twitter Cards
    const twitterTags = this.document.querySelectorAll('meta[name^="twitter:"]');
    const hasTwitterCards = twitterTags.length >= 2; // At least card type and title
    if (!hasTwitterCards) {
      issues.push('Missing Twitter Card tags');
    }

    // Check structured data
    const structuredData = this.document.querySelectorAll('script[type="application/ld+json"]');
    const hasStructuredData = structuredData.length > 0;
    if (!hasStructuredData) {
      issues.push('Missing structured data (JSON-LD)');
    }

    // Calculate technical score
    const technicalElements = [
      hasCanonical,
      hasMetaDescription,
      hasOpenGraph,
      hasTwitterCards,
      hasStructuredData
    ];
    
    const technicalScore = Math.round(
      (technicalElements.filter(Boolean).length / technicalElements.length) * 100
    );

    return {
      hasCanonical,
      hasMetaDescription,
      hasMetaKeywords,
      hasOpenGraph,
      hasTwitterCards,
      hasStructuredData,
      technicalScore,
      issues
    };
  }

  /**
   * Calculate keyword density
   */
  private calculateKeywordDensity(text: string): Record<string, number> {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !this.stopWords.has(word));

    const wordCount = words.length;
    const wordFreq: Record<string, number> = {};

    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const keywordDensity: Record<string, number> = {};
    Object.entries(wordFreq).forEach(([word, freq]) => {
      const density = (freq / wordCount) * 100;
      if (density >= 0.5) { // Only include words with at least 0.5% density
        keywordDensity[word] = density;
      }
    });

    // Sort by density and return top 10
    return Object.fromEntries(
      Object.entries(keywordDensity)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    );
  }

  /**
   * Calculate readability score (simplified Flesch Reading Ease)
   */
  private calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((count, word) => count + this.countSyllables(word), 0);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Flesch Reading Ease formula
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Count syllables in a word (simplified)
   */
  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let syllableCount = 0;
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        syllableCount++;
      }
      previousWasVowel = isVowel;
    }

    // Handle silent 'e'
    if (word.endsWith('e')) {
      syllableCount--;
    }

    return Math.max(1, syllableCount);
  }

  /**
   * Check content uniqueness (basic implementation)
   */
  private checkContentUniqueness(text: string): boolean {
    // This is a simplified check - in a real implementation,
    // you would compare against a database of existing content
    const minUniqueLength = 100;
    const uniqueWords = new Set(
      text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !this.stopWords.has(word))
    );

    return text.length >= minUniqueLength && uniqueWords.size >= 20;
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(analysis: ContentAnalysis): number {
    const scores = [
      analysis.headingStructure.hasProperHierarchy ? 100 : 50,
      analysis.imageOptimization.optimizationScore,
      analysis.semanticStructure.semanticScore,
      analysis.contentQuality.contentScore,
      analysis.technicalSEO.technicalScore
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  /**
   * Get content analysis
   */
  getContentAnalysis(): ContentAnalysis | null {
    return this.contentAnalysis.value;
  }

  /**
   * Get content analysis observable
   */
  getContentAnalysisObservable(): Observable<ContentAnalysis | null> {
    return this.contentAnalysis$;
  }

  /**
   * Generate content optimization recommendations
   */
  generateRecommendations(): Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action: string;
  }> {
    const analysis = this.contentAnalysis.value;
    if (!analysis) return [];

    const recommendations: Array<{
      category: string;
      priority: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      action: string;
    }> = [];

    // Heading structure recommendations
    if (!analysis.headingStructure.hasProperHierarchy) {
      recommendations.push({
        category: 'Heading Structure',
        priority: 'high',
        title: 'Fix Heading Hierarchy',
        description: 'Proper heading structure improves SEO and accessibility.',
        action: 'Review and fix heading hierarchy issues'
      });
    }

    // Image optimization recommendations
    if (analysis.imageOptimization.optimizationScore < 70) {
      recommendations.push({
        category: 'Image Optimization',
        priority: 'high',
        title: 'Optimize Images',
        description: 'Add alt text and optimize image formats for better SEO.',
        action: 'Add missing alt text and use modern image formats'
      });
    }

    // Content quality recommendations
    if (analysis.contentQuality.wordCount < 300) {
      recommendations.push({
        category: 'Content Quality',
        priority: 'medium',
        title: 'Increase Content Length',
        description: 'Longer content tends to rank better in search results.',
        action: 'Add more valuable content to reach at least 300 words'
      });
    }

    // Technical SEO recommendations
    if (analysis.technicalSEO.technicalScore < 80) {
      recommendations.push({
        category: 'Technical SEO',
        priority: 'high',
        title: 'Improve Technical SEO',
        description: 'Fix missing meta tags and structured data.',
        action: 'Add missing meta tags, Open Graph, and structured data'
      });
    }

    // Semantic structure recommendations
    if (analysis.semanticStructure.semanticScore < 70) {
      recommendations.push({
        category: 'Semantic HTML',
        priority: 'medium',
        title: 'Improve Semantic Structure',
        description: 'Use semantic HTML elements for better accessibility and SEO.',
        action: 'Add missing semantic elements like <main>, <nav>, <header>'
      });
    }

    return recommendations;
  }

  /**
   * Export content analysis report
   */
  exportAnalysisReport(): string {
    const analysis = this.contentAnalysis.value;
    if (!analysis) return 'No analysis data available';

    const report = {
      timestamp: analysis.lastAnalyzed.toISOString(),
      overallScore: analysis.overallScore,
      headingStructure: analysis.headingStructure,
      imageOptimization: analysis.imageOptimization,
      semanticStructure: analysis.semanticStructure,
      contentQuality: analysis.contentQuality,
      technicalSEO: analysis.technicalSEO,
      recommendations: this.generateRecommendations()
    };

    return JSON.stringify(report, null, 2);
  }
}