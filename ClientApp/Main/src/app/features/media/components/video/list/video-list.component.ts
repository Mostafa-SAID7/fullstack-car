import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VideoService, VideoFilters } from '../../../services/video.service';
import { VideoList, MediaFilters, MediaStatus } from '../../../models';
import { PaginatedResult } from '../../../../../core/models/pagination.model';
import { PaginationComponent } from '@shared/components/ui/pagination/pagination.component';
import { MediaCardComponent } from '../../media-card/media-card.component';


@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MediaCardComponent, PaginationComponent, TranslateModule],
  templateUrl: './video-list.component.html'
})
export class VideoListComponent implements OnInit {
  @Input() compact = false;
  @Input() limit: number | null = null;

  videos: VideoList[] = [];
  loading = false;
  totalCount = 0;
  currentPage = 1;
  pageSize = 12;
  totalPages = 0;

  searchForm: FormGroup;
  showFilters = false;
  filters: Partial<MediaFilters> = {
    pageNumber: 1,
    pageSize: 12,
    sortBy: 'CreatedAt',
    sortDescending: true
  };


  sortOptions = [
    { value: 'CreatedAt', label: 'Newest First', descending: true },
    { value: 'CreatedAt', label: 'Oldest First', descending: false },
    { value: 'ViewCount', label: 'Most Viewed', descending: true },
    { value: 'LikeCount', label: 'Most Liked', descending: true },
    { value: 'Title', label: 'Title A-Z', descending: false },
    { value: 'Title', label: 'Title Z-A', descending: true }
  ];

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: MediaStatus.Published, label: 'Published' },
    { value: MediaStatus.Draft, label: 'Draft' },
    { value: MediaStatus.Processing, label: 'Processing' }
  ];

  constructor(
    private videoService: VideoService,
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      status: [''],
      sortBy: ['CreatedAt'],
      sortDescending: [true]
    });
  }

  ngOnInit(): void {
    if (this.limit) {
      this.pageSize = this.limit;
      this.filters.pageSize = this.limit;
    }
    this.loadVideos();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.onSearch();
      });

    this.searchForm.get('status')?.valueChanges.subscribe(() => {
      this.onSearch();
    });

    this.searchForm.get('sortBy')?.valueChanges.subscribe(() => {
      this.onSearch();
    });

    this.searchForm.get('sortDescending')?.valueChanges.subscribe(() => {
      this.onSearch();
    });
  }

  private loadVideos(): void {
    this.loading = true;

    // Create proper VideoFilters object with required properties
    const videoFilters: VideoFilters = {
      pageNumber: this.filters.pageNumber || 1,
      pageSize: this.filters.pageSize || 12,
      sortBy: this.filters.sortBy || 'CreatedAt',
      sortDescending: this.filters.sortDescending ?? true,
      searchTerm: this.filters.searchTerm,
      status: this.filters.status,
      creatorId: this.filters.creatorId,
      tags: this.filters.tags,
      fromDate: this.filters.fromDate,
      toDate: this.filters.toDate
    };

    this.videoService.getVideos(videoFilters).subscribe({
      next: (response: PaginatedResult<VideoList>) => {
        this.videos = response.items;
        this.totalCount = response.totalCount;
        this.currentPage = response.pageNumber;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading videos:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const formValue = this.searchForm.value;

    this.filters = {
      ...this.filters,
      searchTerm: formValue.searchTerm || undefined,
      status: formValue.status || undefined,
      sortBy: formValue.sortBy,
      sortDescending: formValue.sortDescending,
      pageNumber: 1
    };

    this.loadVideos();
  }

  onSortChange(event: any): void {
    const selectedOption = this.sortOptions.find(option =>
      option.value === event.target.value.split('|')[0] &&
      option.descending.toString() === event.target.value.split('|')[1]
    );

    if (selectedOption) {
      this.searchForm.patchValue({
        sortBy: selectedOption.value,
        sortDescending: selectedOption.descending
      });
    }
  }

  onPageChange(page: number): void {
    this.filters.pageNumber = page;
    this.loadVideos();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  playVideo(video: VideoList): void {
    this.router.navigate(['/media/videos', video.id]);
  }

  likeVideo(video: VideoList): void {
    this.videoService.likeVideo(video.id).subscribe({
      next: () => {
        // Refresh the video list or update the like count locally
        this.loadVideos();
      },
      error: (error) => {
        console.error('Error liking video:', error);
      }
    });
  }

  shareVideo(video: VideoList): void {
    const url = `${window.location.origin}/media/videos/${video.id}`;

    if (navigator.share) {
      navigator.share({
        title: video.title,
        url: url
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        // Show success message
        this.translate.get('media.linkCopied').subscribe(res => alert(res));
      }).catch(() => {
        // Show error message
        this.translate.get('media.copyFailed').subscribe(res => alert(res));
      });
    }
  }

  navigateToUpload(): void {
    this.router.navigate(['/media/videos/upload']);
  }

  onPlay(video: VideoList): void {
    this.playVideo(video);
  }

  onEdit(video: VideoList): void {
    // Navigate to edit page (assuming route exists)
    this.router.navigate(['/media/videos/edit', video.id]);
  }

  onDelete(video: VideoList): void {
    this.translate.get('media.deleteConfirm').subscribe(msg => {
      if (confirm(msg)) {
        this.videoService.deleteVideo(video.id).subscribe({
          next: () => {
            this.loadVideos();
          },
          error: (error) => {
            console.error('Error deleting video:', error);
          }
        });
      }
    });
  }

  clearFilters(): void {
    this.searchForm.reset({
      searchTerm: '',
      status: '',
      sortBy: 'CreatedAt',
      sortDescending: true
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}

