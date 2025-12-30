import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatTooltipModule],
    template: `
    <header class="h-14 glass sticky top-0 z-50 border-b border-border/40 flex items-center justify-between px-4 transition-all duration-300 backdrop-blur-md">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <span class="text-white font-black text-2xl tracking-tighter italic group-hover:rotate-3 transition-transform">C</span>
            </div>
            <div class="relative hidden sm:block group">
                <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-300"></i>
                <input type="text" placeholder="Search Community..."
                    class="bg-secondary/50 hover:bg-secondary/80 focus:bg-background border-transparent focus:border-primary/20 focus:ring-2 focus:ring-primary/20 rounded-full py-2.5 pl-10 pr-4 w-64 focus:w-80 transition-all duration-300 outline-none text-sm placeholder:text-muted-foreground/70">
            </div>
        </div>

        <nav class="flex items-center gap-1 h-full hidden md:flex">
            <div class="relative h-full px-8 flex items-center cursor-pointer group" matTooltip="Home">
                <div class="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-t-full"></div>
                <i class="fa-solid fa-house text-muted-foreground text-xl group-hover:text-primary hover:scale-110 transition-all duration-300"></i>
            </div>
            <div class="relative h-full px-8 flex items-center cursor-pointer group" matTooltip="Groups">
                 <div class="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-t-full"></div>
                <i class="fa-solid fa-users text-muted-foreground text-xl group-hover:text-primary hover:scale-110 transition-all duration-300"></i>
            </div>
            <div class="relative h-full px-8 flex items-center cursor-pointer group" matTooltip="Videos">
                 <div class="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-t-full"></div>
                <i class="fa-solid fa-video text-muted-foreground text-xl group-hover:text-primary hover:scale-110 transition-all duration-300"></i>
            </div>
            <div class="relative h-full px-8 flex items-center cursor-pointer group" matTooltip="Marketplace">
                 <div class="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-t-full"></div>
                <i class="fa-solid fa-store text-muted-foreground text-xl group-hover:text-primary hover:scale-110 transition-all duration-300"></i>
            </div>
        </nav>

        <div class="flex items-center gap-3">
            <button class="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200" matTooltip="Menu">
                <i class="fa-solid fa-bars text-foreground/80"></i>
            </button>
            <button class="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all duration-200" matTooltip="Messenger">
                <i class="fa-solid fa-comment text-foreground/80"></i>
                <span class="absolute -top-1 -right-1 bg-blue-600 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full border-2 border-background shadow-sm animate-pulse">3</span>
            </button>
            <button class="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200" matTooltip="Notifications">
                <i class="fa-solid fa-bell text-foreground/80"></i>
            </button>
            <div class="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 cursor-pointer hover:border-primary hover:scale-105 transition-all duration-300" matTooltip="Account">
                <div class="w-full h-full rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-md">JD</div>
            </div>
        </div>
    </header>
  `
})
export class HeaderComponent { }
