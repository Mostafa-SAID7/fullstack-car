import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
    translate = inject(TranslateService);

    isSearchOpen = false;
    currentLang = 'en-US';

    notifications$ = this.notificationService.notifications$;
    unreadCount$ = this.notificationService.unreadCount$;

    ngOnInit() {
        this.currentLang = this.translate.currentLang || 'en-US';
        this.translate.onLangChange.subscribe(event => {
            this.currentLang = event.lang;
        });
    }

    toggleSearch() {
        this.isSearchOpen = !this.isSearchOpen;
    }

    switchLanguage(lang: string) {
        this.translate.use(lang);
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

    handleNotificationClick(note: Notification) {
        if (!note.isRead) {
            this.notificationService.markAsRead(note.id);
        }
        if (note.targetUrl) {
            // Navigate if targetUrl exists
            // window.location.href = note.targetUrl; // or router.navigate
        }
    }

    markAllRead() {
        this.notificationService.markAllAsRead();
    }
}

