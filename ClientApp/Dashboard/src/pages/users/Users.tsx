import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { UsersHeader } from './components/UsersHeader';
import { UsersFilters } from './components/UsersFilters';
import { UsersTable } from './components/UsersTable';
import { UsersPagination } from './components/UsersPagination';
import { UsersEmptyState } from './components/UsersEmptyState';

export const Users: React.FC = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  
  // Mock data - in real app, this would come from API
  const [users] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      isActive: true,
      isEmailConfirmed: true,
      avatar: '',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      isActive: true,
      isEmailConfirmed: false,
      avatar: '',
      createdAt: '2024-01-02T00:00:00Z'
    }
  ]);

  const [filters, setFilters] = useState({
    searchTerm: '',
    role: undefined,
    isActive: undefined,
    isEmailConfirmed: undefined
  });

  const pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: users.length,
    itemsPerPage: 10
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    console.log('Page changed to:', page);
  };

  const handleUserAction = (action: string, userId: string) => {
    console.log('User action:', action, 'for user:', userId);
  };

  const loadUsers = () => {
    console.log('Loading users...');
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">{t('loading_users', 'Loading users...')}</span>
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
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <span className="text-destructive">{error}</span>
          <button 
            onClick={loadUsers}
            className="mt-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            {t('retry', 'Retry')}
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