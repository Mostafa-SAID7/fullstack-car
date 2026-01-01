import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../services/news.service';
import { Article } from '../../../../core/models/news.model';
import { NewsCardComponent } from '../news-card/news-card.component';

@Component({
    selector: 'app-news-list',
    standalone: true,
    imports: [CommonModule, NewsCardComponent],
    template: `
    <div class="space-y-8 animate-fade-in">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-black text-foreground tracking-tight uppercase italic">
            Community <span class="text-primary">News</span>
          </h2>
          <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-1">
            Latest updates from the automotive world
          </p>
        </div>
        
        <div class="flex items-center space-x-2">
          <div class="mica-effect bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center">
            <i class="fa-solid fa-magnifying-glass text-muted-foreground mr-3"></i>
            <input type="text" placeholder="Search news..." class="bg-transparent border-none outline-none text-sm font-bold w-48">
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="h-[400px] rounded-2xl bg-surface/20 mica-effect animate-pulse"></div>
      </div>

      <div *ngIf="!loading && articles.length === 0" class="flex flex-col items-center justify-center py-20 mica-effect rounded-3xl border border-white/5 bg-surface/10">
        <i class="hugeicons-folder-open text-6xl text-muted-foreground/20 mb-4"></i>
        <h3 class="text-xl font-black text-muted-foreground uppercase italic tracking-widest">No articles found</h3>
      </div>

      <div *ngIf="!loading && articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-news-card *ngFor="let article of articles" [article]="article"></app-news-card>
      </div>
    </div>
  `
})
export class NewsListComponent implements OnInit {
    articles: Article[] = [];
    loading = true;

    constructor(private newsService: NewsService) { }

    ngOnInit(): void {
        this.loadNews();
    }

    loadNews(): void {
        this.loading = true;
        this.newsService.getArticles(1, 12).subscribe({
            next: (result) => {
                this.articles = result.items;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }
}
