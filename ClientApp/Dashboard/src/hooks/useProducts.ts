import { useState } from 'react';

export const useProducts = () => {
  const [products] = useState([
    { id: 1, name: 'Premium Car Wash', category: 'Service', price: '$29.99', status: 'Active' },
    { id: 2, name: 'Oil Change', category: 'Maintenance', price: '$49.99', status: 'Active' },
    { id: 3, name: 'Tire Rotation', category: 'Maintenance', price: '$19.99', status: 'Active' },
    { id: 4, name: 'Brake Inspection', category: 'Safety', price: '$39.99', status: 'Inactive' },
    { id: 5, name: 'Engine Diagnostic', category: 'Diagnostic', price: '$89.99', status: 'Active' },
  ]);

  return {
    products
  };
};