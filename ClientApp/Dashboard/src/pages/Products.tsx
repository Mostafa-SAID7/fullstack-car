import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Package, Plus, Search, Filter } from 'lucide-react';

export const Products = () => {
  const { t } = useTranslation();
  const products = [
    { id: 1, name: 'Premium Car Wash', category: 'Service', price: '$29.99', status: 'Active' },
    { id: 2, name: 'Oil Change', category: 'Maintenance', price: '$49.99', status: 'Active' },
    { id: 3, name: 'Tire Rotation', category: 'Maintenance', price: '$19.99', status: 'Active' },
    { id: 4, name: 'Brake Inspection', category: 'Safety', price: '$39.99', status: 'Inactive' },
    { id: 5, name: 'Engine Diagnostic', category: 'Diagnostic', price: '$89.99', status: 'Active' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{t('dashboard.admin.dashboard.products')}</h1>
          <p className="text-muted-foreground/80 font-medium text-lg">Manage your offerings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          {t('shared.common.common.add')} Product
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                {product.status}
              </span>
            </div>

            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{product.category}</p>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-primary">{product.price}</span>
              <button className="px-4 py-2 bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary rounded-lg transition-all font-medium">
                {t('shared.common.common.edit')}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};