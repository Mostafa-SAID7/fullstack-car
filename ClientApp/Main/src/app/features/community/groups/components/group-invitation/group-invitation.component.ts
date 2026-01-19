import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Group } from '../../models/group.model';

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
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <!-- Invitation Header -->
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <i class="fas fa-users text-primary text-lg"></i>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Group Invitation</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ getInvitationMessage() }}</p>
        </div>
      </div>

      <!-- Group Information -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ invitation.groupName }}</h4>
        <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
          <span>
            <i class="fas fa-user text-xs mr-1"></i>
            {{ invitation.inviterName }}
          </span>
          <span>
            <i class="fas fa-clock text-xs mr-1"></i>
            {{ formatDate(invitation.invitedAt) }}
          </span>
        </div>
      </div>

      <!-- Status Display -->
      <div *ngIf="invitation.status !== 'pending'" class="text-center py-4">
        <div [ngClass]="getStatusClass()" class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
          <i [class]="getStatusIcon()" class="mr-2"></i>
          {{ getStatusText() }}
        </div>
      </div>

      <!-- Action Buttons (only for pending invitations) -->
      <div *ngIf="invitation.status === 'pending' && !isExpired()" class="flex space-x-3">
        <button 
          (click)="acceptInvitation()"
          class="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
          <i class="fas fa-check mr-2"></i>
          Accept
        </button>
        <button 
          (click)="declineInvitation()"
          class="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <i class="fas fa-times mr-2"></i>
          Decline
        </button>
      </div>

      <!-- Expired Message -->
      <div *ngIf="isExpired()" class="text-center py-4">
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          This invitation has expired
        </p>
      </div>
    </div>
  `
})
export class GroupInvitationComponent {
  @Input() invitation!: GroupInvitation;
  @Output() accept = new EventEmitter<string>();
  @Output() decline = new EventEmitter<string>();

  constructor(private translateService: TranslateService) {}

  getInvitationMessage(): string {
    return `You've been invited to join ${this.invitation.groupName}`;
  }

  acceptInvitation(): void {
    this.accept.emit(this.invitation.id);
  }

  declineInvitation(): void {
    this.decline.emit(this.invitation.id);
  }

  isExpired(): boolean {
    return new Date() > this.invitation.expiresAt || this.invitation.status === 'expired';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  getStatusClass(): string {
    switch (this.invitation.status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  }

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

  getStatusText(): string {
    switch (this.invitation.status) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'expired':
        return 'Expired';
      default:
        return 'Pending';
    }
  }
}