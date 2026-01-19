import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorName: string;
  createdAt: Date;
}

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ review().title }}</h3>
        <div class="flex items-center">
          @for (star of [1,2,3,4,5]; track star) {
            <i class="fa-solid fa-star text-yellow-400" 
               [class.text-gray-300]="star > review().rating"></i>
          }
        </div>
      </div>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ review().content }}</p>
      <div class="text-sm text-gray-500">
        By {{ review().authorName }} • {{ review().createdAt | date }}
      </div>
    </div>
  `
})
export class ReviewItemComponent {
  review = input.required<Review>();
}