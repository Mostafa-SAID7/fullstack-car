import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Create Booking</h1>
      <p>Book a service appointment</p>
      <div class="placeholder">
        <i class="fas fa-plus-circle"></i>
        <p>Booking form will be implemented here</p>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; text-align: center; }
    .placeholder { padding: 3rem; color: #6b7280; }
    .placeholder i { font-size: 3rem; margin-bottom: 1rem; }
  `]
})
export class CreateBookingComponent implements OnInit {
  ngOnInit(): void {}
}