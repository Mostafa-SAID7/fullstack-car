import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar-right',
    standalone: true,
    imports: [CommonModule],
    template: `
    <aside class="hidden lg:flex w-72 flex-col p-4 fixed right-0 top-14 h-[calc(100vh-3.5rem)] overflow-y-auto z-10 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
        <div class="flex items-center justify-between text-muted-foreground font-semibold px-3 mb-4 tracking-wide text-xs uppercase opacity-80">
            <span>Contacts</span>
            <div class="flex gap-4 text-sm">
                <i class="fa-solid fa-video hover:text-primary cursor-pointer transition-colors"></i>
                <i class="fa-solid fa-search hover:text-primary cursor-pointer transition-colors"></i>
                <i class="fa-solid fa-ellipsis hover:text-primary cursor-pointer transition-colors"></i>
            </div>
        </div>
        <div class="fb-sidebar-item group relative animate-in" *ngFor="let user of [1,2,3,4,5]; let i = index" [style.animation-delay]="i * 0.1 + 's'">
            <div class="relative">
                <div class="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">U{{user}}</div>
                <div class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#18191a] rounded-full shadow-sm"></div>
            </div>
            <span class="font-medium text-foreground/80 group-hover:text-primary transition-colors">User {{user}}</span>
        </div>
    </aside>
  `
})
export class SidebarRightComponent { }
