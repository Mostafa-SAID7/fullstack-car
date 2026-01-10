import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../../../core/models/post.model';
import { PostItemComponent } from '../post-item/post-item.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, PostItemComponent, TranslateModule, PaginationComponent, ReactiveFormsModule],
  templateUrl: './post-list.component.html',
  host: { 'class': 'block' }
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 5;
  totalCount = 0;
  totalPages = 0;
  showFilters = false;
  searchForm: FormGroup;

  constructor(private postService: PostService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      sortBy: ['createdAt']
    });
  }

  ngOnInit(): void {
    this.loadPosts();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.onSearch());

    this.searchForm.get('sortBy')?.valueChanges.subscribe(() => this.onSearch());
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
        commentsCount: i,
        createdAt: new Date().toISOString(),
        type: 1,
        status: 1,
        viewsCount: 100 + i * 10,
        userId: `u${i}`
      });
    }
    return posts;
  }
}
