import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service';
import { LayoutService } from '../../../core/services/layout.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { AIAgentService } from '../../../features/ai-agent/services/ai-agent.service';
import { Notification } from '../../../core/models/notification.model';

interface ChatMessage {
    text: string;
    isUser: boolean;
    timestamp: Date;
}

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        MatTooltipModule,
        TranslateModule,
        MatMenuModule,
        MatBadgeModule,
        RouterModule,
        FormsModule
    ],
    providers: [DatePipe],
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit {
    themeService = inject(ThemeService);
    layoutService = inject(LayoutService);
    notificationService = inject(NotificationService);
    authService = inject(AuthService);
    aiAgentService = inject(AIAgentService);
    router = inject(Router);

    isSearchOpen = false;
    currentLang = 'en-US';

    // AI Chat State
    aiMessages: ChatMessage[] = [];
    currentChatMsg = '';
    isAiTyping = false;
    aiMode: 'chat' | 'maintenance' | 'recommendation' = 'chat';
    showAiModes = false;

    @ViewChild('aiChatContainer') private aiChatContainer!: ElementRef;

    notifications$ = this.notificationService.notifications$;
    unreadCount$ = this.notificationService.unreadCount$;
    currentUser$ = this.authService.currentUser$;

    // Messenger Mock Data
    mockMessages = [
        { id: 1, user: 'Sarah Jenkins', text: 'Hey, did you see the new Off-road guide?', time: '2m ago', online: true },
        { id: 2, user: 'Mike Ross', text: 'The Egypt meet is next Friday!', time: '1h ago', online: true },
        { id: 3, user: 'Alex Cooper', text: 'Thanks for the maintenance advice.', time: '5h ago', online: false }
    ];

    ngOnInit() {
        this.aiMessages.push({
            text: "Hello! I'm your AI automotive assistant. **How can I help you today?**",
            isUser: false,
            timestamp: new Date()
        });
    }

    toggleSearch() {
        this.isSearchOpen = !this.isSearchOpen;
    }

    // AI Chat Methods
    sendAiMessage() {
        if (!this.currentChatMsg.trim() || this.isAiTyping) return;

        const userMsg = this.currentChatMsg;
        this.aiMessages.push({ text: userMsg, isUser: true, timestamp: new Date() });
        this.currentChatMsg = '';
        this.isAiTyping = true;
        this.scrollToAiBottom();

        this.aiAgentService.chat({
            message: this.aiMode !== 'chat' ? `[${this.aiMode.toUpperCase()} MODE] ${userMsg}` : userMsg,
            context: 'Header Chat Dropdown'
        }).subscribe({
            next: (res) => {
                this.isAiTyping = false;
                this.aiMessages.push({ text: res?.message || 'No response.', isUser: false, timestamp: new Date() });
                this.scrollToAiBottom();
            },
            error: () => {
                this.isAiTyping = false;
                this.aiMessages.push({ text: 'Connection trouble. Try again later.', isUser: false, timestamp: new Date() });
                this.scrollToAiBottom();
            }
        });
    }

    setAiMode(mode: any) {
        this.aiMode = mode;
        this.showAiModes = false;
    }

    parseMarkdown(text: string): string {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n- (.*)/g, '<br>• $1')
            .replace(/\n/g, '<br>');
    }

    private scrollToAiBottom() {
        setTimeout(() => {
            if (this.aiChatContainer) {
                this.aiChatContainer.nativeElement.scrollTop = this.aiChatContainer.nativeElement.scrollHeight;
            }
        }, 100);
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

    switchLanguage(lang: string) {
        localStorage.setItem('language', lang);
    }
}


