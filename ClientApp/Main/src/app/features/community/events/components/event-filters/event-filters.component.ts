import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { EventCategoryDto } from '../../models/event-api.types';

@Component({
  selector: 'app-event-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule
  ],
  template: `
    <div class="event-filters bg-gray-50 rounded-lg p-6">
      <form [formGroup]="filtersForm" (ngSubmit)="applyFilters()">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Category Filter -->
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              <mat-option value="">All Categories</mat-option>
              <mat-option *ngFor="let category of categories" [value]="category.name">
                {{ category.name }}
                <span *ngIf="category.eventCount" class="text-gray-500 ml-2">({{ category.eventCount }})</span>
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Event Type Filter -->
          <mat-form-field appearance="outline">
            <mat-label>Event Type</mat-label>
            <mat-select formControlName="eventType">
              <mat-option value="">All Types</mat-option>
              <mat-option *ngFor="let type of eventTypes" [value]="type.value">
                {{ type.label }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Location Filter -->
          <mat-form-field appearance="outline">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" placeholder="City, venue, or address">
            <mat-icon matSuffix>location_on</mat-icon>
          </mat-form-field>

          <!-- Price Range -->
          <mat-form-field appearance="outline">
            <mat-label>Price Range</mat-label>
            <mat-select formControlName="priceRange">
              <mat-option value="">Any Price</mat-option>
              <mat-option value="free">Free Events</mat-option>
              <mat-option value="0-25">$0 - $25</mat-option>
              <mat-option value="25-50">$25 - $50</mat-option>
              <mat-option value="50-100">$50 - $100</mat-option>
              <mat-option value="100+">$100+</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Date Range -->
        <mat-expansion-panel class="mt-4">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon class="mr-2">date_range</mat-icon>
              Date Range
            </mat-panel-title>
          </mat-expansion-panel-header>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <mat-form-field appearance="outline">
              <mat-label>From Date</mat-label>
              <input matInput [matDatepicker]="fromPicker" formControlName="fromDate">
              <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
              <mat-datepicker #fromPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>To Date</mat-label>
              <input matInput [matDatepicker]="toPicker" formControlName="toDate">
              <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
              <mat-datepicker #toPicker></mat-datepicker>
            </mat-form-field>
          </div>
        </mat-expansion-panel>

        <!-- Additional Options -->
        <mat-expansion-panel class="mt-2">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon class="mr-2">tune</mat-icon>
              Additional Options
            </mat-panel-title>
          </mat-expansion-panel-header>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <mat-checkbox formControlName="isOnline">
              <mat-icon class="mr-2">computer</mat-icon>
              Online Events Only
            </mat-checkbox>

            <mat-checkbox formControlName="isFree">
              <mat-icon class="mr-2">money_off</mat-icon>
              Free Events Only
            </mat-checkbox>

            <mat-checkbox formControlName="hasAvailableSpots">
              <mat-icon class="mr-2">event_available</mat-icon>
              Available Spots
            </mat-checkbox>
          </div>
        </mat-expansion-panel>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center mt-6">
          <button 
            type="button" 
            mat-stroked-button 
            (click)="clearFilters()"
            color="warn">
            <mat-icon>clear</mat-icon>
            Clear All
          </button>

          <div class="flex gap-2">
            <button 
              type="button" 
              mat-button 
              (click)="resetToDefaults()">
              Reset
            </button>
            <button 
              type="submit" 
              mat-raised-button 
              color="primary">
              <mat-icon>search</mat-icon>
              Apply Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .event-filters {
      border: 1px solid #e5e7eb;
    }

    ::ng-deep .mat-expansion-panel {
      box-shadow: none !important;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    ::ng-deep .mat-expansion-panel-header {
      padding: 16px;
    }

    ::ng-deep .mat-expansion-panel-body {
      padding: 0 16px 16px 16px;
    }
  `]
})
export class EventFiltersComponent implements OnInit {
  @Input() categories: EventCategoryDto[] = [];
  @Output() filtersChange = new EventEmitter<any>();

  filtersForm!: FormGroup;

  eventTypes = [
    { value: 'conference', label: 'Conference' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'meetup', label: 'Meetup' },
    { value: 'networking', label: 'Networking' },
    { value: 'training', label: 'Training' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'social', label: 'Social Event' },
    { value: 'competition', label: 'Competition' },
    { value: 'exhibition', label: 'Exhibition' }
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Subscribe to form changes
    this.filtersForm.valueChanges.subscribe(() => {
      // Emit changes with a small delay to avoid too many API calls
      setTimeout(() => this.emitFilters(), 300);
    });
  }

  private initializeForm(): void {
    this.filtersForm = this.fb.group({
      category: [''],
      eventType: [''],
      location: [''],
      priceRange: [''],
      fromDate: [null],
      toDate: [null],
      isOnline: [false],
      isFree: [false],
      hasAvailableSpots: [false]
    });
  }

  applyFilters(): void {
    this.emitFilters();
  }

  clearFilters(): void {
    this.filtersForm.reset({
      category: '',
      eventType: '',
      location: '',
      priceRange: '',
      fromDate: null,
      toDate: null,
      isOnline: false,
      isFree: false,
      hasAvailableSpots: false
    });
    this.emitFilters();
  }

  resetToDefaults(): void {
    this.clearFilters();
  }

  private emitFilters(): void {
    const formValue = this.filtersForm.value;
    const filters: any = {};

    // Only include non-empty values
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value !== null && value !== undefined && value !== '' && value !== false) {
        if (key === 'fromDate' || key === 'toDate') {
          filters[key] = value instanceof Date ? value.toISOString() : value;
        } else if (key === 'priceRange') {
          this.handlePriceRange(value, filters);
        } else {
          filters[key] = value;
        }
      }
    });

    this.filtersChange.emit(filters);
  }

  private handlePriceRange(priceRange: string, filters: any): void {
    switch (priceRange) {
      case 'free':
        filters.isFree = true;
        break;
      case '0-25':
        filters.minPrice = 0;
        filters.maxPrice = 25;
        break;
      case '25-50':
        filters.minPrice = 25;
        filters.maxPrice = 50;
        break;
      case '50-100':
        filters.minPrice = 50;
        filters.maxPrice = 100;
        break;
      case '100+':
        filters.minPrice = 100;
        break;
    }
  }
}