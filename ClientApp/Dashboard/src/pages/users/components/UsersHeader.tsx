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
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-card/80 border border-border/50 p-6 md:p-8 shadow-xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-purple-500/5 rounded-full blur-2xl md:blur-3xl -translate-y-24 md:-translate-y-32 translate-x-24 md:translate-x-32" />
        <div className="absolute bottom-0 left-0 w-36 h-36 md:w-48 md:h-48 bg-blue-500/5 rounded-full blur-xl md:blur-2xl translate-y-18 md:translate-y-24 -translate-x-18 md:-translate-x-24" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Users className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {t('users', 'User Management')}
              </h1>
              <div className="w-16 h-1 md:w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-3" />
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {t('users_description', 'Comprehensive user management and permission control system')}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground font-medium">{stats[1].value} Active Users</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm text-card-foreground hover:bg-muted/50 hover:shadow-lg transition-all duration-200 text-sm md:text-base"
            >
              <Filter className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">{t('filters', 'Filters')}</span>
              <Filter className="w-4 h-4 sm:hidden" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-200 font-semibold text-sm md:text-base"
            >
              <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">{t('add_user', 'Add User')}</span>
              <UserPlus className="w-4 h-4 sm:hidden" />
            </motion.button>
          </div>
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
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === 'positive'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};