import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
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

    constructor(private groupService: GroupService) { }

    joinGroup(): void {
        this.groupService.joinGroup(this.group.id).subscribe(result => {
            if (result.succeeded) {
                // Update state or emit event
                this.group.membersCount++;
            }
        });
    }
}
