import React from 'react';
import { Search } from 'lucide-react';
import type { UserFilters } from '../types/filters';

interface UsersFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
  loading?: boolean;
}

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  filters,
  onFiltersChange,
  loading = false
}) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            disabled={loading}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status || ''}
          onChange={(e) => onFiltersChange({ status: e.target.value })}
          disabled={loading}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
          <option value="Banned">Banned</option>
        </select>

        {/* Role Filter */}
        <select
          value={filters.role || ''}
          onChange={(e) => onFiltersChange({ role: e.target.value })}
          disabled={loading}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Moderator">Moderator</option>
          <option value="User">User</option>
          <option value="Premium">Premium</option>
          <option value="ServiceProvider">Service Provider</option>
        </select>

        {/* Sort Options */}
        <div className="flex gap-2">
          <select
            value={filters.sortBy || 'CreatedAt'}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
            disabled={loading}
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          >
            <option value="CreatedAt">Join Date</option>
            <option value="FirstName">First Name</option>
            <option value="LastName">Last Name</option>
            <option value="Email">Email</option>
            <option value="LastLogin">Last Login</option>
          </select>
          
          <select
            value={filters.sortDirection || 'desc'}
            onChange={(e) => onFiltersChange({ sortDirection: e.target.value })}
            disabled={loading}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.status || filters.role) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Search: {filters.search}
                <button
                  onClick={() => onFiltersChange({ search: '' })}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full">
                Status: {filters.status}
                <button
                  onClick={() => onFiltersChange({ status: '' })}
                  className="ml-1 hover:bg-green-500/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            
            {filters.role && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-600 text-xs rounded-full">
                Role: {filters.role}
                <button
                  onClick={() => onFiltersChange({ role: '' })}
                  className="ml-1 hover:bg-purple-500/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            )}
            
            <button
              onClick={() => onFiltersChange({ search: '', status: '', role: '' })}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};