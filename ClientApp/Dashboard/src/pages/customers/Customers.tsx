import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserPlus, Search, Filter, Loader2 } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { CustomersHeader } from './components/CustomersHeader';
import { CustomersFilters } from './components/CustomersFilters';
import { CustomersTable } from './components/CustomersTable';

export const Customers = () => {
  const { t } = useTranslation();
  const { users, loading } = useCustomers();

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
      className="space-y-8"
    >
      <CustomersHeader />
      <CustomersFilters />
      <CustomersTable users={users} />
    </motion.div>
  );
};