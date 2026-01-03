import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../../hooks/useProducts';
import { ProductsHeader } from './components/ProductsHeader';
import { ProductsFilters } from './components/ProductsFilters';
import { ProductsGrid } from './components/ProductsGrid';

export const Products = () => {
  const { t } = useTranslation();
  const { products } = useProducts();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <ProductsHeader />
      <ProductsFilters />
      <ProductsGrid products={products} />
    </motion.div>
  );
};