import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { CarService } from '../../models/marketplace.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in" *ngIf="service">
      <div class="mb-10">
        <button (click)="goBack()" class="group flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all active:scale-95">
          <i class="fas fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i> 
          Back to Explorations
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="space-y-8">
          <div class="fb-card overflow-hidden group/img aspect-[4/3]">
            <img [src]="service.imageUrl || '/assets/images/default-service.jpg'" [alt]="service.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105">
          </div>
          
          <div class="fb-card p-8">
            <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-60 mb-6">Service Overview</h2>
            <div class="grid grid-cols-2 gap-6">
              <div class="p-4 bg-secondary/50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Time Estimate</p>
                <div class="flex items-center gap-2">
                  <i class="fas fa-clock text-primary"></i>
                  <span class="text-sm font-black text-foreground">{{ formatDuration(service.duration) }}</span>
                </div>
              </div>
              <div class="p-4 bg-secondary/50 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Popularity</p>
                <div class="flex items-center gap-2">
                  <i class="fas fa-fire text-orange-500"></i>
                  <span class="text-sm font-black text-foreground">{{ service.totalBookings }} Bookings</span>
                </div>
              </div>
            </div>

            <div class="mt-8 space-y-4">
               <div class="flex items-center gap-3 p-4 bg-emerald-500/5 text-emerald-600 rounded-2xl border border-emerald-500/10" *ngIf="service.isAvailable24x7">
                  <i class="fas fa-check-circle"></i>
                  <span class="text-[10px] font-black uppercase tracking-widest">Available 24x7 for transmission</span>
               </div>
               <div class="flex items-center gap-3 p-4 bg-red-500/5 text-red-600 rounded-2xl border border-red-500/10" *ngIf="service.isEmergencyService">
                  <i class="fas fa-bolt"></i>
                  <span class="text-[10px] font-black uppercase tracking-widest">Priority Emergency Protocol</span>
               </div>
            </div>
          </div>
        </div>
        
        <div class="space-y-8">
           <div class="fb-card p-10">
              <div class="flex justify-between items-start mb-6">
                <h1 class="text-4xl font-black text-foreground tracking-tighter uppercase">{{ service.name }}</h1>
                <div class="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                  <i class="fas fa-star text-primary text-xs"></i>
                  <span class="text-xs font-black text-primary">{{ service.rating.toFixed(1) }}</span>
                </div>
              </div>

              <div class="description text-muted-foreground text-sm leading-relaxed mb-10 prose dark:prose-invert">
                {{ service.description }}
              </div>

              <div class="pt-8 border-t border-black/5 dark:border-white/5 mb-10">
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-black text-emerald-600 tracking-tighter">{{ formatPrice(service.basePrice) }}</span>
                  <span class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Standard Base</span>
                </div>
              </div>

              <button (click)="bookService()" 
                class="w-full py-5 bg-primary text-white rounded-[1.25rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <i class="fas fa-calendar-plus text-sm"></i>
                Initiate Booking
              </button>
           </div>

           <div class="fb-card p-8 bg-secondary/30 dark:bg-white/5 border-dashed">
              <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Transmission Security</h3>
              <p class="text-[11px] leading-relaxed text-muted-foreground/60 italic">
                All services are performed by verified transmission specialists within our orbital network. Booking implies agreement to standard protocols.
              </p>
           </div>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="flex flex-col items-center justify-center py-32 animate-pulse">
      <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing Details...</p>
    </div>

    <div *ngIf="error" class="fb-card p-12 text-center max-w-md mx-auto mt-20">
      <div class="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <i class="fas fa-triangle-exclamation text-2xl"></i>
      </div>
      <p class="text-sm font-black text-foreground uppercase tracking-widest mb-6">{{ error }}</p>
      <button (click)="loadService()" class="px-8 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Retry Transmission</button>
    </div>
  `
})
export class ServiceDetailComponent implements OnInit {
  service: CarService | null = null;
  loading = false;
  error: string | null = null;
  serviceId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marketplaceService: MarketplaceService
  ) { }

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (this.serviceId) {
      this.loadService();
    }
  }

  loadService(): void {
    if (!this.serviceId) return;

    this.loading = true;
    this.error = null;

    this.marketplaceService.getService(this.serviceId).subscribe({
      next: (response) => {
        if (response.success) {
          this.service = response.data;
        } else {
          this.error = 'Service not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading service:', error);
        this.error = 'Failed to load service';
        this.loading = false;
      }
    });
  }

  bookService(): void {
    if (this.service) {
      this.router.navigate(['/marketplace/bookings/create'], {
        queryParams: { serviceId: this.service.id }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/marketplace/services']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  }
}