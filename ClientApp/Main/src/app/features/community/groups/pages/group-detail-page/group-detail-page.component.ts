import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Group, GroupMember } from '../../models/group.model';
import { GroupService } from '../../../../../core/services/group.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { GroupHeaderComponent } from '../../components/group-header/group-header.component';
import { GroupSidebarComponent } from '../../components/group-sidebar/group-sidebar.component';
import { GroupPostsComponent } from '../../components/group-posts/group-posts.component';
import { GroupMembersComponent } from '../../components/group-members/group-members.component';
import { GroupEventsComponent } from '../../components/group-events/group-events.component';
import { GroupDiscussionsComponent } from '../../components/group-discussions/group-discussions.component';

@Component({
  selector: 'app-group-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GroupHeaderComponent,
    GroupSidebarComponent,
    GroupPostsComponent,
    GroupMembersComponent,
    GroupEventsComponent,
    GroupDiscussionsComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      @if (isLoading()) {
        <div class="flex items-center justify-center min-h-screen">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      } @else if (group()) {
        <!-- Group Header -->
        <app-group-header 
          [group]="group()!">
        </app-group-header>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Main Content Area -->
            <div class="lg:col-span-3">
              <!-- Tab Navigation -->
              <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                <nav class="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    *ngFor="let tab of tabs()"
                    [class]="getTabClasses(tab.key)"
                    (click)="setActiveTab(tab.key)">
                    <i [class]="tab.icon + ' mr-2'"></i>
                    {{ tab.label }}
                    @if (tab.count !== undefined) {
                      <span class="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs font-medium">
                        {{ tab.count }}
                      </span>
                    }
                  </button>
                </nav>
              </div>

              <!-- Tab Content -->
              <div class="space-y-6">
                @switch (activeTab()) {
                  @case ('posts') {
                    <app-group-posts [group]="group()!"></app-group-posts>
                  }
                  @case ('members') {
                    <app-group-members [group]="group()!"></app-group-members>
                  }
                  @case ('events') {
                    <app-group-events [group]="group()!"></app-group-events>
                  }
                  @case ('discussions') {
                    <app-group-discussions [group]="group()!"></app-group-discussions>
                  }
                }
              </div>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
              <app-group-sidebar 
                [group]="group()!">
              </app-group-sidebar>
            </div>
          </div>
        </div>
      } @else {
        <!-- Error State -->
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <i class="fas fa-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Group Not Found</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4">The group you're looking for doesn't exist or you don't have access to it.</p>
            <button 
              (click)="goBack()"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Go Back
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class GroupDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groupService = inject(GroupService);
  private authService = inject(AuthService);

  // Signals
  private _group = signal<Group | null>(null);
  private _members = signal<GroupMember[]>([]);
  private _isLoading = signal(true);
  private _activeTab = signal('posts');

  // Public readonly signals
  readonly group = this._group.asReadonly();
  readonly members = this._members.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly activeTab = this._activeTab.asReadonly();

  // Computed values
  readonly groupId = computed(() => this.route.snapshot.paramMap.get('id') || '');
  readonly canManageGroup = computed(() => {
    const group = this._group();
    const currentUser = this.authService.currentUser();
    if (!group || !currentUser) return false;
    return group.ownerId === currentUser.id || group.moderatorIds.includes(currentUser.id);
  });

  readonly tabs = computed(() => {
    const group = this._group();
    return [
      { key: 'posts', label: 'Posts', icon: 'fas fa-newspaper', count: group?.postCount },
      { key: 'members', label: 'Members', icon: 'fas fa-users', count: group?.memberCount },
      { key: 'events', label: 'Events', icon: 'fas fa-calendar', count: undefined },
      { key: 'discussions', label: 'Discussions', icon: 'fas fa-comments', count: undefined }
    ];
  });

  ngOnInit(): void {
    this.loadGroup();
    this.loadMembers();

    // Set active tab from route data
    const tabFromRoute = this.route.snapshot.data['tab'];
    if (tabFromRoute) {
      this._activeTab.set(tabFromRoute);
    }
  }

  private loadGroup(): void {
    const groupId = this.groupId();
    if (!groupId) {
      this._isLoading.set(false);
      return;
    }

    this.groupService.getGroup(groupId).subscribe({
      next: (group) => {
        this._group.set(group);
        this._isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load group:', error);
        this._isLoading.set(false);
      }
    });
  }

  private loadMembers(): void {
    const groupId = this.groupId();
    if (!groupId) return;

    this.groupService.getGroupMembers(groupId).subscribe({
      next: (members) => {
        this._members.set(members);
      },
      error: (error) => {
        console.error('Failed to load members:', error);
      }
    });
  }

  setActiveTab(tab: string): void {
    this._activeTab.set(tab);
    // Update URL without navigation
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }

  getTabClasses(tabKey: string): string {
    const baseClasses = 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors';
    const activeClasses = 'border-primary text-primary';
    const inactiveClasses = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300';
    
    return `${baseClasses} ${this.activeTab() === tabKey ? activeClasses : inactiveClasses}`;
  }

  onJoinGroup(): void {
    const groupId = this.groupId();
    if (!groupId) return;

    this.groupService.joinGroup(groupId).subscribe({
      next: () => {
        this.loadGroup(); // Refresh group data
        this.loadMembers(); // Refresh members
      },
      error: (error) => {
        console.error('Failed to join group:', error);
      }
    });
  }

  onLeaveGroup(): void {
    const groupId = this.groupId();
    if (!groupId) return;

    if (confirm('Are you sure you want to leave this group?')) {
      this.groupService.leaveGroup(groupId).subscribe({
        next: () => {
          this.router.navigate(['/groups']);
        },
        error: (error) => {
          console.error('Failed to leave group:', error);
        }
      });
    }
  }

  onEditGroup(): void {
    const groupId = this.groupId();
    if (groupId) {
      this.router.navigate(['/groups', groupId, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/groups']);
  }
}