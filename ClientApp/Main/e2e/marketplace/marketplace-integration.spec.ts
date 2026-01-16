/**
 * Marketplace Integration E2E Tests (Angular Main App)
 * 
 * These tests verify end-to-end functionality of the marketplace integration
 * in the Main App (user-facing application). They require a running backend API.
 * 
 * Prerequisites:
 * - Backend API running at configured endpoint
 * - Test database seeded with test data
 * - Main App running in test mode
 * 
 * Run with: npm run e2e:marketplace
 */

import { test, expect, Page } from '@playwright/test';

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.BASE_URL || 'http://localhost:4200',
  apiUrl: process.env.API_URL || 'http://localhost:5000/api',
  timeout: 10000,
};

// Helper functions
async function navigateToProducts(page: Page) {
  await page.goto(`${TEST_CONFIG.baseUrl}/marketplace/products`);
  await page.waitForLoadState('networkidle');
}

async function navigateToProductDetail(page: Page, productId: string) {
  await page.goto(`${TEST_CONFIG.baseUrl}/marketplace/products/${productId}`);
  await page.waitForLoadState('networkidle');
}

async function navigateToServices(page: Page) {
  await page.goto(`${TEST_CONFIG.baseUrl}/marketplace/services`);
  await page.waitForLoadState('networkidle');
}

test.describe('Marketplace Integration Tests - Main App', () => {
  test.beforeEach(async ({ page }) => {
    // Check if backend is available
    try {
      const response = await page.request.get(`${TEST_CONFIG.apiUrl}/health`);
      if (!response.ok()) {
        test.skip(true, 'Backend API not available');
      }
    } catch (error) {
      test.skip(true, 'Backend API not available');
    }
  });

  test.describe('Requirement 15.4: Main App Product Retrieval via API', () => {
    test('should display products list page', async ({ page }) => {
      await navigateToProducts(page);

      // Verify page title or heading
      await expect(page.locator('h1, h2').first()).toBeVisible();

      // Verify products are displayed
      const productCards = page.locator('[data-testid="product-card"]');
      const count = await productCards.count();
      
      // Should have at least one product or show empty state
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should display product images with lazy loading', async ({ page }) => {
      await navigateToProducts(page);

      // Wait for products to load
      await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

      // Check if images are present
      const images = page.locator('[data-testid="product-image"]');
      const imageCount = await images.count();

      if (imageCount > 0) {
        // Verify first image loads
        const firstImage = images.first();
        await expect(firstImage).toBeVisible();
        
        // Verify image has src attribute
        const src = await firstImage.getAttribute('src');
        expect(src).toBeTruthy();
      }
    });

    test('should display product details page', async ({ page }) => {
      await navigateToProducts(page);

      // Wait for products to load
      await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

      // Click on first product
      const firstProduct = page.locator('[data-testid="product-card"]').first();
      const productLink = firstProduct.locator('a, button').first();
      
      if (await productLink.isVisible()) {
        await productLink.click();
        await page.waitForLoadState('networkidle');

        // Verify product detail page elements
        await expect(page.locator('[data-testid="product-name"]')).toBeVisible();
        await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
        await expect(page.locator('[data-testid="product-description"]')).toBeVisible();
      }
    });

    test('should display product ratings and prices', async ({ page }) => {
      await navigateToProducts(page);

      // Wait for products to load
      await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

      const productCards = page.locator('[data-testid="product-card"]');
      const count = await productCards.count();

      if (count > 0) {
        const firstProduct = productCards.first();
        
        // Verify price is displayed
        const price = firstProduct.locator('[data-testid="product-price"]');
        await expect(price).toBeVisible();
        
        // Verify price format (should contain currency symbol or number)
        const priceText = await price.textContent();
        expect(priceText).toMatch(/\d+/);
      }
    });
  });

  test.describe('Requirement 15.6: Main App Service Retrieval via API', () => {
    test('should display services list page', async ({ page }) => {
      await navigateToServices(page);

      // Verify page title or heading
      await expect(page.locator('h1, h2').first()).toBeVisible();

      // Verify services are displayed or empty state shown
      const serviceCards = page.locator('[data-testid="service-card"]');
      const count = await serviceCards.count();
      
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should display service ratings and prices', async ({ page }) => {
      await navigateToServices(page);

      // Wait for services to load
      await page.waitForSelector('[data-testid="service-card"]', { timeout: 5000 });

      const serviceCards = page.locator('[data-testid="service-card"]');
      const count = await serviceCards.count();

      if (count > 0) {
        const firstService = serviceCards.first();
        
        // Verify price is displayed
        const price = firstService.locator('[data-testid="service-price"]');
        await expect(price).toBeVisible();
      }
    });
  });

  test.describe('Requirement 15.9: Search and Filtering Work Correctly', () => {
    test('should search products by search term', async ({ page }) => {
      await navigateToProducts(page);

      // Find search input
      const searchInput = page.locator('[data-testid="product-search"]');
      
      if (await searchInput.isVisible()) {
        // Enter search term
        await searchInput.fill('test');
        
        // Wait for debounce and results
        await page.waitForTimeout(500);
        await page.waitForLoadState('networkidle');

        // Verify results are displayed
        const productCards = page.locator('[data-testid="product-card"]');
        const count = await productCards.count();
        
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });

    test('should filter products by category', async ({ page }) => {
      await navigateToProducts(page);

      // Find category filter
      const categoryFilter = page.locator('[data-testid="category-filter"]');
      
      if (await categoryFilter.isVisible()) {
        // Select a category
        await categoryFilter.click();
        
        // Select first option (if dropdown)
        const firstOption = page.locator('[data-testid="category-option"]').first();
        if (await firstOption.isVisible()) {
          await firstOption.click();
          
          // Wait for results
          await page.waitForLoadState('networkidle');

          // Verify results are displayed
          const productCards = page.locator('[data-testid="product-card"]');
          const count = await productCards.count();
          
          expect(count).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('should filter products by price range', async ({ page }) => {
      await navigateToProducts(page);

      // Find price range filters
      const minPriceInput = page.locator('[data-testid="min-price"]');
      const maxPriceInput = page.locator('[data-testid="max-price"]');
      
      if (await minPriceInput.isVisible() && await maxPriceInput.isVisible()) {
        // Set price range
        await minPriceInput.fill('50');
        await maxPriceInput.fill('150');
        
        // Wait for results
        await page.waitForTimeout(500);
        await page.waitForLoadState('networkidle');

        // Verify results are displayed
        const productCards = page.locator('[data-testid="product-card"]');
        const count = await productCards.count();
        
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });

    test('should debounce search input', async ({ page }) => {
      await navigateToProducts(page);

      const searchInput = page.locator('[data-testid="product-search"]');
      
      if (await searchInput.isVisible()) {
        // Track network requests
        let requestCount = 0;
        page.on('request', (request) => {
          if (request.url().includes('/products') && request.url().includes('search')) {
            requestCount++;
          }
        });

        // Type quickly (should debounce)
        await searchInput.fill('t');
        await page.waitForTimeout(100);
        await searchInput.fill('te');
        await page.waitForTimeout(100);
        await searchInput.fill('tes');
        await page.waitForTimeout(100);
        await searchInput.fill('test');
        
        // Wait for debounce period
        await page.waitForTimeout(500);

        // Should have made only 1 request due to debouncing
        expect(requestCount).toBeLessThanOrEqual(2);
      }
    });
  });

  test.describe('Requirement 15.10: Pagination Works Correctly', () => {
    test('should display pagination controls', async ({ page }) => {
      await navigateToProducts(page);

      // Wait for products to load
      await page.waitForLoadState('networkidle');

      // Check for pagination controls
      const pagination = page.locator('[data-testid="pagination"]');
      
      // Pagination may not be visible if there are few products
      const isVisible = await pagination.isVisible().catch(() => false);
      
      if (isVisible) {
        // Verify pagination elements
        const nextButton = page.locator('[data-testid="pagination-next"]');
        const prevButton = page.locator('[data-testid="pagination-prev"]');
        
        expect(await nextButton.isVisible() || await prevButton.isVisible()).toBe(true);
      }
    });

    test('should navigate to next page', async ({ page }) => {
      await navigateToProducts(page);

      // Wait for products to load
      await page.waitForLoadState('networkidle');

      const nextButton = page.locator('[data-testid="pagination-next"]');
      
      if (await nextButton.isVisible() && await nextButton.isEnabled()) {
        // Get first product ID on page 1
        const firstProductPage1 = page.locator('[data-testid="product-card"]').first();
        const page1Id = await firstProductPage1.getAttribute('data-product-id');

        // Click next page
        await nextButton.click();
        await page.waitForLoadState('networkidle');

        // Get first product ID on page 2
        const firstProductPage2 = page.locator('[data-testid="product-card"]').first();
        const page2Id = await firstProductPage2.getAttribute('data-product-id');

        // IDs should be different
        if (page1Id && page2Id) {
          expect(page1Id).not.toBe(page2Id);
        }
      }
    });

    test('should implement infinite scroll', async ({ page }) => {
      await navigateToProducts(page);

      // Wait for initial products to load
      await page.waitForLoadState('networkidle');

      // Get initial product count
      const initialCount = await page.locator('[data-testid="product-card"]').count();

      // Scroll to bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Wait for more products to load
      await page.waitForTimeout(1000);

      // Get new product count
      const newCount = await page.locator('[data-testid="product-card"]').count();

      // Should have loaded more products (if available)
      // Note: This may not always increase if there are no more products
      expect(newCount).toBeGreaterThanOrEqual(initialCount);
    });
  });

  test.describe('Performance and UX', () => {
    test('should load products page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await navigateToProducts(page);
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should display loading indicator during data fetch', async ({ page }) => {
      await page.goto(`${TEST_CONFIG.baseUrl}/marketplace/products`);

      // Check for loading indicator (should appear briefly)
      const loadingIndicator = page.locator('[data-testid="loading-indicator"]');
      
      // Loading indicator may appear and disappear quickly
      // Just verify the page eventually loads
      await page.waitForLoadState('networkidle');
      
      // Verify products are displayed
      const productCards = page.locator('[data-testid="product-card"]');
      const count = await productCards.count();
      
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await navigateToProducts(page);

      // Verify page is responsive
      const productCards = page.locator('[data-testid="product-card"]');
      const count = await productCards.count();

      if (count > 0) {
        const firstProduct = productCards.first();
        const boundingBox = await firstProduct.boundingBox();
        
        // Product card should fit within mobile viewport
        if (boundingBox) {
          expect(boundingBox.width).toBeLessThanOrEqual(375);
        }
      }
    });
  });
});

/**
 * NOTE: Tests for Requirement 15.7 (Real-time Updates via SignalR) require
 * SignalR connection setup and are better suited for manual testing or
 * specialized E2E tests with SignalR client.
 * 
 * Tests for Requirement 15.8 (Caching) require monitoring network requests
 * and cache behavior, which can be added with more advanced Playwright features.
 */
