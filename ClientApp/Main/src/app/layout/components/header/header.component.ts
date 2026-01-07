import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service';
import { LayoutService } from '../../../core/services/layout.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/notification.model';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatTooltipModule, TranslateModule, MatMenuModule, MatBadgeModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    themeService = inject(ThemeService);
    layoutService = inject(LayoutService);
    notificationService = inject(NotificationService);

    isSearchOpen = false;
    currentLang = 'en-US';

    notifications$ = this.notificationService.notifications$;
    unreadCount$ = this.notificationService.unreadCount$;

    ngOnInit() {
        // Language functionality removed - using static English text
    }

    toggleSearch() {
        this.isSearchOpen = !this.isSearchOpen;
    }

    switchLanguage(lang: string) {
        // Language switching removed - using static English text
        localStorage.setItem('language', lang); // Persist if not already handled

        // Optional: Direction change logic
        if (lang.startsWith('ar')) {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.lang = 'en';
        }
    }

    setThemeMode(mode: 'light' | 'dark' | 'system') {
        this.themeService.setThemeMode(mode);
    }

    getThemeMode(): 'light' | 'dark' | 'system' {
        return this.themeService.getThemeMode();
    }

    getThemeIcon(): string {
        const mode = this.getThemeMode();
        switch (mode) {
            case 'light':
                return 'fa-sun';
            case 'dark':
                return 'fa-moon';
            case 'system':
                return 'fa-desktop';
            default:
                return 'fa-moon';
        }
    }

    getThemeTooltip(): string {
        const mode = this.getThemeMode();
        const resolvedTheme = this.themeService.isDark() ? 'dark' : 'light';
        
        switch (mode) {
            case 'light':
                return 'Theme: Light';
            case 'dark':
                return 'Theme: Dark';
            case 'system':
                return `Theme: System (${resolvedTheme})`;
            default:
                return 'Theme';
        }
    }

    handleNotificationClick(note: Notification) {
        if (!note.isRead) {
            this.notificationService.markAsRead(note.id).subscribe({
                next: (result) => {
                    if (!result.succeeded) {
                        console.error('Failed to mark notification as read:', result.errors);
                    }
                },
                error: (error) => {
                    console.error('Error marking notification as read:', error);
                }
            });
        }
        if (note.targetUrl) {
            // Navigate if targetUrl exists
            // window.location.href = note.targetUrl; // or router.navigate
        }
    }

    markAllRead() {
        this.notificationService.markAllAsRead().subscribe({
            next: (result) => {
                if (!result.succeeded) {
                    console.error('Failed to mark all notifications as read:', result.errors);
                }
            },
            error: (error) => {
                console.error('Error marking all notifications as read:', error);
            }
        });
    }
}

