import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Eye, EyeOff, MoreHorizontal } from 'lucide-react';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
  hidden?: boolean;
}

export interface DataTableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onRowAction?: (action: string, row: any) => void;
  actions?: Array<{
    label: string;
    action: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'danger';
  }>;
  showToggleColumns?: boolean;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  onSort,
  onRowAction,
  actions = [],
  showToggleColumns = true,
  className = ''
}) => {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.filter(col => !col.hidden).map(col => col.key)
  );
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const handleSort = (key: string) => {
    if (!columns.find(col => col.key === key)?.sortable) return;
    
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const visibleColumnsData = columns.filter(col => visibleColumns.includes(col.key));

  if (loading) {
    return (
      <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className="h-12 bg-muted"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 border-t border-border"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Column Toggle */}
      {showToggleColumns && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Table Columns</h3>
            <button
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showColumnToggle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showColumnToggle ? 'Hide' : 'Show'} Columns
            </button>
          </div>
          
          {showColumnToggle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 flex flex-wrap gap-2"
            >
              {columns.map((column) => (
                <label key={column.key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => toggleColumn(column.key)}
                    className="rounded border-border"
                  />
                  <span className="text-muted-foreground">{column.label}</span>
                </label>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {visibleColumnsData.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-medium text-muted-foreground ${
                    column.sortable ? 'cursor-pointer hover:text-foreground' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 ${
                            sortKey === column.key && sortDirection === 'asc' 
                              ? 'text-primary' 
                              : 'text-muted-foreground/50'
                          }`} 
                        />
                        <ChevronDown 
                          className={`w-3 h-3 -mt-1 ${
                            sortKey === column.key && sortDirection === 'desc' 
                              ? 'text-primary' 
                              : 'text-muted-foreground/50'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground w-16">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t border-border hover:bg-muted/25 transition-colors">
                {visibleColumnsData.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-foreground">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-4 py-3 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === `${index}` ? null : `${index}`)}
                        className="p-1 hover:bg-muted rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {actionMenuOpen === `${index}` && (
                        <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg py-1 z-10 min-w-32">
                          {actions.map((action) => (
                            <button
                              key={action.action}
                              onClick={() => {
                                onRowAction?.(action.action, row);
                                setActionMenuOpen(null);
                              }}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                                action.variant === 'danger' ? 'text-destructive' : 'text-foreground'
                              }`}
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
};

export default DataTable;