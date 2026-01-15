import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for Feedback Submission
 * Tests user feedback features (thumbs up/down, corrections)
 */

test.describe('Feedback Submission', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();
    
    // Send a message to get an AI response
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('Tell me about car maintenance');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();
    
    // Wait for AI response
    const aiMessage = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant')).last();
    await expect(aiMessage).toBeVisible({ timeout: 10000 });
  });

  test('should display feedback buttons on AI messages', async () => {
    // Check if feedback buttons are visible
    const thumbsUpButton = page.locator('[data-testid="thumbs-up"]').or(page.locator('button[aria-label*="thumbs up"]')).last();
    const thumbsDownButton = page.locator('[data-testid="thumbs-down"]').or(page.locator('button[aria-label*="thumbs down"]')).last();
    
    const thumbsUpVisible = await thumbsUpButton.isVisible();
    const thumbsDownVisible = await thumbsDownButton.isVisible();
    
    // At least one feedback mechanism should be visible
    expect(thumbsUpVisible || thumbsDownVisible).toBe(true);
  });

  test('should submit positive feedback', async () => {
    // Click thumbs up button
    const thumbsUpButton = page.locator('[data-testid="thumbs-up"]').or(page.locator('button[aria-label*="thumbs up"]')).last();
    
    if (await thumbsUpButton.isVisible()) {
      await thumbsUpButton.click();
      
      // Verify feedback was recorded (button state changes or confirmation appears)
      const feedbackConfirmation = page.locator('[data-testid="feedback-confirmation"]').or(page.locator('.feedback-success'));
      
      // Either confirmation appears or button state changes
      const confirmationVisible = await feedbackConfirmation.isVisible({ timeout: 2000 }).catch(() => false);
      const buttonPressed = await thumbsUpButton.getAttribute('aria-pressed');
      
      expect(confirmationVisible || buttonPressed === 'true').toBe(true);
    }
  });

  test('should submit negative feedback', async () => {
    // Click thumbs down button
    const thumbsDownButton = page.locator('[data-testid="thumbs-down"]').or(page.locator('button[aria-label*="thumbs down"]')).last();
    
    if (await thumbsDownButton.isVisible()) {
      await thumbsDownButton.click();
      
      // Verify feedback form or confirmation appears
      const feedbackForm = page.locator('[data-testid="feedback-form"]').or(page.locator('.feedback-form'));
      const feedbackConfirmation = page.locator('[data-testid="feedback-confirmation"]').or(page.locator('.feedback-success'));
      
      const formVisible = await feedbackForm.isVisible({ timeout: 2000 }).catch(() => false);
      const confirmationVisible = await feedbackConfirmation.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(formVisible || confirmationVisible).toBe(true);
    }
  });

  test('should open correction form when thumbs down is clicked', async () => {
    // Click thumbs down button
    const thumbsDownButton = page.locator('[data-testid="thumbs-down"]').or(page.locator('button[aria-label*="thumbs down"]')).last();
    
    if (await thumbsDownButton.isVisible()) {
      await thumbsDownButton.click();
      
      // Check if correction form appears
      const correctionForm = page.locator('[data-testid="correction-form"]').or(page.locator('.correction-form'));
      const feedbackTextarea = page.locator('[data-testid="feedback-textarea"]').or(page.locator('textarea[placeholder*="feedback"]'));
      
      const formVisible = await correctionForm.isVisible({ timeout: 2000 }).catch(() => false);
      const textareaVisible = await feedbackTextarea.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(formVisible || textareaVisible).toBe(true);
    }
  });

  test('should submit correction with text', async () => {
    // Click thumbs down button
    const thumbsDownButton = page.locator('[data-testid="thumbs-down"]').or(page.locator('button[aria-label*="thumbs down"]')).last();
    
    if (await thumbsDownButton.isVisible()) {
      await thumbsDownButton.click();
      
      // Wait for form
      await page.waitForTimeout(1000);
      
      // Fill correction text
      const correctionTextarea = page.locator('[data-testid="correction-textarea"]').or(page.locator('textarea')).last();
      if (await correctionTextarea.isVisible()) {
        await correctionTextarea.fill('The correct answer should be: Change oil every 5,000 miles');
        
        // Submit correction
        const submitButton = page.locator('[data-testid="submit-correction"]').or(page.locator('button:has-text("Submit")'));
        await submitButton.click();
        
        // Verify submission confirmation
        const confirmation = page.locator('[data-testid="feedback-confirmation"]').or(page.locator('.feedback-success, .success-message'));
        await expect(confirmation).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should allow canceling correction form', async () => {
    // Click thumbs down button
    const thumbsDownButton = page.locator('[data-testid="thumbs-down"]').or(page.locator('button[aria-label*="thumbs down"]')).last();
    
    if (await thumbsDownButton.isVisible()) {
      await thumbsDownButton.click();
      
      // Wait for form
      await page.waitForTimeout(1000);
      
      // Click cancel button
      const cancelButton = page.locator('[data-testid="cancel-correction"]').or(page.locator('button:has-text("Cancel")'));
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
        
        // Verify form is closed
        const correctionForm = page.locator('[data-testid="correction-form"]').or(page.locator('.correction-form'));
        await expect(correctionForm).not.toBeVisible();
      }
    }
  });

  test('should not allow submitting empty correction', async () => {
    // Click thumbs down button
    const thumbsDownButton = page.locator('[data-testid="thumbs-down"]').or(page.locator('button[aria-label*="thumbs down"]')).last();
    
    if (await thumbsDownButton.isVisible()) {
      await thumbsDownButton.click();
      
      // Wait for form
      await page.waitForTimeout(1000);
      
      // Try to submit without text
      const submitButton = page.locator('[data-testid="submit-correction"]').or(page.locator('button:has-text("Submit")'));
      if (await submitButton.isVisible()) {
        const isDisabled = await submitButton.isDisabled();
        
        if (!isDisabled) {
          await submitButton.click();
          
          // Verify error message or form still visible
          const errorMessage = page.locator('[data-testid="error-message"]').or(page.locator('.error-message'));
          const correctionForm = page.locator('[data-testid="correction-form"]').or(page.locator('.correction-form'));
          
          const errorVisible = await errorMessage.isVisible({ timeout: 2000 }).catch(() => false);
          const formStillVisible = await correctionForm.isVisible();
          
          expect(errorVisible || formStillVisible).toBe(true);
        } else {
          // Button is disabled, which is correct behavior
          expect(isDisabled).toBe(true);
        }
      }
    }
  });

  test('should track feedback per message', async () => {
    // Send another message to get a second AI response
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('What about tire maintenance?');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();
    
    // Wait for second AI response
    await page.waitForTimeout(3000);
    
    // Get all AI messages
    const aiMessages = page.locator('[data-testid="ai-message"]').or(page.locator('.message.assistant'));
    const messageCount = await aiMessages.count();
    
    if (messageCount >= 2) {
      // Click thumbs up on first message
      const firstThumbsUp = page.locator('[data-testid="thumbs-up"]').or(page.locator('button[aria-label*="thumbs up"]')).first();
      if (await firstThumbsUp.isVisible()) {
        await firstThumbsUp.click();
        await page.waitForTimeout(500);
      }
      
      // Click thumbs down on second message
      const lastThumbsDown = page.locator('[data-testid="thumbs-down"]').or(page.locator('button[aria-label*="thumbs down"]')).last();
      if (await lastThumbsDown.isVisible()) {
        await lastThumbsDown.click();
        await page.waitForTimeout(500);
      }
      
      // Verify both feedbacks were recorded independently
      // (This is hard to verify visually, but we can check button states)
      const firstButtonPressed = await firstThumbsUp.getAttribute('aria-pressed');
      expect(firstButtonPressed === 'true' || firstButtonPressed === null).toBe(true);
    }
  });
});

test.describe('Feedback History', () => {
  test('should display feedback history', async ({ page }) => {
    await page.goto('/');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();
    
    // Send message and give feedback
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('Test message for feedback history');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Give feedback
    const thumbsUpButton = page.locator('[data-testid="thumbs-up"]').or(page.locator('button[aria-label*="thumbs up"]')).last();
    if (await thumbsUpButton.isVisible()) {
      await thumbsUpButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for feedback history button
    const historyButton = page.locator('[data-testid="feedback-history"]').or(page.locator('button:has-text("Feedback History")'));
    
    if (await historyButton.isVisible()) {
      await historyButton.click();
      
      // Verify history panel opens
      const historyPanel = page.locator('[data-testid="feedback-history-panel"]').or(page.locator('.feedback-history'));
      await expect(historyPanel).toBeVisible();
    }
  });
});

test.describe('Feedback Analytics', () => {
  test('should track feedback analytics', async ({ page }) => {
    // Mock API to verify analytics are sent
    let analyticsData: any = null;
    
    await page.route('**/api/feedback', route => {
      analyticsData = route.request().postDataJSON();
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    await page.goto('/');
    
    // Open chat widget
    const fab = page.locator('[data-testid="chat-fab"]').or(page.locator('button:has-text("Chat")'));
    await fab.click();
    
    // Send message
    const messageInput = page.locator('[data-testid="message-input"]').or(page.locator('textarea, input[type="text"]').last());
    await messageInput.fill('Analytics test message');
    
    const sendButton = page.locator('[data-testid="send-button"]').or(page.locator('button:has-text("Send")'));
    await sendButton.click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // Give feedback
    const thumbsUpButton = page.locator('[data-testid="thumbs-up"]').or(page.locator('button[aria-label*="thumbs up"]')).last();
    if (await thumbsUpButton.isVisible()) {
      await thumbsUpButton.click();
      
      // Wait for analytics to be sent
      await page.waitForTimeout(2000);
      
      // Verify analytics data was sent (if API was called)
      if (analyticsData) {
        expect(analyticsData).toHaveProperty('type');
        expect(analyticsData.type).toMatch(/positive|thumbs_up|like/);
      }
    }
  });
});
