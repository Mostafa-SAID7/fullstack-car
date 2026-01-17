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
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  // Input signals
  // Input signals
  currentPage = input<number>(1);
  totalItems = input<number>(0);
  itemsPerPage = input<number>(10);
  maxVisiblePages = input<number>(7);
  // Add backward compatibility inputs
  totalPagesInput = input<number | undefined>(undefined, { alias: 'totalPages' });
  pageSize = input<number | undefined>(undefined, { alias: 'pageSize' });

  // Output signals
  pageChange = output<number>();

  // Computed signals
  actualItemsPerPage = computed(() => this.pageSize() ?? this.itemsPerPage());

  totalPages = computed(() => {
    const inputTotal = this.totalPagesInput();
    if (inputTotal !== undefined) return inputTotal;
    return Math.ceil(this.totalItems() / this.actualItemsPerPage());
  });

  startItem = computed(() => {
    const start = (this.currentPage() - 1) * this.actualItemsPerPage() + 1;
    return Math.min(start, this.totalItems());
  });

  endItem = computed(() => {
    const end = this.currentPage() * this.actualItemsPerPage();
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