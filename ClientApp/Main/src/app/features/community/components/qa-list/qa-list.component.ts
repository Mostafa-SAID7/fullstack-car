import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QAService } from '../../services/qa.service';
import { Question } from '../../../../core/models/qa.model';
import { QAItemComponent } from '../qa-item/qa-item.component';

@Component({
    selector: 'app-qa-list',
    standalone: true,
    imports: [CommonModule, QAItemComponent],
    template: `
    <div class="space-y-8 animate-fade-in">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 class="text-3xl font-black text-foreground tracking-tight uppercase italic">
            Q&A <span class="text-primary">Knowledge</span>
          </h2>
          <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-1">
            Get expert help from the community
          </p>
        </div>
        
        <button class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
          Ask a Question
        </button>
      </div>

      <div class="flex items-center space-x-4">
        <button class="px-4 py-2 rounded-xl bg-white/10 text-foreground text-xs font-bold uppercase transition-all hover:bg-primary hover:text-white">Newest</button>
        <button class="px-4 py-2 rounded-xl bg-white/5 text-muted-foreground text-xs font-bold uppercase transition-all hover:bg-white/10">Frequent</button>
        <button class="px-4 py-2 rounded-xl bg-white/5 text-muted-foreground text-xs font-bold uppercase transition-all hover:bg-white/10">Unanswered</button>
      </div>

      <div *ngIf="loading" class="space-y-4">
        <div *ngFor="let i of [1,2,3,4]" class="h-48 rounded-3xl bg-surface/20 mica-effect animate-pulse"></div>
      </div>

      <div *ngIf="!loading && questions.length === 0" class="flex flex-col items-center justify-center py-20 mica-effect rounded-3xl border border-white/5 bg-surface/10">
        <i class="fa-solid fa-circle-question text-6xl text-muted-foreground/20 mb-4"></i>
        <h3 class="text-xl font-black text-muted-foreground uppercase italic tracking-widest">Be the first to ask!</h3>
      </div>

      <div *ngIf="!loading && questions.length > 0" class="space-y-4">
        <app-qa-item *ngFor="let question of questions" [question]="question"></app-qa-item>
      </div>
    </div>
  `
})
export class QAListComponent implements OnInit {
    questions: Question[] = [];
    loading = true;

    constructor(private qaService: QAService) { }

    ngOnInit(): void {
        this.loadQuestions();
    }

    loadQuestions(): void {
        this.loading = true;
        this.qaService.getQuestions(1, 10).subscribe({
            next: (result) => {
                this.questions = result.items;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }
}
