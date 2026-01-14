import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TranslationService } from '../../../../../core/services/translation.service';
import { FriendService } from '../../../services/friend.service';
import { MessageInterfaceComponent, Conversation } from '../../messaging/message-interface/message-interface.component';

@Component({
    selector: 'app-friend-list',
    standalone: true,
    imports: [CommonModule, TranslateModule, PaginationComponent, ReactiveFormsModule, MessageInterfaceComponent],
    template: `
    <div class="p-4 lg:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-6">
      
      <!-- Card 1: Search & Actions -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <form [formGroup]="searchForm" class="flex flex-col md:flex-row gap-4 mb-0">
          <!-- Search Input -->
          <div class="relative flex-grow group">
            <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300"></i>
            <input formControlName="searchTerm" type="text" [placeholder]="'friends.searchPlaceholder' | translate"
              class="w-full bg-secondary/30 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 rounded-full pl-12 pr-6 py-4 outline-none transition-all text-foreground font-bold">
          </div>

          <!-- Filter Actions -->
          <div class="flex gap-2">
            <button type="button" (click)="toggleFilters()"
              [ngClass]="showFilters ? 'bg-primary text-white' : 'bg-secondary dark:bg-white/5'"
              class="px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-sliders-h"></i>
              <span>{{ 'common.filters' | translate }}</span>
            </button>

            <button type="button"
              class="px-8 py-4 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-3 whitespace-nowrap">
              <i class="fas fa-user-plus"></i>
              <span>{{ 'friends.findFriends' | translate }}</span>
            </button>
          </div>
        </form>

        <!-- Collapsible Filters -->
        <div *ngIf="showFilters" class="pt-6 animate-fade-in">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col">
              <label class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 ml-4 opacity-70">{{ 'common.sortBy' | translate }}</label>
              <div class="relative">
                <i class="fas fa-sort absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                <select formControlName="sortBy"
                  class="w-full bg-secondary/30 dark:bg-white/5 border-none rounded-2xl pl-12 pr-6 py-4 outline-none transition-all text-sm font-bold cursor-pointer appearance-none">
                  <option value="name">{{ 'friends.sortByName' | translate }}</option>
                  <option value="recent">{{ 'friends.sortByRecent' | translate }}</option>
                  <option value="online">{{ 'friends.sortByOnline' | translate }}</option>
                </select>
                <i class="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Content Grid -->
      <div class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 lg:p-8 shadow-xl border border-black/5 dark:border-white/5 min-h-[500px]">
        <!-- Loading -->
        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="aspect-square bg-secondary/30 dark:bg-white/5 rounded-3xl animate-pulse"></div>
        </div>

        <!-- Grid -->
        <div *ngIf="!loading && friends.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let friend of friends" class="bg-secondary/10 dark:bg-white/5 rounded-[2rem] p-6 border border-black/5 dark:border-white/5 hover:scale-[1.02] transition-all cursor-pointer">
            <div class="w-20 h-20 bg-primary/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <i class="fas fa-user text-2xl text-primary"></i>
            </div>
            <h3 class="text-center font-black uppercase text-sm tracking-widest text-foreground">{{friend.firstName}} {{friend.lastName}}</h3>
            <p class="text-center text-[10px] font-bold text-muted-foreground uppercase mt-1">{{ 'connections.friend' | translate }}</p>
            <div class="flex justify-center gap-2 mt-4">
              <button (click)="openMessageInterface(friend)"
                class="w-8 h-8 rounded-lg hover:bg-primary/5 flex items-center justify-center text-muted-foreground/60 hover:text-primary transition-all"
                [title]="'messaging.sendMessage' | translate">
                <i class="fa-solid fa-comment-dots text-xs"></i>
              </button>
              <button (click)="removeFriend(friend.id)"
                class="w-8 h-8 rounded-lg hover:bg-red-500/5 flex items-center justify-center text-muted-foreground/60 hover:text-red-500 transition-all"
                [title]="'friends.removeFriend' | translate">
                <i class="fa-solid fa-user-minus text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && friends.length === 0" class="py-24 text-center">
          <div class="w-20 h-20 bg-secondary/30 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <i class="fas fa-user-group text-3xl text-muted-foreground/30"></i>
          </div>
          <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-2">{{ 'friends.noFriends' | translate }}</h3>
          <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest">{{ 'friends.connectWithCommunity' | translate }}</p>
        </div>
      </div>

      <!-- Card 3: Pagination -->
      <div *ngIf="totalPages > 1" class="bg-white dark:bg-[#111] rounded-[2.5rem] p-6 shadow-xl border border-black/5 dark:border-white/5">
        <app-pagination [currentPage]="currentPage" [totalPages]="totalPages" [pageSize]="pageSize"
          [totalItems]="totalCount" (pageChange)="onPageChange($event)"></app-pagination>
      </div>

      <!-- Message Interface Modal -->
      <div *ngIf="selectedConversation" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div class="flex justify-end mb-4">
            <button (click)="closeMessageInterface()" 
                    class="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <app-message-interface [conversation]="selectedConversation"></app-message-interface>
        </div>
      </div>

    </div>
  `
})
export class FriendListComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private translationService = inject(TranslationService);
    private friendService = inject(FriendService);
    
    friends: any[] = [];
    loading = false;
    currentPage = 1;
    pageSize = 12;
    totalCount = 0;
    totalPages = 0;
    showFilters = false;
    searchForm: FormGroup;
    selectedConversation: Conversation | null = null;

    constructor(
        private fb: FormBuilder,
        private translate: TranslateService
    ) {
        this.searchForm = this.fb.group({
            searchTerm: [''],
            sortBy: ['name']
        });
    }

    async ngOnInit(): Promise<void> {
        // Load social feature translations from backend API
        await this.loadSocialTranslations();
        this.loadFriends();
        this.setupSearch();
        
        // Subscribe to language changes to reload translations
        this.translationService.currentLanguage$
            .pipe(takeUntil(this.destroy$))
            .subscribe(async (newLanguage) => {
                await this.loadSocialTranslations();
                // Refresh friend list with new language
                this.loadFriends();
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
            const translations = await this.translationService.loadTranslations(currentLanguage, 'social').toPromise();
            this.translate.setTranslation(currentLanguage, translations, true);
            
            console.log('Social translations loaded successfully from backend API');
        } catch (error) {
            console.error('Failed to load social translations from backend API:', error);
            // Fallback to English if current language fails
            if (this.translationService.getCurrentLanguage().code !== 'en-US') {
                try {
                    const fallbackTranslations = await this.translationService.loadTranslations('en-US', 'social').toPromise();
                    this.translate.setTranslation('en-US', fallbackTranslations, true);
                    console.log('Loaded fallback English translations for social features');
                } catch (fallbackError) {
                    console.error('Failed to load fallback translations:', fallbackError);
                }
            }
        }
    }

    private setupSearch(): void {
        this.searchForm.get('searchTerm')?.valueChanges
            .pipe(
                debounceTime(500), 
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.onSearch());

        this.searchForm.get('sortBy')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.onSearch());
    }

    onSearch(): void {
        this.currentPage = 1;
        this.loadFriends();
    }

    loadFriends(): void {
        this.loading = true;
        
        this.friendService.getFriends(this.currentPage, this.pageSize)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result) => {
                    this.friends = result.items || [];
                    this.totalCount = result.totalCount || 0;
                    this.totalPages = result.totalPages || 1;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading friends:', error);
                    // Fallback to mock data for development
                    this.friends = [
                        { id: '1', firstName: 'Ahmed', lastName: 'Ali', friendsSince: new Date() },
                        { id: '2', firstName: 'Sara', lastName: 'Hassan', friendsSince: new Date() },
                        { id: '3', firstName: 'Omar', lastName: 'Khaled', friendsSince: new Date() },
                        { id: '4', firstName: 'Zainab', lastName: 'Ibrahim', friendsSince: new Date() }
                    ];
                    this.totalCount = 4;
                    this.totalPages = 1;
                    this.loading = false;
                }
            });
    }

    removeFriend(friendId: string): void {
        const confirmMessage = this.translate.instant('friends.confirmRemove');
        if (confirm(confirmMessage)) {
            this.friendService.removeFriend(friendId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (result) => {
                        if (result.succeeded) {
                            this.friends = this.friends.filter(f => f.id !== friendId);
                            this.totalCount--;
                            
                            const successMessage = this.translate.instant('friends.friendRemoved');
                            // You could show a toast notification here
                            console.log(successMessage);
                        } else {
                            console.error('Failed to remove friend:', result.errors);
                        }
                    },
                    error: (error) => {
                        console.error('Error removing friend:', error);
                    }
                });
        }
    }

    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.loadFriends();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    openMessageInterface(friend: any): void {
        this.selectedConversation = {
            id: `conv_${friend.id}`,
            participantId: friend.id,
            participantName: friend.name,
            participantAvatar: friend.avatar,
            unreadCount: 0,
            isOnline: Math.random() > 0.5 // Random online status for demo
        };
    }

    closeMessageInterface(): void {
        this.selectedConversation = null;
    }
}
