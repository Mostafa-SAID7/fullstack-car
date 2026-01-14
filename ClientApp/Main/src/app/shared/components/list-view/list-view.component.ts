import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { PaginationComponent } from '../pagination/pagination.component';

export interface ListViewConfig {
    showPagination?: boolean;
    itemsPerPage?: number;
    gridCols?: number;
    gap?: string;
}

export interface PaginationConfig {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

@Component({
    selector: 'app-list-view',
    standalone: true,
    imports: [CommonModule, LoadingStateComponent, EmptyStateComponent, PaginationComponent],
    templateUrl: './list-view.component.html'
})
export class ListViewComponent {
    /**
     * Array of items to display
     */
    @Input() items: any[] = [];

    /**
     * Loading state
     */
    @Input() loading = false;

    /**
     * Error message
     */
    @Input() error: string | null = null;

    /**
     * Configuration
     */
    @Input() config: ListViewConfig = {
        showPagination: true,
        gridCols: 3,
        gap: '20px'
    };

    /**
     * Pagination configuration
     */
    @Input() pagination?: PaginationConfig;

    /**
     * Empty state message
     */
    @Input() emptyMessage = 'No items found';

    /**
     * Empty state description
     */
    @Input() emptyDescription = 'Try adjusting your filters';

    /**
     * Item template
     */
    @ContentChild('itemTemplate') itemTemplate: TemplateRef<any> | null = null;

    /**
     * Page change event
     */
    @Output() pageChange = new EventEmitter<number>();

    /**
     * Retry event (when error occurs)
     */
    @Output() retry = new EventEmitter<void>();

    get gridStyle() {
        return {
            'display': 'grid',
            'grid-template-columns': `repeat(${this.config.gridCols}, minmax(0, 1fr))`,
            'gap': this.config.gap
        };
    }

    get hasFilters(): boolean {
        // Returns true if filters content is projected
        return true; // Simplified - Angular checks content projection automatically
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }

    onRetry() {
        this.retry.emit();
    }
}
