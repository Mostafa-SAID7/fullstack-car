import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group } from '../../../../../core/models/group.model';

@Component({
  selector: 'app-group-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold mb-4">Group Info</h3>
      <div class="space-y-3">
        <div>
          <span class="text-sm font-medium text-gray-500">Category:</span>
          <p class="text-gray-900 dark:text-white">{{ group().category }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Type:</span>
          <p class="text-gray-900 dark:text-white">{{ group().type | titlecase }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Members:</span>
          <p class="text-gray-900 dark:text-white">{{ group().memberCount }}</p>
        </div>
        <div>
          <span class="text-sm font-medium text-gray-500">Posts:</span>
          <p class="text-gray-900 dark:text-white">{{ group().postCount }}</p>
        </div>
      </div>
    </div>
  `
})
export class GroupSidebarComponent {
  group = input.required<Group>();
}