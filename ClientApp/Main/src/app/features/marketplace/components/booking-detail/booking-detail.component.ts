import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-8 py-24 text-center animate-fade-in max-w-2xl mx-auto">
      <div class="w-20 h-20 rounded-2xl bg-secondary dark:bg-white/5 flex items-center justify-center mx-auto mb-8 border border-black/5 dark:border-white/10 shadow-lg">
        <i class="fas fa-calendar-check text-3xl text-muted-foreground/30"></i>
      </div>
      <h2 class="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">Transmission Registry</h2>
      <div class="p-8 border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
        <p class="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-loose">
          Booking data is currently being retrieved from the main server. Please wait for synchronization.
        </p>
      </div>
    </div>
  `
})
export class BookingDetailComponent implements OnInit {
  ngOnInit(): void { }
}