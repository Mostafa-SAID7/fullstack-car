import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Question } from '../../../../../core/models/qa.model';

@Component({
  selector: 'app-qa-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card mica-effect bg-surface/30 p-5 border border-white/5 hover:border-primary/20 transition-all duration-300 group">
      <div class="flex gap-5">
        <div class="flex flex-col items-center space-y-4">
          <div class="flex flex-col items-center">
            <span class="text-lg font-black text-foreground">{{ question.upvotesCount - question.downvotesCount }}</span>
            <span class="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">Votes</span>
          </div>
          <div class="flex flex-col items-center px-2 py-1.5 rounded-xl border" 
               [ngClass]="question.hasAcceptedAnswer ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'border-white/10 text-muted-foreground'">
            <span class="text-lg font-black">{{ question.answersCount }}</span>
            <span class="text-[9px] font-black uppercase tracking-tighter">Answers</span>
          </div>
          <div class="flex flex-col items-center text-muted-foreground/40">
            <span class="text-xs font-bold">{{ question.viewsCount }}</span>
            <i class="fa-regular fa-eye text-[10px]"></i>
          </div>
        </div>

        <div class="flex-1 space-y-3">
          <div class="flex items-center space-x-2">
            <span *ngIf="question.priority === 3" class="px-2 py-0.5 rounded bg-red-500 text-white text-[9px] font-black uppercase">Urgent</span>
            <span *ngIf="question.bountyAmount > 0" class="px-2 py-0.5 rounded bg-yellow-500/90 text-black text-[9px] font-black uppercase">+{{question.bountyAmount}} Bounty</span>
          </div>

          <h3 class="text-lg font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
            <a [routerLink]="['/community/qa', question.id]">{{ question.title }}</a>
          </h3>

          <p class="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {{ question.content }}
          </p>

          <div class="pt-2 flex flex-wrap gap-2">
             <span *ngFor="let tag of getTags(question.tags)" class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg border border-primary/5 hover:bg-primary/20 cursor-pointer transition-colors">
               #{{ tag }}
             </span>
          </div>

          <div class="pt-4 flex items-center justify-between border-t border-white/5">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-black border border-white/10 uppercase italic">
                {{ question.user?.firstName?.[0] || 'Q' }}
              </div>
              <span class="text-xs font-bold text-foreground/60">{{ question.user?.firstName }} asked {{ question.createdAt | date:'shortTime' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QAItemComponent {
  @Input({ required: true }) question!: Question;

  getTags(tagsString?: string): string[] {
    if (!tagsString) return [];
    try {
      return JSON.parse(tagsString);
    } catch {
      return tagsString.split(',').map(t => t.trim());
    }
  }
}
