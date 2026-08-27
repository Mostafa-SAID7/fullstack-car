import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { PostService } from '../../services/post.service';
import { TranslationService } from '../../../../../core/services/translation.service';
import { Post } from '@shared/models/community/post.model';
import { PostItemComponent } from '../../components/post-item/post-item.component';
import { PaginationComponent } from '@shared/components/ui/pagination/pagination.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostItemComponent, TranslateModule, PaginationComponent, ReactiveFormsModule],
  templateUrl: './post-list.component.html',
  host: { 'class': 'block' }
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 5;
  totalCount = 0;
  totalPages = 0;
  showFilters = false;
  searchForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private postService: PostService,
    private fb: FormBuilder,
    private translationService: TranslationService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      sortBy: ['createdAt']
    });
  }

  ngOnInit(): void {
    this.initializeTranslations();
    this.loadPosts();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async initializeTranslations(): Promise<void> {
    try {
      // Load posts feature translations for the current language
      const currentLanguage = this.translationService.getCurrentLanguage().code;
      await this.translationService.loadSingleFeatureTranslations(currentLanguage, 'posts');
    } catch (error) {
      console.error('Failed to load posts translations:', error);
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
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    console.log(`[PostList] Loading posts for page ${this.currentPage}, size ${this.pageSize}`);

    this.postService.getPosts(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        console.log('[PostList] Received result:', result);
        if (result && result.items && result.items.length > 0) {
          this.posts = result.items;
          this.totalCount = result.totalCount || 0;
          this.totalPages = result.totalPages || Math.ceil(this.totalCount / this.pageSize);
          console.log(`[PostList] Using backend data. Total pages: ${this.totalPages}`);
        } else {
          console.warn('[PostList] Backend returned empty or null. Falling back to mock data for visibility.');
          const allMock = this.getMockPosts();
          this.posts = allMock.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
          this.totalCount = allMock.length;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          console.log(`[PostList] Mock data loaded. Total pages: ${this.totalPages}`);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('[PostList] Error loading posts from backend:', err);
        this.loading = false;
        const allMock = this.getMockPosts();
        this.posts = allMock.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        this.totalCount = allMock.length;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        console.log(`[PostList] Mock data loaded after error. Total pages: ${this.totalPages}`);
      }
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private getMockPosts(): Post[] {
    const posts: Post[] = [];
    for (let i = 1; i <= 12; i++) {
      posts.push({
        id: `${i}`,
        title: `Mock Post ${i}`,
        content: `This is the content for mock post ${i}. It is used to demonstrate pagination when no backend data is available. 🚗💨`,
        userFirstName: i % 2 === 0 ? 'Mahmoud' : 'Ahmed',
        userLastName: 'Said',
        likesCount: 10 + i * 5,
        createdAt: new Date(),
        type: 1,
        status: 1,
        viewsCount: 100 + i * 10,
        userId: `u${i}`
      });
    }
    return posts;
  }
}
