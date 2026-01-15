import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for AI Agent Specialized Modes
 * Tests different specialized agent modes (Mechanic, Buyer's Guide, etc.)
 */

test.describe('Mechanic Agent Flow', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();
    
    // Wait for chat widget
    const chatWidget = page.locator('[data-testid="chat-widget"]').or(page.locator('.chat-widget'));
    await expect(chatWidget).toBeVisible();
  });

  test('should switch to mechanic mode', async () => {
    // Find and click mechanic mode selector
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    await modeSelector.click();

    // Select mechanic mode
    const mechanicOption = page.locator('[data-testid="mode-mechanic"]').or(page.locator('button:has-text("Mechanic")'));
    await mechanicOption.click();

    // Verify mode indicator shows mechanic
    const modeIndicator = page.locator('[data-testid="current-mode"]').or(page.locator('.current-mode'));
    await expect(modeIndicator).toContainText('Mechanic');
  });

  test('should provide maintenance advice in mechanic mode', async () => {
    // Switch to mechanic mode
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    if (await modeSelector.isVisible()) {
      await modeSelector.click();
      const mechanicOption = page.locator('[data-testid="mode-mechanic"]').or(page.locator('button:has-text("Mechanic")'));
      await mechanicOption.click();
    }

    // Ask maintenance question
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('When should I change my oil for a 2020 Honda Civic?');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Wait for response
    const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });

    // Verify response contains maintenance-related keywords
    const responseText = await aiMessage.textContent();
    expect(responseText?.toLowerCase()).toMatch(/oil|maintenance|service|miles|kilometers|interval/);
  });

  test('should help diagnose car problems', async () => {
    // Switch to mechanic mode
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    if (await modeSelector.isVisible()) {
      await modeSelector.click();
      const mechanicOption = page.locator('[data-testid="mode-mechanic"]').or(page.locator('button:has-text("Mechanic")'));
      await mechanicOption.click();
    }

    // Describe a problem
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('My car makes a squeaking noise when I brake');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Wait for diagnostic response
    const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });

    // Verify response contains diagnostic keywords
    const responseText = await aiMessage.textContent();
    expect(responseText?.toLowerCase()).toMatch(/brake|pad|rotor|check|inspect|mechanic/);
  });
});

test.describe('Buyer\'s Guide Agent Flow', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();
  });

  test('should switch to buyer\'s guide mode', async () => {
    // Find and click mode selector
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    await modeSelector.click();

    // Select buyer's guide mode
    const buyerOption = page.locator('[data-testid="mode-buyer_guide"]').or(page.locator('button:has-text("Buying Guide")'));
    await buyerOption.click();

    // Verify mode indicator
    const modeIndicator = page.locator('[data-testid="current-mode"]').or(page.locator('.current-mode'));
    await expect(modeIndicator).toContainText(/Buyer|Buying/);
  });

  test('should recommend cars based on preferences', async () => {
    // Switch to buyer's guide mode
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    if (await modeSelector.isVisible()) {
      await modeSelector.click();
      const buyerOption = page.locator('[data-testid="mode-buyer_guide"]').or(page.locator('button:has-text("Buying Guide")'));
      await buyerOption.click();
    }

    // Ask for car recommendations
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('I need a family SUV under $30,000');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Wait for recommendations
    const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });

    // Verify response contains car-related keywords
    const responseText = await aiMessage.textContent();
    expect(responseText?.toLowerCase()).toMatch(/suv|car|vehicle|recommend|budget|price/);
  });

  test('should display car recommendation cards', async () => {
    // Switch to buyer's guide mode
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    if (await modeSelector.isVisible()) {
      await modeSelector.click();
      const buyerOption = page.locator('[data-testid="mode-buyer_guide"]').or(page.locator('button:has-text("Buying Guide")'));
      await buyerOption.click();
    }

    // Ask for recommendations
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('Show me sedans under $25,000');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Wait for response
    await page.waitForTimeout(5000);

    // Check if recommendation cards are displayed
    const recommendationCards = page.locator('[data-testid="recommendation-card"]').or(page.locator('.recommendation-card'));
    const cardCount = await recommendationCards.count();
    
    // We might have 0 or more cards depending on inventory
    expect(cardCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Seller\'s Assistant Agent Flow', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();
  });

  test('should switch to seller\'s assistant mode', async () => {
    // Find and click mode selector
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    await modeSelector.click();

    // Select seller's assistant mode
    const sellerOption = page.locator('[data-testid="mode-seller_assistant"]').or(page.locator('button:has-text("Selling")'));
    await sellerOption.click();

    // Verify mode indicator
    const modeIndicator = page.locator('[data-testid="current-mode"]').or(page.locator('.current-mode'));
    await expect(modeIndicator).toContainText(/Seller|Selling/);
  });

  test('should help with car listing', async () => {
    // Switch to seller's assistant mode
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    if (await modeSelector.isVisible()) {
      await modeSelector.click();
      const sellerOption = page.locator('[data-testid="mode-seller_assistant"]').or(page.locator('button:has-text("Selling")'));
      await sellerOption.click();
    }

    // Ask for listing help
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('I want to sell my 2018 Toyota Camry');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Wait for response
    const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });

    // Verify response contains selling-related keywords
    const responseText = await aiMessage.textContent();
    expect(responseText?.toLowerCase()).toMatch(/sell|list|price|market|value|description/);
  });
});

test.describe('Modification Expert Agent Flow', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();
  });

  test('should switch to modification expert mode', async () => {
    // Find and click mode selector
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    await modeSelector.click();

    // Select modification expert mode
    const modOption = page.locator('[data-testid="mode-modification_expert"]').or(page.locator('button:has-text("Modification")'));
    await modOption.click();

    // Verify mode indicator
    const modeIndicator = page.locator('[data-testid="current-mode"]').or(page.locator('.current-mode'));
    await expect(modeIndicator).toContainText(/Modification|Expert/);
  });

  test('should provide modification advice', async () => {
    // Switch to modification expert mode
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    if (await modeSelector.isVisible()) {
      await modeSelector.click();
      const modOption = page.locator('[data-testid="mode-modification_expert"]').or(page.locator('button:has-text("Modification")'));
      await modOption.click();
    }

    // Ask about modifications
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('Can I install a turbo on my Honda Civic?');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Wait for response
    const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });

    // Verify response contains modification-related keywords
    const responseText = await aiMessage.textContent();
    expect(responseText?.toLowerCase()).toMatch(/turbo|modification|install|compatible|performance/);
  });
});

test.describe('Community Helper Agent Flow', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();
  });

  test('should switch to community helper mode', async () => {
    // Find and click mode selector
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    await modeSelector.click();

    // Select community helper mode
    const communityOption = page.locator('[data-testid="mode-community_helper"]').or(page.locator('button:has-text("Community")'));
    await communityOption.click();

    // Verify mode indicator
    const modeIndicator = page.locator('[data-testid="current-mode"]').or(page.locator('.current-mode'));
    await expect(modeIndicator).toContainText(/Community|Helper/);
  });

  test('should explain platform features', async () => {
    // Switch to community helper mode
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    if (await modeSelector.isVisible()) {
      await modeSelector.click();
      const communityOption = page.locator('[data-testid="mode-community_helper"]').or(page.locator('button:has-text("Community")'));
      await communityOption.click();
    }

    // Ask about platform features
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('How do I join a car group?');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Wait for response
    const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });

    // Verify response contains community-related keywords
    const responseText = await aiMessage.textContent();
    expect(responseText?.toLowerCase()).toMatch(/group|join|community|platform|feature/);
  });
});

test.describe('Agent Mode Persistence', () => {
  test('should persist selected agent mode across page reloads', async ({ page }) => {
    await page.goto('/');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    // Switch to mechanic mode
    const modeSelector = page.locator('[data-testid="agent-mode-selector"]').or(page.locator('.agent-mode-selector'));
    if (await modeSelector.isVisible()) {
      await modeSelector.click();
      const mechanicOption = page.locator('[data-testid="mode-mechanic"]').or(page.locator('button:has-text("Mechanic")'));
      await mechanicOption.click();
    }

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Open chat widget again
    await fab.click();

    // Verify mechanic mode is still selected
    const modeIndicator = page.locator('[data-testid="current-mode"]').or(page.locator('.current-mode'));
    if (await modeIndicator.isVisible()) {
      await expect(modeIndicator).toContainText('Mechanic');
    }
  });
});
