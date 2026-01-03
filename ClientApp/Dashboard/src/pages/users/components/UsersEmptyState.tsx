import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Search } from 'lucide-react';

interface UsersEmptyStateProps {
  hasFilters: boolean;
}

export const UsersEmptyState: React.FC<UsersEmptyStateProps> = ({ hasFilters }) => {
  const { t } = useTranslation();

  if (hasFilters) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('no_users_found', 'No users found')}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t('no_users_found_description', 'No users match your current search criteria. Try adjusting your filters.')}
        </p>
        <button className="px-4 py-2 text-primary hover:text-primary/80 transition-colors">
          {t('clear_filters', 'Clear Filters')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-12 text-center">
      <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {t('no_users_yet', 'No users yet')}
      </h3>
      <p className="text-muted-foreground mb-6">
        {t('no_users_yet_description', 'Get started by adding your first user to the system.')}
      </p>
      <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
        <UserPlus className="w-4 h-4" />
        {t('add_first_user', 'Add First User')}
      </button>
    </div>
  );
};