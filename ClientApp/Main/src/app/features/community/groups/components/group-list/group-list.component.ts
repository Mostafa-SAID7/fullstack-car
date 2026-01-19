import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group, GroupSearchFilters } from '../../../../../core/models/group.model';
import { GroupCardComponent } from '../group-card/group-card.component';

/**
 * Group List Component
 * 
 * Displays a list of groups with filtering and sorting options
 */
@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, GroupCardComponent],
  template: `
    <div class="group-list">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ title() }}
          </h2>
          @if (subtitle()) {
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              {{ subtitle() }}
            </p>
          }
        </div>
        
        @if (showCreateButton()) {
          <button 
            (click)="onCreateGroup()"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
            <i class="fa-solid fa-plus"></i>
            <span>Create Group</span>
          </button>
        }
      </div>

      <!-- Filters -->
      @if (showFilters()) {
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                [value]="searchQuery()"
                (input)="updateSearchQuery($event)"
                placeholder="Search groups..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent">
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                [value]="selectedCategory()"
                (change)="updateCategory($event)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">All Categories</option>
                @for (category of categories(); track category) {
                  <option [value]="category">{{ category }}</option>
                }
              </select>
            </div>

            <!-- Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                [value]="selectedType()"
                (change)="updateType($event)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">All Types</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="secret">Secret</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                [value]="sortBy()"
                (change)="updateSortBy($event)"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="name">Name</option>
                <option value="members">Members</option>
                <option value="activity">Activity</option>
                <option value="created">Created Date</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
          </div>

          <!-- Active Filters -->
          @if (hasActiveFilters()) {
            <div class="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              
              @if (searchQuery()) {
                <span class="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Search: "{{ searchQuery() }}"
                  <button (click)="clearSearchQuery()" class="ml-1 hover:text-primary/80">
                    <i class="fa-solid fa-times"></i>
                  </button>
                </span>
              }
              
              @if (selectedCategory()) {
                <span class="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Category: {{ selectedCategory() }}
                  <button (click)="clearCategory()" class="ml-1 hover:text-primary/80">
                    <i class="fa-solid fa-times"></i>
                  </button>
                </span>
              }
              
              @if (selectedType()) {
                <span class="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  Type: {{ selectedType() }}
                  <button (click)="clearType()" class="ml-1 hover:text-primary/80">
                    <i class="fa-solid fa-times"></i>
                  </button>
                </span>
              }
              
              <button 
                (click)="clearAllFilters()"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline">
                Clear all
              </button>
            </div>
          }
        </div>
      }

      <!-- Results Info -->
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          @if (isLoading()) {
            Loading groups...
          } @else {
            Showing {{ filteredGroups().length }} of {{ groups().length }} groups
          }
        </p>
        
        <!-- View Toggle -->
        <div class="flex items-center space-x-2">
          <button
            (click)="setViewMode('grid')"
            [class]="viewMode() === 'grid' ? 'text-primary' : 'text-gray-400'"
            class="p-2 hover:text-primary transition-colors"
            title="Grid View">
            <i class="fa-solid fa-grid-2"></i>
          </button>
          <button
            (click)="setViewMode('list')"
            [class]="viewMode() === 'list' ? 'text-primary' : 'text-gray-400'"
            class="p-2 hover:text-primary transition-colors"
            title="List View">
            <i class="fa-solid fa-list"></i>
          </button>
        </div>
      </div>

      <!-- Groups Grid/List -->
      @if (isLoading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      } @else if (filteredGroups().length === 0) {
        <div class="text-center py-12">
          <i class="fa-solid fa-users text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No groups found
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            @if (hasActiveFilters()) {
              Try adjusting your filters or search terms.
            } @else {
              There are no groups to display.
            }
          </p>
          @if (showCreateButton()) {
            <button 
              (click)="onCreateGroup()"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Create First Group
            </button>
          }
        </div>
      } @else {
        <div [class]="gridClasses()">
          @for (group of filteredGroups(); track group.id) {
            <app-group-card
              [group]="group"
              [showJoinButton]="showJoinButtons()"
              [showManageButton]="showManageButtons()"
              (joinClick)="onJoinGroup($event)"
              (manageClick)="onManageGroup($event)"
              (shareClick)="onShareGroup($event)"
              (moreClick)="onMoreOptions($event)">
            </app-group-card>
          }
        </div>
      }

      <!-- Load More -->
      @if (hasMore() && !isLoading()) {
        <div class="text-center mt-8">
          <button 
            (click)="onLoadMore()"
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Load More Groups
          </button>
        </div>
      }
    </div>
  `
})
export class GroupListComponent {
  // Input properties
  groups = input.required<Group[]>();
  title = input<string>('Groups');
  subtitle = input<string>('');
  showFilters = input<boolean>(true);
  showCreateButton = input<boolean>(true);
  showJoinButtons = input<boolean>(true);
  showManageButtons = input<boolean>(false);
  isLoading = input<boolean>(false);
  hasMore = input<boolean>(false);
  categories = input<string[]>([]);

  // Output events
  createGroup = output<void>();
  joinGroup = output<Group>();
  manageGroup = output<Group>();
  shareGroup = output<Group>();
  moreOptions = output<Group>();
  loadMore = output<void>();
  filtersChange = output<GroupSearchFilters>();

  // Local state
  protected searchQuery = signal<string>('');
  protected selectedCategory = signal<string>('');
  protected selectedType = signal<string>('');
  protected sortBy = signal<string>('name');
  protected viewMode = signal<'grid' | 'list'>('grid');

  // Computed properties
  filteredGroups = computed(() => {
    let filtered = this.groups();

    // Apply search filter
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.category.toLowerCase().includes(query) ||
        group.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (this.selectedCategory()) {
      filtered = filtered.filter(group => group.category === this.selectedCategory());
    }

    // Apply type filter
    if (this.selectedType()) {
      filtered = filtered.filter(group => group.type === this.selectedType());
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (this.sortBy()) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return b.memberCount - a.memberCount;
        case 'activity':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  });

  hasActiveFilters = computed(() =>
    this.searchQuery() || this.selectedCategory() || this.selectedType()
  );

  gridClasses = computed(() => {
    const baseClasses = 'gap-6';
    return this.viewMode() === 'grid'
      ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${baseClasses}`
      : `flex flex-col ${baseClasses}`;
  });

  // Event handlers
  updateSearchQuery(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.emitFiltersChange();
  }

  updateCategory(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value);
    this.emitFiltersChange();
  }

  updateType(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedType.set(target.value);
    this.emitFiltersChange();
  }

  updateSortBy(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.sortBy.set(target.value);
    this.emitFiltersChange();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  clearSearchQuery(): void {
    this.searchQuery.set('');
    this.emitFiltersChange();
  }

  clearCategory(): void {
    this.selectedCategory.set('');
    this.emitFiltersChange();
  }

  clearType(): void {
    this.selectedType.set('');
    this.emitFiltersChange();
  }

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedType.set('');
    this.emitFiltersChange();
  }

  onCreateGroup(): void {
    this.createGroup.emit();
  }

  onJoinGroup(group: Group): void {
    this.joinGroup.emit(group);
  }

  onManageGroup(group: Group): void {
    this.manageGroup.emit(group);
  }

  onShareGroup(group: Group): void {
    this.shareGroup.emit(group);
  }

  onMoreOptions(group: Group): void {
    this.moreOptions.emit(group);
  }

  onLoadMore(): void {
    this.loadMore.emit();
  }

  private emitFiltersChange(): void {
    const filters: GroupSearchFilters = {
      query: this.searchQuery() || undefined,
      category: this.selectedCategory() || undefined,
      type: this.selectedType() as any || undefined,
      sortBy: this.sortBy() as any,
      sortOrder: 'desc'
    };

    this.filtersChange.emit(filters);
  }
}