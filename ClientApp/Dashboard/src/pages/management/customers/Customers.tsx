import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, UserCheck, TrendingUp, UserPlus, UserX, RefreshCw, Download } from 'lucide-react';
import { useCustomers } from '../../../hooks';
import { PageHeader, type PageStat, type PageAction } from '../../../components/shared';
import { SearchAndFilters, EmptyState, Pagination, DynamicModal, type FilterField, type FormField } from '../../../components/shared';
import { CustomersTable } from './components/CustomersTable';
import { TabNavigation, TabContent } from '../../../components/layout/tabs/TabNavigation';
import { useModal } from '../../../hooks/useModal';

export const Customers = () => {
  const { users, loading } = useCustomers();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Paginated customers for current page
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  }, [users, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Customer modal configuration
  const customerFormFields: FormField[] = [
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
      placeholder: 'Enter phone number',
      required: true
    },
    {
      key: 'company',
      label: 'Company',
      type: 'text',
      placeholder: 'Enter company name (optional)'
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter full address (optional)'
    },
    {
      key: 'customerType',
      label: 'Customer Type',
      type: 'select',
      required: true,
      options: [
        { value: 'individual', label: 'Individual' },
        { value: 'business', label: 'Business' },
        { value: 'enterprise', label: 'Enterprise' }
      ]
    }
  ];

  const handleCreateCustomer = async (customerData: Record<string, any>) => {
    try {
      console.log('Creating customer:', customerData);
      // Here you would call your API to create the customer
      // await createCustomer(customerData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Customer created successfully!');
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  };

  const addCustomerModal = useModal({
    type: 'customer',
    fields: customerFormFields,
    onSubmit: handleCreateCustomer,
    size: 'lg'
  });

  // Filter configuration
  const filterFields: FilterField[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
        { value: 'suspended', label: 'Suspended' }
      ]
    },
    {
      key: 'customerType',
      label: 'Customer Type',
      type: 'select',
      options: [
        { value: '', label: 'All Types' },
        { value: 'customer', label: 'Customer' },
        { value: 'premium', label: 'Premium Customer' },
        { value: 'vip', label: 'VIP Customer' }
      ]
    },
    {
      key: 'registrationDate',
      label: 'Registration Date',
      type: 'date'
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setSearchValue('');
  };

  // Page header configuration
  const stats: PageStat[] = [
    {
      label: 'Total Customers',
      value: '2,847',
      icon: Users,
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Active Customers',
      value: '2,234',
      icon: UserCheck,
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'New This Month',
      value: '156',
      icon: TrendingUp,
      change: '+23%',
      changeType: 'positive'
    },
    {
      label: 'Inactive Customers',
      value: '613',
      icon: UserX,
      change: '-5%',
      changeType: 'negative'
    }
  ];

  const actions: PageAction[] = [
    {
      label: 'Refresh',
      icon: RefreshCw,
      onClick: () => console.log('Refresh customers'),
      variant: 'secondary',
      hideOnMobile: true
    },
    {
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export customers'),
      variant: 'secondary',
      hideOnMobile: true
    },
    {
      label: 'Add Customer',
      icon: UserPlus,
      onClick: addCustomerModal.openModal,
      variant: 'primary'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'segments', label: 'Segments', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <SearchAndFilters
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Search customers by name, email, or phone..."
              filterFields={filterFields}
              filterValues={filterValues}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
            <CustomersTable users={paginatedCustomers} />
            <Pagination
              currentPage={currentPage}
              totalItems={users.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-6">
            <SearchAndFilters
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Search customers by name, email, or phone..."
              filterFields={filterFields}
              filterValues={filterValues}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
            <CustomersTable users={paginatedCustomers} />
            <Pagination
              currentPage={currentPage}
              totalItems={users.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />
          </div>
        );
      case 'segments':
        return (
          <EmptyState
            icon={UserCheck}
            title="Customer Segments"
            description="Advanced customer segmentation and targeting coming soon."
            showAction={false}
          />
        );
      case 'analytics':
        return (
          <EmptyState
            icon={TrendingUp}
            title="Customer Analytics"
            description="Customer behavior analytics and insights coming soon."
            showAction={false}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
        title="Customer Management"
        description="Comprehensive customer relationship and data management platform"
        icon={Users}
        iconGradient={{ from: 'from-indigo-500', to: 'to-indigo-600' }}
        titleGradient={{ from: 'from-purple-600', to: 'to-blue-600' }}
        stats={stats}
        actions={actions}
        activeIndicator={{ value: '2,234', label: 'Active Customers' }}
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>

      {/* Add Customer Modal */}
      <DynamicModal {...addCustomerModal.modalProps} />
    </motion.div>
  );
};