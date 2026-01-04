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
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-card/80 border border-border/50 p-6 md:p-8 shadow-xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-indigo-500/5 rounded-full blur-2xl md:blur-3xl -translate-y-24 md:-translate-y-32 translate-x-24 md:translate-x-32" />
        <div className="absolute bottom-0 left-0 w-36 h-36 md:w-48 md:h-48 bg-cyan-500/5 rounded-full blur-xl md:blur-2xl translate-y-18 md:translate-y-24 -translate-x-18 md:-translate-x-24" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Users className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {t('customers', 'Customer Management')}
              </h1>
              <div className="w-16 h-1 md:w-24 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full mb-3" />
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {t('customers_description', 'Comprehensive customer relationship and data management platform')}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground font-medium">{stats[1].value} Active Customers</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-200 font-semibold"
          >
            <UserPlus className="w-5 h-5" />
            {t('add_customer', 'Add Customer')}
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
              <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};