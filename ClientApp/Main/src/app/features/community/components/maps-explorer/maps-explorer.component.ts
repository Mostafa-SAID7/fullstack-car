import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsService } from '../../services/maps.service';
import { Location } from '../../../../core/models/maps.model';
import { LocationCardComponent } from '../location-card/location-card.component';

@Component({
    selector: 'app-maps-explorer',
    standalone: true,
    imports: [CommonModule, LocationCardComponent],
    template: `
    <div class="space-y-8 animate-fade-in">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 class="text-3xl font-black text-foreground tracking-tight uppercase italic">
            Automotive <span class="text-primary">Near You</span>
          </h2>
          <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-1">
            Discover service centers, showrooms, and more
          </p>
        </div>
        
        <div class="flex mica-effect border border-white/10 rounded-2xl overflow-hidden">
          <button class="px-6 py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest italic">Grid View</button>
          <button class="px-6 py-3 text-muted-foreground font-black text-[10px] uppercase tracking-widest italic hover:bg-white/5 transition-all">Map View</button>
        </div>
      </div>

      <div class="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button class="shrink-0 px-5 py-2.5 rounded-2xl bg-white/10 text-foreground text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all hover:bg-primary hover:text-white">All</button>
        <button class="shrink-0 px-5 py-2.5 rounded-2xl bg-white/5 text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all hover:bg-white/10">Showrooms</button>
        <button class="shrink-0 px-5 py-2.5 rounded-2xl bg-white/5 text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all hover:bg-white/10">Service Centers</button>
        <button class="shrink-0 px-5 py-2.5 rounded-2xl bg-white/5 text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all hover:bg-white/10">Charging</button>
      </div>

      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div *ngFor="let i of [1,2,3,4]" class="h-40 rounded-3xl bg-surface/20 mica-effect animate-pulse"></div>
      </div>

      <div *ngIf="!loading && locations.length === 0" class="flex flex-col items-center justify-center py-20 mica-effect rounded-3xl border border-white/5 bg-surface/10">
        <i class="fa-solid fa-map-location-dot text-6xl text-muted-foreground/20 mb-4"></i>
        <h3 class="text-xl font-black text-muted-foreground uppercase italic tracking-widest">No locations nearby</h3>
      </div>

      <div *ngIf="!loading && locations.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-location-card *ngFor="let loc of locations" [location]="loc" (onCheckIn)="handleCheckIn($event)"></app-location-card>
      </div>
    </div>
  `
})
export class MapsExplorerComponent implements OnInit {
    locations: Location[] = [];
    loading = true;

    constructor(private mapsService: MapsService) { }

    ngOnInit(): void {
        this.loadLocations();
    }

    loadLocations(): void {
        this.loading = true;
        this.mapsService.getLocations().subscribe({
            next: (result) => {
                this.locations = result.items;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    handleCheckIn(location: Location): void {
        // Implement check-in logic here
        console.log('Checking into', location.name);
    }
}
