import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="px-8 py-24 text-center animate-fade-in max-w-2xl mx-auto">
      <div class="w-24 h-24 rounded-[2rem] bg-secondary dark:bg-white/5 flex items-center justify-center mx-auto mb-10 border border-black/5 dark:border-white/10 shadow-xl">
        <i class="fa-solid fa-calendar-check text-4xl text-primary"></i>
      </div>
      <h2 class="text-3xl font-black text-foreground mb-4 uppercase tracking-tighter">{{ 'marketplace.bookingLog' | translate }}</h2>
      <p class="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] leading-relaxed mb-12 opacity-70">
        {{ 'marketplace.trackManage' | translate }}
      </p>
      
      <div class="p-8 border-2 border-dashed border-black/5 dark:border-white/5 rounded-3xl">
        <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic">
          {{ 'marketplace.noTransmissions' | translate }}
        </p>
      </div>
    </div>
  `
})
export class BookingListComponent implements OnInit {
  ngOnInit(): void { }
}