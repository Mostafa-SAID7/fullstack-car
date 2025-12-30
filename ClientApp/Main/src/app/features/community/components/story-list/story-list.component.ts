import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-story-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex gap-2 py-2 overflow-x-auto no-scrollbar mb-6">
        <!-- Create Story -->
        <div class="flex-shrink-0 w-28 h-48 bg-white dark:bg-[#18191a] rounded-xl border border-border/50 shadow-sm relative cursor-pointer overflow-hidden group">
            <div class="h-[70%] bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                <i class="fa-solid fa-image text-muted-foreground/30 text-3xl"></i>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-[30%] bg-white dark:bg-[#18191a] flex flex-col items-center justify-center p-2 z-10">
                <div class="absolute -top-5 w-10 h-10 rounded-full bg-primary border-4 border-white dark:border-[#18191a] flex items-center justify-center text-white shadow-lg">
                    <i class="fa-solid fa-plus text-sm"></i>
                </div>
                <span class="text-[11px] font-bold mt-3">Create Story</span>
            </div>
        </div>

        <!-- Mock Loaded Stories -->
        <div *ngFor="let i of [1,2,3,4]"
            class="flex-shrink-0 w-28 h-48 bg-muted rounded-xl border border-border shadow-sm relative cursor-pointer overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <div class="absolute top-3 left-3 w-9 h-9 rounded-full border-4 border-primary z-20 overflow-hidden bg-primary/20 flex items-center justify-center font-bold text-white text-[10px]">
                U{{i}}
            </div>
            <span class="absolute bottom-3 left-3 text-white text-[10px] font-bold z-20">User {{i}}</span>
            <div class="w-full h-full transition-transform duration-500 group-hover:scale-110 flex items-center justify-center bg-primary/5">
                <i class="fa-solid fa-car text-primary/10 text-4xl"></i>
            </div>
        </div>
    </div>
  `
})
export class StoryListComponent { }
