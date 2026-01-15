import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Shield,
  Users,
  Settings,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import {
  QAAnalyticsComponent,
  ModerationDashboardComponent,
  UserReputationManagementComponent,
  QAConfigurationComponent
} from '@/components/qa';
import { TabNavigation, TabContent } from '@/components/shared/TabNavigation';

export const QAManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'moderation',
      label: 'Moderation',
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: 'reputation',
      label: 'User Reputation',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Quick Stats Cards */}
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                      <p className="text-2xl font-bold text-foreground">1,234</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xs text-success mt-2">+12% from last month</p>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Answers</p>
                      <p className="text-2xl font-bold text-foreground">3,456</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-info" />
                  </div>
                  <p className="text-xs text-success mt-2">+8% from last month</p>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-foreground">789</p>
                    </div>
                    <Users className="w-8 h-8 text-warning" />
                  </div>
                  <p className="text-xs text-success mt-2">+15% from last month</p>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                      <p className="text-2xl font-bold text-foreground">2.4h</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-success" />
                  </div>
                  <p className="text-xs text-success mt-2">-20% from last month</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Latest questions and answers in your community</p>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          How to optimize React performance in large applications?
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Asked by John Doe • 2 hours ago • 3 answers
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return <QAAnalyticsComponent />;
      case 'moderation':
        return <ModerationDashboardComponent />;
      case 'reputation':
        return <UserReputationManagementComponent />;
      case 'configuration':
        return <QAConfigurationComponent />;
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
      {/* Page Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground">QA System Management</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive management dashboard for your question and answer platform
        </p>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <TabContent activeTab={activeTab}>
        {renderTabContent()}
      </TabContent>
    </motion.div>
  );
};

export default QAManagement;