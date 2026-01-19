import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import { ToastService } from '@core/services/toast.service';

export interface SharePlatform {
  name: string;
  icon: string;
  color: string;
  action: () => void;
}

@Component({
  selector: 'app-question-share',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    TranslateModule
  ],
  template: `
    <div class="relative">
      <button
        [matMenuTriggerFor]="shareMenu"
        class="group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 bg-secondary/50 dark:bg-white/5 hover:bg-secondary dark:hover:bg-white/10"
        title="Share Question">

        <i class="fas fa-share-alt text-xl text-muted-foreground group-hover:text-primary transition-colors"></i>

        <!-- Share count badge -->
        <span *ngIf="shareCount > 0"
              class="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-gray-800">
          {{ shareCount > 99 ? '99+' : shareCount }}
        </span>
      </button>

      <mat-menu #shareMenu="matMenu" class="custom-mat-menu share-menu w-64">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white">{{ 'qa.shareQuestion' | translate }}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ 'qa.shareQuestionDesc' | translate }}</p>
        </div>

        <div class="py-2">
          <button mat-menu-item
                  *ngFor="let platform of sharePlatforms"
                  (click)="platform.action()"
                  class="flex items-center gap-3 py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <i [class]="'fab ' + platform.icon + ' text-lg'"
               [style.color]="platform.color"></i>
            <span class="text-sm font-medium">{{ platform.name }}</span>
          </button>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800">
          <div class="flex items-center gap-2">
            <input
              #shareUrl
              [value]="getShareUrl()"
              readonly
              class="flex-1 px-3 py-2 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              (click)="shareUrl.select()">
            <button
              (click)="copyToClipboard(shareUrl)"
              class="px-3 py-2 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary/90 transition-colors">
              {{ 'actions.copy' | translate }}
            </button>
          </div>
        </div>
      </mat-menu>
    </div>
  `,
  styles: [`
    .share-menu .mat-mdc-menu-item {
      padding: 0;
    }

    .share-menu .mat-mdc-menu-item:hover {
      background-color: inherit;
    }
  `]
})
export class QuestionShareComponent implements OnInit {
  @Input() questionId!: string;
  @Input() questionTitle!: string;
  @Input() shareCount = 0;

  sharePlatforms: SharePlatform[] = [];

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.initializeSharePlatforms();
  }

  private initializeSharePlatforms(): void {
    const shareUrl = this.getShareUrl();
    const shareText = `Check out this question: ${this.questionTitle}`;

    this.sharePlatforms = [
      {
        name: 'Twitter',
        icon: 'fa-twitter',
        color: '#1DA1F2',
        action: () => this.shareOnTwitter(shareUrl, shareText)
      },
      {
        name: 'Facebook',
        icon: 'fa-facebook',
        color: '#1877F2',
        action: () => this.shareOnFacebook(shareUrl)
      },
      {
        name: 'LinkedIn',
        icon: 'fa-linkedin',
        color: '#0077B5',
        action: () => this.shareOnLinkedIn(shareUrl, shareText)
      },
      {
        name: 'WhatsApp',
        icon: 'fa-whatsapp',
        color: '#25D366',
        action: () => this.shareOnWhatsApp(shareUrl, shareText)
      },
      {
        name: 'Reddit',
        icon: 'fa-reddit',
        color: '#FF4500',
        action: () => this.shareOnReddit(shareUrl, shareText)
      }
    ];
  }

  getShareUrl(): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/qa/${this.questionId}`;
  }

  private shareOnTwitter(url: string, text: string): void {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    this.openShareWindow(shareUrl, 'Twitter');
  }

  private shareOnFacebook(url: string): void {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    this.openShareWindow(shareUrl, 'Facebook');
  }

  private shareOnLinkedIn(url: string, text: string): void {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    this.openShareWindow(shareUrl, 'LinkedIn');
  }

  private shareOnWhatsApp(url: string, text: string): void {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  }

  private shareOnReddit(url: string, text: string): void {
    const shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    this.openShareWindow(shareUrl, 'Reddit');
  }

  private openShareWindow(url: string, platform: string): void {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      url,
      `share-${platform}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }

  async copyToClipboard(inputElement: HTMLInputElement): Promise<void> {
    try {
      await navigator.clipboard.writeText(inputElement.value);
      this.toastService.success('qa.linkCopied');
    } catch (error) {
      // Fallback for older browsers
      inputElement.select();
      document.execCommand('copy');
      this.toastService.success('qa.linkCopied');
    }
  }
}
