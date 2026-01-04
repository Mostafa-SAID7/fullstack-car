import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export const CustomersFilters: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const statuses = [
    { value: 'all', label: t('all_statuses', 'All Statuses') },
    { value: 'active', label: t('active', 'Active') },
    { value: 'inactive', label: t('inactive', 'Inactive') },
    { value: 'pending', label: t('pending', 'Pending') },
    { value: 'suspended', label: t('suspended', 'Suspended') }
  ];

  const roles = [
    { value: 'all', label: t('all_roles', 'All Roles') },
    { value: 'customer', label: t('customer', 'Customer') },
    { value: 'premium', label: t('premium_customer', 'Premium Customer') },
    { value: 'vip', label: t('vip_customer', 'VIP Customer') }
  ];

  const dateRanges = [
    { value: 'all', label: t('all_time', 'All Time') },
    { value: 'today', label: t('today', 'Today') },
    { value: 'week', label: t('this_week', 'This Week') },
    { value: 'month', label: t('this_month', 'This Month') },
    { value: 'quarter', label: t('this_quarter', 'This Quarter') },
    { value: 'year', label: t('this_year', 'This Year') }
  ];

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('search_customers', 'Search customers by name, email, or phone...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Filter Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t('filters', 'Filters')}
        </motion.button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t('advanced_filters', 'Advanced Filters')}
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('status', 'Status')}
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('customer_type', 'Customer Type')}
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('registration_date', 'Registration Date')}
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('apply_filters', 'Apply Filters')}
            </motion.button>
            <button
              onClick={() => {
                setSelectedStatus('all');
                setSelectedRole('all');
                setDateRange('all');
              }}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('clear_filters', 'Clear Filters')}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};