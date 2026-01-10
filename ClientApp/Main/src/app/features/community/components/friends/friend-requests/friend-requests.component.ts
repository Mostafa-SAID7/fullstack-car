import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FriendRequest } from '../../../../../core/models/friend.model';
import { FriendService } from '../../../services/friend.service';

@Component({
    selector: 'app-friend-requests',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
        <div class="fb-card p-4">
            <div class="flex items-center justify-between mb-3 border-b border-black/5 dark:border-white/5 pb-2">
                <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-70">Requests</h2>
                <span class="bg-primary/20 text-primary text-[9px] font-black px-1.5 py-0.5 rounded-lg shadow-sm border border-primary/10">{{ requests.length }}</span>
            </div>
            
            <div class="space-y-2">
                <div *ngFor="let request of requests" class="flex items-center gap-2 group p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <!-- Compact Avatar -->
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary/10 to-primary/5 border border-primary/10 overflow-hidden shadow-sm flex-shrink-0">
                        <img *ngIf="request.requesterProfileImageUrl" [src]="request.requesterProfileImageUrl" class="w-full h-full object-cover">
                        <div *ngIf="!request.requesterProfileImageUrl" class="w-full h-full flex items-center justify-center text-[10px] font-black text-primary">
                            {{ request.requesterFirstName[0] }}{{ request.requesterLastName[0] }}
                        </div>
                    </div>

                    <!-- Name and Date (Single Line Concept) -->
                    <div class="flex-1 min-w-0">
                        <h4 class="text-[11px] font-bold truncate text-foreground/90 group-hover:text-primary transition-colors">{{ request.requesterFirstName }}</h4>
                    </div>

                    <!-- Icon Actions -->
                    <div class="flex gap-1 flex-shrink-0">
                        <button (click)="accept(request.id)" 
                            class="w-7 h-7 flex items-center justify-center rounded-lg bg-primary text-white hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-90"
                            title="Accept">
                            <i class="fa-solid fa-check text-[10px]"></i>
                        </button>
                        <button (click)="decline(request.id)" 
                            class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10 text-muted-foreground hover:bg-red-500 hover:text-white transition-all active:scale-90"
                            title="Decline">
                            <i class="fa-solid fa-xmark text-[10px]"></i>
                        </button>
                    </div>
                </div>
                
                <div *ngIf="requests.length === 0" class="py-2 text-center">
                    <p class="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">Clear</p>
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
            this.requests = result.items || [];
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
