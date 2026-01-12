import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Download,
  Settings,
  BarChart3
} from 'lucide-react';
import { 
  EnhancedPageHeader,
  TabNavigation,
  TabContent
} from '../../components/shared';
import { 
  BulkModerationComponent,
  BulkUserManagementComponent,
  ContentExportComponent
} from '../../components/qa';
import type { TabItem } from '../../types/shared';

export const BulkOperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('moderation');

  const tabs: TabItem[] = [
    {
      id: 'moderation',
      label: 'Content Moderation',
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'export',
      label: 'Data Export',
      icon: <Download className="w-4 h-4" />
    }
  ];

  const pageActions = [
    {
      label: 'System Settings',
      icon: Settings,
      onClick: () => console.log('Open system settings'),
      variant: 'secondary' as const
    },
    {
      label: 'View Analytics',
      icon: BarChart3,
      onClick: () => console.log('Open analytics'),
      variant: 'secondary' as const
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <EnhancedPageHeader
        title="Bulk Operations"
        description="Comprehensive bulk management tools for QA system content and users, integrated with existing dashboard workflows"
        icon={Shield}
        iconGradient={{ from: 'from-blue-500', to: 'to-purple-600' }}
        titleGradient={{ from: 'from-blue-600', to: 'to-purple-600' }}
        actions={pageActions}
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
        className="mb-6"
      />

      <TabContent activeTab={activeTab}>
        {activeTab === 'moderation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BulkModerationComponent />
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BulkUserManagementComponent />
          </motion.div>
        )}

        {activeTab === 'export' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ContentExportComponent />
          </motion.div>
        )}
      </TabContent>
    </motion.div>
  );
};

export default BulkOperationsPage;