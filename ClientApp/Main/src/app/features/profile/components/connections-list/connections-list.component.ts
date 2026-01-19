import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocialConnection, FollowRequest } from '../../models/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile.service';
import { PaginatedResult } from '../../../../core/models/result.model';

@Component({
  selector: 'app-connections-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
         (click)="onBackdropClick($event)">
      <div class="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
           (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 class="text-2xl font-bold">{{ getTitle() }}</h2>
            <p class="text-sm text-muted-foreground mt-1">{{ getTotalCount() }} {{ connectionType }}</p>
          </div>
          <button 
            (click)="onClose()"
            class="w-10 h-10 rounded-full hover:bg-accent flex items-center justify-center transition-colors">
            <i class="fas fa-times text-muted-foreground"></i>
          </button>
        </div>
        
        <!-- Search and Filter -->
        <div class="p-6 border-b border-border">
          <div class="relative">
            <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()"
              placeholder="Search connections..."
              class="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
          </div>
          
          <!-- Filter Tabs (for friends view) -->
          <div *ngIf="connectionType === 'friends'" class="flex gap-2 mt-4">
            <button
              *ngFor="let filter of friendFilters"
              (click)="setActiveFilter(filter.value)"
              [class]="getFilterButtonClasses(filter.value)"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              {{ filter.label }}
            </button>
          </div>
        </div>
        
        <!-- Connections List -->
        <div class="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div *ngIf="isLoading()" class="p-6">
            <div class="space-y-4">
              <div *ngFor="let i of [1,2,3,4,5]" class="flex items-center gap-4 p-4 animate-pulse">
                <div class="w-12 h-12 bg-secondary rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-secondary rounded w-32 mb-2"></div>
                  <div class="h-3 bg-secondary rounded w-24"></div>
                </div>
                <div class="w-20 h-8 bg-secondary rounded"></div>
              </div>
            </div>
          </div>
          
          <div *ngIf="!isLoading() && filteredConnections().length === 0" class="p-12 text-center">
            <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-users text-muted-foreground text-xl"></i>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ getEmptyStateTitle() }}</h3>
            <p class="text-muted-foreground">{{ getEmptyStateMessage() }}</p>
          </div>
          
          <div *ngIf="!isLoading() && filteredConnections().length > 0" class="divide-y divide-border">
            <div 
              *ngFor="let connection of filteredConnections(); trackBy: trackByConnection"
              class="p-4 hover:bg-accent/50 transition-colors">
              <div class="flex items-center gap-4">
                <!-- Avatar -->
                <div class="relative">
                  <div class="w-12 h-12 rounded-xl bg-secondary overflow-hidden flex items-center justify-center">
                    <img 
                      *ngIf="connection.connectedUser.profileImageUrl" 
                      [src]="connection.connectedUser.profileImageUrl"
                      [alt]="connection.connectedUser.firstName + ' ' + connection.connectedUser.lastName"
                      class="w-full h-full object-cover">
                    <span 
                      *ngIf="!connection.connectedUser.profileImageUrl" 
                      class="text-primary font-bold">
                      {{ connection.connectedUser.firstName[0] }}{{ connection.connectedUser.lastName[0] }}
                    </span>
                  </div>
                  
                  <!-- Online Status -->
                  <div 
                    *ngIf="connection.connectedUser.isOnline"
                    class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background">
                  </div>
                  
                  <!-- Verification Badge -->
                  <div 
                    *ngIf="connection.connectedUser.isVerified"
                    class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-background flex items-center justify-center">
                    <i class="fas fa-check text-white text-[8px]"></i>
                  </div>
                </div>
                
                <!-- User Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h4 class="font-semibold truncate">
                      {{ connection.connectedUser.firstName }} {{ connection.connectedUser.lastName }}
                    </h4>
                    <span 
                      *ngIf="connection.connectedUser.isVerified"
                      class="inline-flex items-center px-1.5 py-0.5 bg-blue-500/10 text-blue-500 text-xs font-medium rounded">
                      <i class="fas fa-check-circle mr-1"></i>
                      Verified
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span *ngIf="connection.connectedUser.mutualConnectionsCount > 0">
                      {{ connection.connectedUser.mutualConnectionsCount }} mutual connections
                    </span>
                    <span *ngIf="connection.status === 'pending'" class="text-orange-500 font-medium">
                      Pending
                    </span>
                    <span *ngIf="connection.createdAt" class="hidden sm:inline">
                      Connected {{ formatDate(connection.createdAt) }}
                    </span>
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex items-center gap-2">
                  <!-- View Profile -->
                  <button
                    (click)="onViewProfile(connection.connectedUser.id)"
                    class="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                    View
                  </button>
                  
                  <!-- Connection-specific actions -->
                  <ng-container [ngSwitch]="connectionType">
                    <!-- Friend Actions -->
                    <ng-container *ngSwitchCase="'friends'">
                      <button
                        *ngIf="connection.status === 'accepted'"
                        (click)="onRemoveFriend(connection.connectedUser.id)"
                        class="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        Remove
                      </button>
                      
                      <button
                        *ngIf="connection.status === 'pending'"
                        (click)="onAcceptFriendRequest(connection.id)"
                        class="px-3 py-1.5 text-sm font-medium text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                        Accept
                      </button>
                      
                      <button
                        *ngIf="connection.status === 'pending'"
                        (click)="onDeclineFriendRequest(connection.id)"
                        class="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        Decline
                      </button>
                    </ng-container>
                    
                    <!-- Follower Actions -->
                    <ng-container *ngSwitchCase="'followers'">
                      <button
                        (click)="onFollowBack(connection.connectedUser.id)"
                        class="px-3 py-1.5 text-sm font-medium bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors">
                        Follow Back
                      </button>
                    </ng-container>
                    
                    <!-- Following Actions -->
                    <ng-container *ngSwitchCase="'following'">
                      <button
                        (click)="onUnfollow(connection.connectedUser.id)"
                        class="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        Unfollow
                      </button>
                    </ng-container>
                  </ng-container>
                  
                  <!-- More Actions Menu -->
                  <div class="relative">
                    <button
                      (click)="toggleConnectionMenu(connection.id)"
                      class="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center transition-colors">
                      <i class="fas fa-ellipsis-h text-muted-foreground"></i>
                    </button>
                    
                    <!-- Dropdown Menu -->
                    <div 
                      *ngIf="activeConnectionMenu() === connection.id"
                      class="absolute right-0 top-10 w-48 bg-card border border-border rounded-xl shadow-xl z-10 py-2">
                      <button
                        (click)="onSendMessage(connection.connectedUser.id)"
                        class="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-3">
                        <i class="fas fa-message text-muted-foreground"></i>
                        Send Message
                      </button>
                      
                      <button
                        (click)="onBlockUser(connection.connectedUser.id)"
                        class="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-3 text-red-500">
                        <i class="fas fa-ban text-red-500"></i>
                        Block User
                      </button>
                      
                      <button
                        (click)="onReportUser(connection.connectedUser.id)"
                        class="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-3 text-red-500">
                        <i class="fas fa-flag text-red-500"></i>
                        Report User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Load More Button -->
          <div *ngIf="hasMoreConnections() && !isLoading()" class="p-6 text-center">
            <button
              (click)="loadMoreConnections()"
              class="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConnectionsListComponent implements OnInit {
  @Input() connectionType: 'friends' | 'followers' | 'following' = 'friends';
  @Input() userId?: string; // If viewing another user's connections
  @Output() close = new EventEmitter<void>();
  @Output() viewProfile = new EventEmitter<string>();
  @Output() sendMessage = new EventEmitter<string>();
  @Output() blockUser = new EventEmitter<string>();
  @Output() reportUser = new EventEmitter<string>();
  
  private userProfileService = inject(UserProfileService);
  
  // State
  connections = signal<SocialConnection[]>([]);
  isLoading = signal<boolean>(false);
  searchQuery = signal<string>('');
  activeFilter = signal<string>('all');
  activeConnectionMenu = signal<string | null>(null);
  currentPage = signal<number>(1);
  totalCount = signal<number>(0);
  hasMore = signal<boolean>(true);
  
  // Filter options for friends
  friendFilters = [
    { label: 'All', value: 'all' },
    { label: 'Online', value: 'online' },
    { label: 'Recently Active', value: 'recent' },
    { label: 'Mutual Friends', value: 'mutual' }
  ];
  
  // Computed values
  filteredConnections = computed(() => {
    const connections = this.connections();
    const query = this.searchQuery().toLowerCase();
    const filter = this.activeFilter();
    
    let filtered = connections;
    
    // Apply search filter
    if (query) {
      filtered = filtered.filter(connection => {
        const fullName = `${connection.connectedUser.firstName} ${connection.connectedUser.lastName}`.toLowerCase();
        return fullName.includes(query);
      });
    }
    
    // Apply additional filters
    switch (filter) {
      case 'online':
        filtered = filtered.filter(connection => connection.connectedUser.isOnline);
        break;
      case 'recent':
        // Sort by most recent activity (this would need to be provided by the API)
        filtered = [...filtered].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'mutual':
        filtered = filtered.filter(connection => connection.connectedUser.mutualConnectionsCount > 0);
        break;
    }
    
    return filtered;
  });
  
  ngOnInit(): void {
    this.loadConnections();
  }
  
  private loadConnections(): void {
    this.isLoading.set(true);
    
    const loadMethod = this.userId 
      ? this.userProfileService.getUserConnections(this.userId, this.connectionType, this.currentPage(), 20)
      : this.userProfileService.getConnections(this.connectionType, this.currentPage(), 20);
    
    loadMethod.subscribe({
      next: (result) => {
        if (this.currentPage() === 1) {
          this.connections.set(result.items);
        } else {
          this.connections.update(current => [...current, ...result.items]);
        }
        this.totalCount.set(result.totalCount);
        this.hasMore.set(result.hasNextPage);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
  
  loadMoreConnections(): void {
    if (this.hasMore() && !this.isLoading()) {
      this.currentPage.update(page => page + 1);
      this.loadConnections();
    }
  }
  
  onSearchChange(): void {
    // Debounce search if needed
    // For now, filtering is done in computed property
  }
  
  setActiveFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
  
  toggleConnectionMenu(connectionId: string): void {
    const current = this.activeConnectionMenu();
    this.activeConnectionMenu.set(current === connectionId ? null : connectionId);
  }
  
  // Event handlers
  onClose(): void {
    this.close.emit();
  }
  
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
  
  onViewProfile(userId: string): void {
    this.viewProfile.emit(userId);
  }
  
  onSendMessage(userId: string): void {
    this.activeConnectionMenu.set(null);
    this.sendMessage.emit(userId);
  }
  
  onBlockUser(userId: string): void {
    this.activeConnectionMenu.set(null);
    this.blockUser.emit(userId);
  }
  
  onReportUser(userId: string): void {
    this.activeConnectionMenu.set(null);
    this.reportUser.emit(userId);
  }
  
  // Friend-specific actions
  onRemoveFriend(userId: string): void {
    if (confirm('Are you sure you want to remove this friend?')) {
      this.userProfileService.removeFriend(userId).subscribe({
        next: () => {
          this.connections.update(connections => 
            connections.filter(c => c.connectedUser.id !== userId)
          );
        }
      });
    }
  }
  
  onAcceptFriendRequest(connectionId: string): void {
    this.userProfileService.acceptFriendRequest(connectionId).subscribe({
      next: () => {
        this.connections.update(connections => 
          connections.map(c => 
            c.id === connectionId ? { ...c, status: 'accepted' as const } : c
          )
        );
      }
    });
  }
  
  onDeclineFriendRequest(connectionId: string): void {
    this.userProfileService.declineFriendRequest(connectionId).subscribe({
      next: () => {
        this.connections.update(connections => 
          connections.filter(c => c.id !== connectionId)
        );
      }
    });
  }
  
  // Follow-specific actions
  onFollowBack(userId: string): void {
    this.userProfileService.followUser(userId).subscribe({
      next: () => {
        // Update connection status or refresh list
        this.loadConnections();
      }
    });
  }
  
  onUnfollow(userId: string): void {
    if (confirm('Are you sure you want to unfollow this user?')) {
      this.userProfileService.unfollowUser(userId).subscribe({
        next: () => {
          this.connections.update(connections => 
            connections.filter(c => c.connectedUser.id !== userId)
          );
        }
      });
    }
  }
  
  // Helper methods
  getTitle(): string {
    switch (this.connectionType) {
      case 'friends':
        return 'Friends';
      case 'followers':
        return 'Followers';
      case 'following':
        return 'Following';
      default:
        return 'Connections';
    }
  }
  
  getTotalCount(): string {
    return this.totalCount().toLocaleString();
  }
  
  getEmptyStateTitle(): string {
    switch (this.connectionType) {
      case 'friends':
        return 'No friends yet';
      case 'followers':
        return 'No followers yet';
      case 'following':
        return 'Not following anyone';
      default:
        return 'No connections';
    }
  }
  
  getEmptyStateMessage(): string {
    if (this.searchQuery()) {
      return 'No connections match your search.';
    }
    
    switch (this.connectionType) {
      case 'friends':
        return 'Start connecting with other users to build your network.';
      case 'followers':
        return 'Share interesting content to attract followers.';
      case 'following':
        return 'Discover and follow users you\'re interested in.';
      default:
        return 'Start building your network by connecting with others.';
    }
  }
  
  getFilterButtonClasses(filter: string): string {
    const isActive = this.activeFilter() === filter;
    return isActive 
      ? 'bg-primary text-white' 
      : 'bg-secondary text-muted-foreground hover:bg-secondary/80';
  }
  
  hasMoreConnections(): boolean {
    return this.hasMore();
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'today';
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  }
  
  trackByConnection(index: number, connection: SocialConnection): string {
    return connection.id;
  }
}