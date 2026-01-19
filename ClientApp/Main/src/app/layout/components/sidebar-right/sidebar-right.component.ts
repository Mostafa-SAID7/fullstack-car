import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FriendService } from '../../../features/community/friends/services/friend.service';
import { MediaService } from '../../../features/media/services/media.service';
import { Friend } from '../../../features/community/friends/models/friend.model';
import { VideoList, PodcastList } from '../../../features/media/models';
import { filter, Subscription } from 'rxjs';
import { CommunitySidebarRightComponent } from '../sidebars/community/community-sidebar-right.component';
import { MediaSidebarRightComponent } from '../sidebars/media/media-sidebar-right.component';
import { MarketplaceSidebarRightComponent } from '../sidebars/marketplace/marketplace-sidebar-right.component';
import { AuthService } from '../../../core/services/auth.service';

export type AppSection = 'community' | 'media' | 'video' | 'podcast' | 'marketplace' | 'default';

@Component({
    selector: 'app-sidebar-right',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule,
        CommunitySidebarRightComponent,
        MediaSidebarRightComponent,
        MarketplaceSidebarRightComponent,
        FormsModule
    ],
    providers: [DatePipe],
    templateUrl: './sidebar-right.component.html'
})
export class SidebarRightComponent implements OnInit, OnDestroy {
    friends: Friend[] = [];
    trendingVideos: VideoList[] = [];
    trendingPodcasts: PodcastList[] = [];
    currentSection: AppSection = 'default';
    private routerSubscription?: Subscription;

    private friendService = inject(FriendService);
    private mediaService = inject(MediaService);
    private authService = inject(AuthService);
    private router = inject(Router);

    constructor() { }

    ngOnInit(): void {
        this.updateSection(this.router.url);

        this.routerSubscription = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.updateSection(event.urlAfterRedirects);
        });

        this.fetchContextualData();
    }

    ngOnDestroy(): void {
        this.routerSubscription?.unsubscribe();
    }

    private updateSection(url: string): void {
        const tree = this.router.parseUrl(url);
        const tab = tree.queryParamMap.get('tab');

        const prevSection = this.currentSection;

        if (url.includes('/community')) {
            this.currentSection = 'community';
        } else if (url.includes('/media')) {
            if (tab === 'videos' || tab?.includes('video')) {
                this.currentSection = 'video';
            } else if (tab === 'podcasts' || tab?.includes('podcast')) {
                this.currentSection = 'podcast';
            } else if (url.includes('/videos')) {
                this.currentSection = 'video';
            } else if (url.includes('/podcasts')) {
                this.currentSection = 'podcast';
            } else {
                this.currentSection = 'media';
            }
        } else if (url.includes('/marketplace')) {
            this.currentSection = 'marketplace';
        } else if (url === '/' || url === '' || url.includes('/home')) {
            this.currentSection = 'community';
        } else {
            this.currentSection = 'default';
        }

        if (prevSection !== this.currentSection) {
            this.fetchContextualData();
        }
    }

    private fetchContextualData(): void {
        const isAuthenticated = this.authService.isAuthenticated;

        if ((this.currentSection === 'community' || this.currentSection === 'default') && isAuthenticated) {
            this.friendService.getFriends(1, 10).subscribe({
                next: (result: any) => {
                    this.friends = result.items || [];
                },
                error: (error: any) => {
                    console.error('Error fetching friends:', error);
                    this.friends = [];
                }
            });
        } else if (this.currentSection === 'video' || this.currentSection === 'media') {
            this.mediaService.getTrendingVideos(5).subscribe({
                next: (videos: any) => {
                    this.trendingVideos = videos || [];
                },
                error: (error: any) => {
                    console.error('Error fetching trending videos:', error);
                    this.trendingVideos = [];
                }
            });
        } else if (this.currentSection === 'podcast') {
            this.mediaService.getTrendingPodcasts(5).subscribe({
                next: (podcasts: any) => {
                    this.trendingPodcasts = podcasts || [];
                },
                error: (error: any) => {
                    console.error('Error fetching trending podcasts:', error);
                    this.trendingPodcasts = [];
                }
            });
        }
    }
}
