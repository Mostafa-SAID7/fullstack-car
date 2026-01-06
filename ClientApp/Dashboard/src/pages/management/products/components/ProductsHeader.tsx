import React from 'react';
import { Package } from 'lucide-react';
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
      activeIndicator={`Active Products (${activeProducts})`}
      actionButtons={[
        {
          label: 'Add Product',
          onClick: onAddProduct,
          variant: 'primary'
        }
      ]}
    />
  );
};