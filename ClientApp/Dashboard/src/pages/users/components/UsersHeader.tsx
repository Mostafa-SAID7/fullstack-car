import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserPlus, Users, UserCheck, UserX, Filter } from 'lucide-react';

interface UsersHeaderProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const UsersHeader: React.FC<UsersHeaderProps> = ({ showFilters, setShowFilters }) => {
  const { t } = useTranslation();

  const stats = [
    {
      label: t('total_users', 'Total Users'),
      value: '1,234',
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      label: t('active_users', 'Active Users'),
      value: '987',
      icon: UserCheck,
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      label: t('new_this_month', 'New This Month'),
      value: '56',
      icon: UserPlus,
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      label: t('inactive_users', 'Inactive Users'),
      value: '247',
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
            {t('users', 'Users')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('users_description', 'Manage system users and their permissions')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            {t('filters', 'Filters')}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            {t('add_user', 'Add User')}
          </motion.button>
        </div>
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