import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Events Calendar</h1>
      <p>Calendar view will be implemented here.</p>
    </div>
  `
})
export class EventsCalendarComponent {
}