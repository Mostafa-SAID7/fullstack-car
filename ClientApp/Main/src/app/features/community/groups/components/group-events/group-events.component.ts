import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group } from '../../../../../core/models/group.model';

@Component({
  selector: 'app-group-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold mb-4">Events</h3>
      <p class="text-gray-600 dark:text-gray-400">Events for {{ group().name }} will be displayed here.</p>
    </div>
  `
})
export class GroupEventsComponent {
  group = input.required<Group>();
}