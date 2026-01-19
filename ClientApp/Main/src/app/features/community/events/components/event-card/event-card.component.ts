import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

import { EventSummaryDto } from '../../models/event-api.types';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule
  ],
  template: `
    <mat-card class="event-card h-full cursor-pointer hover:shadow-lg transition-shadow" (click)="onEventClick()">
      <!-- Event Image -->
      <div class="relative">
        <img 
          mat-card-image 
          [src]="event.imageUrl || '/assets/images/default-event.jpg'" 
          [alt]="event.title"
          class="h-48 object-cover">
        
        <!-- Featured Badge -->
        <div *ngIf="event.isFeatured" class="absolute top-2 left-2">
          <mat-chip class="bg-yellow-500 text-black font-bold">
            <mat-icon matChipAvatar>star</mat-icon>
            Featured
          </mat-chip>
        </div>

        <!-- Price Badge -->
        <div class="absolute top-2 right-2">
          <mat-chip [class]="event.isFree ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'">
            {{ event.isFree ? 'FREE' : (event.price ? '$' + event.price : 'PAID') }}
          </mat-chip>
        </div>

        <!-- Online Badge -->
        <div *ngIf="event.isOnline" class="absolute bottom-2 left-2">
          <mat-chip class="bg-purple-500 text-white">
            <mat-icon matChipAvatar>computer</mat-icon>
            Online
          </mat-chip>
        </div>
      </div>

      <mat-card-content class="p-4">
        <!-- Category -->
        <div class="mb-2">
          <mat-chip [class]="getCategoryClass(event.category)" class="text-xs">
            {{ event.category }}
          </mat-chip>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {{ event.title }}
        </h3>

        <!-- Description -->
        <p *ngIf="event.shortDescription" class="text-sm text-gray-600 mb-3 line-clamp-2">
          {{ event.shortDescription }}
        </p>

        <!-- Date and Time -->
        <div class="flex items-center text-sm text-gray-700 mb-2">
          <mat-icon class="text-base mr-2">schedule</mat-icon>
          <span>{{ formatEventDate() }}</span>
        </div>

        <!-- Location -->
        <div *ngIf="!event.isOnline && event.location" class="flex items-center text-sm text-gray-700 mb-3">
          <mat-icon class="text-base mr-2">location_on</mat-icon>
          <span class="line-clamp-1">{{ event.location }}</span>
        </div>

        <!-- Organizer -->
        <div class="flex items-center text-sm text-gray-600 mb-3">
          <img 
            [src]="event.organizer.avatarUrl || '/assets/images/default-avatar.png'" 
            [alt]="event.organizer.name"
            class="w-6 h-6 rounded-full mr-2">
          <span>by {{ event.organizer.name }}</span>
        </div>

        <!-- Attendance Info -->
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm text-gray-600">
            <mat-icon class="text-base mr-1">people</mat-icon>
            <span>{{ event.attendeeCount }} attending</span>
            <span *ngIf="event.maxAttendees" class="ml-1">/ {{ event.maxAttendees }}</span>
          </div>

          <!-- Availability Status -->
          <div *ngIf="event.maxAttendees" class="text-xs">
            <mat-chip 
              [class]="getAvailabilityClass()"
              class="text-xs">
              {{ getAvailabilityText() }}
            </mat-chip>
          </div>
        </div>
      </mat-card-content>

      <mat-card-actions class="p-4 pt-0">
        <button mat-button color="primary" class="w-full">
          <mat-icon>visibility</mat-icon>
          View Details
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .event-card {
      transition: all 0.3s ease;
    }
    
    .event-card:hover {
      transform: translateY(-2px);
    }

    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class EventCardComponent {
  @Input() event!: EventSummaryDto;
  @Output() eventClick = new EventEmitter<EventSummaryDto>();

  onEventClick(): void {
    this.eventClick.emit(this.event);
  }

  formatEventDate(): string {
    const startDate = new Date(this.event.startDate);
    const endDate = new Date(this.event.endDate);
    const now = new Date();
    
    // Check if it's today
    const isToday = startDate.toDateString() === now.toDateString();
    if (isToday) {
      return `Today at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Check if it's tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = startDate.toDateString() === tomorrow.toDateString();
    if (isTomorrow) {
      return `Tomorrow at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Check if it's this week
    const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil > 0 && daysUntil <= 7) {
      const dayName = startDate.toLocaleDateString([], { weekday: 'long' });
      return `${dayName} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Default format
    if (startDate.toDateString() === endDate.toDateString()) {
      return `${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
  }

  getCategoryClass(category: string): string {
    const categoryClasses: { [key: string]: string } = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Business': 'bg-green-100 text-green-800',
      'Education': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Sports': 'bg-orange-100 text-orange-800',
      'Health': 'bg-red-100 text-red-800',
      'Community': 'bg-indigo-100 text-indigo-800'
    };
    return categoryClasses[category] || 'bg-gray-100 text-gray-800';
  }

  getAvailabilityClass(): string {
    if (!this.event.maxAttendees) return '';
    
    const percentage = (this.event.attendeeCount / this.event.maxAttendees) * 100;
    
    if (percentage >= 100) return 'bg-red-100 text-red-800';
    if (percentage >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }

  getAvailabilityText(): string {
    if (!this.event.maxAttendees) return '';
    
    const remaining = this.event.maxAttendees - this.event.attendeeCount;
    
    if (remaining <= 0) return 'Full';
    if (remaining <= 5) return `${remaining} spots left`;
    return 'Available';
  }
}