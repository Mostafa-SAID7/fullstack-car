import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  hover?: boolean;
  selected?: boolean;
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const Table = forwardRef<HTMLTableElement, TableProps>(({
  className,
  variant = 'default',
  size = 'md',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-card',
    striped: 'bg-card [&_tbody_tr:nth-child(even)]:bg-muted/30',
    bordered: 'bg-card border-collapse border border-border [&_th]:border-border [&_td]:border-border'
  };

  const sizes = {
    sm: '[&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2 [&_th]:text-xs [&_td]:text-sm',
    md: '[&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3 [&_th]:text-sm [&_td]:text-sm',
    lg: '[&_th]:px-6 [&_th]:py-4 [&_td]:px-6 [&_td]:py-4 [&_th]:text-base [&_td]:text-base'
  };

  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          'w-full caption-bottom text-sm',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    </div>
  );
});

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(({
  className,
  ...props
}, ref) => (
  <thead
    ref={ref}
    className={cn('[&_tr]:border-b [&_tr]:border-border', className)}
    {...props}
  />
));

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(({
  className,
  ...props
}, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({
  className,
  hover = false,
  selected = false,
  ...props
}, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-border transition-colors',
      hover && 'hover:bg-muted/50 cursor-pointer',
      selected && 'bg-primary/10',
      className
    )}
    {...props}
  />
));

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(({
  className,
  children,
  sortable = false,
  sortDirection,
  onSort,
  ...props
}, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
      sortable && 'cursor-pointer select-none hover:text-foreground',
      className
    )}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center gap-2">
      {children}
      {sortable && sortDirection && (
        <span className="text-xs">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </div>
  </th>
));

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({
  className,
  ...props
}, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle', className)}
    {...props}
  />
));

const TableCaption = forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({
  className,
  ...props
}, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
));

Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
};

export default Table;

