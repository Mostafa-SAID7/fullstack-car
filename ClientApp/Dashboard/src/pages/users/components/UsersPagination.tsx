import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface UsersPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export const UsersPagination: React.FC<UsersPaginationProps> = ({ pagination, onPageChange }) => {
  const { t } = useTranslation();
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="bg-card border border-border rounded-lg px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t('showing_results', 'Showing {{start}} to {{end}} of {{total}} results', {
            start: startIndex,
            end: endIndex,
            total: totalItems
          })}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-1 text-muted-foreground">...</span>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(page as number)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    {page}
                  </motion.button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};