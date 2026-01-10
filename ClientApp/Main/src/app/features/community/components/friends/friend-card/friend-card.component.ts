import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Friend } from '../../../../../core/models/friend.model';
import { FriendService } from '../../../services/friend.service';

@Component({
    selector: 'app-friend-card',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './friend-card.component.html',
    host: { 'class': 'block' }
})
export class FriendCardComponent {
    @Input() friend!: Friend;

    constructor(private friendService: FriendService) { }

    removeFriend(): void {
        this.friendService.removeFriend(this.friend.id).subscribe(result => {
            if (result.succeeded) {
                // Future: Emit event to parent to refresh list
            }
        });
    }
}
