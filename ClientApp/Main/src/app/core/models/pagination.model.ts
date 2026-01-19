export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class PaginationHelper {
  static calculateTotalPages(totalItems: number, pageSize: number): number {
    return Math.ceil(totalItems / pageSize);
  }

  static getPageNumbers(currentPage: number, totalPages: number, maxVisible: number = 5): number[] {
    const pages: number[] = [];
    const half = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  static createPaginationInfo(
    currentPage: number,
    totalItems: number,
    pageSize: number
  ): PaginationInfo {
    const totalPages = this.calculateTotalPages(totalItems, pageSize);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: pageSize,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }
}