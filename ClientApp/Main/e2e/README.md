# E2E Tests for AI Agent Chat Flow

This directory contains end-to-end tests for the AI Agent chat functionality using Playwright.

## Test Structure

### Test Files

- **`chat-flow.spec.ts`** - Tests general chat conversation flow
  - Opening/closing chat widget
  - Sending messages and receiving responses
  - Typing indicators
  - Conversation context
  - Markdown rendering
  - Error handling and retry

- **`agent-modes.spec.ts`** - Tests specialized agent modes
  - Mechanic Agent (maintenance advice, diagnostics)
  - Buyer's Guide Agent (car recommendations)
  - Seller's Assistant Agent (listing help)
  - Modification Expert Agent (modification advice)
  - Community Helper Agent (platform features)
  - Mode switching and persistence

- **`conversation-management.spec.ts`** - Tests conversation persistence and management
  - Conversation persistence across sessions
  - Conversation history
  - Creating new conversations
  - Deleting conversations
  - Exporting conversations
  - Sharing conversations
  - Pagination

- **`feedback.spec.ts`** - Tests user feedback functionality
  - Thumbs up/down buttons
  - Correction forms
  - Feedback submission
  - Feedback history
  - Analytics tracking

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Ensure the Angular development server is running:
   ```bash
   npm run start
   ```

4. Ensure the Python AI Agent backend is running on the expected port

### Test Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test e2e/ai-agent/chat-flow.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

## Test Configuration

The tests are configured in `playwright.config.ts` with:

- **Base URL**: `http://localhost:4200` (Angular dev server)
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry

## Test Data Attributes

The tests use `data-testid` attributes for reliable element selection. If these are not available, the tests fall back to more generic selectors like text content or CSS classes.

### Expected Test IDs

- `chat-fab` - Floating action button to open chat
- `chat-widget` - Main chat widget container
- `message-input` - Text input for typing messages
- `send-button` - Button to send messages
- `user-message` - User message containers
- `ai-message` - AI response message containers
- `typing-indicator` - Typing indicator element
- `close-chat` - Button to close chat widget
- `agent-mode-selector` - Agent mode selection dropdown
- `current-mode` - Current agent mode indicator
- `conversation-history` - Button to open conversation history
- `new-conversation` - Button to start new conversation
- `thumbs-up` / `thumbs-down` - Feedback buttons
- `feedback-form` - Feedback form container
- `correction-textarea` - Text area for corrections

## Test Scenarios Covered

### General Chat Flow
- ✅ Opening chat widget
- ✅ Sending messages and receiving responses
- ✅ Typing indicators
- ✅ Conversation context maintenance
- ✅ Error handling and retry
- ✅ Markdown rendering
- ✅ Message timestamps
- ✅ Empty message handling

### Agent Modes
- ✅ Mechanic agent maintenance advice
- ✅ Buyer's guide car recommendations
- ✅ Seller's assistant listing help
- ✅ Modification expert compatibility advice
- ✅ Community helper platform guidance
- ✅ Mode switching and persistence

### Conversation Management
- ✅ Conversation persistence across sessions
- ✅ Conversation history viewing
- ✅ Creating new conversations
- ✅ Conversation search
- ✅ Conversation deletion
- ✅ Conversation export
- ✅ Conversation sharing
- ✅ Pagination

### Feedback System
- ✅ Positive feedback (thumbs up)
- ✅ Negative feedback (thumbs down)
- ✅ Correction form submission
- ✅ Feedback per message tracking
- ✅ Feedback history
- ✅ Analytics tracking

## Troubleshooting

### Common Issues

1. **Tests fail with "element not found"**
   - Ensure the Angular app is running on `http://localhost:4200`
   - Check that the AI Agent backend is running
   - Verify test IDs are implemented in components

2. **API timeouts**
   - Increase timeout values in test configuration
   - Check backend API is responding correctly
   - Verify network connectivity

3. **Browser launch failures**
   - Run `npx playwright install` to install browsers
   - Check system requirements for Playwright

4. **Flaky tests**
   - Add appropriate wait conditions
   - Use `page.waitForLoadState('networkidle')`
   - Increase timeouts for slow operations

### Debugging

1. **Run in headed mode** to see browser actions:
   ```bash
   npm run test:e2e:headed
   ```

2. **Use debug mode** for step-by-step debugging:
   ```bash
   npm run test:e2e:debug
   ```

3. **Check test reports** in `playwright-report/` directory

4. **View traces** for failed tests in the HTML report

## CI/CD Integration

The tests are configured to run in CI environments with:
- Retry on failure (2 retries)
- Single worker for stability
- Automatic browser installation
- Artifact collection (screenshots, videos, traces)

Add to your CI pipeline:
```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
```

## Contributing

When adding new E2E tests:

1. Follow the existing test structure and naming conventions
2. Use appropriate `data-testid` attributes in components
3. Include both positive and negative test cases
4. Add proper error handling and timeouts
5. Update this README with new test scenarios
6. Ensure tests are deterministic and not flaky