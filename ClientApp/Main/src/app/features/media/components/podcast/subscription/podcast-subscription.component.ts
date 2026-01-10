import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-podcast-subscription',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="podcast-subscription space-y-12 animate-fade-in">
      <div class="subscription-header fb-card p-8 lg:p-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        <div class="relative">
          <h2 class="text-4xl lg:text-5xl font-black text-foreground mb-4 tracking-tighter">My Subscriptions</h2>
          <p class="text-muted-foreground text-sm lg:text-base font-medium opacity-80 uppercase tracking-widest">Manage your podcast subscriptions and get notified of new episodes</p>
        </div>
      </div>
      
      <div class="subscription-stats grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="fb-card p-6 flex flex-col items-center text-center">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Total Subscriptions</h3>
          <span class="text-3xl font-black text-primary">{{ totalSubscriptions }}</span>
        </div>
        <div class="fb-card p-6 flex flex-col items-center text-center">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">New Episodes</h3>
          <span class="text-3xl font-black text-primary">{{ newEpisodes }}</span>
        </div>
        <div class="fb-card p-6 flex flex-col items-center text-center">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Hours Listened</h3>
          <span class="text-3xl font-black text-primary">{{ hoursListened }}</span>
        </div>
      </div>
      
      <div class="subscription-actions flex flex-wrap gap-4 px-4">
        <button (click)="discoverPodcasts()"
          class="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <i class="fas fa-search"></i>
          Discover New Podcasts
        </button>
        <button (click)="importSubscriptions()"
          class="flex items-center gap-3 px-8 py-4 bg-secondary dark:bg-white/5 text-foreground rounded-2xl font-black text-[11px] uppercase tracking-widest border border-black/5 dark:border-white/10 hover:bg-secondary/80 transition-all">
          <i class="fas fa-upload"></i>
          Import Subscriptions
        </button>
      </div>
      
      <div class="new-episodes space-y-8 px-4" *ngIf="newEpisodesList.length > 0">
        <h3 class="text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs">
            <i class="fas fa-bolt"></i>
          </span>
          New Episodes
        </h3>
        <div class="episode-list space-y-4">
          <div *ngFor="let episode of newEpisodesList" 
            class="fb-card p-4 flex gap-6 group hover:border-primary/20 transition-all relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-primary" *ngIf="true"></div>
            <img [src]="episode.podcastThumbnail" [alt]="episode.podcastTitle" 
              class="w-20 h-20 rounded-xl object-cover border border-black/5 shadow-sm flex-shrink-0">
            <div class="episode-info flex-grow">
              <h4 class="font-black text-sm text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{{ episode.title }}</h4>
              <p class="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">{{ episode.podcastTitle }}</p>
              <p class="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">{{ episode.description }}</p>
              <div class="episode-meta flex items-center gap-4 mt-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                <span class="flex items-center gap-1.5"><i class="far fa-clock"></i> {{ episode.duration }}</span>
                <span class="flex items-center gap-1.5"><i class="far fa-calendar"></i> {{ episode.publishedDate | date:'shortDate' }}</span>
                <span class="px-2 py-0.5 bg-primary/10 text-primary rounded">NEW</span>
              </div>
            </div>
            <div class="episode-actions flex flex-col gap-2 justify-center">
              <button (click)="playEpisode(episode)"
                class="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-90 transition-all">
                <i class="fas fa-play text-xs"></i>
              </button>
              <button (click)="downloadEpisode(episode)"
                class="w-10 h-10 bg-secondary dark:bg-white/5 text-muted-foreground rounded-xl flex items-center justify-center hover:text-primary transition-all">
                <i class="fas fa-download text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="subscribed-podcasts space-y-8 px-4">
        <h3 class="text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs">
            <i class="fas fa-podcast"></i>
          </span>
          My Podcasts
        </h3>
        <div class="podcast-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let podcast of subscribedPodcasts" 
            class="fb-card p-4 flex gap-4 group hover:border-primary/20 transition-all relative">
            <img [src]="podcast.thumbnail" [alt]="podcast.title" 
              class="w-24 h-24 rounded-2xl object-cover border border-black/5 shadow-sm flex-shrink-0">
            <div class="podcast-info flex-grow flex flex-col justify-between py-1">
              <div>
                <h4 class="font-black text-sm text-foreground uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">{{ podcast.title }}</h4>
                <p class="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">{{ podcast.author }}</p>
              </div>
              <div class="podcast-stats flex flex-col gap-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                <span>{{ podcast.episodeCount }} episodes</span>
                <span>Last: {{ podcast.lastEpisodeDate | date:'shortDate' }}</span>
              </div>
            </div>
            <div class="absolute right-4 bottom-4 flex gap-1">
              <button (click)="unsubscribe(podcast)"
                class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 flex items-center justify-center hover:bg-red-100 transition-all active:scale-90">
                <i class="fas fa-times text-[10px]"></i>
              </button>
              <button (click)="openSettings(podcast)"
                class="w-8 h-8 rounded-lg bg-secondary dark:bg-white/5 text-muted-foreground flex items-center justify-center hover:text-primary transition-all active:scale-90">
                <i class="fas fa-cog text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="empty-state flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-[#111] rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10" *ngIf="subscribedPodcasts.length === 0">
        <div class="w-24 h-24 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-xl mb-8">
          <i class="fas fa-podcast text-3xl text-slate-300"></i>
        </div>
        <h3 class="text-2xl font-black text-slate-900 dark:text-white uppercase italic mb-2">No Subscriptions Yet</h3>
        <p class="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-10 max-w-xs">Start discovering and subscribing to podcasts to see them here</p>
        <button (click)="discoverPodcasts()"
          class="px-12 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          Discover Podcasts
        </button>
      </div>
    </div>
  `
})
export class PodcastSubscriptionComponent implements OnInit {
  totalSubscriptions = 0;
  newEpisodes = 0;
  hoursListened = 0;
  newEpisodesList: any[] = [];
  subscribedPodcasts: any[] = [];

  ngOnInit() {
    this.loadSubscriptionData();
  }

  loadSubscriptionData() {
    // Load user's subscription data
    // This would typically call a service
  }

  discoverPodcasts() {
    // Navigate to podcast discovery/search
    console.log('Navigating to podcast discovery');
  }

  importSubscriptions() {
    // Open import dialog or navigate to import page
    console.log('Opening import subscriptions dialog');
  }

  playEpisode(episode: any) {
    // Play the selected episode
    console.log('Playing episode:', episode.title);
  }

  downloadEpisode(episode: any) {
    // Download episode for offline listening
    console.log('Downloading episode:', episode.title);
  }

  unsubscribe(podcast: any) {
    // Unsubscribe from podcast
    console.log('Unsubscribing from:', podcast.title);
  }

  openSettings(podcast: any) {
    // Open podcast-specific settings
    console.log('Opening settings for:', podcast.title);
  }
}