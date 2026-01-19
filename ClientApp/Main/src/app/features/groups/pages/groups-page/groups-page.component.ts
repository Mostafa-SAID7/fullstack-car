import { RouterModule } from "@angular/router";
import { CreateGroupModalComponent } from "../../components/create-group-modal/create-group-modal.component";
import { GroupListComponent } from "../../components/group-list/group-list.component";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { Group, GroupSearchFilters, CreateGroupRequest } from "@/core/models/group.model";
import { GroupService } from "@/core/services/group.service";
import { NotificationService } from "@/core/services/notification.service";

@Component({
    selector: 'app-groups-page',
    standalone: true,
    imports: [CommonModule, RouterModule, GroupListComponent, CreateGroupModalComponent],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4 py-8">
        <!-- Main Content -->
        <app-group-list
          [groups]="groups()"
          [categories]="categories()"
          [isLoading]="isLoading()"
          [showFilters]="true"
          [showCreateButton]="true"
          [title]="'Community Groups'"
          [subtitle]="'Discover and join communities that match your interests'"
          (createGroup)="openCreateModal()"
          (joinGroup)="onJoinGroup($event)"
          (manageGroup)="onManageGroup($event)"
          (filtersChange)="onFiltersChange($event)"
        ></app-group-list>
      </div>

      <!-- Create Group Modal -->
      @if (showCreateModal()) {
        <app-create-group-modal
          (cancel)="closeCreateModal()"
          (create)="onCreateGroup($event)">
        </app-create-group-modal>
      }
    </div>
  `
})
export class GroupsPageComponent implements OnInit {
    private groupService = inject(GroupService);
    private notificationService = inject(NotificationService);

    // State
    groups = signal<Group[]>([]);
    categories = signal<string[]>([]);
    isLoading = signal<boolean>(false);
    showCreateModal = signal<boolean>(false);

    ngOnInit(): void {
        this.loadGroups();
        this.loadCategories();
    }

    loadGroups(filters?: GroupSearchFilters): void {
        this.isLoading.set(true);

        // If no filters, load popular/recommended groups initially
        if (!filters || (!filters.query && !filters.category && !filters.type)) {
            this.groupService.getPopularGroups().subscribe({
                next: (groups) => {
                    this.groups.set(groups);
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('Failed to load groups:', error);
                    this.notificationService.error('Failed to load groups');
                    this.isLoading.set(false);
                }
            });
            return;
        }

        // Otherwise search with filters
        this.groupService.searchGroups(filters).subscribe({
            next: (response) => {
                this.groups.set(response.data);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Failed to search groups:', error);
                this.notificationService.error('Failed to search groups');
                this.isLoading.set(false);
            }
        });
    }

    loadCategories(): void {
        this.groupService.getGroupCategories().subscribe({
            next: (categories) => this.categories.set(categories),
            error: (error) => console.error('Failed to load categories:', error)
        });
    }

    onFiltersChange(filters: GroupSearchFilters): void {
        this.loadGroups(filters);
    }

    openCreateModal(): void {
        this.showCreateModal.set(true);
    }

    closeCreateModal(): void {
        this.showCreateModal.set(false);
    }

    onCreateGroup(request: CreateGroupRequest): void {
        this.groupService.createGroup(request).subscribe({
            next: (group) => {
                this.closeCreateModal();
                // Refresh list
                this.loadGroups();
            },
            error: (error) => {
                console.error('Failed to create group:', error);
                this.notificationService.error('Failed to create group');
            }
        });
    }

    onJoinGroup(group: Group): void {
        if (this.groupService.isGroupMember(group.id)) {
            // Leave group
            /* 
               TODO: Add confirmation dialog before leaving.
               Also handling leaving vs joining should probably be done in the card or wrapper based on state, 
               but here we just implementing the action.
            */
            return;
        }

        this.groupService.joinGroup(group.id).subscribe({
            next: () => {
                // Optimistic update or refresh
                this.loadGroups();
            },
            error: (error) => {
                console.error('Failed to join group:', error);
                this.notificationService.error('Failed to join group');
            }
        });
    }

    onManageGroup(group: Group): void {
        // Navigate to group management page
        // this.router.navigate(['/groups', group.id, 'manage']);
        console.log('Navigate to manage group:', group.id);
    }
}