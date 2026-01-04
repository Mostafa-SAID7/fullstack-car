import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Loader2, BarChart3, UserCheck, Shield, Activity } from 'lucide-react';
import { UsersHeader } from './components/UsersHeader';
import { UsersFilters } from './components/UsersFilters';
import { UsersTable } from './components/UsersTable';
import { UsersPagination } from './components/UsersPagination';
import { UsersEmptyState } from './components/UsersEmptyState';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';

export const Users: React.FC = () => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'management', label: 'Management', icon: UserCheck },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'activity', label: 'Activity', icon: Activity }
  ];

  // Mock data - in real app, this would come from API
  const [users] = useState<any[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      roles: ['admin'],
      isActive: true,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      roles: ['user'],
      isActive: true,
      isEmailConfirmed: false,
      profileImageUrl: '',
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <UsersHeader showFilters={showFilters} setShowFilters={setShowFilters} />;
      case 'management':
        return (
          <div className="space-y-6">
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
      case 'roles':
        return (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Role Management</h3>
            <p className="text-muted-foreground">User role and permission management system coming soon.</p>
          </div>
        );
      case 'activity':
        return (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">User Activity</h3>
            <p className="text-muted-foreground">User activity logs and audit trails coming soon.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">{t('loading_users', 'Loading users...')}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>
    </motion.div>
  );
};