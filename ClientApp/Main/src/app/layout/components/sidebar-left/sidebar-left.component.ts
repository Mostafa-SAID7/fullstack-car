import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sidebar-left',
    standalone: true,
    imports: [CommonModule],
    template: `
    <aside class="hidden lg:flex w-72 flex-col p-4 fixed left-0 top-14 h-[calc(100vh-3.5rem)] overflow-y-auto z-10 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
        <div class="fb-sidebar-item hover:scale-105 transition-transform duration-200">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-md">JD</div>
            <span class="font-medium text-foreground/90">John Doe</span>
        </div>
        <div class="fb-sidebar-item group">
            <i class="fa-solid fa-user-group text-sky-500 text-xl w-9 flex justify-center group-hover:scale-110 transition-transform"></i>
            <span class="font-medium text-foreground/80 group-hover:text-primary transition-colors">Friends</span>
        </div>
        <div class="fb-sidebar-item group">
            <i class="fa-solid fa-clock text-blue-500 text-xl w-9 flex justify-center group-hover:scale-110 transition-transform"></i>
            <span class="font-medium text-foreground/80 group-hover:text-primary transition-colors">Memories</span>
        </div>
        <div class="fb-sidebar-item group">
            <i class="fa-solid fa-bookmark text-purple-500 text-xl w-9 flex justify-center group-hover:scale-110 transition-transform"></i>
            <span class="font-medium text-foreground/80 group-hover:text-primary transition-colors">Saved</span>
        </div>
        <div class="fb-sidebar-item group">
            <i class="fa-solid fa-people-group text-primary text-xl w-9 flex justify-center group-hover:scale-110 transition-transform"></i>
            <span class="font-medium text-foreground/80 group-hover:text-primary transition-colors">Groups</span>
        </div>
        <hr class="my-4 border-border/50">
        <h3 class="px-3 text-muted-foreground font-semibold mb-2 text-sm uppercase tracking-wider">Your Shortcuts</h3>
        <div class="fb-sidebar-item group">
            <div class="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-black italic text-xs group-hover:bg-primary group-hover:text-white transition-colors duration-300">OFF</div>
            <span class="font-medium truncate text-foreground/80 group-hover:text-primary transition-colors">Off-road Lovers Egypt</span>
        </div>
        
        <div class="mt-auto px-3 py-4 text-xs text-muted-foreground/60 text-center">
            <p>&copy; 2024 Community Car</p>
        </div>
    </aside>
  `
})
export class SidebarLeftComponent { }
