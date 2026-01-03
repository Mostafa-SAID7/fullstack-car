import React from 'react';
// import { useUsers } from '../../hooks/useUsers'; // TODO: Create this hook
import { UsersHeader } from './components/UsersHeader';
import { UsersFilters } from './components/UsersFilters';
import { UsersTable } from './components/UsersTable';
import { UsersPagination } from './components/UsersPagination';
import { UsersEmptyState } from './components/UsersEmptyState';

export const Users: React.FC = () => {
  const {
    users,
    loading,
    error,
    pagination,
    filters,
    showFilters,
    setShowFilters,
    handleFilterChange,
    handlePageChange,
    handleUserAction,
    loadUsers
  } = useUsers();

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsersHeader showFilters={showFilters} setShowFilters={setShowFilters} />
      
      <UsersFilters
        filters={filters}
        showFilters={showFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={() => {
          handleFilterChange('searchTerm', '');
          handleFilterChange('role', undefined);
          handleFilterChange('isActive', undefined);
          handleFilterChange('isEmailConfirmed', undefined);
        }}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <span className="text-red-800">{error}</span>
          <button 
            onClick={loadUsers}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <UsersTable users={users} onUserAction={handleUserAction} />
      
      {pagination.totalPages > 1 && (
        <UsersPagination pagination={pagination} onPageChange={handlePageChange} />
      )}

      {!loading && users.length === 0 && (
        <UsersEmptyState hasFilters={Object.values(filters).some(v => v !== undefined && v !== '')} />
      )}
    </div>
  );
};