import { useState } from 'react';
import type { Product } from '../../types/products';

export const useProducts = () => {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Car Wash',
      description: 'Complete exterior and interior car wash service',
      price: 29.99,
      category: 'Service',
      status: 'active',
      stock: 100,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Oil Change',
      description: 'Full synthetic oil change with filter replacement',
      price: 49.99,
      category: 'Maintenance',
      status: 'active',
      stock: 50,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Tire Rotation',
      description: 'Professional tire rotation service',
      price: 19.99,
      category: 'Maintenance',
      status: 'active',
      stock: 25,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'Brake Inspection',
      description: 'Comprehensive brake system inspection',
      price: 39.99,
      category: 'Safety',
      status: 'inactive',
      stock: 10,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      name: 'Engine Diagnostic',
      description: 'Complete engine diagnostic scan',
      price: 89.99,
      category: 'Diagnostic',
      status: 'active',
      stock: 15,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
  ]);

  return {
    products
  };
};

// Export the hook
export { useProducts as default };
