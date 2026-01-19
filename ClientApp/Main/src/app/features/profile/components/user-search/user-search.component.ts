import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { Subject } from 'rxjs';
import { UserSearchResult } from '../../models/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile.service';
import { PaginatedResult } from '../../../../core/models/result.model';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <!-- Search Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Find People</h1>
        <p class="text-muted-foreground">Discover and connect with other community members</p>
      </div>
      
      <!-- Search Bar -->
      <div class="relative mb-8">
        <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearchInput($event)"
          placeholder="Search by name, location, or interests..."
          class="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg">
        
        <!-- Clear Search -->
        <button
          *ngIf="searchQuery()"
          (click)="clearSearch()"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors">
          <i class="fas fa-times text-muted-foreground"></i>
        </button>
      </div>
      
      <!-- Search Filters -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          *ngFor="let filter of searchFilters"
          (click)="toggleFilter(filter.value)"
          [class]="getFilterClasses(filter.value)"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          <i [class]="filter.icon + ' mr-2'"></i>
          {{ filter.label }}
        </button>
      </div>
      
      <!-- Search Results -->
      <div class="space-y-6">
        <!-- Loading State -->
        <div *ngIf="isSearching()" class="space-y-4">
          <div *ngFor="let i of [1,2,3,4,5]" class="bg-card border border-border rounded-2xl p-6 animate-pulse">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-secondary rounded-2xl"></div>
              <div class="flex-1">
                <div class="h-5 bg-secondary rounded w-48 mb-2"></div>
                <div class="h-4 bg-secondary rounded w-32 mb-2"></div>
                <div class="h-3 bg-secondary rounded w-24"></div>
              </div>
              <div class="w-24 h-10 bg-secondary rounded-xl"></div>
            </div>
          </div>
        </div>
        
        <!-- No Results -->
        <div *ngIf="!isSearching() && searchQuery() && searchResults().length === 0" 
             class="text-center py-12">
          <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-search text-muted-foreground text-xl"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2">No users found</h3>
          <p class="text-muted-foreground">Try adjusting your search terms or filters.</p>
        </div>
        
        <!-- Search Results -->
        <div *ngIf="!isSearching() && searchResults().length > 0" class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">
              Search Results ({{ totalResults() }})
            </h2>
            <div class="text-sm text-muted-foreground">
              Showing {{ searchResults().length }} of {{ totalResults() }} results
            </div>
          </div>
          
          <div 
            *ngFor="let user of searchResults(); trackBy: trackByUser"
            class="bg-card border border-border rounded-2xl p-6 hover:border-primary/20 transition-all">
            <div class="flex items-center gap-6">
              <!-- User Avatar -->
              <div class="relative">
                <div class="w-16 h-16 rounded-2xl bg-secondary overflow-hidden flex items-center justify-center">
                  <img 
                    *ngIf="user.profileImageUrl" 
                    [src]="user.profileImageUrl"
                    [alt]="user.firstName + ' ' + user.lastName"
                    class="w-full h-full object-cover">
                  <span 
                    *ngIf="!user.profileImageUrl" 
                    class="text-primary text-xl font-bold">
                    {{ user.firstName[0] }}{{ user.lastName[0] }}
                  </span>
                </div>
                
                <!-- Online Status -->
                <div 
                  *ngIf="user.isOnline"
                  class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-background">
                </div>
                
                <!-- Verification Badge -->
                <div 
                  *ngIf="user.isVerified"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-background flex items-center justify-center">
                  <i class="fas fa-check text-white text-xs"></i>
                </div>
              </div>
              
              <!-- User Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-lg font-semibold truncate">
                    {{ user.firstName }} {{ user.lastName }}
                  </h3>
                  <span 
                    *ngIf="user.isVerified"
                    class="inline-flex items-center px-2 py-0.5 bg-blue-500/10 text-blue-500 text-xs font-medium rounded-full">
                    <i class="fas fa-check-circle mr-1"></i>
                    Verified
                  </span>
                </div>
                
                <p *ngIf="user.bio" class="text-muted-foreground text-sm mb-2 line-clamp-2">
                  {{ user.bio }}
                </p>
                
                <div class="flex items-center gap-4 text-sm text-muted-foreground">
                  <span *ngIf="user.location" class="flex items-center gap-1">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ user.location }}
                  </span>
                  
                  <span *ngIf="user.mutualConnectionsCount > 0" class="flex items-center gap-1">
                    <i class="fas fa-users"></i>
                    {{ user.mutualConnectionsCount }} mutual connections
                  </span>
                  
                  <span *ngIf="user.isOnline" class="flex items-center gap-1 text-emerald-500">
                    <i class="fas fa-circle text-xs"></i>
                    Online
                  </span>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center gap-3">
                <!-- View Profile -->
                <button
                  (click)="viewProfile(user.id)"
                  class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors">
                  View Profile
                </button>
                
                <!-- Connection Actions -->
                <ng-container [ngSwitch]="getConnectionStatus(user)">
                  <!-- Not Connected -->
                  <ng-container *ngSwitchCase="'none'">
                    <button
                      (click)="sendFriendRequest(user.id)"
                      class="px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
                      <i class="fas fa-user-plus mr-2"></i>
                      Add Friend
                    </button>
                    
                    <button
                      (click)="followUser(user.id)"
                      class="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                      <i class="fas fa-plus mr-2"></i>
                      Follow
                    </button>
                  </ng-container>
                  
                  <!-- Friend Request Sent -->
                  <ng-container *ngSwitchCase="'friend-request-sent'">
                    <button
                      disabled
                      class="px-4 py-2 text-sm font-medium bg-gray-500 text-white rounded-xl opacity-50 cursor-not-allowed">
                      <i class="fas fa-clock mr-2"></i>
                      Request Sent
                    </button>
                  </ng-container>
                  
                  <!-- Friend Request Received -->
                  <ng-container *ngSwitchCase="'friend-request-received'">
                    <button
                      (click)="acceptFriendRequest(user.id)"
                      class="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                      <i class="fas fa-check mr-2"></i>
                      Accept
                    </button>
                  </ng-container>
                  
                  <!-- Already Friends -->
                  <ng-container *ngSwitchCase="'friends'">
                    <button
                      class="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-xl opacity-75 cursor-default">
                      <i class="fas fa-check mr-2"></i>
                      Friends
                    </button>
                  </ng-container>
                  
                  <!-- Following -->
                  <ng-container *ngSwitchCase="'following'">
                    <button
                      (click)="unfollowUser(user.id)"
                      class="px-4 py-2 text-sm font-medium bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors">
                      <i class="fas fa-check mr-2"></i>
                      Following
                    </button>
                  </ng-container>
                </ng-container>
              </div>
            </div>
          </div>
          
          <!-- Load More Button -->
          <div *ngIf="hasMoreResults()" class="text-center pt-6">
            <button
              (click)="loadMoreResults()"
              [disabled]="isLoadingMore()"
              class="px-6 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <span *ngIf="!isLoadingMore()">Load More Results</span>
              <span *ngIf="isLoadingMore()" class="flex items-center gap-2">
                <i class="fas fa-spinner fa-spin"></i>
                Loading...
              </span>
            </button>
          </div>
        </div>
        
        <!-- Suggested Users (when no search) -->
        <div *ngIf="!searchQuery() && !isSearching()" class="space-y-6">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold mb-2">Suggested for You</h2>
            <p class="text-muted-foreground">People you might know or want to connect with</p>
          </div>
          
          <!-- Suggested users will be loaded here -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let user of suggestedUsers(); trackBy: trackByUser"
                 class="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/20 transition-all">
              <!-- User Avatar -->
              <div class="relative w-20 h-20 mx-auto mb-4">
                <div class="w-full h-full rounded-2xl bg-secondary overflow-hidden flex items-center justify-center">
                  <img 
                    *ngIf="user.profileImageUrl" 
                    [src]="user.profileImageUrl"
                    [alt]="user.firstName + ' ' + user.lastName"
                    class="w-full h-full object-cover">
                  <span 
                    *ngIf="!user.profileImageUrl" 
                    class="text-primary text-xl font-bold">
                    {{ user.firstName[0] }}{{ user.lastName[0] }}
                  </span>
                </div>
                
                <!-- Verification Badge -->
                <div 
                  *ngIf="user.isVerified"
                  class="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-background flex items-center justify-center">
                  <i class="fas fa-check text-white text-xs"></i>
                </div>
              </div>
              
              <!-- User Info -->
              <h3 class="font-semibold mb-1">{{ user.firstName }} {{ user.lastName }}</h3>
              <p *ngIf="user.location" class="text-sm text-muted-foreground mb-2">{{ user.location }}</p>
              <p *ngIf="user.mutualConnectionsCount > 0" class="text-xs text-muted-foreground mb-4">
                {{ user.mutualConnectionsCount }} mutual connections
              </p>
              
              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button
                  (click)="viewProfile(user.id)"
                  class="flex-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                  View
                </button>
                <button
                  (click)="sendFriendRequest(user.id)"
                  class="flex-1 px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserSearchComponent implements OnInit {
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);
  
  // Search state
  searchQuery = signal<string>('');
  searchResults = signal<UserSearchResult[]>([]);
  suggestedUsers = signal<UserSearchResult[]>([]);
  isSearching = signal<boolean>(false);
  isLoadingMore = signal<boolean>(false);
  currentPage = signal<number>(1);
  totalResults = signal<number>(0);
  hasMore = signal<boolean>(false);
  
  // Filters
  activeFilters = signal<string[]>([]);
  searchFilters = [
    { label: 'Online Now', value: 'online', icon: 'fas fa-circle' },
    { label: 'Verified', value: 'verified', icon: 'fas fa-check-circle' },
    { label: 'Mutual Friends', value: 'mutual', icon: 'fas fa-users' },
    { label: 'Same Location', value: 'location', icon: 'fas fa-map-marker-alt' }
  ];
  
  // Search subject for debouncing
  private searchSubject = new Subject<string>();
  
  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadSuggestedUsers();
  }
  
  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.trim()) {
          this.isSearching.set(true);
          this.currentPage.set(1);
          return this.userProfileService.searchUsers(query, 1, 20);
        } else {
          this.searchResults.set([]);
          return of(null);
        }
      })
    ).subscribe({
      next: (result) => {
        if (result) {
          this.searchResults.set(result.items);
          this.totalResults.set(result.totalCount);
          this.hasMore.set(result.hasNextPage);
        }
        this.isSearching.set(false);
      },
      error: () => {
        this.isSearching.set(false);
      }
    });
  }
  
  private loadSuggestedUsers(): void {
    this.userProfileService.getSuggestedUsers(1, 12).subscribe({
      next: (result) => {
        this.suggestedUsers.set(result.items);
      }
    });
  }
  
  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }
  
  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.searchSubject.next('');
  }
  
  toggleFilter(filterValue: string): void {
    this.activeFilters.update(filters => {
      const index = filters.indexOf(filterValue);
      if (index > -1) {
        return filters.filter(f => f !== filterValue);
      } else {
        return [...filters, filterValue];
      }
    });
    
    // Re-trigger search with filters
    if (this.searchQuery()) {
      this.searchSubject.next(this.searchQuery());
    }
  }
  
  getFilterClasses(filterValue: string): string {
    const isActive = this.activeFilters().includes(filterValue);
    return isActive 
      ? 'bg-primary text-white' 
      : 'bg-secondary text-muted-foreground hover:bg-secondary/80';
  }
  
  loadMoreResults(): void {
    if (this.hasMore() && !this.isLoadingMore()) {
      this.isLoadingMore.set(true);
      const nextPage = this.currentPage() + 1;
      
      this.userProfileService.searchUsers(this.searchQuery(), nextPage, 20).subscribe({
        next: (result) => {
          this.searchResults.update(current => [...current, ...result.items]);
          this.currentPage.set(nextPage);
          this.hasMore.set(result.hasNextPage);
          this.isLoadingMore.set(false);
        },
        error: () => {
          this.isLoadingMore.set(false);
        }
      });
    }
  }
  
  hasMoreResults(): boolean {
    return this.hasMore();
  }
  
  // User actions
  viewProfile(userId: string): void {
    this.router.navigate(['/profile', userId]);
  }
  
  sendFriendRequest(userId: string): void {
    this.userProfileService.sendFriendRequest(userId).subscribe({
      next: () => {
        // Update the user's connection status in the results
        this.updateUserConnectionStatus(userId, { friendRequestSent: true });
      }
    });
  }
  
  acceptFriendRequest(userId: string): void {
    // This would need the request ID, which should be available in the user data
    // For now, we'll just show a success message
    this.updateUserConnectionStatus(userId, { isFriend: true });
  }
  
  followUser(userId: string): void {
    this.userProfileService.followUser(userId).subscribe({
      next: () => {
        this.updateUserConnectionStatus(userId, { isFollowing: true });
      }
    });
  }
  
  unfollowUser(userId: string): void {
    this.userProfileService.unfollowUser(userId).subscribe({
      next: () => {
        this.updateUserConnectionStatus(userId, { isFollowing: false });
      }
    });
  }
  
  private updateUserConnectionStatus(userId: string, statusUpdate: Partial<any>): void {
    // Update in search results
    this.searchResults.update(users => 
      users.map(user => 
        user.id === userId 
          ? { ...user, connectionStatus: { ...user.connectionStatus, ...statusUpdate } }
          : user
      )
    );
    
    // Update in suggested users
    this.suggestedUsers.update(users => 
      users.map(user => 
        user.id === userId 
          ? { ...user, connectionStatus: { ...user.connectionStatus, ...statusUpdate } }
          : user
      )
    );
  }
  
  getConnectionStatus(user: UserSearchResult): string {
    const status = user.connectionStatus;
    
    if (status?.isFriend) return 'friends';
    if (status?.friendRequestSent) return 'friend-request-sent';
    if (status?.friendRequestReceived) return 'friend-request-received';
    if (status?.isFollowing) return 'following';
    
    return 'none';
  }
  
  trackByUser(index: number, user: UserSearchResult): string {
    return user.id;
  }
}