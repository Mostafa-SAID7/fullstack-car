import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Package, Archive, TrendingUp } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductsHeader } from './components/ProductsHeader';
import { ProductsFilters } from './components/ProductsFilters';
import { ProductsGrid } from './components/ProductsGrid';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';
import { Pagination } from '../../components/ui/Pagination';

export const Products = () => {
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');

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
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'catalog', label: 'Catalog', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Archive },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ProductsFilters />
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
            <ProductsFilters />
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
          <div className="text-center py-12">
            <Archive className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Inventory Management</h3>
            <p className="text-muted-foreground">Advanced inventory tracking and stock management coming soon.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Product Analytics</h3>
            <p className="text-muted-foreground">Product performance analytics and sales insights coming soon.</p>
          </div>
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
      <ProductsHeader />

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