import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>My Bookings</h1>
      <p>View and manage your service bookings</p>
      <div class="placeholder">
        <i class="fas fa-calendar-alt"></i>
        <p>Booking list will be implemented here</p>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; text-align: center; }
    .placeholder { padding: 3rem; color: #6b7280; }
    .placeholder i { font-size: 3rem; margin-bottom: 1rem; }
  `]
})
export class BookingListComponent implements OnInit {
  ngOnInit(): void {}
}