import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeService } from '../../../core/services/theme.service';
import { LayoutService } from '../../../core/services/layout.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslationService, SupportedLanguage } from '../../../core/services/translation.service';
import { Notification } from '../../../core/models/notification.model';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Modern Header Component using Angular 19 Features
 * 
 * Demonstrates:
 * - Angular Signals for reactive state
 * - New control flow syntax (@if, @for, @switch)
 * - toSignal() for Observable to Signal conversion
 * - Computed signals for derived state
 */
@Component({
  selector: 'app-header-modern',
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
  templateUrl: './header-modern.component.html'
})
export class HeaderModernComponent implements OnInit {
  // Services
  themeService = inject(ThemeService);
  layoutService = inject(LayoutService);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  translationService = inject(TranslationService);
  router = inject(Router);

  // Local state using Signals
  isSearchOpen = signal(false);
  
  // Convert Observables to Signals using toSignal()
  currentLanguage = toSignal(this.translationService.currentLanguage$, { 
    initialValue: this.translationService.getCurrentLanguage() 
  });
  isRTL = toSignal(this.translationService.isRTL$, { initialValue: false });
  isLoading = toSignal(this.translationService.isLoading$, { initialValue: false });
  notifications = toSignal(this.notificationService.notifications$, { initialValue: [] });
  unreadCount = toSignal(this.notificationService.unreadCount$, { initialValue: 0 });
  currentUser = toSignal(this.authService.currentUser$, { initialValue: null });

  // Computed signals
  supportedLanguages = signal<SupportedLanguage[]>(this.translationService.supportedLanguages);
  
  hasNotifications = computed(() => this.notifications().length > 0);
  hasUnreadNotifications = computed(() => this.unreadCount() > 0);
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return 'UP';
    const first = user.firstName?.[0] || 'U';
    const last = user.lastName?.[0] || 'P';
    return `${first}${last}`;
  });
  
  themeTooltip = computed(() => 
    `Theme: ${this.themeService.isDark() ? 'Dark' : 'Light'}`
  );

  ngOnInit() {
    // Initialize translations on component load
    this.translationService.initializeTranslations().catch(error => {
      console.error('Failed to initialize translations:', error);
    });
  }

  // UI Actions
  toggleSearch(): void {
    this.isSearchOpen.update(open => !open);
  }

  toggleTheme(): void {
    const newMode = this.themeService.isDark() ? 'light' : 'dark';
    this.themeService.setThemeMode(newMode);
  }

  // Auth Methods
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  // Notification Methods
  handleNotificationClick(note: Notification): void {
    if (!note.isRead) {
      this.notificationService.markAsRead(note.id).subscribe();
    }
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead().subscribe();
  }

  // Language Methods
  async switchLanguage(languageCode: string): Promise<void> {
    if (this.isLanguageSelected(languageCode)) {
      console.log(`Language ${languageCode} is already selected`);
      return;
    }

    try {
      console.log(`Switching to language: ${languageCode}`);
      await this.translationService.changeLanguage(languageCode);
      console.log(`Successfully switched to ${languageCode}`);
      this.updateDocumentTitle();
    } catch (error) {
      console.error(`Failed to switch language to ${languageCode}:`, error);
    }
  }

  private updateDocumentTitle(): void {
    const currentLang = this.getCurrentLanguage();
    document.documentElement.setAttribute('lang', currentLang.code);
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.translationService.getCurrentLanguage();
  }

  isLanguageSelected(languageCode: string): boolean {
    return this.translationService.getCurrentLanguage().code === languageCode;
  }
}
