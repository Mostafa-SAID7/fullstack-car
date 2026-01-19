import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { GroupService } from '../../../../../core/services/group.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Group, GroupSearchFilters } from '../../../../../core/models/group.model';
import { CreateGroupModalComponent } from '../../components/create-group-modal/create-group-modal.component';
import { GroupCardComponent } from '../../components/group-card/group-card.component';

@Component({
  selector: 'app-groups-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    GroupCardComponent
  ],
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss']
})
export class GroupsPageComponent implements OnInit {
  private groupService = inject(GroupService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  // Signals
  private _allGroups = signal<Group[]>([]);
  private _featuredGroups = signal<Group[]>([]);
  private _trendingGroups = signal<Group[]>([]);
  private _recommendedGroups = signal<Group[]>([]);
  private _categories = signal<string[]>([]);
  private _isLoading = signal(false);
  private _searchQuery = signal('');
  private _selectedCategory = signal<string | null>(null);
  private _selectedTab = signal<'all' | 'my-groups' | 'joined' | 'managed'>('all');

  // Public readonly signals
  readonly allGroups = this._allGroups.asReadonly();
  readonly featuredGroups = this._featuredGroups.asReadonly();
  readonly trendingGroups = this._trendingGroups.asReadonly();
  readonly recommendedGroups = this._recommendedGroups.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly selectedTab = this._selectedTab.asReadonly();

  // Computed values
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated);
  readonly userGroups = computed(() => this.groupService.userGroups());
  readonly joinedGroups = computed(() => this.groupService.joinedGroups());
  readonly managedGroups = computed(() => this.groupService.managedGroups());

  readonly filteredGroups = computed(() => {
    let groups = this._allGroups();
    
    // Filter by search query
    if (this._searchQuery()) {
      const query = this._searchQuery().toLowerCase();
      groups = groups.filter(group => 
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (this._selectedCategory()) {
      groups = groups.filter(group => group.category === this._selectedCategory());
    }
    
    return groups;
  });

  readonly displayedGroups = computed(() => {
    switch (this._selectedTab()) {
      case 'my-groups':
        return this.userGroups();
      case 'joined':
        return this.joinedGroups();
      case 'managed':
        return this.managedGroups();
      default:
        return this.filteredGroups();
    }
  });

  // Form
  searchForm: FormGroup;

  constructor() {
    this.searchForm = this.fb.group({
      query: [''],
      category: ['']
    });

    // Setup search form subscriptions
    this.searchForm.get('query')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => this._searchQuery.set(query || ''));

    this.searchForm.get('category')?.valueChanges
      .subscribe(category => this._selectedCategory.set(category || null));
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this._isLoading.set(true);

    // Load all groups
    this.searchGroups();

    // Load featured groups
    this.groupService.getFeaturedGroups(6).subscribe({
      next: (groups) => this._featuredGroups.set(groups),
      error: (error) => console.error('Failed to load featured groups:', error)
    });

    // Load trending groups
    this.groupService.getTrendingGroups(8).subscribe({
      next: (groups) => this._trendingGroups.set(groups),
      error: (error) => console.error('Failed to load trending groups:', error)
    });

    // Load recommended groups (if authenticated)
    if (this.isAuthenticated()) {
      this.groupService.getRecommendedGroups(8).subscribe({
        next: (groups) => this._recommendedGroups.set(groups),
        error: (error) => console.error('Failed to load recommended groups:', error)
      });
    }

    // Load categories
    this.groupService.getGroupCategories().subscribe({
      next: (categories) => this._categories.set(categories),
      error: (error) => console.error('Failed to load categories:', error)
    });

    this._isLoading.set(false);
  }

  searchGroups(): void {
    const filters: GroupSearchFilters = {
      query: this._searchQuery() || undefined,
      category: this._selectedCategory() || undefined,
      pageSize: 50,
      sortBy: 'relevance'
    };

    this.groupService.searchGroups(filters).subscribe({
      next: (response) => {
        this._allGroups.set(response.data);
      },
      error: (error) => {
        console.error('Failed to search groups:', error);
        this._allGroups.set([]);
      }
    });
  }

  onTabChange(tab: 'all' | 'my-groups' | 'joined' | 'managed'): void {
    this._selectedTab.set(tab);
    
    // Load specific data based on tab
    if (tab === 'joined' && this.joinedGroups().length === 0) {
      this.groupService.getJoinedGroups().subscribe();
    } else if (tab === 'managed' && this.managedGroups().length === 0) {
      this.groupService.getManagedGroups().subscribe();
    }
  }

  onGroupClick(group: Group): void {
    this.router.navigate(['/groups', group.id]);
  }

  onCreateGroup(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const dialogRef = this.dialog.open(CreateGroupModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh groups after creation
        this.loadInitialData();
      }
    });
  }

  onJoinGroup(group: Group): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.groupService.joinGroup(group.id).subscribe({
      next: () => {
        // Refresh user groups
        this.groupService.loadUserGroups();
      },
      error: (error) => {
        console.error('Failed to join group:', error);
      }
    });
  }

  onLeaveGroup(group: Group): void {
    this.groupService.leaveGroup(group.id).subscribe({
      next: () => {
        // Refresh user groups
        this.groupService.loadUserGroups();
      },
      error: (error) => {
        console.error('Failed to leave group:', error);
      }
    });
  }

  clearFilters(): void {
    this.searchForm.reset();
    this._searchQuery.set('');
    this._selectedCategory.set(null);
    this.searchGroups();
  }

  isUserMember(group: Group): boolean {
    return this.groupService.isGroupMember(group.id);
  }

  canManageGroup(group: Group): boolean {
    return this.groupService.canManageGroup(group);
  }
}