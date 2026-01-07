import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FriendRequest } from '../../../../core/models/friend.model';
import { FriendService } from '../../services/friend.service';

@Component({
    selector: 'app-friend-requests',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
        <div class="fb-card p-5">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-black uppercase tracking-widest text-primary">Friend Requests</h2>
                <span class="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">{{ requests.length }}</span>
            </div>
            
            <div class="space-y-4">
                <div *ngFor="let request of requests" class="flex items-start gap-3 p-2 rounded-xl hover:bg-secondary/10 transition-colors">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/10 to-primary/5 border border-primary/10 overflow-hidden shadow-sm flex-shrink-0">
                        <img *ngIf="request.requesterProfileImageUrl" [src]="request.requesterProfileImageUrl" class="w-full h-full object-cover">
                        <div *ngIf="!request.requesterProfileImageUrl" class="w-full h-full flex items-center justify-center font-black text-primary">
                            {{ request.requesterFirstName[0] }}{{ request.requesterLastName[0] }}
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="text-xs font-black truncate">{{ request.requesterFirstName }} {{ request.requesterLastName }}</h4>
                        <span class="text-[9px] text-muted-foreground/60 block mb-2">{{ request.requestedAt | date:'shortDate' }}</span>
                        
                        <div class="flex gap-2">
                            <button (click)="accept(request.id)" class="flex-1 bg-primary text-white text-[9px] font-black py-1.5 rounded-lg hover:bg-primary/90 transition-all uppercase tracking-widest">
                                Accept
                            </button>
                            <button (click)="decline(request.id)" class="flex-1 bg-secondary text-foreground text-[9px] font-black py-1.5 rounded-lg hover:bg-secondary/80 transition-all uppercase tracking-widest">
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
                
                <div *ngIf="requests.length === 0" class="py-4 text-center">
                    <p class="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">No friend requests</p>
                </div>
            </div>
        </div>
    `,
    host: { 'class': 'block' }
})
export class FriendRequestsComponent implements OnInit {
    requests: FriendRequest[] = [];

    constructor(private friendService: FriendService) { }

    ngOnInit(): void {
        this.friendService.getFriendRequests(1, 5).subscribe(result => {
            this.requests = result.items;
        });
    }

    accept(id: string): void {
        this.friendService.acceptFriendRequest(id).subscribe(result => {
            if (result.succeeded) {
                this.requests = this.requests.filter(r => r.id !== id);
            }
        });
    }

    decline(id: string): void {
        this.friendService.declineFriendRequest(id).subscribe(result => {
            if (result.succeeded) {
                this.requests = this.requests.filter(r => r.id !== id);
            }
        });
    }
}
