import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatTooltipModule],
    template: `
    <header class="h-14 bg-card sticky top-0 z-50 shadow-sm flex items-center justify-between px-4">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                <span class="text-white font-black text-2xl tracking-tighter italic">f</span>
            </div>
            <div class="relative hidden sm:block">
                <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"></i>
                <input type="text" placeholder="Search Facebook" class="fb-input pl-10 w-64 md:w-[240px] lg:w-[280px]">
            </div>
        </div>

        <nav class="flex items-center h-full hidden md:flex gap-1 md:gap-8 lg:gap-14">
            <div class="relative h-full px-4 md:px-10 flex items-center justify-center cursor-pointer border-b-[3px] border-primary text-primary" matTooltip="Home">
                <i class="fa-solid fa-house text-2xl"></i>
            </div>
            <div class="relative h-full px-4 md:px-10 flex items-center justify-center cursor-pointer border-b-[3px] border-transparent text-muted-foreground hover:bg-secondary rounded-lg my-1" matTooltip="Friends">
                <i class="fa-solid fa-user-group text-2xl"></i>
            </div>
            <div class="relative h-full px-4 md:px-10 flex items-center justify-center cursor-pointer border-b-[3px] border-transparent text-muted-foreground hover:bg-secondary rounded-lg my-1" matTooltip="Video">
                <div class="relative">
                    <i class="fa-solid fa-tv text-2xl"></i>
                    <span class="absolute -top-1.5 -right-2 bg-red-500 text-[10px] font-bold text-white px-1 rounded-full border border-card">9+</span>
                </div>
            </div>
            <div class="relative h-full px-4 md:px-10 flex items-center justify-center cursor-pointer border-b-[3px] border-transparent text-muted-foreground hover:bg-secondary rounded-lg my-1" matTooltip="Marketplace">
                <i class="fa-solid fa-store text-2xl"></i>
            </div>
            <div class="relative h-full px-4 md:px-10 flex items-center justify-center cursor-pointer border-b-[3px] border-transparent text-muted-foreground hover:bg-secondary rounded-lg my-1" matTooltip="Groups">
                <i class="fa-solid fa-users text-2xl"></i>
            </div>
        </nav>

        <div class="flex items-center gap-2">
            <button class="fb-icon-btn" matTooltip="Menu">
                <i class="fa-solid fa-bars text-xl"></i>
            </button>
            <button class="fb-icon-btn" matTooltip="Messenger">
                <i class="fa-brands fa-facebook-messenger text-xl"></i>
            </button>
            <button class="fb-icon-btn relative" matTooltip="Notifications">
                <i class="fa-solid fa-bell text-xl"></i>
                <span class="absolute -top-1 -right-1 bg-red-500 text-[11px] font-bold text-white px-1.5 py-0.5 rounded-full border-2 border-card">3</span>
            </button>
            <div class="w-10 h-10 rounded-full bg-secondary overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ml-1" matTooltip="Account">
                <div class="w-full h-full bg-gray-300 flex items-center justify-center text-muted-foreground font-bold">JD</div>
            </div>
        </div>
    </header>  `
})
export class HeaderComponent { }
