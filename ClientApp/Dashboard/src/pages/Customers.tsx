import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { UserPlus, Search, Filter } from 'lucide-react';

export const Customers = () => {
  const { t } = useTranslation();
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', joined: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Inactive', joined: '2024-03-10' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'Active', joined: '2024-04-05' },
    { id: 5, name: 'David Brown', email: 'david@example.com', status: 'Pending', joined: '2024-04-25' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{t('dashboard.admin.management.users.title')}</h1>
          <p className="text-muted-foreground/80 font-medium text-lg">{t('dashboard.admin.management.users.list')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <UserPlus className="w-5 h-5" />
          {t('dashboard.admin.management.users.create')}
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('shared.common.common.search')}
            className="w-full bg-muted/50 border border-transparent focus:border-primary/20 focus:bg-background h-10 pl-10 pr-4 rounded-lg outline-none transition-all"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors">
          <Filter className="w-4 h-4" />
          {t('shared.common.common.filter')}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-md rounded-3xl border border-border/50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/20">
              <tr>
                <th className="text-left p-4 font-semibold">{t('identity.profile.name')}</th>
                <th className="text-left p-4 font-semibold">{t('identity.profile.email')}</th>
                <th className="text-left p-4 font-semibold">{t('dashboard.admin.management.users.accountStatus')}</th>
                <th className="text-left p-4 font-semibold">{t('dashboard.admin.management.users.registrationDate')}</th>
                <th className="text-left p-4 font-semibold">{t('shared.common.common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-t border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{customer.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${customer.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                      customer.status === 'Inactive' ? 'bg-red-500/10 text-red-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{customer.joined}</td>
                  <td className="p-4">
                    <button className="text-primary hover:text-primary/80 font-medium">
                      Edit
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};