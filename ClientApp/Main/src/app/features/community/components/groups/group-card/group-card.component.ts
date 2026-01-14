import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Group } from '../../../../../core/models/group.model';
import { GroupService } from '../../../services/group.service';

@Component({
    selector: 'app-group-card',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './group-card.component.html',
    host: { 'class': 'block' }
})
export class GroupCardComponent {
    @Input() group!: Group;

    constructor(
        private groupService: GroupService,
        private translateService: TranslateService
    ) { }

    joinGroup(): void {
        this.groupService.joinGroup(this.group.id).subscribe({
            next: (result) => {
                if (result.succeeded) {
                    // Update state or emit event
                    this.group.membersCount++;
                }
            },
            error: (error) => {
                console.error('Failed to join group:', error);
                // Handle error - could emit an event or show a notification
            }
        });
    }

    /**
     * Get localized privacy level description
     */
    getPrivacyLabel(privacy: number): string {
        const privacyKeys = {
            0: 'privacy.public',
            1: 'privacy.private', 
            2: 'privacy.secret'
        };
        
        const key = privacyKeys[privacy as keyof typeof privacyKeys] || 'privacy.public';
        return this.translateService.instant(key);
    }

    /**
     * Get privacy level description for accessibility
     */
    getPrivacyDescription(privacy: number): string {
        const descriptionKeys = {
            0: 'groups.public',
            1: 'groups.private',
            2: 'groups.secret'
        };
        
        const key = descriptionKeys[privacy as keyof typeof descriptionKeys] || 'groups.public';
        return this.translateService.instant(key);
    }
}
