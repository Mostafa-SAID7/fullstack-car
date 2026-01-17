import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Pagination Component
 * 
 * Responsive pagination component using Angular 19 features
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6" aria-label="Pagination">
      <!-- Mobile View -->
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          (click)="goToPrevious()"
          [disabled]="currentPage() <= 1"
          class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
          Previous
        </button>
        <button
          (click)="goToNext()"
          [disabled]="currentPage() >= totalPages()"
          class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
          Next
        </button>
      </div>

      <!-- Desktop View -->
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Showing
            <span class="font-medium">{{ startItem() }}</span>
            to
            <span class="font-medium">{{ endItem() }}</span>
            of
            <span class="font-medium">{{ totalItems() }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <!-- Previous Button -->
            <button
              (click)="goToPrevious()"
              [disabled]="currentPage() <= 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700">
              <span class="sr-only">Previous</span>
              <i class="fa-solid fa-chevron-left w-5 h-5"></i>
            </button>

            <!-- Page Numbers -->
            @for (page of visiblePages(); track page) {
              @if (page === '...') {
                <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-600">
                  ...
                </span>
              } @else {
                <button
                  (click)="goToPage(+page)"
                  [class]="getPageButtonClass(+page)"
                  [attr.aria-current]="currentPage() === +page ? 'page' : null">
                  {{ page }}
                </button>
              }
            }

            <!-- Next Button -->
            <button
              (click)="goToNext()"
              [disabled]="currentPage() >= totalPages()"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-600 dark:hover:bg-gray-700">
              <span class="sr-only">Next</span>
              <i class="fa-solid fa-chevron-right w-5 h-5"></i>
            </button>
          </nav>
        </div>
      </div>
    </nav>
  `
})
export class PaginationComponent {
  // Input signals
  currentPage = input<number>(1);
  totalItems = input<number>(0);
  itemsPerPage = input<number>(10);
  maxVisiblePages = input<number>(7);

  // Output signals
  pageChange = output<number>();

  // Computed signals
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));
  
  startItem = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage() + 1;
    return Math.min(start, this.totalItems());
  });
  
  endItem = computed(() => {
    const end = this.currentPage() * this.itemsPerPage();
    return Math.min(end, this.totalItems());
  });

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const maxVisible = this.maxVisiblePages();
    
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => (i + 1).toString());
    }

    const pages: string[] = [];
    const halfVisible = Math.floor(maxVisible / 2);
    
    // Always show first page
    pages.push('1');
    
    let start = Math.max(2, current - halfVisible);
    let end = Math.min(total - 1, current + halfVisible);
    
    // Adjust if we're near the beginning
    if (current <= halfVisible + 1) {
      end = Math.min(total - 1, maxVisible - 1);
    }
    
    // Adjust if we're near the end
    if (current >= total - halfVisible) {
      start = Math.max(2, total - maxVisible + 2);
    }
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i.toString());
    }
    
    // Add ellipsis before last page if needed
    if (end < total - 1) {
      pages.push('...');
    }
    
    // Always show last page (if more than 1 page)
    if (total > 1) {
      pages.push(total.toString());
    }
    
    return pages;
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  goToPrevious(): void {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  goToNext(): void {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  getPageButtonClass(page: number): string {
    const baseClass = 'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0';
    
    if (page === this.currentPage()) {
      return `${baseClass} bg-primary text-white ring-primary`;
    }
    
    return `${baseClass} text-gray-900 ring-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-700`;
  }
}