import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-podcast-category',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="podcast-category space-y-12 animate-fade-in">
      <div class="category-header fb-card p-8 lg:p-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        <div class="relative">
          <h2 class="text-4xl lg:text-6xl font-black text-foreground mb-4 tracking-tighter">{{ categoryName }}</h2>
          <p class="text-muted-foreground text-sm lg:text-base leading-relaxed max-w-2xl font-medium">{{ categoryDescription }}</p>
          
          <div class="category-stats flex gap-8 mt-10">
            <div class="stat flex flex-col">
              <span class="stat-number text-2xl font-black text-primary">{{ podcastCount }}</span>
              <span class="stat-label text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Podcasts</span>
            </div>
            <div class="stat flex flex-col">
              <span class="stat-number text-2xl font-black text-primary">{{ subscriberCount }}</span>
              <span class="stat-label text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Subscribers</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="featured-podcasts space-y-8" *ngIf="featuredPodcasts.length > 0">
        <h3 class="text-xl font-black text-foreground uppercase tracking-tight px-4">Featured Audio Highlights</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div *ngFor="let podcast of featuredPodcasts" 
            class="fb-card p-6 flex gap-6 group cursor-pointer relative overflow-hidden border-none bg-primary text-white shadow-xl shadow-primary/20">
            <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary to-indigo-600"></div>
            <img [src]="podcast.thumbnail" [alt]="podcast.title" 
              class="w-32 h-32 rounded-2xl object-cover shadow-2xl relative z-10 border-2 border-white/20">
            <div class="flex-grow flex flex-col justify-between relative z-10">
              <div>
                <h4 class="font-black text-lg uppercase tracking-tight leading-tight mb-2">{{ podcast.title }}</h4>
                <p class="text-[11px] text-white/80 line-clamp-2 leading-relaxed uppercase font-bold tracking-wide">{{ podcast.description }}</p>
              </div>
              <div class="flex items-center gap-4 mt-4 text-[10px] font-black uppercase tracking-widest">
                <span class="px-2 py-1 bg-white/20 rounded-lg">{{ podcast.duration }}</span>
                <span class="opacity-80">{{ podcast.listens }} listens</span>
              </div>
            </div>
            <button (click)="playPodcast(podcast)"
              class="absolute right-6 bottom-6 w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center shadow-2xl transform transition-all group-hover:scale-110 active:scale-95 z-20">
              <i class="fas fa-play text-sm"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="recent-podcasts space-y-8">
        <h3 class="text-xl font-black text-foreground uppercase tracking-tight px-4">Latest Stream in {{ categoryName }}</h3>
        <div class="grid grid-cols-1 gap-4">
          <div *ngFor="let podcast of recentPodcasts" 
            class="fb-card p-4 flex items-center gap-6 group hover:border-primary/20 transition-all cursor-pointer">
            <img [src]="podcast.thumbnail" [alt]="podcast.title" 
              class="w-16 h-16 rounded-xl object-cover border border-black/5 dark:border-white/5 flex-shrink-0">
            <div class="flex-grow">
              <h5 class="font-black text-sm text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{{ podcast.title }}</h5>
              <p class="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{{ podcast.author }}</p>
              <span class="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5 block">{{ podcast.publishedDate | date:'shortDate' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button (click)="playPodcast(podcast)"
                class="w-10 h-10 bg-secondary dark:bg-white/5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all flex items-center justify-center active:scale-90">
                <i class="fas fa-play text-xs"></i>
              </button>
              <button (click)="subscribeToPodcast(podcast)"
                class="w-10 h-10 bg-secondary dark:bg-white/5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all flex items-center justify-center active:scale-90">
                <i class="fas fa-plus text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-center py-12" *ngIf="hasMorePodcasts">
        <button (click)="loadMorePodcasts()"
          class="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl">
          Load More Podcasts
        </button>
      </div>
    </div>
  `
})
export class PodcastCategoryComponent implements OnInit {
  @Input() categoryId: string = '';
  @Input() categoryName: string = '';
  @Input() categoryDescription: string = '';

  podcastCount = 0;
  subscriberCount = 0;
  featuredPodcasts: any[] = [];
  recentPodcasts: any[] = [];
  hasMorePodcasts = false;

  ngOnInit() {
    this.loadCategoryData();
  }

  loadCategoryData() {
    // Load category-specific data
    // This would typically call a service
  }

  playPodcast(podcast: any) {
    // Implement play functionality
    console.log('Playing podcast:', podcast.title);
  }

  subscribeToPodcast(podcast: any) {
    // Implement subscribe functionality
    console.log('Subscribing to podcast:', podcast.title);
  }

  loadMorePodcasts() {
    // Load more podcasts in this category
    console.log('Loading more podcasts for category:', this.categoryName);
  }
}