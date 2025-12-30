import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-create-post',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fb-card p-4 shadow-md border-primary/5 mb-6">
        <div class="flex gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">JD</div>
            <div class="flex-1 bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full px-4 flex items-center cursor-pointer hover:bg-[#e4e6e9] dark:hover:bg-[#4e4f50] transition-colors group">
                <span class="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">What's on your mind, John?</span>
            </div>
        </div>
        <hr class="border-border/50 mx-2">
        <div class="flex mt-3">
            <button class="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-accent transition-all text-sm font-bold text-muted-foreground group">
                <i class="fa-solid fa-video text-red-500 scale-110 group-hover:scale-125 transition-transform"></i>
                Live video
            </button>
            <button class="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-accent transition-all text-sm font-bold text-muted-foreground group">
                <i class="fa-solid fa-images text-emerald-500 scale-110 group-hover:scale-125 transition-transform"></i>
                Photo/video
            </button>
            <button class="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-accent transition-all text-sm font-bold text-muted-foreground group">
                <i class="fa-solid fa-face-smile text-amber-500 scale-110 group-hover:scale-125 transition-transform"></i>
                Feeling/activity
            </button>
        </div>
    </div>
  `
})
export class CreatePostComponent { }
