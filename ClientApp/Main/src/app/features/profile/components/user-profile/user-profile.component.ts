import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { UserDto } from '../../../../core/models/auth.model';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-profile.component.html',
    styles: [`
    .profile-header-gradient {
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
    }
  `]
})
export class UserProfileComponent implements OnInit {
    private authService = inject(AuthService);
    currentUser: UserDto | null = null;
    activeTab = 'posts';

    stats = [
        { label: 'Followers', value: '1.2k' },
        { label: 'Following', value: '450' },
        { label: 'Posts', value: '84' }
    ];

    tabs = [
        { id: 'posts', label: 'Posts', icon: 'fa-th-large' },
        { id: 'photos', label: 'Photos', icon: 'fa-image' },
        { id: 'about', label: 'About', icon: 'fa-info-circle' }
    ];

    ngOnInit() {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    setTab(tabId: string) {
        this.activeTab = tabId;
    }
}
