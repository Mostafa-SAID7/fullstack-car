import React from 'react';
import { Users, UserPlus } from 'lucide-react';
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
      iconGradient={{
        from: 'from-green-500',
        to: 'to-emerald-600'
      }}
      titleGradient={{
        from: 'from-green-600',
        to: 'to-emerald-600'
      }}
      stats={[
        {
          label: 'Total Customers',
          value: totalCustomers.toString(),
          icon: Users,
          change: '+15%',
          changeType: 'positive',
          color: 'text-green-600'
        },
        {
          label: 'Active Customers',
          value: activeCustomers.toString(),
          icon: Users,
          change: '+10%',
          changeType: 'positive',
          color: 'text-emerald-600'
        }
      ]}
      actions={onAddCustomer ? [
        {
          label: 'Add Customer',
          icon: UserPlus,
          onClick: onAddCustomer,
          variant: 'primary'
        }
      ] : []}
      activeIndicator={{
        value: activeCustomers.toString(),
        label: 'Active Customers'
      }}
    />
  );
};