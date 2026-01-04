import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Package, Archive, TrendingUp } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductsHeader } from './components/ProductsHeader';
import { ProductsFilters } from './components/ProductsFilters';
import { ProductsGrid } from './components/ProductsGrid';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';

export const Products = () => {
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'catalog', label: 'Catalog', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Archive },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProductsHeader />;
      case 'catalog':
        return (
          <div className="space-y-6">
            <ProductsFilters />
            <ProductsGrid products={products} />
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