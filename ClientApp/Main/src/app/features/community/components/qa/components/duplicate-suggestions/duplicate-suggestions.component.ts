import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { QuestionList } from '../../models/qa-api.types';

export interface DuplicateSuggestion {
  question: QuestionList;
  similarity: number; // 0-1 score
  matchedTags: string[];
  matchedTitle: boolean;
}

@Component({
  selector: 'app-duplicate-suggestions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  template: `
    <div *ngIf="suggestions.length > 0" class="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 mb-6">
      <div class="flex items-start gap-3">
        <div class="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <i class="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-400 text-sm"></i>
        </div>

        <div class="flex-1">
          <h3 class="text-sm font-bold text-yellow-800 dark:text-yellow-200 mb-2">
            {{ 'qa.possibleDuplicates' | translate }}
          </h3>

          <p class="text-xs text-yellow-700 dark:text-yellow-300 mb-4">
            {{ 'qa.duplicateSuggestionDesc' | translate }}
          </p>

          <div class="space-y-3">
            <div *ngFor="let suggestion of suggestions; let i = index"
                 class="bg-white dark:bg-gray-800 rounded-xl p-3 border border-yellow-200 dark:border-yellow-700 shadow-sm hover:shadow-md transition-shadow">

              <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <a [routerLink]="['/qa', suggestion.question.id]"
                     class="text-sm font-medium text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-2 block"
                     [title]="suggestion.question.title">
                    {{ suggestion.question.title }}
                  </a>

                  <div class="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <span class="flex items-center gap-1">
                      <i class="fas fa-comment"></i>
                      {{ suggestion.question.answerCount }} {{ 'qa.answers' | translate }}
                    </span>

                    <span class="flex items-center gap-1">
                      <i class="fas fa-eye"></i>
                      {{ suggestion.question.viewCount }} {{ 'qa.views' | translate }}
                    </span>

                    <span class="flex items-center gap-1">
                      <i class="fas fa-thumbs-up"></i>
                      {{ suggestion.question.voteScore }} {{ 'qa.votes' | translate }}
                    </span>
                  </div>

                  <!-- Similarity indicators -->
                  <div class="flex items-center gap-2 mt-2">
                    <div class="flex items-center gap-1 text-xs">
                      <span class="text-gray-600 dark:text-gray-400">{{ 'qa.similarity' | translate }}:</span>
                      <div class="flex gap-0.5">
                        <div *ngFor="let star of [1,2,3,4,5]"
                             class="w-3 h-3"
                             [class.text-yellow-400]="star <= Math.round(suggestion.similarity * 5)"
                             [class.text-gray-300]="star > Math.round(suggestion.similarity * 5)">
                          <i class="fas fa-star"></i>
                        </div>
                      </div>
                      <span class="text-gray-600 dark:text-gray-400">({{ (suggestion.similarity * 100) | number:'1.0-0' }}%)</span>
                    </div>
                  </div>

                  <!-- Matched elements -->
                  <div *ngIf="suggestion.matchedTags.length > 0 || suggestion.matchedTitle" class="flex flex-wrap gap-1 mt-2">
                    <span *ngIf="suggestion.matchedTitle"
                          class="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                      {{ 'qa.similarTitle' | translate }}
                    </span>
                    <span *ngFor="let tag of suggestion.matchedTags"
                          class="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs">
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <div class="flex gap-2">
                  <a [routerLink]="['/qa', suggestion.question.id]"
                     class="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    {{ 'qa.viewQuestion' | translate }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-4 pt-3 border-t border-yellow-200 dark:border-yellow-700">
            <button (click)="onDismissAll()"
                    class="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 text-xs font-bold rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors">
              {{ 'actions.dismiss' | translate }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DuplicateSuggestionsComponent implements OnInit, OnDestroy {
  @Input() suggestions: DuplicateSuggestion[] = [];
  @Input() questionTitle = '';
  @Input() questionTags: string[] = [];

  @Output() dismissAll = new EventEmitter<void>();
  @Output() viewQuestion = new EventEmitter<string>();

  // Make Math available in template
  Math = Math;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onViewQuestion(questionId: string): void {
    this.viewQuestion.emit(questionId);
  }

  onDismissAll(): void {
    this.dismissAll.emit();
  }
}
