import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-community-sidebar-left',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    template: `
        <div class="space-y-6">
            <!-- Navigation Links -->
            <div class="space-y-1">
                <div *ngFor="let item of menuItems"
                    class="flex items-center justify-between p-2 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer group text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-secondary dark:hover:bg-white/5"
                    [routerLink]="item.link"
                    routerLinkActive="!text-primary bg-primary/10 dark:bg-primary/20 shadow-sm active-nav">
                    
                    <div class="flex items-center gap-3">
                        <div
                            class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/30 transition-all duration-300 group-[.active-nav]:bg-white group-[.active-nav]:dark:bg-white/5 group-[.active-nav]:text-primary group-[.active-nav]:shadow-sm">
                            <i [class]="'fa-solid ' + item.icon + ' text-sm'"></i>
                        </div>
                        <span class="text-xs font-bold md:hidden lg:block">{{ item.label }}</span>
                    </div>

                    <!-- Count Badge -->
                    <span *ngIf="item.count > 0" 
                        class="text-[10px] font-black px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors md:hidden lg:block">
                        {{ item.count }}
                    </span>
                </div>
            </div>
        </div>
    `
})
export class CommunitySidebarLeftComponent {
    menuItems = [
        { label: 'Questions', icon: 'fa-circle-question', link: '/community/qa', count: 12 },
        { label: 'Posts', icon: 'fa-pencil-square', link: '/community/posts', count: 45 },
        { label: 'Guides', icon: 'fa-book-open', link: '/community/guides', count: 8 },
        { label: 'Friends', icon: 'fa-user-group', link: '/community/friends', count: 120 },
        { label: 'Groups', icon: 'fa-users', link: '/community/groups', count: 5 },
        { label: 'Pages', icon: 'fa-file-lines', link: '/community/pages', count: 3 },
        { label: 'Reviews', icon: 'fa-star', link: '/community/reviews', count: 24 },
        { label: 'Maps', icon: 'fa-map-location-dot', link: '/community/maps', count: 0 }
    ];
}
