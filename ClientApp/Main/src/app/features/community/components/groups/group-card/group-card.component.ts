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
                    this.group.memberCount++;
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
    getPrivacyLabel(privacy: string): string {
        const privacyKeys: Record<string, string> = {
            'public': 'privacy.public',
            'private': 'privacy.private',
            'secret': 'privacy.secret'
        };

        const key = privacyKeys[privacy] || 'privacy.public';
        return this.translateService.instant(key);
    }

    /**
     * Get privacy level description for accessibility
     */
    getPrivacyDescription(privacy: string): string {
        const descriptionKeys: Record<string, string> = {
            'public': 'groups.public',
            'private': 'groups.private',
            'secret': 'groups.secret'
        };

        const key = descriptionKeys[privacy] || 'groups.public';
        return this.translateService.instant(key);
    }
}
