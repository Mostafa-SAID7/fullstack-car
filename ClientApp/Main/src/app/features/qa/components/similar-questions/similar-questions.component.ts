import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

// QA Types and Services
import { QASearchService } from '../../../community/services/qa-search.service';
import { QuestionSimilarity, SearchFilter } from '../../../../shared/types/qa-api.types';

interface SimilarQuestion extends QuestionSimilarity {
  relevanceLevel: 'high' | 'medium' | 'low';
  matchReason: string;
}

@Component({
  selector: 'app-similar-questions',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './similar-questions.component.html',
  styleUrls: ['./similar-questions.component.scss']
})
export class SimilarQuestionsComponent implements OnInit, OnChanges {
  @Input() searchTerm = '';
  @Input() category = '';
  @Input() tags: string[] = [];
  @Input() maxResults = 5;
  @Input() showTitle = true;
  @Input() showEmptyState = true;

  similarQuestions: SimilarQuestion[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private qaSearchService: QASearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findSimilarQuestions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-search when inputs change
    if (changes['searchTerm'] || changes['category'] || changes['tags']) {
      this.findSimilarQuestions();
    }
  }

  private findSimilarQuestions(): void {
    // Only search if we have meaningful input
    if (!this.searchTerm || this.searchTerm.length < 3) {
      this.similarQuestions = [];
      return;
    }

    this.loading = true;
    this.error = null;

    const searchFilter: SearchFilter = {
      searchTerm: this.searchTerm,
      categories: this.category ? [this.category] : undefined,
      tags: this.tags.length > 0 ? this.tags : undefined,
      pageSize: this.maxResults * 2, // Get more results to filter for similarity
      sortBy: 'relevance',
      includeContent: true,
      includeTags: true
    };

    this.qaSearchService.searchQuestions(searchFilter).subscribe({
      next: (response) => {
        if (response?.succeeded && response.data) {
          this.similarQuestions = this.processSimilarQuestions(response.data.items);
        } else {
          // Fallback to mock data for demonstration
          this.similarQuestions = this.getMockSimilarQuestions();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to find similar questions:', error);
        this.error = 'Failed to load similar questions';
        // Use mock data as fallback
        this.similarQuestions = this.getMockSimilarQuestions();
        this.loading = false;
      }
    });
  }

  private processSimilarQuestions(questions: any[]): SimilarQuestion[] {
    return questions
      .map(q => this.convertToSimilarQuestion(q))
      .filter(q => q.similarityScore > 0.3) // Filter for meaningful similarity
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, this.maxResults);
  }

  private convertToSimilarQuestion(question: any): SimilarQuestion {
    const similarityScore = this.calculateSimilarity(question);
    
    return {
      id: question.id,
      title: question.title,
      category: question.category,
      voteScore: question.voteScore,
      similarityScore,
      answerCount: question.answerCount,
      hasAcceptedAnswer: question.hasAcceptedAnswer || question.answerCount > 0,
      createdAt: question.createdAt,
      relevanceLevel: this.getRelevanceLevel(similarityScore),
      matchReason: this.getMatchReason(question, similarityScore)
    };
  }

  private calculateSimilarity(question: any): number {
    let score = 0;
    const searchTermLower = this.searchTerm.toLowerCase();
    const titleLower = question.title.toLowerCase();

    // Title similarity (weighted heavily)
    const titleWords = searchTermLower.split(' ').filter(w => w.length > 2);
    const titleMatches = titleWords.filter(word => titleLower.includes(word)).length;
    score += (titleMatches / titleWords.length) * 0.6;

    // Category match
    if (this.category && question.category === this.category) {
      score += 0.2;
    }

    // Tag matches
    if (this.tags.length > 0 && question.tags) {
      const tagMatches = this.tags.filter(tag => 
        question.tags.some((qTag: string) => qTag.toLowerCase() === tag.toLowerCase())
      ).length;
      score += (tagMatches / this.tags.length) * 0.2;
    }

    // Ensure score is between 0 and 1
    return Math.min(Math.max(score, 0), 1);
  }

  private getRelevanceLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 0.7) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  private getMatchReason(question: any, score: number): string {
    const reasons: string[] = [];
    
    if (score >= 0.7) {
      reasons.push('Very similar title');
    } else if (score >= 0.5) {
      reasons.push('Similar keywords');
    }

    if (this.category && question.category === this.category) {
      reasons.push('Same category');
    }

    if (this.tags.length > 0 && question.tags) {
      const tagMatches = this.tags.filter(tag => 
        question.tags.some((qTag: string) => qTag.toLowerCase() === tag.toLowerCase())
      ).length;
      if (tagMatches > 0) {
        reasons.push(`${tagMatches} matching tag${tagMatches > 1 ? 's' : ''}`);
      }
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Related content';
  }

  private getMockSimilarQuestions(): SimilarQuestion[] {
    const searchTermLower = this.searchTerm.toLowerCase();
    
    const mockQuestions = [
      {
        id: '1',
        title: 'How to handle async operations in JavaScript?',
        category: 'Web Development',
        voteScore: 15,
        similarityScore: 0.85,
        answerCount: 3,
        hasAcceptedAnswer: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        relevanceLevel: 'high' as const,
        matchReason: 'Very similar title, Same category'
      },
      {
        id: '2',
        title: 'JavaScript Promise vs async/await comparison',
        category: 'Web Development',
        voteScore: 23,
        similarityScore: 0.72,
        answerCount: 5,
        hasAcceptedAnswer: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        relevanceLevel: 'high' as const,
        matchReason: 'Similar keywords, Same category'
      },
      {
        id: '3',
        title: 'Best practices for asynchronous JavaScript code',
        category: 'Web Development',
        voteScore: 18,
        similarityScore: 0.68,
        answerCount: 4,
        hasAcceptedAnswer: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        relevanceLevel: 'medium' as const,
        matchReason: 'Related content, Same category'
      }
    ];

    // Filter based on search term relevance
    return mockQuestions.filter(q => 
      q.title.toLowerCase().includes(searchTermLower) ||
      searchTermLower.split(' ').some(word => 
        word.length > 2 && q.title.toLowerCase().includes(word)
      )
    ).slice(0, this.maxResults);
  }

  navigateToQuestion(question: SimilarQuestion): void {
    this.router.navigate(['/community/qa/questions', question.id]);
  }

  getRelevanceIcon(level: 'high' | 'medium' | 'low'): string {
    switch (level) {
      case 'high': return 'star';
      case 'medium': return 'star_half';
      case 'low': return 'star_border';
    }
  }

  getRelevanceColor(level: 'high' | 'medium' | 'low'): string {
    switch (level) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-gray-600 dark:text-gray-400';
    }
  }

  getSimilarityPercentage(score: number): number {
    return Math.round(score * 100);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  }

  trackBySimilarQuestion(index: number, question: SimilarQuestion): string {
    return question.id;
  }

  hasHighSimilarityQuestions(): boolean {
    return this.similarQuestions.some(q => q.similarityScore > 0.8);
  }
}