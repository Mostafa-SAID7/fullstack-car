import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MediaService } from '../../../services/media.service';
import { PodcastService, PodcastFilters } from '../../../services/podcast.service';
import { PodcastList, MediaFilters, MediaStatus } from '../../../models';
import { PaginatedResult } from '../../../../../core/models/pagination.model';
import { PaginationComponent } from '@shared/components/ui/pagination/pagination.component';
import { MediaCardComponent } from '../../media-card/media-card.component';


@Component({
  selector: 'app-podcast-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MediaCardComponent, PaginationComponent],
  templateUrl: './podcast-list.component.html'
})
export class PodcastListComponent implements OnInit {
  @Input() compact = false;
  @Input() limit: number | null = null;

  podcasts: PodcastList[] = [];
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
    { value: 'PlayCount', label: 'Most Played', descending: true },
    { value: 'LikeCount', label: 'Most Liked', descending: true },
    { value: 'Title', label: 'Title A-Z', descending: false }
  ];

  constructor(
    private mediaService: MediaService,
    private podcastService: PodcastService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      sortBy: ['CreatedAt'],
      sortDescending: [true]
    });
  }

  ngOnInit(): void {
    if (this.limit) {
      this.pageSize = this.limit;
      this.filters.pageSize = this.limit;
    }
    this.loadPodcasts();
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

    this.searchForm.get('sortBy')?.valueChanges.subscribe(() => {
      this.onSearch();
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }


  private loadPodcasts(): void {
    this.loading = true;

    // Create proper PodcastFilters object with required properties
    const podcastFilters: PodcastFilters = {
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

    this.podcastService.getPodcasts(podcastFilters).subscribe({
      next: (response: any) => {
        this.podcasts = response.data?.items || response.items || [];
        this.totalCount = response.data?.totalCount || response.totalCount || 0;
        this.currentPage = response.data?.pageNumber || response.pageNumber || 1;
        this.totalPages = response.data?.totalPages || response.totalPages || 0;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading podcasts:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    const formValue = this.searchForm.value;
    this.filters = {
      ...this.filters,
      searchTerm: formValue.searchTerm || undefined,
      sortBy: formValue.sortBy,
      sortDescending: formValue.sortDescending,
      pageNumber: 1
    };
    this.loadPodcasts();
  }

  onPageChange(page: number): void {
    this.filters.pageNumber = page;
    this.loadPodcasts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  playPodcast(podcast: PodcastList): void {
    this.router.navigate(['/media/podcasts', podcast.id]);
  }

  navigateToUpload(): void {
    this.router.navigate(['/media/podcasts/upload']);
  }

  onPlay(podcast: PodcastList): void {
    this.playPodcast(podcast);
  }

  onEdit(podcast: PodcastList): void {
    this.router.navigate(['/media/podcasts/edit', podcast.id]);
  }

  onDelete(podcast: PodcastList): void {
    if (confirm('Are you sure you want to delete this podcast?')) {
      this.podcastService.deletePodcast(podcast.id).subscribe({
        next: () => {
          this.loadPodcasts();
        },
        error: (error: any) => {
          console.error('Error deleting podcast:', error);
        }
      });
    }
  }
}

