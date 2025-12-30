import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../../core/models/post.model';

@Component({
    selector: 'app-post-item',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fb-card shadow-lg border-primary/5 group/post mb-6">
        <div class="p-4 pb-2 flex items-center justify-between">
            <div class="flex gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary overflow-hidden">
                    <img *ngIf="post.userProfileImageUrl" [src]="post.userProfileImageUrl" class="w-full h-full object-cover">
                    <span *ngIf="!post.userProfileImageUrl">{{ post.userFirstName[0] }}</span>
                </div>
                <div>
                    <h4 class="text-sm font-black hover:underline cursor-pointer">{{ post.userFirstName }} {{ post.userLastName }}</h4>
                    <div class="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>{{ post.createdAt | date:'short' }}</span> • <i class="fa-solid fa-earth-africa"></i>
                    </div>
                </div>
            </div>
            <button class="w-9 h-9 rounded-full hover:bg-accent flex items-center justify-center text-muted-foreground transition-all">
                <i class="fa-solid fa-ellipsis"></i>
            </button>
        </div>
        <div class="px-4 py-2 font-bold text-lg" *ngIf="post.title">{{ post.title }}</div>
        <div class="px-4 py-3 text-[15px] leading-relaxed">
            {{ post.content }}
        </div>
        <div *ngIf="post.imageUrl" class="relative bg-muted h-[450px] flex items-center justify-center overflow-hidden cursor-pointer">
            <img [src]="post.imageUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover/post:scale-105">
            <div class="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-xl">
                Full View
            </div>
        </div>
        <div class="px-4 py-3">
            <div class="flex items-center justify-between text-xs text-muted-foreground border-b border-border/30 pb-4 mb-1">
                <div class="flex items-center -space-x-1">
                    <span class="flex items-center justify-center w-6 h-6 bg-primary rounded-full text-white border-2 border-white dark:border-[#18191a] z-20 shadow-sm">
                        <i class="fa-solid fa-thumbs-up text-[10px]"></i>
                    </span>
                    <span class="ml-2 font-bold text-foreground/70">{{ post.likesCount }} people like this</span>
                </div>
                <div class="font-bold hover:underline cursor-pointer">{{ post.commentsCount }} comments</div>
            </div>
            <div class="flex gap-1 py-1">
                <button class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-accent transition-all text-sm font-black text-primary group/like">
                    <i class="fa-solid fa-thumbs-up scale-110 group-hover/like:scale-125 transition-transform group-active/like:scale-90"></i>
                    Like
                </button>
                <button class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-accent transition-all text-sm font-black text-muted-foreground group">
                    <i class="fa-solid fa-comment scale-110 group-hover:scale-125 transition-transform"></i>
                    Comment
                </button>
                <button class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-accent transition-all text-sm font-black text-muted-foreground group">
                    <i class="fa-solid fa-share scale-110 group-hover:scale-125 transition-transform"></i>
                    Share
                </button>
            </div>
        </div>
    </div>
  `
})
export class PostItemComponent {
    @Input() post!: Post;
}
