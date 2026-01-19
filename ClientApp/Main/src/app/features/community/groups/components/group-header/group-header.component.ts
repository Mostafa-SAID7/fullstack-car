import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-group-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <span class="text-2xl font-bold text-primary">
            {{ group().name.charAt(0).toUpperCase() }}
          </span>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ group().name }}</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ group().description }}</p>
          <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>{{ group().memberCount }} members</span>
            <span>{{ group().type | titlecase }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GroupHeaderComponent {
  group = input.required<Group>();
}