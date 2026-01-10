import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FriendRequestsComponent } from '../../../../features/community/components/friends/friend-requests/friend-requests.component';
import { Friend } from '../../../../core/models/friend.model';


@Component({
    selector: 'app-community-sidebar-right',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule, FriendRequestsComponent],
    template: `
        <div class="space-y-4">
            <!-- Friend Requests -->
            <app-friend-requests></app-friend-requests>

            <!-- Contacts / Friends List -->
            <div class="space-y-0.5">
                <div
                    class="flex items-center justify-between text-primary font-black px-4 mb-2 tracking-[0.2em] text-[10px] uppercase opacity-70">
                    <span>Contacts</span>
                    <div class="flex gap-4 text-sm opacity-60">
                        <i class="fa-solid fa-video hover:text-primary cursor-pointer transition-all"></i>
                        <i class="fa-solid fa-search hover:text-primary cursor-pointer transition-all"></i>
                        <i class="fa-solid fa-ellipsis hover:text-primary cursor-pointer transition-all"></i>
                    </div>
                </div>

                <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 hover:bg-secondary dark:hover:bg-white/5 text-foreground/80 font-semibold text-sm hover:text-primary relative overflow-hidden group hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 group relative"
                    *ngFor="let friend of friends">
                    <div class="relative z-10">
                        <div
                            class="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-background border border-border/50 flex items-center justify-center overflow-hidden group-hover:border-primary/30 transition-all duration-300 shadow-sm">
                            <img *ngIf="friend.profileImageUrl" [src]="friend.profileImageUrl"
                                class="w-full h-full object-cover">
                            <div *ngIf="!friend.profileImageUrl"
                                class="w-full h-full flex items-center justify-center text-[10px] font-black text-muted-foreground group-hover:text-primary transition-all">
                                {{ friend.firstName[0] }}{{ friend.lastName[0] }}
                            </div>
                        </div>
                        <div
                            class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full shadow-lg ring-1 ring-emerald-500/20">
                        </div>
                    </div>
                    <span
                        class="font-bold text-foreground/80 group-hover:text-primary transition-colors truncate relative z-10">
                        {{ friend.firstName }} {{ friend.lastName }}
                    </span>
                </div>

                <div *ngIf="friends.length === 0"
                    class="px-4 py-2 text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest text-center">
                    No friends found
                </div>
            </div>
        </div>
    `
})
export class CommunitySidebarRightComponent {
    @Input() friends: Friend[] = [];
}
