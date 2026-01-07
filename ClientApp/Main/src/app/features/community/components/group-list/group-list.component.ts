import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Group } from '../../../../core/models/group.model';
import { GroupService } from '../../services/group.service';
import { GroupCardComponent } from '../group-card/group-card.component';

@Component({
    selector: 'app-group-list',
    standalone: true,
    imports: [CommonModule, TranslateModule, GroupCardComponent],
    template: `
        <div class="space-y-4">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-sm font-black uppercase tracking-widest text-primary">Suggested Groups</h2>
                <button class="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary">See All</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <app-group-card *ngFor="let group of groups" [group]="group"></app-group-card>
            </div>
            <div *ngIf="groups.length === 0" class="fb-card p-10 text-center animate-pulse">
                <i class="fa-solid fa-users text-4xl text-muted-foreground/20 mb-3"></i>
                <p class="text-sm text-muted-foreground/60 font-black uppercase tracking-widest">No groups available</p>
            </div>
        </div>
    `,
    host: { 'class': 'block' }
})
export class GroupListComponent implements OnInit {
    groups: Group[] = [];

    constructor(private groupService: GroupService) { }

    ngOnInit(): void {
        this.groupService.getGroups(1, 4).subscribe(result => {
            this.groups = result.items;
        });
    }
}
