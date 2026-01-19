import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Article } from '../../../../../core/models/news.model';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="group relative bg-surface/40 mica-effect rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 animate-fade-in">
      <div class="aspect-[16/9] overflow-hidden relative">
        <img [src]="article.featuredImageUrl || 'assets/images/news-placeholder.jpg'" 
             class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             [alt]="article.title">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        
        <div class="absolute top-4 left-4">
          <span class="px-3 py-1 rounded-full bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
            {{ getCategoryTranslation(article.category?.name) | translate }}
          </span>
        </div>
        
        <!-- Credibility Indicator -->
        <div class="absolute top-4 right-4" *ngIf="article.priority === 3">
          <span class="px-2 py-1 rounded-full bg-red-500/90 text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
            {{ 'categories.breaking' | translate }}
          </span>
        </div>
      </div>

      <div class="p-5 space-y-3">
        <div class="flex items-center space-x-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
          <span class="flex items-center">
            <i class="fa-regular fa-calendar-days mr-1.5 text-primary"></i>
            {{ article.publishedAt | date:'MMM d, y' }}
          </span>
          <span class="w-1 h-1 rounded-full bg-white/20"></span>
          <span class="flex items-center">
            <i class="fa-regular fa-clock mr-1.5 text-primary"></i>
            {{ 'news.readTime' | translate }}
          </span>
        </div>

        <h3 class="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {{ article.title }}
        </h3>

        <p class="text-sm text-muted-foreground/80 line-clamp-3 leading-relaxed">
          {{ article.summary }}
        </p>

        <div class="pt-4 flex items-center justify-between border-t border-white/5">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black italic border border-white/10">
              {{ article.author?.firstName?.[0] || 'A' }}
            </div>
            <span class="text-xs font-bold text-foreground/70">{{ article.author?.firstName }} {{ article.author?.lastName }}</span>
          </div>
          
          <div class="flex items-center space-x-3 text-muted-foreground/60">
            <span class="flex items-center text-[10px] font-bold" [title]="'actions.like' | translate">
              <i class="fa-regular fa-heart mr-1 group-hover:text-red-500 transition-colors"></i>
              {{ article.likesCount }}
            </span>
            <span class="flex items-center text-[10px] font-bold" [title]="'actions.comment' | translate">
              <i class="fa-regular fa-comment mr-1"></i>
              {{ article.commentsCount }}
            </span>
            <span class="flex items-center text-[10px] font-bold" [title]="'sharing.title' | translate">
              <i class="fa-regular fa-share mr-1"></i>
              {{ article.sharesCount }}
            </span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center justify-between pt-3 border-t border-white/5">
          <button class="flex items-center space-x-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
            <i class="fa-regular fa-bookmark"></i>
            <span>{{ 'actions.save' | translate }}</span>
          </button>
          
          <button class="flex items-center space-x-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
            <i class="fa-regular fa-share"></i>
            <span>{{ 'sharing.title' | translate }}</span>
          </button>
        </div>
      </div>
      
      <a [routerLink]="['/community/news', article.id]" class="absolute inset-0 z-10"></a>
    </div>
  `
})
export class NewsCardComponent {
  @Input({ required: true }) article!: Article;

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
}
