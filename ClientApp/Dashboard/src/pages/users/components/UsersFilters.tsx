import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';

interface UsersFiltersProps {
  filters: {
    searchTerm?: string;
    role?: string;
    isActive?: boolean;
    isEmailConfirmed?: boolean;
  };
  showFilters: boolean;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
}

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  filters,
  showFilters,
  onFilterChange,
  onClearFilters
}) => {
  const { t } = useTranslation();

  const roles = [
    { value: '', label: t('all_roles', 'All Roles') },
    { value: 'admin', label: t('admin', 'Admin') },
    { value: 'user', label: t('user', 'User') },
    { value: 'moderator', label: t('moderator', 'Moderator') }
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t('search_users', 'Search users by name, email, or ID...')}
          value={filters.searchTerm || ''}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('role', 'Role')}
              </label>
              <select
                value={filters.role || ''}
                onChange={(e) => onFilterChange('role', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('status', 'Status')}
              </label>
              <select
                value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                onChange={(e) => onFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">{t('all_statuses', 'All Statuses')}</option>
                <option value="true">{t('active', 'Active')}</option>
                <option value="false">{t('inactive', 'Inactive')}</option>
              </select>
            </div>

            {/* Email Confirmation Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('email_status', 'Email Status')}
              </label>
              <select
                value={filters.isEmailConfirmed === undefined ? '' : filters.isEmailConfirmed.toString()}
                onChange={(e) => onFilterChange('isEmailConfirmed', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">{t('all_email_statuses', 'All Email Statuses')}</option>
                <option value="true">{t('confirmed', 'Confirmed')}</option>
                <option value="false">{t('unconfirmed', 'Unconfirmed')}</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
            <button
              onClick={onClearFilters}
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