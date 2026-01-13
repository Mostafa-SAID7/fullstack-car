import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ThemeService } from '../../../core/services/theme.service';
import { LayoutService } from '../../../core/services/layout.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService, SupportedLanguage } from '../../../core/services/translation.service';
import { Notification } from '../../../core/models/notification.model';


@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        MatTooltipModule,
        TranslateModule,
        MatMenuModule,
        MatBadgeModule,
        RouterModule
    ],
    providers: [DatePipe],
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {

    themeService = inject(ThemeService);
    layoutService = inject(LayoutService);
    notificationService = inject(NotificationService);
    authService = inject(AuthService);
    translationService = inject(TranslationService);
    translateService = inject(TranslateService);
    router = inject(Router);

    isSearchOpen = false;
    
    // Language properties
    supportedLanguages = this.translationService.supportedLanguages;
    currentLanguage$ = this.translationService.currentLanguage$;
    isRTL$ = this.translationService.isRTL$;
    isLoading$ = this.translationService.isLoading$;

    notifications$ = this.notificationService.notifications$;
    unreadCount$ = this.notificationService.unreadCount$;
    currentUser$ = this.authService.currentUser$;

    ngOnInit() {
        // Initialize translations on component load
        this.translationService.initializeTranslations().catch(error => {
            console.error('Failed to initialize translations:', error);
        });
    }

    toggleSearch() {
        this.isSearchOpen = !this.isSearchOpen;
    }

    // Auth Methods
    logout() {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['/auth/login']);
        });
    }

    toggleTheme() {
        const newMode = this.themeService.isDark() ? 'light' : 'dark';
        this.themeService.setThemeMode(newMode);
    }

    getThemeTooltip(): string {
        return `Theme: ${this.themeService.isDark() ? 'Dark' : 'Light'}`;
    }

    handleNotificationClick(note: Notification) {
        if (!note.isRead) {
            this.notificationService.markAsRead(note.id).subscribe();
        }
    }

    markAllRead() {
        this.notificationService.markAllAsRead().subscribe();
    }

    /**
     * Switch application language with enhanced error handling and user feedback
     */
    async switchLanguage(languageCode: string): Promise<void> {
        if (this.isLanguageSelected(languageCode)) {
            console.log(`Language ${languageCode} is already selected`);
            return;
        }

        try {
            console.log(`Switching to language: ${languageCode}`);
            await this.translationService.changeLanguage(languageCode);
            
            // Show success feedback (optional - could be a toast notification)
            console.log(`Successfully switched to ${languageCode}`);
            
            // Update document title if needed
            this.updateDocumentTitle();
            
        } catch (error) {
            console.error(`Failed to switch language to ${languageCode}:`, error);
            
            // Show error feedback (optional - could be a toast notification)
            // For now, just log the error
        }
    }

    /**
     * Update document title based on current language
     */
    private updateDocumentTitle(): void {
        // This could be enhanced to translate the document title
        const currentLang = this.getCurrentLanguage();
        document.documentElement.setAttribute('lang', currentLang.code);
    }

    /**
     * Get current language info
     */
    getCurrentLanguage(): SupportedLanguage {
        return this.translationService.getCurrentLanguage();
    }

    /**
     * Check if a language is currently selected
     */
    isLanguageSelected(languageCode: string): boolean {
        return this.translationService.getCurrentLanguage().code === languageCode;
    }
}


