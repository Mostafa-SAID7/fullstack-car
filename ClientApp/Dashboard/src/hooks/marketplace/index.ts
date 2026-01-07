import { useState } from 'react';
import { marketplaceService } from '../../services/marketplace';
import type { Customer } from '../../services/marketplace/customers';
import type { Product } from '../../services/marketplace/products';
import type { MarketplaceService } from '../../services/marketplace/services';

export const useMarketplace = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Dashboard
  const getDashboard = async (fromDate?: Date, toDate?: Date) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.getDashboard(fromDate, toDate);
      if (result.succeeded) {
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to fetch dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardMetrics = async (period: string = '30d') => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.getDashboardMetrics(period);
      if (result.succeeded) {
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to fetch metrics');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Analytics
  const getAnalytics = async (fromDate?: Date, toDate?: Date, segment?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.getMarketplaceAnalytics(fromDate, toDate, segment);
      if (result.succeeded) {
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to fetch analytics');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    clearError,
    getDashboard,
    getDashboardMetrics,
    getAnalytics
  };
};

export const useMarketplaceCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchCustomers = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.getCustomers(filters);
      if (result.succeeded && result.data) {
        setCustomers(result.data.items);
        setTotalCount(result.data.totalCount);
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to fetch customers');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customers';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: Partial<Customer>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.createCustomer(customerData);
      if (result.succeeded && result.data) {
        setCustomers(prev => [result.data!, ...prev]);
        setTotalCount(prev => prev + 1);
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to create customer');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create customer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.updateCustomer(id, customerData);
      if (result.succeeded && result.data) {
        setCustomers(prev => prev.map(c => c.id === id ? result.data! : c));
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to update customer');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.deleteCustomer(id);
      if (result.succeeded) {
        setCustomers(prev => prev.filter(c => c.id !== id));
        setTotalCount(prev => prev - 1);
        return true;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to delete customer');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete customer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    totalCount,
    loading,
    error,
    clearError,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
};

export const useMarketplaceProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchProducts = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.getProducts(filters);
      if (result.succeeded && result.data) {
        setProducts(result.data.items);
        setTotalCount(result.data.totalCount);
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to fetch products');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.createProduct(productData);
      if (result.succeeded && result.data) {
        setProducts(prev => [result.data!, ...prev]);
        setTotalCount(prev => prev + 1);
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to create product');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.updateProduct(id, productData);
      if (result.succeeded && result.data) {
        setProducts(prev => prev.map(p => p.id === id ? result.data! : p));
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to update product');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.deleteProduct(id);
      if (result.succeeded) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setTotalCount(prev => prev - 1);
        return true;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to delete product');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    totalCount,
    loading,
    error,
    clearError,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};

export const useMarketplaceServices = () => {
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchServices = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.getServices(filters);
      if (result.succeeded && result.data) {
        setServices(result.data.items);
        setTotalCount(result.data.totalCount);
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to fetch services');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Partial<MarketplaceService>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.createService(serviceData);
      if (result.succeeded && result.data) {
        setServices(prev => [result.data!, ...prev]);
        setTotalCount(prev => prev + 1);
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to create service');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: string, serviceData: Partial<MarketplaceService>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.updateService(id, serviceData);
      if (result.succeeded && result.data) {
        setServices(prev => prev.map(s => s.id === id ? result.data! : s));
        return result.data;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to update service');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await marketplaceService.deleteService(id);
      if (result.succeeded) {
        setServices(prev => prev.filter(s => s.id !== id));
        setTotalCount(prev => prev - 1);
        return true;
      } else {
        throw new Error(result.errors?.[0] || 'Failed to delete service');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete service';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    totalCount,
    loading,
    error,
    clearError,
    fetchServices,
    createService,
    updateService,
    deleteService
  };
};