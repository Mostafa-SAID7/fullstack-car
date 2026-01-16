/**
 * Marketplace Integration Tests
 * 
 * These tests verify end-to-end functionality of the marketplace integration
 * across Dashboard and backend API. They require a running backend API.
 * 
 * Prerequisites:
 * - Backend API running at configured endpoint
 * - Test database seeded with test data
 * - Valid authentication tokens
 * - SignalR hub accessible
 * 
 * Run with: npm run test:integration
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Test configuration
const TEST_CONFIG = {
  apiUrl: process.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  retryAttempts: 3,
};

// Test data
const TEST_PRODUCT = {
  name: 'Integration Test Product',
  description: 'Product created during integration testing',
  sku: `TEST-${Date.now()}`,
  price: 99.99,
  stockQuantity: 100,
  minStockLevel: 10,
  category: 'CarParts',
  status: 'Active',
  brand: 'Test Brand',
  weight: 5.0,
  isFeatured: false,
  isDigital: false,
};

const TEST_SERVICE = {
  name: 'Integration Test Service',
  title: 'Test Service Title',
  description: 'Service created during integration testing',
  shortDescription: 'Test service',
  basePrice: 149.99,
  estimatedDuration: 60,
  serviceType: 'Maintenance',
  category: 'General',
  status: 'Active',
};

// Helper functions
async function authenticateTestUser(): Promise<string> {
  // TODO: Implement authentication logic
  // This should return a valid JWT token for testing
  const token = process.env.TEST_AUTH_TOKEN || '';
  if (!token) {
    throw new Error('TEST_AUTH_TOKEN environment variable not set');
  }
  return token;
}

async function makeApiRequest(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  token?: string
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${TEST_CONFIG.apiUrl}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return response;
}

describe('Marketplace Integration Tests', () => {
  let authToken: string;
  let createdProductId: string | null = null;
  let createdServiceId: string | null = null;

  beforeAll(async () => {
    // Skip tests if backend is not available
    try {
      const healthCheck = await fetch(`${TEST_CONFIG.apiUrl}/health`);
      if (!healthCheck.ok) {
        console.warn('Backend API not available. Skipping integration tests.');
        return;
      }
    } catch (error) {
      console.warn('Backend API not available. Skipping integration tests.');
      return;
    }

    // Authenticate test user
    try {
      authToken = await authenticateTestUser();
    } catch (error) {
      console.warn('Authentication failed. Skipping integration tests.');
    }
  }, TEST_CONFIG.timeout);

  afterAll(async () => {
    // Cleanup: Delete test products and services
    if (createdProductId && authToken) {
      try {
        await makeApiRequest(
          `/v3/marketplace/products/${createdProductId}`,
          'DELETE',
          undefined,
          authToken
        );
      } catch (error) {
        console.warn('Failed to cleanup test product:', error);
      }
    }

    if (createdServiceId && authToken) {
      try {
        await makeApiRequest(
          `/v6/marketplace/services/${createdServiceId}`,
          'DELETE',
          undefined,
          authToken
        );
      } catch (error) {
        console.warn('Failed to cleanup test service:', error);
      }
    }
  }, TEST_CONFIG.timeout);

  describe('Requirement 15.1: Dashboard Product Creation via API', () => {
    test('should create a product via API', async () => {
      if (!authToken) {
        console.warn('Skipping test: No auth token available');
        return;
      }

      const response = await makeApiRequest(
        '/v3/marketplace/products',
        'POST',
        TEST_PRODUCT,
        authToken
      );

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.name).toBe(TEST_PRODUCT.name);
      expect(data.sku).toBe(TEST_PRODUCT.sku);
      expect(data.price).toBe(TEST_PRODUCT.price);

      createdProductId = data.id;
    }, TEST_CONFIG.timeout);

    test('should retrieve created product from list', async () => {
      if (!authToken || !createdProductId) {
        console.warn('Skipping test: Prerequisites not met');
        return;
      }

      const response = await makeApiRequest(
        '/v3/marketplace/products',
        'GET',
        undefined,
        authToken
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('items');
      expect(Array.isArray(data.items)).toBe(true);

      const createdProduct = data.items.find((p: any) => p.id === createdProductId);
      expect(createdProduct).toBeDefined();
      expect(createdProduct.name).toBe(TEST_PRODUCT.name);
    }, TEST_CONFIG.timeout);
  });

  describe('Requirement 15.2: Dashboard Product Update via API', () => {
    test('should update a product via API', async () => {
      if (!authToken || !createdProductId) {
        console.warn('Skipping test: Prerequisites not met');
        return;
      }

      const updatedData = {
        name: 'Updated Test Product',
        price: 149.99,
      };

      const response = await makeApiRequest(
        `/v3/marketplace/products/${createdProductId}`,
        'PUT',
        updatedData,
        authToken
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.name).toBe(updatedData.name);
      expect(data.price).toBe(updatedData.price);
    }, TEST_CONFIG.timeout);

    test('should retrieve updated product', async () => {
      if (!authToken || !createdProductId) {
        console.warn('Skipping test: Prerequisites not met');
        return;
      }

      const response = await makeApiRequest(
        `/v3/marketplace/products/${createdProductId}`,
        'GET',
        undefined,
        authToken
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.name).toBe('Updated Test Product');
      expect(data.price).toBe(149.99);
    }, TEST_CONFIG.timeout);
  });

  describe('Requirement 15.3: Dashboard Product Deletion via API', () => {
    test('should delete a product via API', async () => {
      if (!authToken || !createdProductId) {
        console.warn('Skipping test: Prerequisites not met');
        return;
      }

      const response = await makeApiRequest(
        `/v3/marketplace/products/${createdProductId}`,
        'DELETE',
        undefined,
        authToken
      );

      expect(response.status).toBe(204);
    }, TEST_CONFIG.timeout);

    test('should not find deleted product', async () => {
      if (!authToken || !createdProductId) {
        console.warn('Skipping test: Prerequisites not met');
        return;
      }

      const response = await makeApiRequest(
        `/v3/marketplace/products/${createdProductId}`,
        'GET',
        undefined,
        authToken
      );

      expect(response.status).toBe(404);

      // Clear the ID since it's been deleted
      createdProductId = null;
    }, TEST_CONFIG.timeout);
  });

  describe('Requirement 15.4: Main App Product Retrieval via API', () => {
    test('should retrieve products list without authentication', async () => {
      const response = await makeApiRequest('/v3/marketplace/products', 'GET');

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('items');
      expect(Array.isArray(data.items)).toBe(true);
      expect(data).toHaveProperty('totalCount');
    }, TEST_CONFIG.timeout);

    test('should retrieve product by ID without authentication', async () => {
      // First get a product ID from the list
      const listResponse = await makeApiRequest('/v3/marketplace/products', 'GET');
      const listData = await listResponse.json();

      if (listData.items.length === 0) {
        console.warn('Skipping test: No products available');
        return;
      }

      const productId = listData.items[0].id;

      const response = await makeApiRequest(
        `/v3/marketplace/products/${productId}`,
        'GET'
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.id).toBe(productId);
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('price');
      expect(data).toHaveProperty('description');
    }, TEST_CONFIG.timeout);
  });

  describe('Requirement 15.5: Dashboard Service Creation via API', () => {
    test('should create a service via API', async () => {
      if (!authToken) {
        console.warn('Skipping test: No auth token available');
        return;
      }

      // First, we need a service provider ID
      // For testing, we'll skip this if we don't have one
      const serviceProviderId = process.env.TEST_SERVICE_PROVIDER_ID;
      if (!serviceProviderId) {
        console.warn('Skipping test: No TEST_SERVICE_PROVIDER_ID available');
        return;
      }

      const serviceData = {
        ...TEST_SERVICE,
        serviceProviderId,
      };

      const response = await makeApiRequest(
        '/v6/marketplace/services',
        'POST',
        serviceData,
        authToken
      );

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.name).toBe(TEST_SERVICE.name);
      expect(data.basePrice).toBe(TEST_SERVICE.basePrice);

      createdServiceId = data.id;
    }, TEST_CONFIG.timeout);
  });

  describe('Requirement 15.6: Main App Service Retrieval via API', () => {
    test('should retrieve services list without authentication', async () => {
      const response = await makeApiRequest('/v6/marketplace/services', 'GET');

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('items');
      expect(Array.isArray(data.items)).toBe(true);
      expect(data).toHaveProperty('totalCount');
    }, TEST_CONFIG.timeout);
  });

  describe('Requirement 15.9: Search and Filtering Work Correctly', () => {
    test('should search products by search term', async () => {
      const response = await makeApiRequest(
        '/v3/marketplace/products?search=test',
        'GET'
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('items');
      expect(Array.isArray(data.items)).toBe(true);
    }, TEST_CONFIG.timeout);

    test('should filter products by category', async () => {
      const response = await makeApiRequest(
        '/v3/marketplace/products?category=CarParts',
        'GET'
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('items');
      
      // All returned items should be in CarParts category
      data.items.forEach((item: any) => {
        expect(item.category).toBe('CarParts');
      });
    }, TEST_CONFIG.timeout);

    test('should filter products by price range', async () => {
      const minPrice = 50;
      const maxPrice = 150;

      const response = await makeApiRequest(
        `/v3/marketplace/products?minPrice=${minPrice}&maxPrice=${maxPrice}`,
        'GET'
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('items');
      
      // All returned items should be within price range
      data.items.forEach((item: any) => {
        expect(item.price).toBeGreaterThanOrEqual(minPrice);
        expect(item.price).toBeLessThanOrEqual(maxPrice);
      });
    }, TEST_CONFIG.timeout);
  });

  describe('Requirement 15.10: Pagination Works Correctly', () => {
    test('should paginate products list', async () => {
      const pageSize = 10;
      const page = 1;

      const response = await makeApiRequest(
        `/v3/marketplace/products?page=${page}&pageSize=${pageSize}`,
        'GET'
      );

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('items');
      expect(data).toHaveProperty('totalCount');
      expect(data).toHaveProperty('page');
      expect(data).toHaveProperty('pageSize');
      
      expect(data.page).toBe(page);
      expect(data.pageSize).toBe(pageSize);
      expect(data.items.length).toBeLessThanOrEqual(pageSize);
    }, TEST_CONFIG.timeout);

    test('should navigate to next page', async () => {
      const pageSize = 10;
      const page1 = 1;
      const page2 = 2;

      const response1 = await makeApiRequest(
        `/v3/marketplace/products?page=${page1}&pageSize=${pageSize}`,
        'GET'
      );

      const response2 = await makeApiRequest(
        `/v3/marketplace/products?page=${page2}&pageSize=${pageSize}`,
        'GET'
      );

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);

      const data1 = await response1.json();
      const data2 = await response2.json();

      // Pages should have different items
      if (data1.items.length > 0 && data2.items.length > 0) {
        expect(data1.items[0].id).not.toBe(data2.items[0].id);
      }
    }, TEST_CONFIG.timeout);
  });
});

/**
 * NOTE: Tests for Requirement 15.7 (Real-time Updates via SignalR) and
 * Requirement 15.8 (Caching) require more complex setup and are better
 * suited for manual testing or E2E tests with Playwright/Cypress.
 * 
 * These tests can be added once the infrastructure is in place.
 */
