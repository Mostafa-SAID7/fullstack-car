import React from 'react';
import { Users } from 'lucide-react';
import { PageHeader } from '../../../../components/shared/PageHeader';

interface CustomersHeaderProps {
  totalCustomers?: number;
  activeCustomers?: number;
  onAddCustomer?: () => void;
}

export const CustomersHeader: React.FC<CustomersHeaderProps> = ({
  totalCustomers = 0,
  activeCustomers = 0,
  onAddCustomer
}) => {
  return (
    <PageHeader
      title="Customers Management"
      description="Manage and monitor your customer base"
      icon={Users}
      activeIndicator={`Active Customers (${activeCustomers})`}
      actionButtons={[
        {
          label: 'Add Customer',
          onClick: onAddCustomer,
          variant: 'primary'
        }
      ]}
    />
  );
};