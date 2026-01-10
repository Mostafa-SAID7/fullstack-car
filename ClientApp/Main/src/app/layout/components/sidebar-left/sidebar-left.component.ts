import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter, Subscription } from 'rxjs';
import { CommunitySidebarLeftComponent } from '../sidebars/community/community-sidebar-left.component';
import { MediaSidebarLeftComponent } from '../sidebars/media/media-sidebar-left.component';
import { MarketplaceSidebarLeftComponent } from '../sidebars/marketplace/marketplace-sidebar-left.component';


export type AppSection = 'community' | 'media' | 'video' | 'podcast' | 'marketplace' | 'default';

@Component({
    selector: 'app-sidebar-left',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule,
        CommunitySidebarLeftComponent,
        MediaSidebarLeftComponent,
        MarketplaceSidebarLeftComponent
    ],
    templateUrl: './sidebar-left.component.html'

})
export class SidebarLeftComponent implements OnInit, OnDestroy {
    currentUser: any;
    currentSection: AppSection = 'default';
    private routerSubscription?: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe((user: any) => {
            this.currentUser = user;
        });

        // Track current section based on URL and query params
        this.updateSection(this.router.url);

        this.routerSubscription = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.updateSection(event.urlAfterRedirects);
        });
    }

    ngOnDestroy(): void {
        this.routerSubscription?.unsubscribe();
    }

    private updateSection(url: string): void {
        const tree = this.router.parseUrl(url);
        const tab = tree.queryParamMap.get('tab');

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
    }



    get currentYear(): number {
        return new Date().getFullYear();
    }
}
