import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NewsService } from '../../services/news.service';
import { Article } from '../../models/news.model';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="p-4 lg:p-8 max-w-[1200px] mx-auto animate-fade-in space-y-6" *ngIf="article">
      
      <!-- Back Button -->
      <div class="flex items-center space-x-4 mb-6">
        <button 
          routerLink="/community/news"
          class="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
          <i class="fas fa-arrow-left"></i>
          <span class="font-bold text-sm uppercase tracking-widest">{{ 'news.browse' | translate }}</span>
        </button>
      </div>

      <!-- Article Header -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5">
        
        <!-- Category and Breaking News Badge -->
        <div class="flex items-center justify-between mb-4">
          <span class="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-widest">
            {{ getCategoryTranslation(article.category?.name) | translate }}
          </span>
          
          <div class="flex items-center space-x-2" *ngIf="article.priority === 3">
            <span class="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-widest">
              {{ 'categories.breaking' | translate }}
            </span>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-3xl lg:text-4xl font-black text-foreground leading-tight mb-4">
          {{ article.title }}
        </h1>

        <!-- Summary -->
        <p class="text-lg text-muted-foreground leading-relaxed mb-6">
          {{ article.summary }}
        </p>

        <!-- Article Meta -->
        <div class="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-white/10">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-black italic border border-white/10">
                {{ article.author?.firstName?.[0] || 'A' }}
              </div>
              <div>
                <p class="text-sm font-bold text-foreground">{{ article.author?.firstName }} {{ article.author?.lastName }}</p>
                <p class="text-xs text-muted-foreground">{{ article.publishedAt | date:'MMM d, y' }}</p>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-6 text-muted-foreground">
            <span class="flex items-center text-sm font-bold">
              <i class="fa-regular fa-eye mr-2"></i>
              {{ article.viewsCount }}
            </span>
            <span class="flex items-center text-sm font-bold">
              <i class="fa-regular fa-heart mr-2"></i>
              {{ article.likesCount }}
            </span>
            <span class="flex items-center text-sm font-bold">
              <i class="fa-regular fa-comment mr-2"></i>
              {{ article.commentsCount }}
            </span>
            <span class="flex items-center text-sm font-bold">
              <i class="fa-regular fa-share mr-2"></i>
              {{ article.sharesCount }}
            </span>
          </div>
        </div>
      </div>

      <!-- Featured Image -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5" *ngIf="article.featuredImageUrl">
        <div class="aspect-[16/9] overflow-hidden rounded-2xl">
          <img 
            [src]="article.featuredImageUrl" 
            [alt]="article.title"
            class="w-full h-full object-cover">
        </div>
      </div>

      <!-- Article Content -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5">
        <div class="prose prose-lg max-w-none dark:prose-invert" [innerHTML]="article.content">
        </div>
      </div>

      <!-- Credibility Information -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5" *ngIf="showCredibilityInfo">
        <h3 class="text-lg font-black text-foreground uppercase tracking-widest mb-4">
          {{ 'credibility.title' | translate }}
        </h3>
        
        <div class="flex items-center space-x-4 mb-4">
          <div class="flex items-center space-x-2">
            <i class="fas fa-check-circle text-green-500"></i>
            <span class="text-sm font-bold text-foreground">{{ 'credibility.verified' | translate }}</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <i class="fas fa-shield-alt text-blue-500"></i>
            <span class="text-sm font-bold text-foreground">{{ 'credibility.trusted' | translate }}</span>
          </div>
        </div>
        
        <p class="text-sm text-muted-foreground">
          {{ 'factChecking.factCheckDisclaimer' | translate }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <div class="flex flex-wrap items-center justify-center gap-4">
          <button 
            (click)="toggleLike()"
            [class.text-red-500]="isLiked"
            class="flex items-center space-x-2 px-6 py-3 rounded-full bg-secondary/30 dark:bg-white/5 hover:bg-primary/10 transition-all font-bold text-sm">
            <i class="fa-regular fa-heart" [class.fas]="isLiked"></i>
            <span>{{ isLiked ? ('actions.unlike' | translate) : ('actions.like' | translate) }}</span>
          </button>
          
          <button 
            (click)="toggleSave()"
            [class.text-primary]="isSaved"
            class="flex items-center space-x-2 px-6 py-3 rounded-full bg-secondary/30 dark:bg-white/5 hover:bg-primary/10 transition-all font-bold text-sm">
            <i class="fa-regular fa-bookmark" [class.fas]="isSaved"></i>
            <span>{{ isSaved ? ('actions.unsave' | translate) : ('actions.save' | translate) }}</span>
          </button>
          
          <button 
            (click)="shareArticle()"
            class="flex items-center space-x-2 px-6 py-3 rounded-full bg-secondary/30 dark:bg-white/5 hover:bg-primary/10 transition-all font-bold text-sm">
            <i class="fa-regular fa-share"></i>
            <span>{{ 'sharing.title' | translate }}</span>
          </button>
          
          <button 
            (click)="reportArticle()"
            class="flex items-center space-x-2 px-6 py-3 rounded-full bg-secondary/30 dark:bg-white/5 hover:bg-red-500/10 transition-all font-bold text-sm text-red-500">
            <i class="fa-regular fa-flag"></i>
            <span>{{ 'actions.report' | translate }}</span>
          </button>
        </div>
      </div>

      <!-- Related Articles -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5" *ngIf="relatedArticles.length > 0">
        <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-6">
          {{ 'news.related' | translate }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let relatedArticle of relatedArticles" 
               class="group cursor-pointer"
               [routerLink]="['/community/news', relatedArticle.id]">
            <div class="aspect-[16/9] overflow-hidden rounded-xl mb-3">
              <img 
                [src]="relatedArticle.featuredImageUrl || 'assets/images/news-placeholder.jpg'" 
                [alt]="relatedArticle.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            </div>
            <h4 class="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {{ relatedArticle.title }}
            </h4>
            <p class="text-xs text-muted-foreground mt-1">
              {{ relatedArticle.publishedAt | date:'MMM d, y' }}
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- Loading State -->
    <div *ngIf="loading" class="p-4 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5">
        <div class="animate-pulse space-y-4">
          <div class="h-8 bg-secondary/30 dark:bg-white/5 rounded-xl w-3/4"></div>
          <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-xl w-1/2"></div>
          <div class="h-64 bg-secondary/30 dark:bg-white/5 rounded-xl"></div>
          <div class="space-y-2">
            <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-xl"></div>
            <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-xl w-5/6"></div>
            <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-xl w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NewsDetailComponent implements OnInit {
  article: Article | null = null;
  relatedArticles: Article[] = [];
  loading = true;
  isLiked = false;
  isSaved = false;
  showCredibilityInfo = true;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const articleId = params['id'];
      if (articleId) {
        this.loadArticle(articleId);
      }
    });
  }

  loadArticle(id: string): void {
    this.loading = true;
    this.newsService.getArticle(id).subscribe({
      next: (result) => {
        this.article = result.data;
        this.loading = false;
        this.loadRelatedArticles();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadRelatedArticles(): void {
    // In real implementation, load related articles based on category or tags
    this.newsService.getArticles(1, 3).subscribe({
      next: (result) => {
        this.relatedArticles = result.items.filter(a => a.id !== this.article?.id).slice(0, 3);
      },
      error: () => {
        // Handle error silently for related articles
      }
    });
  }

  getCategoryTranslation(categoryName: string | undefined): string {
    if (!categoryName) return 'categories.all';
    
    const categoryMap: { [key: string]: string } = {
      'automotive': 'categories.automotive',
      'technology': 'categories.technology',
      'business': 'categories.business',
      'sports': 'categories.sports',
      'entertainment': 'categories.entertainment',
      'health': 'categories.health',
      'science': 'categories.science',
      'politics': 'categories.politics',
      'lifestyle': 'categories.lifestyle',
      'travel': 'categories.travel',
      'education': 'categories.education',
      'environment': 'categories.environment',
      'local': 'categories.local',
      'international': 'categories.international',
      'breaking': 'categories.breaking'
    };

    return categoryMap[categoryName.toLowerCase()] || 'categories.all';
  }

  toggleLike(): void {
    if (!this.article) return;
    
    this.isLiked = !this.isLiked;
    
    if (this.isLiked) {
      this.article.likesCount++;
      this.newsService.likeArticle(this.article.id).subscribe();
    } else {
      this.article.likesCount--;
      // In real implementation, call unlike API
    }
  }

  toggleSave(): void {
    this.isSaved = !this.isSaved;
    // In real implementation, call save/unsave API
  }

  shareArticle(): void {
    if (!this.article) return;
    
    if (navigator.share) {
      navigator.share({
        title: this.article.title,
        text: this.article.summary,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Show success message
    }
  }

  reportArticle(): void {
    // In real implementation, open report dialog
    console.log('Report article functionality');
  }
}