import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CultureDatePipe } from '../../../../../shared/pipes/culture-date.pipe';
import { DateFormattingService } from '../../../../../shared/services/date-formatting.service';

export interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  isOnline: boolean;
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
  imports: [CommonModule, TranslateModule, CultureDatePipe],
  template: `
    <div class="space-y-6">
      <!-- Role Definitions -->
      <div class="fb-card p-6">
        <h3 class="font-black text-lg mb-4 flex items-center">
          <i class="fas fa-shield-alt mr-3 text-primary"></i>
          {{ 'members.title' | translate }}
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let role of getRoles()" class="bg-secondary/10 rounded-2xl p-4">
            <div class="flex items-center mb-3">
              <div [class]="'w-8 h-8 rounded-full flex items-center justify-center mr-3 ' + role.color">
                <i [class]="role.icon + ' text-white text-sm'"></i>
              </div>
              <div>
                <h4 class="font-bold text-foreground">{{ role.name }}</h4>
                <p class="text-xs text-muted-foreground">{{ role.description }}</p>
              </div>
            </div>
            
            <div class="space-y-1">
              <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                {{ 'roles.permissions' | translate }}
              </p>
              <div class="flex flex-wrap gap-1">
                <span *ngFor="let permission of role.permissions" 
                  class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium">
                  {{ permission }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Members by Role -->
      <div class="fb-card p-6" *ngIf="members && members.length > 0">
        <h3 class="font-black text-lg mb-4 flex items-center">
          <i class="fas fa-users mr-3 text-primary"></i>
          {{ 'members.memberCount' | translate }}: {{ members.length }}
        </h3>

        <div class="space-y-4">
          <!-- Group by Role -->
          <div *ngFor="let roleGroup of getMembersByRole()" class="space-y-3">
            <h4 class="font-bold text-foreground flex items-center">
              <div [class]="'w-6 h-6 rounded-full flex items-center justify-center mr-2 ' + getRoleColor(roleGroup.role)">
                <i [class]="getRoleIcon(roleGroup.role) + ' text-white text-xs'"></i>
              </div>
              {{ getRoleName(roleGroup.role) }}
              <span class="ml-2 px-2 py-1 bg-secondary/20 text-muted-foreground text-xs rounded-full">
                {{ roleGroup.members.length }}
              </span>
            </h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div *ngFor="let member of roleGroup.members" 
                class="flex items-center space-x-3 p-3 bg-secondary/5 rounded-xl hover:bg-secondary/10 transition-colors">
                <div class="relative">
                  <img *ngIf="member.profileImageUrl" 
                    [src]="member.profileImageUrl" 
                    [alt]="member.firstName + ' ' + member.lastName"
                    class="w-10 h-10 rounded-full object-cover">
                  <div *ngIf="!member.profileImageUrl" 
                    class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <i class="fas fa-user text-primary text-sm"></i>
                  </div>
                  <div *ngIf="member.isOnline" 
                    class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-foreground truncate">
                    {{ member.firstName }} {{ member.lastName }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    {{ member.joinedAt | cultureDate:'shortDate' }}
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

  constructor(
    private translateService: TranslateService,
    private dateFormattingService: DateFormattingService
  ) {}

  /**
   * Get all available roles with localized names and descriptions
   */
  getRoles(): GroupRole[] {
    return [
      {
        key: 'owner',
        name: this.translateService.instant('roles.owner'),
        description: this.translateService.instant('roles.ownerDescription'),
        permissions: [
          this.translateService.instant('permissions.manageGroup'),
          this.translateService.instant('permissions.manageMembers'),
          this.translateService.instant('permissions.deleteGroup')
        ],
        color: 'bg-purple-500',
        icon: 'fas fa-crown'
      },
      {
        key: 'admin',
        name: this.translateService.instant('members.admins'),
        description: this.translateService.instant('roles.adminDescription'),
        permissions: [
          this.translateService.instant('permissions.manageMembers'),
          this.translateService.instant('permissions.moderateContent'),
          this.translateService.instant('permissions.manageEvents')
        ],
        color: 'bg-red-500',
        icon: 'fas fa-shield-alt'
      },
      {
        key: 'moderator',
        name: this.translateService.instant('members.moderators'),
        description: this.translateService.instant('roles.moderatorDescription'),
        permissions: [
          this.translateService.instant('permissions.moderateContent'),
          this.translateService.instant('permissions.manageDiscussions')
        ],
        color: 'bg-blue-500',
        icon: 'fas fa-gavel'
      },
      {
        key: 'member',
        name: this.translateService.instant('members.members'),
        description: this.translateService.instant('roles.memberDescription'),
        permissions: [
          this.translateService.instant('permissions.createPosts'),
          this.translateService.instant('permissions.participate')
        ],
        color: 'bg-green-500',
        icon: 'fas fa-user'
      }
    ];
  }

  /**
   * Group members by their roles
   */
  getMembersByRole(): { role: string; members: GroupMember[] }[] {
    const roleOrder = ['owner', 'admin', 'moderator', 'member'];
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
        members: grouped[role].sort((a, b) => a.firstName.localeCompare(b.firstName))
      }));
  }

  /**
   * Get localized role name
   */
  getRoleName(role: string): string {
    const roleKeys = {
      owner: 'roles.owner',
      admin: 'members.admins',
      moderator: 'members.moderators',
      member: 'members.members'
    };
    
    const key = roleKeys[role as keyof typeof roleKeys] || 'members.members';
    return this.translateService.instant(key);
  }

  /**
   * Get role color class
   */
  getRoleColor(role: string): string {
    const colors = {
      owner: 'bg-purple-500',
      admin: 'bg-red-500',
      moderator: 'bg-blue-500',
      member: 'bg-green-500'
    };
    
    return colors[role as keyof typeof colors] || 'bg-gray-500';
  }

  /**
   * Get role icon class
   */
  getRoleIcon(role: string): string {
    const icons = {
      owner: 'fas fa-crown',
      admin: 'fas fa-shield-alt',
      moderator: 'fas fa-gavel',
      member: 'fas fa-user'
    };
    
    return icons[role as keyof typeof icons] || 'fas fa-user';
  }

  /**
   * Get formatted join date based on current locale (kept for backward compatibility)
   * @deprecated Use cultureDate pipe instead
   */
  getFormattedJoinDate(date: Date): string {
    return this.dateFormattingService.formatDate(date, { format: 'shortDate' });
  }
}