import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../forms/buttons/Button';
import { cn } from '../../lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showItemsPerPageSelector?: boolean;
  showInfo?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined';
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
  showItemsPerPageSelector = true,
  showInfo = true,
  size = 'md',
  variant = 'default',
  className
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1; // Ensure at least 1 page
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  // Always show pagination component

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    // Handle edge cases
    if (totalPages === 0) {
      pages.push(1); // Always show at least page 1
    } else if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In the middle
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    onItemsPerPageChange?.(newItemsPerPage);
    // Reset to first page when changing items per page
    onPageChange(1);
  };

  const buttonSizes = {
    sm: 'sm',
    md: 'sm',
    lg: 'md'
  } as const;

  const containerClasses = {
    default: 'bg-card border border-border',
    outlined: 'border border-border'
  };

  return (
    <div className={cn(
      'flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg',
      containerClasses[variant],
      className
    )}>
      {/* Items info and per page selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
        {showInfo && (
          <span>
            Showing {startItem}-{endItem} of {totalItems} items
          </span>
        )}

        {showItemsPerPageSelector && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value)}
              className="px-3 py-1 bg-background border border-border rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span>per page</span>
          </div>
        )}
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <Button
          variant="outline"
          size={buttonSizes[size]}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={size === 'sm' ? 'hidden' : 'hidden sm:flex'}
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size={buttonSizes[size]}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-1 text-muted-foreground">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "primary" : "outline"}
                  size={buttonSizes[size]}
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    "min-w-[2.5rem] h-8",
                    currentPage === page && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size={buttonSizes[size]}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size={buttonSizes[size]}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={size === 'sm' ? 'hidden' : 'hidden sm:flex'}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;