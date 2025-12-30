import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../core/services/theme.service';
import { LayoutService } from '../../../core/services/layout.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatTooltipModule],
    template: `
    <header class="h-14 glass fixed top-0 left-0 w-full z-50 shadow-sm flex items-center justify-between px-2 sm:px-4 md:px-6 transition-colors duration-300">
        <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0">
                <span class="text-white font-black text-2xl tracking-tighter italic">f</span>
            </div>
            
            <!-- Mobile Search Icon -->
            <div class="w-10 h-10 bg-secondary rounded-full flex md:hidden items-center justify-center cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                 (click)="toggleSearch()">
                <i class="fa-solid fa-search text-foreground"></i>
            </div>

            <!-- Mobile Search Input Overlay -->
            <div *ngIf="isSearchOpen" class="absolute top-0 left-0 w-full h-14 bg-card flex items-center px-4 z-50 md:hidden animate-fade-in shadow-md">
                <i class="fa-solid fa-arrow-left text-xl text-muted-foreground mr-4 cursor-pointer" (click)="toggleSearch()"></i>
                <input type="text" placeholder="Search Facebook" class="fb-input w-full" autoFocus>
            </div>

            <!-- Desktop Search Bar -->
            <div class="relative hidden md:block group">
                <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 group-focus-within:hidden"></i>
                <input type="text" placeholder="Search Facebook" class="fb-input pl-10 w-[240px] lg:w-[280px] xl:w-[320px] transition-all focus:pl-4 focus:shadow-md">
            </div>
        </div>

        <nav class="flex items-center h-full hidden md:flex gap-1 lg:gap-8 xl:gap-14 flex-1 justify-center max-w-2xl px-4">
            <div class="relative h-full flex-1 flex items-center justify-center cursor-pointer border-b-[3px] border-primary text-primary transition-all duration-200 hover:bg-secondary/50 rounded-lg my-1 group" matTooltip="Home">
                <i class="fa-solid fa-house text-2xl group-active:scale-95 transition-transform"></i>
            </div>
            <div class="relative h-full flex-1 flex items-center justify-center cursor-pointer border-b-[3px] border-transparent text-muted-foreground hover:bg-secondary rounded-lg my-1 transition-all duration-200 group" matTooltip="Friends">
                <i class="fa-solid fa-user-group text-2xl group-active:scale-95 transition-transform"></i>
            </div>
            <div class="relative h-full flex-1 flex items-center justify-center cursor-pointer border-b-[3px] border-transparent text-muted-foreground hover:bg-secondary rounded-lg my-1 transition-all duration-200 group" matTooltip="Video">
                <div class="relative group-active:scale-95 transition-transform">
                    <i class="fa-solid fa-tv text-2xl"></i>
                    <span class="absolute -top-1.5 -right-2 bg-red-500 text-[10px] font-bold text-white px-1 rounded-full border border-card">9+</span>
                </div>
            </div>
            <div class="relative h-full flex-1 flex items-center justify-center cursor-pointer border-b-[3px] border-transparent text-muted-foreground hover:bg-secondary rounded-lg my-1 transition-all duration-200 group" matTooltip="Marketplace">
                <i class="fa-solid fa-store text-2xl group-active:scale-95 transition-transform"></i>
            </div>
            <div class="relative h-full flex-1 flex items-center justify-center cursor-pointer border-b-[3px] border-transparent text-muted-foreground hover:bg-secondary rounded-lg my-1 transition-all duration-200 group" matTooltip="Groups">
                <i class="fa-solid fa-users text-2xl group-active:scale-95 transition-transform"></i>
            </div>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <!-- Theme Toggle Button -->
            <button class="fb-icon-btn active:scale-95 touch-manipulation" 
                    [matTooltip]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                    (click)="themeService.toggleTheme()">
                <i class="fa-solid text-xl transition-transform duration-500 rotate-0" 
                   [ngClass]="themeService.isDark() ? 'fa-sun text-yellow-500 rotate-180' : 'fa-moon text-gray-600'">
                </i>
            </button>

            <!-- Menu Button -->
            <button class="fb-icon-btn active:scale-95 touch-manipulation lg:hidden" 
                    matTooltip="Menu"
                    (click)="layoutService.toggleMobileMenu()">
                <i class="fa-solid fa-bars text-xl"></i>
            </button>
            <button class="fb-icon-btn active:scale-95 touch-manipulation hidden lg:flex" matTooltip="Menu">
                <i class="fa-solid fa-bars text-xl"></i>
            </button>
            <button class="fb-icon-btn active:scale-95 touch-manipulation" matTooltip="Messenger">
                <i class="fa-brands fa-facebook-messenger text-xl"></i>
            </button>
            <button class="fb-icon-btn relative active:scale-95 touch-manipulation" matTooltip="Notifications">
                <i class="fa-solid fa-bell text-xl"></i>
                <span class="absolute -top-1 -right-1 bg-red-500 text-[11px] font-bold text-white px-1.5 py-0.5 rounded-full border-2 border-card">3</span>
            </button>
            <div class="w-10 h-10 rounded-full bg-secondary overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ml-1 active:scale-95 touch-manipulation" matTooltip="Account">
                <div class="w-full h-full bg-gray-300 flex items-center justify-center text-muted-foreground font-bold">JD</div>
            </div>
        </div>
    </header>  `
})
export class HeaderComponent {
    themeService = inject(ThemeService);
    layoutService = inject(LayoutService);
    isSearchOpen = false;

    toggleSearch() {
        this.isSearchOpen = !this.isSearchOpen;
    }
}
