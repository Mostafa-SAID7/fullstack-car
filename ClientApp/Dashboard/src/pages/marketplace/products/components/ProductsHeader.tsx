import React from 'react';
import { Package, Plus } from 'lucide-react';
import { PageHeader } from '../../../../components/shared/PageHeader';

interface ProductsHeaderProps {
  totalProducts?: number;
  activeProducts?: number;
  onAddProduct?: () => void;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  totalProducts = 0,
  activeProducts = 0,
  onAddProduct
}) => {
  return (
    <PageHeader
      title="Products Management"
      description="Manage your product catalog and inventory"
      icon={Package}
      iconGradient={{
        from: 'from-blue-500',
        to: 'to-indigo-600'
      }}
      titleGradient={{
        from: 'from-blue-600',
        to: 'to-indigo-600'
      }}
      stats={[
        {
          label: 'Total Products',
          value: totalProducts.toString(),
          icon: Package,
          change: '+12%',
          changeType: 'positive',
          color: 'text-blue-600'
        },
        {
          label: 'Active Products',
          value: activeProducts.toString(),
          icon: Package,
          change: '+8%',
          changeType: 'positive',
          color: 'text-green-600'
        }
      ]}
      actions={onAddProduct ? [
        {
          label: 'Add Product',
          icon: Plus,
          onClick: onAddProduct,
          variant: 'primary'
        }
      ] : []}
      activeIndicator={{
        value: activeProducts.toString(),
        label: 'Active Products'
      }}
    />
  );
};