import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserPlus, Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

export const CustomersHeader: React.FC = () => {
  const { t } = useTranslation();

  const stats = [
    {
      label: t('total_customers', 'Total Customers'),
      value: '2,847',
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      label: t('active_customers', 'Active Customers'),
      value: '2,234',
      icon: UserCheck,
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      label: t('new_this_month', 'New This Month'),
      value: '156',
      icon: TrendingUp,
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      label: t('inactive_customers', 'Inactive Customers'),
      value: '613',
      icon: UserX,
      change: '-5%',
      changeType: 'negative' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('customers', 'Customers')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('customers_description', 'Manage your customer base and relationships')}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          {t('add_customer', 'Add Customer')}
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};