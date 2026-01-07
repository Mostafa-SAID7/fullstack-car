import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div class="relative mb-8">
            <h1 class="text-9xl font-black italic text-primary/10 select-none">404</h1>
            <div class="absolute inset-0 flex items-center justify-center">
                <i class="fas fa-ghost text-6xl text-primary animate-bounce"></i>
            </div>
        </div>
        
        <h2 class="text-3xl font-black text-foreground mb-4 tracking-tight">Lost in Gear?</h2>
        <p class="text-muted-foreground max-w-md mb-8 font-medium">
            The page you're looking for appears to have drifted off track. Let's get you back on the right road.
        </p>

        <div class="flex flex-col sm:flex-row gap-4">
            <button routerLink="/community" 
                class="px-8 py-3 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3">
                <i class="fas fa-home"></i> Back to Feed
            </button>
            <button (click)="goBack()" 
                class="px-8 py-3 bg-secondary text-foreground rounded-2xl font-black hover:bg-secondary/80 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 border border-border/40">
                <i class="fas fa-arrow-left"></i> Go Back
            </button>
        </div>
        
        <div class="mt-16 grid grid-cols-2 gap-8 opacity-40 grayscale grayscale-[50%]">
            <div class="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-muted-foreground">
                <span class="w-8 h-[2px] bg-primary"></span>
                COMMUNITY CAR
            </div>
            <div class="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-muted-foreground justify-end">
                FULLY2CAR
                <span class="w-8 h-[2px] bg-primary"></span>
            </div>
        </div>
    </div>
  `
})
export class NotFoundComponent {
    goBack() {
        window.history.back();
    }
}
