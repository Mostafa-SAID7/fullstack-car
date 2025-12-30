import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FriendRequestsComponent } from '../../../features/community/components/friend-requests/friend-requests.component';
import { FriendService } from '../../../features/community/services/friend.service';
import { Friend } from '../../../core/models/friend.model';

@Component({
    selector: 'app-sidebar-right',
    standalone: true,
    imports: [CommonModule, TranslateModule, FriendRequestsComponent],
    templateUrl: './sidebar-right.component.html'
})
export class SidebarRightComponent implements OnInit {
    friends: Friend[] = [];

    constructor(private friendService: FriendService) { }

    ngOnInit(): void {
        this.friendService.getFriends(1, 10).subscribe(result => {
            this.friends = result.items;
        });
    }
}
