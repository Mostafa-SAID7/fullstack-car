import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, BarChart3, UserCheck, Users, TrendingUp } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { CustomersHeader } from './components/CustomersHeader';
import { CustomersFilters } from './components/CustomersFilters';
import { CustomersTable } from './components/CustomersTable';
import { TabNavigation, TabContent } from '../../components/ui/TabNavigation';

export const Customers = () => {
  const { users, loading } = useCustomers();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'management', label: 'Management', icon: UserCheck },
    { id: 'segments', label: 'Segments', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <CustomersFilters />
            <CustomersTable users={users} />
          </div>
        );
      case 'management':
        return (
          <div className="space-y-6">
            <CustomersFilters />
            <CustomersTable users={users} />
          </div>
        );
      case 'segments':
        return (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Customer Segments</h3>
            <p className="text-muted-foreground">Advanced customer segmentation and targeting tools coming soon.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Customer Analytics</h3>
            <p className="text-muted-foreground">Detailed customer behavior analytics and insights coming soon.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <CustomersHeader />

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