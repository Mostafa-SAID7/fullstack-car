import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FriendRequest } from '../../../../../core/models/friend.model';
import { FriendService } from '../../services/friend.service';
import { TranslationService } from '../../../../../core/services/translation.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
    selector: 'app-friend-requests',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
        <div class="fb-card p-4">
            <div class="flex items-center justify-between mb-3 border-b border-black/5 dark:border-white/5 pb-2">
                <h2 class="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-70">{{ 'friends.friendRequests' | translate }}</h2>
                <span class="bg-primary/20 text-primary text-[9px] font-black px-1.5 py-0.5 rounded-lg shadow-sm border border-primary/10">{{ requests.length }}</span>
            </div>
            
            <div class="space-y-2">
                <div *ngFor="let request of requests" class="flex items-center gap-2 group p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    <!-- Compact Avatar -->
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary/10 to-primary/5 border border-primary/10 overflow-hidden shadow-sm flex-shrink-0">
                        <img *ngIf="request.requesterProfileImageUrl" [src]="request.requesterProfileImageUrl" class="w-full h-full object-cover">
                        <div *ngIf="!request.requesterProfileImageUrl" class="w-full h-full flex items-center justify-center text-[10px] font-black text-primary">
                            {{ request.requesterFirstName[0] }}{{ request.requesterLastName[0] }}
                        </div>
                    </div>

                    <!-- Name and Date (Single Line Concept) -->
                    <div class="flex-1 min-w-0">
                        <h4 class="text-[11px] font-bold truncate text-foreground/90 group-hover:text-primary transition-colors">{{ request.requesterFirstName }}</h4>
                        <p class="text-[9px] text-muted-foreground/60 uppercase tracking-widest">{{ 'friends.requestReceived' | translate }}</p>
                    </div>

                    <!-- Icon Actions -->
                    <div class="flex gap-1 flex-shrink-0">
                        <button (click)="accept(request.id)" 
                            class="w-7 h-7 flex items-center justify-center rounded-lg bg-primary text-white hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-90"
                            [title]="'friends.acceptRequest' | translate">
                            <i class="fa-solid fa-check text-[10px]"></i>
                        </button>
                        <button (click)="decline(request.id)" 
                            class="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10 text-muted-foreground hover:bg-red-500 hover:text-white transition-all active:scale-90"
                            [title]="'friends.declineRequest' | translate">
                            <i class="fa-solid fa-xmark text-[10px]"></i>
                        </button>
                    </div>
                </div>
                
                <div *ngIf="requests.length === 0" class="py-2 text-center">
                    <p class="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">{{ 'friends.noRequests' | translate }}</p>
                </div>
            </div>
        </div>
    `,
    host: { 'class': 'block' }
})
export class FriendRequestsComponent implements OnInit, OnDestroy {
    requests: FriendRequest[] = [];
    private destroy$ = new Subject<void>();
    private translationService = inject(TranslationService);
    private notificationService = inject(NotificationService);

    constructor(
        private friendService: FriendService,
        private translate: TranslateService
    ) { }

    async ngOnInit(): Promise<void> {
        // Load social feature translations from backend API
        await this.loadSocialTranslations();
        this.loadFriendRequests();
        
        // Subscribe to language changes to reload translations
        this.translationService.currentLanguage$
            .pipe(takeUntil(this.destroy$))
            .subscribe(async (newLanguage) => {
                await this.loadSocialTranslations();
                // Refresh friend requests with new language
                this.loadFriendRequests();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private async loadSocialTranslations(): Promise<void> {
        try {
            const currentLanguage = this.translationService.getCurrentLanguage().code;
            
            // Load social translations from backend API
            await this.translationService.loadSingleFeatureTranslations(currentLanguage, 'social');
            
            // Update ngx-translate with the loaded translations
            const translations = await this.translationService.loadTranslations(currentLanguage, 'social').pipe(takeUntil(this.destroy$)).toPromise();
            this.translate.setTranslation(currentLanguage, translations, true);
            
            console.log('Social translations loaded for friend requests from backend API');
        } catch (error) {
            console.error('Failed to load social translations for friend requests:', error);
            // Fallback to English if current language fails
            if (this.translationService.getCurrentLanguage().code !== 'en-US') {
                try {
                    const fallbackTranslations = await this.translationService.loadTranslations('en-US', 'social').pipe(takeUntil(this.destroy$)).toPromise();
                    this.translate.setTranslation('en-US', fallbackTranslations, true);
                } catch (fallbackError) {
                    console.error('Failed to load fallback translations:', fallbackError);
                }
            }
        }
    }

    private loadFriendRequests(): void {
        this.friendService.getFriendRequests(1, 5)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    this.requests = result.items || [];
                },
                error: (error) => {
                    console.error('Error loading friend requests:', error);
                    this.requests = [];
                }
            });
    }

    accept(id: string): void {
        const request = this.requests.find(r => r.id === id);
        if (!request) return;

        this.friendService.acceptFriendRequest(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    if (result.succeeded) {
                        this.requests = this.requests.filter(r => r.id !== id);
                        
                        const userName = `${request.requesterFirstName} ${request.requesterLastName}`;
                        
                        // Show localized success notification with user's name
                        const successMessage = this.translate.instant('friends.requestAccepted');
                        const notificationMessage = this.translate.instant('notifications.friendRequestAccepted', { 0: userName });
                        
                        console.log(`${successMessage}: ${notificationMessage}`);
                        this.showLocalizedNotification('friends.requestAccepted', 'success', { userName });
                        
                        // Add a localized system notification
                        this.addLocalizedSystemNotification('notifications.friendRequestAccepted', { 0: userName });
                    } else {
                        console.error('Failed to accept friend request:', result.errors);
                        this.showLocalizedNotification('friends.requestAcceptError', 'error');
                    }
                },
                error: (error) => {
                    console.error('Error accepting friend request:', error);
                    this.showLocalizedNotification('friends.requestAcceptError', 'error');
                }
            });
    }

    decline(id: string): void {
        const request = this.requests.find(r => r.id === id);
        if (!request) return;

        this.friendService.declineFriendRequest(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    if (result.succeeded) {
                        this.requests = this.requests.filter(r => r.id !== id);
                        
                        const userName = `${request.requesterFirstName} ${request.requesterLastName}`;
                        
                        // Show localized success notification
                        const successMessage = this.translate.instant('friends.requestDeclined');
                        console.log(`${successMessage}: ${userName}`);
                        
                        this.showLocalizedNotification('friends.requestDeclined', 'success', { userName });
                    } else {
                        console.error('Failed to decline friend request:', result.errors);
                        this.showLocalizedNotification('friends.requestDeclineError', 'error');
                    }
                },
                error: (error) => {
                    console.error('Error declining friend request:', error);
                    this.showLocalizedNotification('friends.requestDeclineError', 'error');
                }
            });
    }

    private showLocalizedNotification(messageKey: string, type: 'success' | 'error', params?: any): void {
        const message = this.translate.instant(messageKey, params);
        
        // Enhanced notification with RTL support
        const isRTL = this.translationService.isCurrentLanguageRTL();
        const notificationClass = isRTL ? 'rtl-notification' : 'ltr-notification';
        
        console.log(`${type.toUpperCase()} (${notificationClass}): ${message}`);
        
        // Here you would typically integrate with a toast notification service
        // For now, we'll create a simple visual feedback
        this.createVisualNotification(message, type, isRTL);
    }

    private createVisualNotification(message: string, type: 'success' | 'error', isRTL: boolean): void {
        // Create a temporary notification element for visual feedback
        const notification = document.createElement('div');
        notification.className = `fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;
        notification.style.direction = isRTL ? 'rtl' : 'ltr';
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    private addLocalizedSystemNotification(messageKey: string, params?: any): void {
        const message = this.translate.instant(messageKey, params);
        
        // Add to browser notifications if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(this.translate.instant('notifications.friendRequest'), {
                body: message,
                icon: '/assets/icons/friend-request.png',
                dir: this.translationService.isCurrentLanguageRTL() ? 'rtl' : 'ltr',
                lang: this.translationService.getCurrentLanguage().code
            });
        }
    }
}
