import { Component, inject, ViewChild, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarLeftComponent } from '../../components/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from '../../components/sidebar-right/sidebar-right.component';
import { AIChatWidgetComponent } from '../../../features/ai-agent/components/ai-chat-widget/ai-chat-widget.component';
import { LayoutService } from '../../../core/services/layout.service';
import { AIAgentService } from '../../../features/ai-agent/services/ai-agent.service';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';

interface WidgetState {
    isOpen: boolean;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    lastOpenedTab: 'ai' | 'messenger';
}

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        HeaderComponent,
        SidebarLeftComponent,
        SidebarRightComponent,
        ToastContainerComponent,
        FormsModule
    ],
    providers: [DatePipe],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
    private aiAgentService = inject(AIAgentService);
    private readonly WIDGET_STATE_KEY = 'chat-widget-state';
    private readonly UNREAD_COUNT_KEY = 'chat-unread-count';

    // Chat Actions State
    isAiVisible = false;
    isMessengerVisible = false;
    aiMessages: any[] = [];
    currentChatMsg = '';
    isAiTyping = false;
    aiMode: 'chat' | 'maintenance' | 'recommendation' = 'chat';
    showAiModes = false;
    
    // Widget State
    widgetPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right';
    unreadCount: number = 0;
    showPositionMenu: boolean = false;

    // Messenger Mock Data
    mockMessages = [
        { id: 1, user: 'Sarah Jenkins', text: 'Hey, did you see the new Off-road guide?', time: '2m ago', online: true },
        { id: 2, user: 'Mike Ross', text: 'The Egypt meet is next Friday!', time: '1h ago', online: true },
        { id: 3, user: 'Alex Cooper', text: 'Thanks for the maintenance advice.', time: '5h ago', online: false }
    ];

    @ViewChild('aiChatContainer') private aiChatContainer!: ElementRef;

    constructor(public layoutService: LayoutService) { }

    ngOnInit(): void {
        this.loadWidgetState();
        this.loadUnreadCount();
    }

    ngOnDestroy(): void {
        this.saveWidgetState();
    }

    // Keyboard Shortcuts
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        // Ctrl+K or Cmd+K to toggle AI chat
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            this.toggleAi();
        }
        
        // Ctrl+M or Cmd+M to toggle messenger
        if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
            event.preventDefault();
            this.toggleMessenger();
        }
        
        // Escape to close any open widget
        if (event.key === 'Escape') {
            if (this.isAiVisible || this.isMessengerVisible) {
                this.closeAllWidgets();
            }
        }
    }

    // Widget State Management
    private loadWidgetState(): void {
        try {
            const savedState = localStorage.getItem(this.WIDGET_STATE_KEY);
            if (savedState) {
                const state: WidgetState = JSON.parse(savedState);
                this.widgetPosition = state.position || 'bottom-right';
                // Don't auto-open on load, just restore position
            }
        } catch (error) {
            console.error('Error loading widget state:', error);
        }
    }

    private saveWidgetState(): void {
        try {
            const state: WidgetState = {
                isOpen: this.isAiVisible || this.isMessengerVisible,
                position: this.widgetPosition,
                lastOpenedTab: this.isAiVisible ? 'ai' : 'messenger'
            };
            localStorage.setItem(this.WIDGET_STATE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Error saving widget state:', error);
        }
    }

    private loadUnreadCount(): void {
        try {
            const count = localStorage.getItem(this.UNREAD_COUNT_KEY);
            this.unreadCount = count ? parseInt(count, 10) : 3; // Default to 3 for demo
        } catch (error) {
            console.error('Error loading unread count:', error);
            this.unreadCount = 3;
        }
    }

    private saveUnreadCount(): void {
        try {
            localStorage.setItem(this.UNREAD_COUNT_KEY, this.unreadCount.toString());
        } catch (error) {
            console.error('Error saving unread count:', error);
        }
    }

    // Widget Position
    setWidgetPosition(position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'): void {
        this.widgetPosition = position;
        this.showPositionMenu = false;
        this.saveWidgetState();
    }

    togglePositionMenu(): void {
        this.showPositionMenu = !this.showPositionMenu;
    }

    getPositionClasses(): string {
        const baseClasses = 'fixed z-[60] flex flex-col gap-4';
        const sizeClasses = 'w-[calc(100vw-3rem)] sm:w-[380px]';
        
        switch (this.widgetPosition) {
            case 'bottom-right':
                return `${baseClasses} ${sizeClasses} bottom-6 right-6`;
            case 'bottom-left':
                return `${baseClasses} ${sizeClasses} bottom-6 left-6`;
            case 'top-right':
                return `${baseClasses} ${sizeClasses} top-20 right-6`;
            case 'top-left':
                return `${baseClasses} ${sizeClasses} top-20 left-6`;
            default:
                return `${baseClasses} ${sizeClasses} bottom-6 right-6`;
        }
    }

    // Modal/Toggle logic
    toggleAi(): void {
        this.isAiVisible = !this.isAiVisible;
        if (this.isAiVisible) {
            this.isMessengerVisible = false;
            this.unreadCount = 0; // Clear unread when opening
            this.saveUnreadCount();
            if (this.aiMessages.length === 0) {
                this.aiMessages.push({
                    text: "Hello! I'm your AI automotive assistant. **How can I help you today?**\n\n**Quick Actions:**\n- Find a car\n- Check maintenance\n- Get recommendations",
                    isUser: false,
                    timestamp: new Date()
                });
            }
        }
        this.saveWidgetState();
    }

    toggleMessenger(): void {
        this.isMessengerVisible = !this.isMessengerVisible;
        if (this.isMessengerVisible) {
            this.isAiVisible = false;
        }
        this.saveWidgetState();
    }

    closeAllWidgets(): void {
        this.isAiVisible = false;
        this.isMessengerVisible = false;
        this.showAiModes = false;
        this.showPositionMenu = false;
        this.saveWidgetState();
    }

    sendAiMessage(): void {
        if (!this.currentChatMsg.trim() || this.isAiTyping) return;

        const userMsg = this.currentChatMsg;
        this.aiMessages.push({ text: userMsg, isUser: true, timestamp: new Date() });
        this.currentChatMsg = '';
        this.isAiTyping = true;

        this.aiAgentService.chat({
            message: this.aiMode !== 'chat' ? `[${this.aiMode.toUpperCase()} MODE] ${userMsg}` : userMsg,
            context: { source: 'Global Chat' }
        }).subscribe({
            next: (res: any) => {
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

    private scrollToAiBottom(): void {
        setTimeout(() => {
            if (this.aiChatContainer) {
                this.aiChatContainer.nativeElement.scrollTop = this.aiChatContainer.nativeElement.scrollHeight;
            }
        }, 100);
    }

    setAiMode(mode: any): void {
        this.aiMode = mode;
        this.showAiModes = false;
        
        // Add system message about mode change
        this.aiMessages.push({
            text: `Switched to **${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode**. How can I assist you?`,
            isUser: false,
            timestamp: new Date(),
            isSystem: true
        });
        this.scrollToAiBottom();
    }

    parseMarkdown(text: string): string {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n- (.*)/g, '<br>• $1')
            .replace(/\n/g, '<br>');
    }

    // Simulate receiving a new message (for demo)
    simulateNewMessage(): void {
        this.unreadCount++;
        this.saveUnreadCount();
    }
}
