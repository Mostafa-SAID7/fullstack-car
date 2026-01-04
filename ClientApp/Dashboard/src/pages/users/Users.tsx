import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Loader2, BarChart3, UserCheck, Shield, Activity } from 'lucide-react';
import { UsersHeader } from './components/UsersHeader';
import { UsersFilters } from './components/UsersFilters';
import { UsersTable } from './components/UsersTable';
import { UsersEmptyState } from './components/UsersEmptyState';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';
import { Pagination } from '../../components/ui/Pagination';

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
  const [allUsers] = useState<any[]>([
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
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      roles: ['user'],
      isActive: false,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-03T00:00:00Z'
    },
    {
      id: '4',
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'alice@example.com',
      roles: ['moderator'],
      isActive: true,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-04T00:00:00Z'
    },
    {
      id: '5',
      firstName: 'Charlie',
      lastName: 'Wilson',
      email: 'charlie@example.com',
      roles: ['user'],
      isActive: true,
      isEmailConfirmed: false,
      profileImageUrl: '',
      createdAt: '2024-01-05T00:00:00Z'
    },
    {
      id: '6',
      firstName: 'Diana',
      lastName: 'Davis',
      email: 'diana@example.com',
      roles: ['admin'],
      isActive: true,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-06T00:00:00Z'
    },
    {
      id: '7',
      firstName: 'Edward',
      lastName: 'Miller',
      email: 'edward@example.com',
      roles: ['user'],
      isActive: false,
      isEmailConfirmed: false,
      profileImageUrl: '',
      createdAt: '2024-01-07T00:00:00Z'
    },
    {
      id: '8',
      firstName: 'Fiona',
      lastName: 'Garcia',
      email: 'fiona@example.com',
      roles: ['moderator'],
      isActive: true,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-08T00:00:00Z'
    },
    {
      id: '9',
      firstName: 'George',
      lastName: 'Martinez',
      email: 'george@example.com',
      roles: ['user'],
      isActive: true,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-09T00:00:00Z'
    },
    {
      id: '10',
      firstName: 'Helen',
      lastName: 'Lopez',
      email: 'helen@example.com',
      roles: ['user'],
      isActive: true,
      isEmailConfirmed: false,
      profileImageUrl: '',
      createdAt: '2024-01-10T00:00:00Z'
    },
    {
      id: '11',
      firstName: 'Ian',
      lastName: 'Gonzalez',
      email: 'ian@example.com',
      roles: ['admin'],
      isActive: false,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-11T00:00:00Z'
    },
    {
      id: '12',
      firstName: 'Julia',
      lastName: 'Anderson',
      email: 'julia@example.com',
      roles: ['user'],
      isActive: true,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-12T00:00:00Z'
    },
    {
      id: '13',
      firstName: 'Kevin',
      lastName: 'Thomas',
      email: 'kevin@example.com',
      roles: ['moderator'],
      isActive: true,
      isEmailConfirmed: false,
      profileImageUrl: '',
      createdAt: '2024-01-13T00:00:00Z'
    },
    {
      id: '14',
      firstName: 'Laura',
      lastName: 'Jackson',
      email: 'laura@example.com',
      roles: ['user'],
      isActive: false,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-14T00:00:00Z'
    },
    {
      id: '15',
      firstName: 'Michael',
      lastName: 'White',
      email: 'michael@example.com',
      roles: ['user'],
      isActive: true,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '16',
      firstName: 'Nina',
      lastName: 'Harris',
      email: 'nina@example.com',
      roles: ['admin'],
      isActive: true,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-16T00:00:00Z'
    },
    {
      id: '17',
      firstName: 'Oliver',
      lastName: 'Clark',
      email: 'oliver@example.com',
      roles: ['user'],
      isActive: true,
      isEmailConfirmed: false,
      profileImageUrl: '',
      createdAt: '2024-01-17T00:00:00Z'
    },
    {
      id: '18',
      firstName: 'Paula',
      lastName: 'Lewis',
      email: 'paula@example.com',
      roles: ['moderator'],
      isActive: false,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-18T00:00:00Z'
    },
    {
      id: '19',
      firstName: 'Quinn',
      lastName: 'Robinson',
      email: 'quinn@example.com',
      roles: ['user'],
      isActive: true,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-19T00:00:00Z'
    },
    {
      id: '20',
      firstName: 'Rachel',
      lastName: 'Walker',
      email: 'rachel@example.com',
      roles: ['user'],
      isActive: true,
      isEmailConfirmed: false,
      profileImageUrl: '',
      createdAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '21',
      firstName: 'Steve',
      lastName: 'Hall',
      email: 'steve@example.com',
      roles: ['admin'],
      isActive: true,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-21T00:00:00Z'
    },
    {
      id: '22',
      firstName: 'Tina',
      lastName: 'Young',
      email: 'tina@example.com',
      roles: ['user'],
      isActive: false,
      isEmailConfirmed: true,
      profileImageUrl: '',
      createdAt: '2024-01-22T00:00:00Z'
    }
  ]);

  const [filters, setFilters] = useState({
    searchTerm: '',
    role: undefined,
    isActive: undefined,
    isEmailConfirmed: undefined
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Filtered users based on current filters
  const filteredUsers = useMemo(() => {
    let filtered = allUsers;

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.role) {
      filtered = filtered.filter(user => user.roles.includes(filters.role));
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(user => user.isActive === filters.isActive);
    }

    if (filters.isEmailConfirmed !== undefined) {
      filtered = filtered.filter(user => user.isEmailConfirmed === filters.isEmailConfirmed);
    }

    return filtered;
  }, [allUsers, filters]);

  // Paginated users for current page
  const users = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Pagination info
  const totalItems = filteredUsers.length;

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
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

            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />

            {!loading && totalItems === 0 && (
              <UsersEmptyState hasFilters={Object.values(filters).some(v => v !== undefined && v !== '')} />
            )}
          </div>
        );
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

            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />

            {!loading && totalItems === 0 && (
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
      <UsersHeader showFilters={showFilters} setShowFilters={setShowFilters} />

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