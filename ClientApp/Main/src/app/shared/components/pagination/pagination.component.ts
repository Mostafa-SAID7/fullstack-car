import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
    @Input() currentPage = 1;
    @Input() pageSize = 10;
    @Input() totalItems = 0;
    @Input() totalPages = 1;
    @Input() maxVisible = 5;

    @Output() pageChange = new EventEmitter<number>();

    get pages(): number[] {
        const pages: number[] = [];
        let startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + this.maxVisible - 1);

        if (endPage - startPage < this.maxVisible - 1) {
            startPage = Math.max(1, endPage - this.maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }

    get showFirstPage(): boolean {
        return this.pages[0] > 1;
    }

    get showLastPage(): boolean {
        return this.pages[this.pages.length - 1] < this.totalPages;
    }

    get startItem(): number {
        return (this.currentPage - 1) * this.pageSize + 1;
    }

    get endItem(): number {
        return Math.min(this.currentPage * this.pageSize, this.totalItems);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.pageChange.emit(page);
        }
    }

    previousPage() {
        this.goToPage(this.currentPage - 1);
    }

    nextPage() {
        this.goToPage(this.currentPage + 1);
    }
}
