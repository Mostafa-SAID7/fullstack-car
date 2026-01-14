import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Location, LocationType } from '../../../../../core/models/maps.model';

@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="card mica-effect bg-surface/30 p-4 border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-xl group">
      <div class="flex gap-4">
        <div class="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0">
          <img [src]="location.featuredImageUrl || 'assets/images/location-placeholder.jpg'" 
               class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between">
            <span class="text-[9px] font-black uppercase tracking-widest text-primary mb-1">{{ getLocationTypeName(location.type) | translate }}</span>
            <div *ngIf="location.isVerified" class="text-sky-500 text-xs">
              <i class="fa-solid fa-circle-check"></i>
            </div>
          </div>

          <h3 class="font-bold text-foreground text-base truncate group-hover:text-primary transition-colors">{{ location.name }}</h3>
          <p class="text-xs text-muted-foreground line-clamp-1 mb-2">{{ location.address }}</p>

          <div class="flex items-center space-x-3 mt-auto">
            <div class="flex items-center space-x-1">
              <i class="fa-solid fa-star text-yellow-500 text-[10px]"></i>
              <span class="text-xs font-black text-foreground">{{ location.rating }}</span>
            </div>
            <span class="text-[10px] text-muted-foreground/60 font-bold uppercase">{{ location.reviewCount }} {{ 'locations.details.reviews' | translate }}</span>
          </div>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-white/5 flex gap-2">
        <button (click)="onCheckIn.emit(location)" class="flex-1 bg-white/5 hover:bg-primary/20 text-foreground text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl border border-white/5 transition-all">
          <i class="fa-solid fa-location-dot mr-1.5"></i> {{ 'checkin.checkInHere' | translate }}
        </button>
        <button class="px-3 bg-white/5 hover:bg-white/10 text-foreground py-2.5 rounded-xl border border-white/5 transition-all">
          <i class="fa-solid fa-share-nodes text-[10px]"></i>
        </button>
      </div>
    </div>
  `
})
export class LocationCardComponent {
  @Input({ required: true }) location!: Location;
  @Output() onCheckIn = new EventEmitter<Location>();

  constructor(private translate: TranslateService) {}

  getLocationTypeName(type: number): string {
    switch (type) {
      case LocationType.Showroom: return 'locations.categories.showroom';
      case LocationType.ServiceCenter: return 'locations.categories.serviceCenter';
      case LocationType.SpareParts: return 'locations.categories.spareParts';
      case LocationType.ChargingStation: return 'locations.categories.chargingStation';
      case LocationType.GasStation: return 'locations.categories.gasStation';
      default: return 'locations.categories.other';
    }
  }
}
