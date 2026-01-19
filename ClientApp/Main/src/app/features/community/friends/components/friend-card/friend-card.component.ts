import { Component, Input, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Friend } from '../../models/friend.model';
import { FriendService } from '../../services/friend.service';
import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
    selector: 'app-friend-card',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './friend-card.component.html',
    host: { 'class': 'block' }
})
export class FriendCardComponent implements OnDestroy {
    @Input() friend!: Friend;
    
    private destroy$ = new Subject<void>();
    private translationService = inject(TranslationService);

    constructor(
        private friendService: FriendService,
        private translate: TranslateService
    ) { 
        // Load social translations on component initialization
        this.loadSocialTranslations();
        
        // Subscribe to language changes
        this.translationService.currentLanguage$
            .pipe(takeUntil(this.destroy$))
            .subscribe(async () => {
                await this.loadSocialTranslations();
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
            
            console.log('Social translations loaded for friend card from backend API');
        } catch (error) {
            console.error('Failed to load social translations for friend card:', error);
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

    removeFriend(): void {
        const confirmMessage = this.translate.instant('friends.confirmRemove');
        if (confirm(confirmMessage)) {
            this.friendService.removeFriend(this.friend.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (result) => {
                        if (result.succeeded) {
                            const successMessage = this.translate.instant('friends.friendRemoved');
                            console.log(successMessage);
                            // Emit event to parent to refresh list
                            // You could implement an EventEmitter here if needed
                        } else {
                            const errorMessage = this.translate.instant('friends.removeFriendError');
                            console.error(errorMessage, result.errors);
                        }
                    },
                    error: (error) => {
                        const errorMessage = this.translate.instant('friends.removeFriendError');
                        console.error(errorMessage, error);
                    }
                });
        }
    }

    sendMessage(): void {
        // Navigate to messaging interface or open message dialog
        console.log('Opening message interface for:', this.friend.firstName);
        // This would typically navigate to a messaging component
        // or open a message modal/dialog
    }
}
