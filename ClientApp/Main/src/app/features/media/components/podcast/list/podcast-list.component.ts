import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MediaService } from '../../../services/media.service';
import { PodcastService, PodcastFilters } from '../../../services/podcast.service';
import { PodcastList, MediaFilters, MediaStatus } from '../../../models';
import { PaginatedResult } from '../../../../../core/models/pagination.model';
import { MediaCardComponent } from '../../media-card/media-card.component';

@Component({
  selector: 'app-podcast-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MediaCardComponent],
  templateUrl: './podcast-list.component.html',
  styleUrls: ['./podcast-list.component.scss']
})
export class PodcastListComponent implements OnInit {
  podcasts: PodcastList[] = [];
  loading = false;
  totalCount = 0;
  currentPage = 1;
  pageSize = 12;
  totalPages = 0;

  searchForm: FormGroup;
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

  get pages(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}