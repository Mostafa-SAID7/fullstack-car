import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Package, Archive, TrendingUp, Plus, DollarSign, RefreshCw, Download } from 'lucide-react';
import { useProducts } from '../../../hooks';
import { PageHeader, type PageStat, type PageAction } from '../../../components/shared';
import { SearchAndFilters, EmptyState, Pagination, DynamicModal, type FilterField, type FormField } from '../../../components/shared';
import { ProductsGrid } from './components/ProductsGrid';
import { TabNavigation, TabContent } from '../../../components/shared/TabNavigation';
import { useModal } from '../../../hooks/useModal';

export const Products = () => {
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Paginated products for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Product modal configuration
  const productFormFields: FormField[] = [
    {
      key: 'name',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Enter product name',
      required: true,
      validation: { min: 2, max: 100 }
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter product description',
      required: true,
      validation: { min: 10, max: 500 }
    },
    {
      key: 'price',
      label: 'Price',
      type: 'number',
      placeholder: 'Enter price',
      required: true,
      validation: { min: 0.01 }
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' },
        { value: 'home', label: 'Home & Garden' },
        { value: 'sports', label: 'Sports & Outdoors' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      key: 'sku',
      label: 'SKU',
      type: 'text',
      placeholder: 'Enter SKU (optional)'
    },
    {
      key: 'stock',
      label: 'Stock Quantity',
      type: 'number',
      placeholder: 'Enter stock quantity',
      required: true,
      validation: { min: 0 }
    },
    {
      key: 'isActive',
      label: 'Active Product',
      type: 'checkbox'
    }
  ];

  const handleCreateProduct = async (productData: Record<string, any>) => {
    try {
      console.log('Creating product:', productData);
      // Here you would call your API to create the product
      // await createProduct(productData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const addProductModal = useModal({
    type: 'product',
    fields: productFormFields,
    onSubmit: handleCreateProduct,
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
        { value: 'draft', label: 'Draft' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: '', label: 'All Categories' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' },
        { value: 'home', label: 'Home & Garden' }
      ]
    },
    {
      key: 'createdAfter',
      label: 'Created After',
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
      label: 'Total Products',
      value: '1,234',
      icon: Package,
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Active Listings',
      value: '987',
      icon: TrendingUp,
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Total Revenue',
      value: '$45,678',
      icon: DollarSign,
      change: '+15%',
      changeType: 'positive'
    }
  ];

  const actions: PageAction[] = [
    {
      label: 'Refresh',
      icon: RefreshCw,
      onClick: () => console.log('Refresh products'),
      variant: 'secondary',
      hideOnMobile: true
    },
    {
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export products'),
      variant: 'secondary',
      hideOnMobile: true
    },
    {
      label: 'Add Product',
      icon: Plus,
      onClick: addProductModal.openModal,
      variant: 'primary'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'catalog', label: 'Catalog', icon: <Package className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory', icon: <Archive className="w-4 h-4" /> },
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
              searchPlaceholder="Search products by name, SKU, or description..."
              filterFields={filterFields}
              filterValues={filterValues}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
            <ProductsGrid products={paginatedProducts} />
            <Pagination
              currentPage={currentPage}
              totalItems={products.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />
          </div>
        );
      case 'catalog':
        return (
          <div className="space-y-6">
            <SearchAndFilters
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Search products by name, SKU, or description..."
              filterFields={filterFields}
              filterValues={filterValues}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
            <ProductsGrid products={paginatedProducts} />
            <Pagination
              currentPage={currentPage}
              totalItems={products.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />
          </div>
        );
      case 'inventory':
        return (
          <EmptyState
            icon={Archive}
            title="Inventory Management"
            description="Advanced inventory tracking and stock management coming soon."
            showAction={false}
          />
        );
      case 'analytics':
        return (
          <EmptyState
            icon={TrendingUp}
            title="Product Analytics"
            description="Product performance analytics and sales insights coming soon."
            showAction={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Product Management"
        description="Comprehensive product catalog and inventory management system"
        icon={Package}
        iconGradient={{ from: 'from-green-500', to: 'to-green-600' }}
        titleGradient={{ from: 'from-emerald-600', to: 'to-teal-600' }}
        stats={stats}
        actions={actions}
        activeIndicator={{ value: '987', label: 'Active Listings' }}
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>

      {/* Add Product Modal */}
      <DynamicModal {...addProductModal.modalProps} />
    </motion.div>
  );
};