import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Edit Event</h1>
      <p>Event editing form will be implemented here.</p>
    </div>
  `
})
export class EventEditComponent {
}