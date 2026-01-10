import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { VideoList, PodcastList } from '../../../../features/media/models';


@Component({
    selector: 'app-media-sidebar-right',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    template: `
        <div class="space-y-6">
            <!-- Videos Section -->
            <div class="px-4">
                <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 opacity-70">Trending in Videos</h3>
                <div class="space-y-4">
                    <div *ngFor="let video of trendingVideos" 
                        class="group block p-2 rounded-xl hover:bg-secondary dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
                        [routerLink]="['/media/videos', video.id]">
                        <div class="relative aspect-video rounded-xl overflow-hidden mb-2">
                            <img [src]="video.thumbnailUrl || video.thumbnail" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <i class="fa-solid fa-play text-white text-xl"></i>
                            </div>
                        </div>
                        <h4 class="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{{ video.title }}</h4>
                        <p class="text-[9px] text-muted-foreground mt-1">{{ video.creatorName }} • {{ video.viewCount }} views</p>
                    </div>
                </div>
            </div>

            <!-- Podcasts Section -->
            <div class="px-4">
                <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 opacity-70">Popular Podcasts</h3>
                <div class="space-y-3">
                    <div *ngFor="let podcast of trendingPodcasts" 
                        class="flex gap-3 p-2 rounded-xl hover:bg-secondary dark:hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                        [routerLink]="['/media/podcasts', podcast.id]">
                        <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                            <img [src]="podcast.thumbnailUrl || podcast.coverImage" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <i class="fa-solid fa-volume-high text-white text-sm"></i>
                            </div>
                        </div>
                        <div class="flex flex-col justify-center min-w-0">
                            <h4 class="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{{ podcast.title }}</h4>
                            <p class="text-[9px] text-muted-foreground mt-0.5 truncate">{{ podcast.creatorName || 'Audio Engine' }}</p>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black uppercase">EP {{ podcast.episodeNumber || '1' }}</span>
                                <span class="text-[8px] text-muted-foreground font-bold italic">{{ (podcast.playCount || 0) | number }} plays</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class MediaSidebarRightComponent {
    @Input() trendingVideos: VideoList[] = [];
    @Input() trendingPodcasts: PodcastList[] = [];
}
