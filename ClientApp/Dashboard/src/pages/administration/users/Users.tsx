import React, { useState, useMemo } from 'react';
import { RefreshCw, Plus, Download, Users as UsersIcon, UserCheck, UserX, Edit, Trash2, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUsers } from './hooks/useUsers';
import { PageHeader, type PageStat, type PageAction } from '../../../components/shared/PageHeader';
import { 
  SearchAndFilters, 
  EmptyState, 
  Pagination, 
  DataTable,
  UserCards,
  PageHeaderSkeleton,
  TabNavigation,
  TabContent,
  DynamicModal,
  type FilterField,
  type TableColumn,
  type ViewMode,
  type TabItem,
  type FormField
} from '../../../components/shared';
import { useModal } from '../../../hooks/useModal';
import type { UserFilters } from './types/filters';

export const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
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
    refetch
  } = useUsers(filters);

  // Modal configuration for adding new users
  const userFormFields: FormField[] = [
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter first name',
      required: true,
      validation: { min: 2, max: 50 }
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter last name',
      required: true,
      validation: { min: 2, max: 50 }
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email address',
      required: true,
      validation: { 
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        message: 'Please enter a valid email address'
      }
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      placeholder: 'Enter phone number (optional)'
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
        { value: 'moderator', label: 'Moderator' }
      ]
    },
    {
      key: 'isActive',
      label: 'Active Account',
      type: 'checkbox'
    }
  ];

  const handleCreateUser = async (userData: Record<string, any>) => {
    try {
      console.log('Creating user:', userData);
      // Here you would call your API to create the user
      // await createUser(userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh the users list
      refetch();
      
      // Show success message (you can integrate with toast notifications)
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // This will be handled by the modal
    }
  };

  const addUserModal = useModal({
    type: 'user',
    fields: userFormFields,
    onSubmit: handleCreateUser,
    size: 'lg'
  });

  // Filter configuration for SearchAndFilters component
  const filterFields: FilterField[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' }
      ]
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: '', label: 'All Roles' },
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'moderator', label: 'Moderator' }
      ]
    },
    {
      key: 'joinedAfter',
      label: 'Joined After',
      type: 'date'
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 10,
      search: '',
      status: '',
      role: '',
      sortBy: 'CreatedAt',
      sortDirection: 'desc'
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev: UserFilters) => ({ ...prev, page }));
  };

  const handleRefresh = () => {
    refetch();
  };

  // Memoize user statistics to prevent recalculation on every render
  const userStats = useMemo(() => {
    const activeUsers = users.filter(u => u.isActive);
    const inactiveUsers = users.filter(u => !u.isActive);
    const pendingUsers = users.filter(u => !u.isEmailConfirmed);
    
    return {
      activeCount: activeUsers.length,
      inactiveCount: inactiveUsers.length,
      pendingCount: pendingUsers.length
    };
  }, [users]);

  // Tab configuration
  const tabs: TabItem[] = [
    {
      id: 'all',
      label: 'All Users',
      icon: <UsersIcon className="w-4 h-4" />,
      count: totalCount || 0
    },
    {
      id: 'active',
      label: 'Active',
      icon: <UserCheck className="w-4 h-4" />,
      count: userStats.activeCount
    },
    {
      id: 'inactive',
      label: 'Inactive',
      icon: <UserX className="w-4 h-4" />,
      count: userStats.inactiveCount
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: <Clock className="w-4 h-4" />,
      count: userStats.pendingCount
    }
  ];

  // Handle tab change and update filters
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update filters based on selected tab
    let newStatus = '';
    switch (tabId) {
      case 'active':
        newStatus = 'active';
        break;
      case 'inactive':
        newStatus = 'inactive';
        break;
      case 'pending':
        newStatus = 'pending';
        break;
      default:
        newStatus = '';
    }
    
    setFilters(prev => ({ 
      ...prev, 
      status: newStatus, 
      page: 1 
    }));
  };

  // Table columns configuration
  const tableColumns: TableColumn[] = [
    {
      key: 'fullName',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {row.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <div className="font-medium text-foreground">{value || 'Unknown'}</div>
            <div className="text-sm text-muted-foreground">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'roles',
      label: 'Role',
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {Array.isArray(value) ? value.join(', ') : value || 'User'}
        </span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {value ? new Date(value).toLocaleDateString() : 'Unknown'}
        </span>
      )
    },
    {
      key: 'lastLoginAt',
      label: 'Last Login',
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {value ? new Date(value).toLocaleDateString() : 'Never'}
        </span>
      )
    }
  ];

  // Table actions
  const tableActions = [
    {
      label: 'Edit User',
      action: 'edit',
      icon: <Edit className="w-4 h-4" />
    },
    {
      label: 'Send Message',
      action: 'message',
      icon: <Mail className="w-4 h-4" />
    },
    {
      label: 'Delete User',
      action: 'delete',
      icon: <Trash2 className="w-4 h-4" />,
      variant: 'danger' as const
    }
  ];

  // Page header configuration
  const stats: PageStat[] = [
    {
      label: 'Total Users',
      value: totalCount?.toString() || '0',
      icon: UsersIcon,
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Active Users',
      value: userStats.activeCount.toString(),
      icon: UserCheck,
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Pending Approval',
      value: userStats.pendingCount.toString(),
      icon: Clock,
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'Inactive Users',
      value: userStats.inactiveCount.toString(),
      icon: UserX,
      change: '-5%',
      changeType: 'negative'
    }
  ];

  const actions: PageAction[] = [
    {
      label: 'Refresh',
      icon: RefreshCw,
      onClick: handleRefresh,
      variant: 'secondary',
      hideOnMobile: true
    },
    {
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export users'),
      variant: 'secondary',
      hideOnMobile: true
    },
    {
      label: 'Add User',
      icon: Plus,
      onClick: addUserModal.openModal,
      variant: 'primary'
    }
  ];

  if (loading) {
    return <PageHeaderSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <h3 className="text-destructive font-medium">Error loading users</h3>
          <p className="text-destructive/80 text-sm mt-1">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="User Management"
        description="Comprehensive user account management and monitoring platform"
        icon={UsersIcon}
        iconGradient={{ from: 'from-blue-500', to: 'to-blue-600' }}
        titleGradient={{ from: 'from-blue-600', to: 'to-cyan-600' }}
        stats={stats}
        actions={actions}
        activeIndicator={{ value: userStats.activeCount.toString(), label: 'Active Users' }}
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        variant="underline"
        className="mb-6"
      />
      
      <TabContent activeTab={activeTab}>
        <SearchAndFilters
          searchValue={filters.search || ''}
          onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value, page: 1 }))}
          searchPlaceholder="Search users by name, email, or phone..."
          filterFields={filterFields}
          filterValues={filters as Record<string, string>}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          showViewToggle={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="mt-6">
          {users.length === 0 && !loading ? (
            <EmptyState
              icon={UsersIcon}
              title="No Users Found"
              description="There are no users matching your current filters. Try adjusting your search criteria or add some users to get started."
              actionLabel="Add User"
              onAction={addUserModal.openModal}
            />
          ) : (
            <div className="space-y-6">
              {viewMode === 'table' ? (
                <DataTable
                  columns={tableColumns}
                  data={users}
                  loading={loading}
                  actions={tableActions}
                  onRowAction={(action, row) => {
                    console.log(`Action: ${action}, User:`, row);
                  }}
                  showToggleColumns={true}
                />
              ) : (
                <UserCards
                  users={users}
                  loading={loading}
                  onUserAction={(action, user) => {
                    console.log(`Action: ${action}, User:`, user);
                  }}
                />
              )}
              
              <Pagination
                currentPage={filters.page || 1}
                totalItems={totalCount}
                itemsPerPage={filters.pageSize || 10}
                onPageChange={handlePageChange}
                onItemsPerPageChange={(newSize) => setFilters(prev => ({ ...prev, pageSize: newSize, page: 1 }))}
              />
            </div>
          )}
        </div>
      </TabContent>

      {/* Add User Modal */}
      <DynamicModal {...addUserModal.modalProps} />
    </motion.div>
  );
};

export default Users;