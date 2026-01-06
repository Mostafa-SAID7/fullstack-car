import React, { useState } from 'react';
import { useUsers } from './hooks/useUsers';
import { UsersHeader } from './components/UsersHeader';
import { UsersFilters } from './components/UsersFilters';
import { UsersTable } from './components/UsersTable';
import { UsersEmptyState } from './components/UsersEmptyState';
import { UsersPagination } from './components/UsersPagination';
import type { UserFilters } from './types/filters';

export const Users: React.FC = () => {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    pageSize: 10,
    search: '',
    status: '',
    role: '',
    sortBy: 'CreatedAt',
    sortDirection: 'desc'
  });

  const {
    users,
    loading,
    error,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    refetch
  } = useUsers(filters);

  const handleFiltersChange = (newFilters: Partial<UserFilters>) => {
    setFilters((prev: UserFilters) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev: UserFilters) => ({ ...prev, page }));
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading users</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <UsersHeader onRefresh={handleRefresh} />
      
      <UsersFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        loading={loading}
      />

      {users.length === 0 && !loading ? (
        <UsersEmptyState />
      ) : (
        <>
          <UsersTable
            users={users}
            loading={loading}
            onUserAction={(action, userId) => {
              // Handle user actions here
              console.log(`Action: ${action}, User ID: ${userId}`);
            }}
          />
          
          {totalCount > 0 && (
            <UsersPagination
              currentPage={filters.page || 1}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={filters.pageSize || 10}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Users;