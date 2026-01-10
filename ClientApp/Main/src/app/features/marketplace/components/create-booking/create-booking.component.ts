import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-8 py-24 text-center animate-fade-in max-w-2xl mx-auto">
      <div class="w-20 h-20 rounded-2xl bg-secondary dark:bg-white/5 flex items-center justify-center mx-auto mb-8 border border-black/5 dark:border-white/10 shadow-lg">
        <i class="fas fa-plus-circle text-3xl text-muted-foreground/30"></i>
      </div>
      <h2 class="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter">Initiate Booking</h2>
      <div class="p-8 border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
        <p class="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-loose">
          Establishing secure handshake for booking protocol. The form will appear once the connection is verified.
        </p>
      </div>
    </div>
  `
})
export class CreateBookingComponent implements OnInit {
  ngOnInit(): void { }
}