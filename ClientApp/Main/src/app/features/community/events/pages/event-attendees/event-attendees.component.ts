import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-attendees',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Event Attendees</h1>
      <p>Attendees list will be implemented here.</p>
    </div>
  `
})
export class EventAttendeesComponent {
}