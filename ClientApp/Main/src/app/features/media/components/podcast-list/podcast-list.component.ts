import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MediaService } from '../../services/media.service';
import { PodcastList, MediaFilters, MediaStatus } from '../../models/media.model';
import { PaginatedResult } from '../../../../core/models/pagination.model';
import { MediaCardComponent } from '../media-card/media-card.component';

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
    this.mediaService.getPodcasts(this.filters).subscribe({
      next: (response: PaginatedResult<PodcastList>) => {
        this.podcasts = response.items;
        this.totalCount = response.totalCount;
        this.currentPage = response.pageNumber;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
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