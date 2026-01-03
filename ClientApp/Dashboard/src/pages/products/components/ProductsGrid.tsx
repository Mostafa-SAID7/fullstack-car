import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Eye, MoreVertical, Star, Package } from 'lucide-react';
import type { Product } from '../../../types/products';

interface ProductsGridProps {
  products: Product[];
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ products }) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('active', 'Active');
      case 'inactive':
        return t('inactive', 'Inactive');
      case 'out_of_stock':
        return t('out_of_stock', 'Out of Stock');
      default:
        return status;
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('no_products', 'No products found')}
        </h3>
        <p className="text-muted-foreground">
          {t('no_products_description', 'Start by adding your first product to the catalog.')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Product Image */}
          <div className="relative aspect-square bg-muted">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(product.status)}`}>
                {getStatusText(product.status)}
              </span>
            </div>

            {/* Actions Menu */}
            <div className="absolute top-2 right-2">
              <button className="p-1 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
                {product.name}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Price and Rating */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-lg font-bold text-foreground">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through ml-2">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>

            {/* Stock Info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                {t('stock', 'Stock')}: {product.stock}
              </span>
              <span className="text-sm text-muted-foreground">
                {t('category', 'Category')}: {product.category}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {t('view', 'View')}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};