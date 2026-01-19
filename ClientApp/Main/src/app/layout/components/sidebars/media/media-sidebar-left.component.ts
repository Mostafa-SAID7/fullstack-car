import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-media-sidebar-left',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    template: `
        <div class="space-y-6">
            <!-- Media Section -->
            <div class="space-y-1">
                    <!-- Videos Link -->
                    <div class="flex items-center justify-start md:justify-center lg:justify-start gap-3 p-2 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-secondary dark:hover:bg-white/5"
                        routerLink="/media/videos"
                        routerLinkActive="!text-primary bg-primary/10 dark:bg-primary/20 shadow-sm active-nav"
                        [routerLinkActiveOptions]="{exact: false}">
                        <div
                            class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/30 transition-all duration-300 group-[.active-nav]:bg-white group-[.active-nav]:dark:bg-white/5 group-[.active-nav]:text-primary group-[.active-nav]:shadow-sm">
                            <i class="fa-solid fa-video text-sm"></i>
                        </div>
                        <span class="text-xs font-bold md:hidden lg:block">Videos</span>
                    </div>

                    <!-- Podcasts Link -->
                    <div class="flex items-center justify-start md:justify-center lg:justify-start gap-3 p-2 rounded-xl transition-all duration-300 ease-in-out cursor-pointer group text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-secondary dark:hover:bg-white/5"
                        routerLink="/media/podcasts"
                        routerLinkActive="!text-primary bg-primary/10 dark:bg-primary/20 shadow-sm active-nav"
                        [routerLinkActiveOptions]="{exact: false}">
                        <div
                            class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/30 transition-all duration-300 group-[.active-nav]:bg-white group-[.active-nav]:dark:bg-white/5 group-[.active-nav]:text-primary group-[.active-nav]:shadow-sm">
                            <i class="fa-solid fa-podcast text-sm"></i>
                        </div>
                        <span class="text-xs font-bold md:hidden lg:block">Podcasts</span>
                    </div>
            </div>
        </div>
    `
})
export class MediaSidebarLeftComponent { }
