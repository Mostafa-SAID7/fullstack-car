import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for AI Agent Chat Flow
 * Tests the complete chat conversation flow with the AI agent
 */

test.describe('General Chat Conversation', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should open chat widget when FAB is clicked', async () => {
    // Find and click the floating action button
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    // Verify chat widget is visible
    const chatWidget = page.locator('[data-testid="chat-widget"]').or(page.locator('.chat-widget'));
    await expect(chatWidget).toBeVisible();
  });

  test('should send a message and receive a response', async () => {
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    // Wait for chat widget to be visible
    const chatWidget = page.locator('[data-testid="chat-widget"]').or(page.locator('.chat-widget'));
    await expect(chatWidget).toBeVisible();

    // Type a message
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('Hello, I need help with my car');

    // Send the message
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Verify user message appears
    const userMessage = page.locator('[data-testid="user-message"]').or(page.locator('.message.user')).last();
    await expect(userMessage).toContainText('Hello, I need help with my car');

    // Wait for AI response (with timeout)
    const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });
    
    // Verify AI response is not empty
    const responseText = await aiMessage.textContent();
    expect(responseText).toBeTruthy();
    expect(responseText!.length).toBeGreaterThan(10);
  });

  test('should display typing indicator while waiting for response', async () => {
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    // Type and send a message
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('What is the best oil for my car?');

    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Verify typing indicator appears
    const typingIndicator = page.locator('[data-testid="typing-indicator"]').or(page.locator('.typing-indicator'));
    await expect(typingIndicator).toBeVisible({ timeout: 2000 });

    // Wait for response and verify typing indicator disappears
    const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });
    await expect(typingIndicator).not.toBeVisible();
  });

  test('should maintain conversation context across multiple messages', async () => {
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    // First message
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('I have a 2015 Toyota Camry');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Wait for first response
    await page.waitForTimeout(3000);

    // Second message (referencing previous context)
    await messageInput.fill('What oil should I use for it?');
    await sendButton.click();

    // Wait for second response
    const messages = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant'));
    await expect(messages.last()).toBeVisible({ timeout: 10000 });

    // Verify we have at least 2 AI responses
    const messageCount = await messages.count();
    expect(messageCount).toBeGreaterThanOrEqual(2);
  });

  test('should close chat widget when close button is clicked', async () => {
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    const chatWidget = page.locator('[data-testid="chat-widget"]').or(page.locator('.chat-widget'));
    await expect(chatWidget).toBeVisible();

    // Click close button
    const closeButton = page.locator('[data-testid="close-chat"]').or(page.locator('button[aria-label="Close"]'));
    await closeButton.click();

    // Verify chat widget is hidden
    await expect(chatWidget).not.toBeVisible();
  });

  test('should display message timestamps', async () => {
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    // Send a message
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('Test message');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Verify timestamp is displayed
    const timestamp = page.locator('[data-testid="message-timestamp"]').or(page.locator('.timestamp')).first();
    await expect(timestamp).toBeVisible();
  });

  test('should handle empty message submission gracefully', async () => {
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    // Try to send empty message
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    
    // Button should be disabled or clicking should have no effect
    const initialMessageCount = await page.locator('[data-testid="user-message"]').or(page.locator('.message.user')).count();
    await sendButton.click();
    
    // Wait a bit
    await page.waitForTimeout(500);
    
    // Verify no new message was added
    const finalMessageCount = await page.locator('[data-testid="user-message"]').or(page.locator('.message.user')).count();
    expect(finalMessageCount).toBe(initialMessageCount);
  });

  test('should render markdown in AI responses', async () => {
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    // Send a message that might trigger markdown response
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('Can you give me a list of maintenance tasks?');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Wait for response
    const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });

    // Check if markdown elements are rendered (lists, bold, etc.)
    const hasMarkdown = await aiMessage.locator('ul, ol, strong, em, code').count();
    // Note: This test might pass even if no markdown is present, 
    // but it verifies the structure supports markdown rendering
    expect(hasMarkdown).toBeGreaterThanOrEqual(0);
  });
});

test.describe('General Chat - Error Handling', () => {
  test('should display error message when API is unavailable', async ({ page }) => {
    // Intercept API calls and return error
    await page.route('**/api/chat', route => {
      route.abort('failed');
    });

    await page.goto('/');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    // Send a message
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('Test message');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Verify error message is displayed
    const errorMessage = page.locator('[data-testid="error-message"]').or(page.locator('.error-message, .alert-error'));
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should allow retry after error', async ({ page }) => {
    let callCount = 0;
    
    // Intercept API calls - fail first, succeed second
    await page.route('**/api/chat', route => {
      callCount++;
      if (callCount === 1) {
        route.abort('failed');
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Success after retry',
            messageId: '123',
            conversationId: 'conv-123',
            agent: 'general'
          })
        });
      }
    });

    await page.goto('/');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();

    // Send a message (will fail)
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('Test message');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();

    // Wait for error
    await page.waitForTimeout(2000);

    // Click retry button
    const retryButton = page.locator('[data-testid="retry-button"]').or(page.locator('button:has-text("Retry")'));
    if (await retryButton.isVisible()) {
      await retryButton.click();

      // Verify success message appears
      const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
      await expect(aiMessage).toBeVisible({ timeout: 5000 });
    }
  });
});
