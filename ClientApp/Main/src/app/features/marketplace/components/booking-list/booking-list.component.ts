import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-8 py-24 text-center animate-fade-in max-w-2xl mx-auto">
      <div class="w-24 h-24 rounded-[2rem] bg-secondary dark:bg-white/5 flex items-center justify-center mx-auto mb-10 border border-black/5 dark:border-white/10 shadow-xl">
        <i class="fa-solid fa-calendar-check text-4xl text-primary"></i>
      </div>
      <h2 class="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter">My Service Log</h2>
      <p class="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] leading-relaxed mb-12 opacity-70">
        Track and manage all your automotive service appointments in one place. Your booking history will appear here.
      </p>
      
      <div class="p-8 border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
        <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic">
          No past transmissions found in your service log.
        </p>
      </div>
    </div>
  `
})
export class BookingListComponent implements OnInit {
  ngOnInit(): void { }
}