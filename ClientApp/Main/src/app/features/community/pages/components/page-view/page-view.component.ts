import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { PageService } from '../../services/page.service';
import { PageDto, PageContentDto, PageStatus, PageType } from '@shared/models/community/page.model';

@Component({
  selector: 'app-page-view',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="p-4 lg:p-8 max-w-[1200px] mx-auto animate-fade-in space-y-6">
      
      <!-- Loading State -->
      <div *ngIf="loading" class="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 shadow-xl border border-black/5 dark:border-white/5">
        <div class="animate-pulse space-y-4">
          <div class="h-8 bg-secondary/30 dark:bg-white/5 rounded-2xl w-3/4"></div>
          <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-2xl w-1/2"></div>
          <div class="space-y-2 pt-4">
            <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-2xl"></div>
            <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-2xl"></div>
            <div class="h-4 bg-secondary/30 dark:bg-white/5 rounded-2xl w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div *ngIf="!loading && page" class="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 shadow-xl border border-black/5 dark:border-white/5">
        
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <button (click)="goBack()" 
                    class="w-10 h-10 rounded-full bg-secondary/30 dark:bg-white/5 flex items-center justify-center hover:scale-105 transition-all">
              <i class="fas fa-arrow-left text-foreground"></i>
            </button>
            
            <span class="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                  [ngClass]="{
                    'bg-green-500/20 text-green-600': page.status === PageStatus.Published,
                    'bg-yellow-500/20 text-yellow-600': page.status === PageStatus.Draft,
                    'bg-gray-500/20 text-gray-600': page.status === PageStatus.Archived
                  }">
              {{ getStatusLabel(page.status) }}
            </span>
            
            <span class="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary/20 text-primary">
              {{ getTypeLabel(page.type) }}
            </span>
          </div>
          
          <h1 class="text-3xl lg:text-4xl font-black uppercase tracking-wider text-foreground mb-3">
            {{ page.title }}
          </h1>
          
          <p class="text-muted-foreground font-bold text-sm mb-4">
            {{ page.description }}
          </p>
          
          <div class="flex items-center gap-6 text-xs text-muted-foreground">
            <span>
              <i class="fas fa-user mr-2"></i>
              {{ page.authorFirstName }} {{ page.authorLastName }}
            </span>
            <span>
              <i class="fas fa-calendar mr-2"></i>
              {{ page.createdAt | date:'medium' }}
            </span>
            <span *ngIf="page.updatedAt">
              <i class="fas fa-edit mr-2"></i>
              Updated {{ page.updatedAt | date:'medium' }}
            </span>
            <span>
              <i class="fas fa-eye mr-2"></i>
              {{ page.viewsCount }} views
            </span>
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-8"></div>

        <!-- Content -->
        <div *ngIf="content" class="prose prose-lg dark:prose-invert max-w-none">
          <div [innerHTML]="content.content" class="page-content"></div>
        </div>

        <!-- Loading Content -->
        <div *ngIf="!content && !loading" class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-3xl text-primary mb-4"></i>
          <p class="text-muted-foreground font-bold text-sm uppercase tracking-widest">Loading content...</p>
        </div>

        <!-- Footer -->
        <div class="mt-12 pt-8 border-t border-black/5 dark:border-white/5">
          <div class="flex items-center justify-between">
            <div class="text-xs text-muted-foreground">
              <span *ngIf="content">Version {{ content.version }}</span>
            </div>
            
            <div class="flex gap-3">
              <button class="px-6 py-3 bg-secondary/30 dark:bg-white/5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">
                <i class="fas fa-share-alt mr-2"></i>
                Share
              </button>
              
              <button class="px-6 py-3 bg-secondary/30 dark:bg-white/5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">
                <i class="fas fa-print mr-2"></i>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="!loading && !page" class="bg-white dark:bg-[#111] rounded-[2.5rem] p-12 shadow-xl border border-black/5 dark:border-white/5 text-center">
        <div class="w-20 h-20 bg-secondary/30 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-exclamation-triangle text-3xl text-muted-foreground/30"></i>
        </div>
        <h3 class="text-xl font-black text-foreground uppercase tracking-widest mb-2">Page not found</h3>
        <p class="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-6">The page you're looking for doesn't exist.</p>
        <button (click)="goBack()" 
                class="px-8 py-4 bg-primary text-white rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25">
          <i class="fas fa-arrow-left mr-2"></i>
          Go Back
        </button>
      </div>

    </div>
  `,
  styles: [`
    :host ::ng-deep .page-content {
      @apply text-foreground;
    }
    
    :host ::ng-deep .page-content h1,
    :host ::ng-deep .page-content h2,
    :host ::ng-deep .page-content h3,
    :host ::ng-deep .page-content h4,
    :host ::ng-deep .page-content h5,
    :host ::ng-deep .page-content h6 {
      @apply font-black uppercase tracking-wider text-foreground mt-8 mb-4;
    }
    
    :host ::ng-deep .page-content p {
      @apply mb-4 leading-relaxed;
    }
    
    :host ::ng-deep .page-content a {
      @apply text-primary hover:underline;
    }
    
    :host ::ng-deep .page-content ul,
    :host ::ng-deep .page-content ol {
      @apply mb-4 ml-6;
    }
    
    :host ::ng-deep .page-content li {
      @apply mb-2;
    }
    
    :host ::ng-deep .page-content img {
      @apply rounded-2xl my-6;
    }
    
    :host ::ng-deep .page-content blockquote {
      @apply border-l-4 border-primary pl-4 italic my-6;
    }
    
    :host ::ng-deep .page-content code {
      @apply bg-secondary/30 dark:bg-white/5 px-2 py-1 rounded text-sm;
    }
    
    :host ::ng-deep .page-content pre {
      @apply bg-secondary/30 dark:bg-white/5 p-4 rounded-2xl overflow-x-auto my-6;
    }
  `]
})
export class PageViewComponent implements OnInit, OnDestroy {
  page: PageDto | null = null;
  content: PageContentDto | null = null;
  loading = false;

  // Expose enums to template
  PageStatus = PageStatus;
  PageType = PageType;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageService: PageService
  ) { }

  ngOnInit(): void {
    this.loadPage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pageService.clearCurrentPage();
  }

  private loadPage(): void {
    this.loading = true;

    this.route.params.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const id = params['id'];
        const slug = params['slug'];

        if (slug) {
          return this.pageService.getPageBySlug(slug);
        } else if (id) {
          return this.pageService.getPage(id);
        } else {
          throw new Error('No page identifier provided');
        }
      })
    ).subscribe({
      next: (page) => {
        this.page = page;
        this.loading = false;
        this.loadContent(page.id);
      },
      error: () => {
        this.loading = false;
        this.page = null;
      }
    });
  }

  private loadContent(pageId: string): void {
    this.pageService.getPageContent(pageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (content) => {
          this.content = content;
        },
        error: () => {
          this.content = null;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/community/pages']);
  }

  getStatusLabel(status: PageStatus): string {
    return this.pageService.getPageStatusLabel(status);
  }

  getTypeLabel(type: PageType): string {
    return this.pageService.getPageTypeLabel(type);
  }
}
