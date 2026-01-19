import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Guide {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  readTime: number;
  likesCount: number;
  createdAt: Date;
}

@Component({
  selector: 'app-guide-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ guide().title }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ guide().description }}</p>
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>{{ guide().category }}</span>
          <span>{{ guide().readTime }} min read</span>
        </div>
      </div>
    </div>
  `
})
export class GuideCardComponent {
  guide = input.required<Guide>();
}