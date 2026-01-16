import React, { ReactNode } from 'react';
import { useIsMobile } from '../../hooks/useResponsive';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  mobileRender?: (item: T) => ReactNode;
  hideOnMobile?: boolean;
  className?: string;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

/**
 * Responsive Table Component
 * Automatically switches between table and card layout on mobile
 */
export function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
  className = ''
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            onClick={() => onRowClick?.(item)}
            className={`card ${onRowClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
          >
            <div className="card-body space-y-3">
              {columns
                .filter(col => !col.hideOnMobile)
                .map((col) => (
                  <div key={col.key} className="flex flex-col">
                    <span className="text-xs font-medium text-muted-foreground mb-1">
                      {col.header}
                    </span>
                    <div className="text-sm text-foreground">
                      {col.mobileRender ? col.mobileRender(item) : col.render(item)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left py-3 px-4 text-sm font-medium text-muted-foreground ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={`border-b border-border ${
                onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-4 text-sm text-foreground ${col.className || ''}`}
                >
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
