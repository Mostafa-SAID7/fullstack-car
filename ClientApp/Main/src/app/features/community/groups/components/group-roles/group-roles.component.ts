import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'owner' | 'moderator' | 'member';
  joinedAt: Date;
  lastActiveAt: Date;
  status: 'active' | 'inactive' | 'banned';
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    verified: boolean;
  };
}

export interface GroupRole {
  key: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  icon: string;
}

@Component({
  selector: 'app-group-roles',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="space-y-6">
      <!-- Role Definitions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
          <i class="fas fa-shield-alt mr-3 text-primary"></i>
          Group Roles
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let role of getRoles()" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <div [class]="'w-8 h-8 rounded-full flex items-center justify-center mr-3 ' + role.color">
                <i [class]="role.icon + ' text-white text-sm'"></i>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ role.name }}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ role.description }}</p>
              </div>
            </div>
            
            <div class="space-y-1">
              <p class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                Permissions
              </p>
              <div class="flex flex-wrap gap-1">
                <span *ngFor="let permission of role.permissions" 
                  class="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                  {{ permission }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Members by Role -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6" *ngIf="members && members.length > 0">
        <h3 class="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
          <i class="fas fa-users mr-3 text-primary"></i>
          Members ({{ members.length }})
        </h3>

        <div class="space-y-4">
          <!-- Group by Role -->
          <div *ngFor="let roleGroup of getMembersByRole()" class="space-y-3">
            <h4 class="font-medium text-gray-900 dark:text-white flex items-center">
              <div [class]="'w-6 h-6 rounded-full flex items-center justify-center mr-2 ' + getRoleColor(roleGroup.role)">
                <i [class]="getRoleIcon(roleGroup.role) + ' text-white text-xs'"></i>
              </div>
              {{ getRoleName(roleGroup.role) }}
              <span class="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                {{ roleGroup.members.length }}
              </span>
            </h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div *ngFor="let member of roleGroup.members" 
                class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div class="relative">
                  <img *ngIf="member.user.avatar" 
                    [src]="member.user.avatar" 
                    [alt]="member.user.displayName"
                    class="w-10 h-10 rounded-full object-cover">
                  <div *ngIf="!member.user.avatar" 
                    class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <i class="fas fa-user text-primary text-sm"></i>
                  </div>
                  <div *ngIf="isOnline(member)" 
                    class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 dark:text-white truncate">
                    {{ member.user.displayName }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ formatDate(member.joinedAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GroupRolesComponent {
  @Input() members: GroupMember[] = [];

  constructor(private translateService: TranslateService) {}

  getRoles(): GroupRole[] {
    return [
      {
        key: 'owner',
        name: 'Owner',
        description: 'Full control over the group',
        permissions: [
          'Manage Group',
          'Manage Members',
          'Delete Group'
        ],
        color: 'bg-purple-500',
        icon: 'fas fa-crown'
      },
      {
        key: 'moderator',
        name: 'Moderator',
        description: 'Can moderate content and manage members',
        permissions: [
          'Moderate Content',
          'Manage Discussions',
          'Manage Events'
        ],
        color: 'bg-blue-500',
        icon: 'fas fa-gavel'
      },
      {
        key: 'member',
        name: 'Member',
        description: 'Can participate in group activities',
        permissions: [
          'Create Posts',
          'Join Discussions',
          'Attend Events'
        ],
        color: 'bg-green-500',
        icon: 'fas fa-user'
      }
    ];
  }

  getMembersByRole(): { role: string; members: GroupMember[] }[] {
    const roleOrder = ['owner', 'moderator', 'member'];
    const grouped = this.members.reduce((acc, member) => {
      if (!acc[member.role]) {
        acc[member.role] = [];
      }
      acc[member.role].push(member);
      return acc;
    }, {} as Record<string, GroupMember[]>);

    return roleOrder
      .filter(role => grouped[role] && grouped[role].length > 0)
      .map(role => ({
        role,
        members: grouped[role].sort((a, b) => a.user.displayName.localeCompare(b.user.displayName))
      }));
  }

  getRoleName(role: string): string {
    const roleNames = {
      owner: 'Owner',
      moderator: 'Moderators',
      member: 'Members'
    };
    
    return roleNames[role as keyof typeof roleNames] || 'Members';
  }

  getRoleColor(role: string): string {
    const colors = {
      owner: 'bg-purple-500',
      moderator: 'bg-blue-500',
      member: 'bg-green-500'
    };
    
    return colors[role as keyof typeof colors] || 'bg-gray-500';
  }

  getRoleIcon(role: string): string {
    const icons = {
      owner: 'fas fa-crown',
      moderator: 'fas fa-gavel',
      member: 'fas fa-user'
    };
    
    return icons[role as keyof typeof icons] || 'fas fa-user';
  }

  isOnline(member: GroupMember): boolean {
    const lastActive = new Date(member.lastActiveAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);
    return diffMinutes < 15; // Online if active within 15 minutes
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
}