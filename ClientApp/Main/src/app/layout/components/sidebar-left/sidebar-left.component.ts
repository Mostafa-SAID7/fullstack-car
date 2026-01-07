import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-sidebar-left',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterModule],
    templateUrl: './sidebar-left.component.html'
})
export class SidebarLeftComponent implements OnInit {
    currentUser: any;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe((user: any) => {
        });
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }
}
