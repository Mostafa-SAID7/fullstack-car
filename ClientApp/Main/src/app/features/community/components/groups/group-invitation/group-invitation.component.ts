import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Group } from '../../../../../core/models/group.model';
import { CultureDatePipe } from '../../../../../shared/pipes/culture-date.pipe';
import { DateFormattingService } from '../../../../../shared/services/date-formatting.service';

export interface GroupInvitation {
  id: string;
  groupId: string;
  groupName: string;
  inviterName: string;
  invitedAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

@Component({
  selector: 'app-group-invitation',
  standalone: true,
  imports: [CommonModule, TranslateModule, CultureDatePipe],
  template: `
    <div class="fb-card p-6 space-y-4">
      <!-- Invitation Header -->
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <i class="fas fa-users text-primary text-lg"></i>
        </div>
        <div class="flex-1">
          <h3 class="font-black text-lg text-foreground">{{ 'invitations.title' | translate }}</h3>
          <p class="text-sm text-muted-foreground">{{ getInvitationMessage() }}</p>
        </div>
      </div>

      <!-- Group Information -->
      <div class="bg-secondary/10 rounded-2xl p-4">
        <h4 class="font-bold text-foreground mb-2">{{ invitation.groupName }}</h4>
        <div class="flex items-center text-sm text-muted-foreground space-x-4">
          <span>
            <i class="fas fa-user text-xs mr-1"></i>
            {{ invitation.inviterName }}
          </span>
          <span>
            <i class="fas fa-clock text-xs mr-1"></i>
            {{ invitation.invitedAt | cultureDate:'medium' }}
          </span>
        </div>
      </div>

      <!-- Status Display -->
      <div *ngIf="invitation.status !== 'pending'" class="text-center py-4">
        <div [ngClass]="getStatusClass()" class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold">
          <i [class]="getStatusIcon()" class="mr-2"></i>
          {{ getStatusText() }}
        </div>
      </div>

      <!-- Action Buttons (only for pending invitations) -->
      <div *ngIf="invitation.status === 'pending' && !isExpired()" class="flex space-x-3">
        <button 
          (click)="acceptInvitation()"
          class="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20">
          <i class="fas fa-check mr-2"></i>
          {{ 'invitations.accept' | translate }}
        </button>
        <button 
          (click)="declineInvitation()"
          class="flex-1 bg-secondary text-foreground px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-secondary/80 transition-all duration-300">
          <i class="fas fa-times mr-2"></i>
          {{ 'invitations.decline' | translate }}
        </button>
      </div>

      <!-- Expired Message -->
      <div *ngIf="isExpired()" class="text-center py-4">
        <p class="text-muted-foreground text-sm">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          {{ 'invitations.expired' | translate }}
        </p>
      </div>
    </div>
  `
})
export class GroupInvitationComponent {
  @Input() invitation!: GroupInvitation;
  @Output() accept = new EventEmitter<string>();
  @Output() decline = new EventEmitter<string>();

  constructor(
    private translateService: TranslateService,
    private dateFormattingService: DateFormattingService
  ) {}

  /**
   * Get localized invitation message with group name interpolation
   */
  getInvitationMessage(): string {
    return this.translateService.instant('invitations.message', { 
      groupName: this.invitation.groupName 
    });
  }

  /**
   * Accept the group invitation
   */
  acceptInvitation(): void {
    this.accept.emit(this.invitation.id);
  }

  /**
   * Decline the group invitation
   */
  declineInvitation(): void {
    this.decline.emit(this.invitation.id);
  }

  /**
   * Check if the invitation has expired
   */
  isExpired(): boolean {
    return new Date() > this.invitation.expiresAt || this.invitation.status === 'expired';
  }

  /**
   * Get formatted date based on current locale (kept for backward compatibility)
   * @deprecated Use cultureDate pipe instead
   */
  getFormattedDate(date: Date): string {
    return this.dateFormattingService.formatDate(date, { format: 'medium' });
  }

  /**
   * Get CSS classes for status display
   */
  getStatusClass(): string {
    const baseClasses = 'inline-flex items-center px-4 py-2 rounded-full text-sm font-bold';
    
    switch (this.invitation.status) {
      case 'accepted':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
      case 'declined':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
      case 'expired':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400`;
    }
  }

  /**
   * Get icon for status display
   */
  getStatusIcon(): string {
    switch (this.invitation.status) {
      case 'accepted':
        return 'fas fa-check-circle';
      case 'declined':
        return 'fas fa-times-circle';
      case 'expired':
        return 'fas fa-clock';
      default:
        return 'fas fa-hourglass-half';
    }
  }

  /**
   * Get localized status text
   */
  getStatusText(): string {
    switch (this.invitation.status) {
      case 'accepted':
        return this.translateService.instant('invitations.accept');
      case 'declined':
        return this.translateService.instant('invitations.decline');
      case 'expired':
        return this.translateService.instant('invitations.expired');
      default:
        return this.translateService.instant('invitations.title');
    }
  }
}