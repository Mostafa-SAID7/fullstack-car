import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MapsService } from '../../services/maps.service';
import { Location, LocationType } from '../../components/location-card/location-card.component';
import { LocationCardComponent } from '../../components/location-card/location-card.component';
import { PaginationComponent } from '@shared/components/ui/pagination/pagination.component';

@Component({
  selector: 'app-maps-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, LocationCardComponent, PaginationComponent],
  template: `
    <div class="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-6">
      
      <!-- Card 1: Search & Filters -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <form [formGroup]="searchForm" class="flex flex-col md:flex-row gap-4 mb-0">
          <!-- Search Input -->
          <div class="relative flex-grow group">
            <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300"></i>
            <input formControlName="searchTerm" type="text" [placeholder]="'search.placeholder' | translate"
              class="w-full bg-secondary/30 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-full pl-12 pr-6 py-4 outline-none transition-all text-foreground font-bold">
          </div>

          <!-- Filter Actions -->
          <div class="flex gap-2">
            <button type="button" (click)="toggleFilters()"
              [ngClass]="showFilters ? 'bg-primary text-white' : 'bg-secondary dark:bg-white/5'"
              class="px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-sliders-h"></i>
              <span>{{ 'search.filterBy' | translate }}</span>
            </button>

            <button type="button"
              class="px-8 py-4 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-plus"></i>
              <span>{{ 'maps.addLocation' | translate }}</span>
            </button>
          </div>
        </form>

        <!-- Collapsible Filters -->
        <div *ngIf="showFilters" class="pt-6 animate-fade-in">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex flex-col">
              <label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-4 opacity-70">{{ 'search.filterBy' | translate }}</label>
              <div class="relative">
                <i class="fas fa-map-pin absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <select formControlName="type"
                  class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                  <option [ngValue]="undefined">{{ 'locations.categories.all' | translate }}</option>
                  <option *ngFor="let type of locationTypes" [ngValue]="type.value">{{ type.translationKey | translate }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Content Grid -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5 min-h-[500px]">
        <!-- Loading -->
        <div *ngIf="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div *ngFor="let i of [1,2,3,4]" class="h-40 bg-secondary/30 dark:bg-white/5 rounded-3xl animate-pulse"></div>
        </div>

        <!-- List -->
        <div *ngIf="!loading && locations.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-location-card *ngFor="let loc of locations" [location]="loc" (onCheckIn)="handleCheckIn($event)"></app-location-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && locations.length === 0" class="py-24 text-center">
          <div class="w-20 h-20 bg-secondary/30 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <i class="fas fa-map-location-dot text-3xl text-muted-foreground/30"></i>
          </div>
          <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-2">{{ 'search.noResults' | translate }}</h3>
          <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest">{{ 'search.tryAdjustingFilters' | translate }}</p>
        </div>
      </div>

      <!-- Card 3: Pagination -->
      <div *ngIf="totalPages > 1" class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <app-pagination [currentPage]="currentPage" [totalPages]="totalPages" [pageSize]="pageSize"
          [totalItems]="totalCount" (pageChange)="onPageChange($event)"></app-pagination>
      </div>

    </div>
  `
})
export class MapsExplorerComponent implements OnInit {
  locations: Location[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  showFilters = false;
  searchForm: FormGroup;

  locationTypes = [
    { name: 'Showroom', value: LocationType.Dealership, translationKey: 'locations.categories.showroom' },
    { name: 'Service Center', value: LocationType.ServiceCenter, translationKey: 'locations.categories.serviceCenter' },
    { name: 'Spare Parts', value: LocationType.AutoParts, translationKey: 'locations.categories.spareParts' },
    { name: 'Charging Station', value: LocationType.ChargingStation, translationKey: 'locations.categories.chargingStation' },
    { name: 'Gas Station', value: LocationType.GasStation, translationKey: 'locations.categories.gasStation' },
    { name: 'Other', value: LocationType.Other, translationKey: 'locations.categories.other' }
  ];

  constructor(private mapsService: MapsService, private fb: FormBuilder, private translate: TranslateService) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      type: [undefined]
    });
  }

  ngOnInit(): void {
    this.loadLocations();
    this.setupFilters();
  }

  private setupFilters(): void {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.onSearch());

    this.searchForm.get('type')?.valueChanges.subscribe(() => this.onSearch());
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading = true;
    const type = this.searchForm.get('type')?.value;

    this.mapsService.getLocations(type, this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        if (result) {
          this.locations = result.items || [];
          this.totalCount = result.totalCount || 0;
          this.totalPages = result.totalPages || 0;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading locations', err);
        this.loading = false;
      }
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLocations();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleCheckIn(location: Location): void {
    // Show localized success message
    const successMessage = this.translate.instant('checkin.checkInSuccess', [location.name]);
    console.log(successMessage);

    // Future: Implement actual check-in logic with localized error handling
    this.mapsService.checkIn(location.id).subscribe({
      next: (result) => {
        // Show success notification in current language
        console.log(this.translate.instant('checkin.checkInSuccess', [location.name]));
      },
      error: (err) => {
        // Show error message in current language
        console.error(this.translate.instant('checkin.checkInError'));
      }
    });
  }
}
