import { Injectable } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

/**
 * Test Utilities Service
 * 
 * Provides common testing utilities and helpers
 */
@Injectable({
  providedIn: 'root'
})
export class TestUtilsService {

  /**
   * Wait for a specified amount of time
   */
  async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Wait for Angular to stabilize
   */
  async waitForStability(fixture: ComponentFixture<any>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /**
   * Find element by test ID
   */
  findByTestId(fixture: ComponentFixture<any>, testId: string): DebugElement | null {
    return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
  }

  /**
   * Find all elements by test ID
   */
  findAllByTestId(fixture: ComponentFixture<any>, testId: string): DebugElement[] {
    return fixture.debugElement.queryAll(By.css(`[data-testid="${testId}"]`));
  }

  /**
   * Find element by CSS selector
   */
  findBySelector(fixture: ComponentFixture<any>, selector: string): DebugElement | null {
    return fixture.debugElement.query(By.css(selector));
  }

  /**
   * Find all elements by CSS selector
   */
  findAllBySelector(fixture: ComponentFixture<any>, selector: string): DebugElement[] {
    return fixture.debugElement.queryAll(By.css(selector));
  }

  /**
   * Get text content of element
   */
  getTextContent(element: DebugElement): string {
    return element.nativeElement.textContent?.trim() || '';
  }

  /**
   * Click element
   */
  click(element: DebugElement): void {
    element.nativeElement.click();
  }

  /**
   * Type text into input element
   */
  typeText(element: DebugElement, text: string): void {
    const input = element.nativeElement as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
  }

  /**
   * Clear input element
   */
  clearInput(element: DebugElement): void {
    const input = element.nativeElement as HTMLInputElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));
  }

  /**
   * Check if element has CSS class
   */
  hasClass(element: DebugElement, className: string): boolean {
    return element.nativeElement.classList.contains(className);
  }

  /**
   * Check if element is visible
   */
  isVisible(element: DebugElement): boolean {
    const nativeElement = element.nativeElement;
    return !!(nativeElement.offsetWidth || nativeElement.offsetHeight || nativeElement.getClientRects().length);
  }

  /**
   * Check if element is disabled
   */
  isDisabled(element: DebugElement): boolean {
    return element.nativeElement.disabled;
  }

  /**
   * Get attribute value
   */
  getAttribute(element: DebugElement, attribute: string): string | null {
    return element.nativeElement.getAttribute(attribute);
  }

  /**
   * Trigger event on element
   */
  triggerEvent(element: DebugElement, eventName: string, eventData?: any): void {
    const event = new CustomEvent(eventName, { detail: eventData });
    element.nativeElement.dispatchEvent(event);
  }

  /**
   * Mock HTTP response
   */
  createMockHttpResponse<T>(data: T, status: number = 200): any {
    return {
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      body: data,
      headers: new Map([['content-type', 'application/json']])
    };
  }

  /**
   * Create mock user data
   */
  createMockUser(overrides?: any): any {
    return {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      displayName: 'Test User',
      avatar: null,
      verified: false,
      createdAt: new Date().toISOString(),
      ...overrides
    };
  }

  /**
   * Create mock group data
   */
  createMockGroup(overrides?: any): any {
    return {
      id: '1',
      name: 'Test Group',
      description: 'A test group',
      type: 'public',
      category: 'general',
      memberCount: 10,
      postCount: 5,
      ownerId: '1',
      moderatorIds: [],
      tags: ['test'],
      rules: [],
      settings: {
        allowMemberPosts: true,
        requirePostApproval: false,
        allowMemberInvites: true,
        allowDiscussions: true,
        allowEvents: true,
        allowPolls: true,
        autoApproveMembers: true,
        showMemberList: true,
        allowExternalSharing: true
      },
      stats: {
        totalMembers: 10,
        activeMembersToday: 3,
        activeMembersWeek: 7,
        totalPosts: 5,
        postsToday: 1,
        postsWeek: 3,
        engagementRate: 0.7,
        growthRate: 0.1
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  /**
   * Create mock message data
   */
  createMockMessage(overrides?: any): any {
    return {
      id: '1',
      conversationId: '1',
      senderId: '1',
      senderName: 'Test User',
      senderAvatar: null,
      type: 'text',
      content: 'Test message',
      attachments: [],
      status: 'sent',
      isEdited: false,
      createdAt: new Date().toISOString(),
      ...overrides
    };
  }

  /**
   * Create mock conversation data
   */
  createMockConversation(overrides?: any): any {
    return {
      id: '1',
      type: 'direct',
      name: null,
      description: null,
      avatar: null,
      participants: [
        {
          userId: '1',
          userName: 'Test User 1',
          userAvatar: null,
          role: 'member',
          isOnline: true,
          joinedAt: new Date().toISOString()
        },
        {
          userId: '2',
          userName: 'Test User 2',
          userAvatar: null,
          role: 'member',
          isOnline: false,
          joinedAt: new Date().toISOString()
        }
      ],
      lastMessage: this.createMockMessage(),
      unreadCount: 0,
      isArchived: false,
      isMuted: false,
      createdAt: new Date().toISOString(),
      ...overrides
    };
  }

  /**
   * Create mock API response
   */
  createMockApiResponse<T>(data: T, success: boolean = true): any {
    return {
      data,
      success,
      message: success ? 'Success' : 'Error',
      errors: success ? [] : ['Test error']
    };
  }

  /**
   * Create mock paginated response
   */
  createMockPaginatedResponse<T>(data: T[], page: number = 1, pageSize: number = 20): any {
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit: pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      succeeded: true,
      statusCode: 200
    };
  }

  /**
   * Mock localStorage
   */
  mockLocalStorage(): Storage {
    const store: Record<string, string> = {};
    
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach(key => delete store[key]); },
      key: (index: number) => Object.keys(store)[index] || null,
      length: Object.keys(store).length
    };
  }

  /**
   * Mock sessionStorage
   */
  mockSessionStorage(): Storage {
    return this.mockLocalStorage(); // Same implementation
  }

  /**
   * Mock console methods
   */
  mockConsole(): any {
    return {
      log: jasmine.createSpy('console.log'),
      warn: jasmine.createSpy('console.warn'),
      error: jasmine.createSpy('console.error'),
      info: jasmine.createSpy('console.info'),
      debug: jasmine.createSpy('console.debug')
    };
  }

  /**
   * Mock window.matchMedia
   */
  mockMatchMedia(matches: boolean = false): any {
    return jasmine.createSpy('matchMedia').and.returnValue({
      matches,
      media: '',
      onchange: null,
      addListener: jasmine.createSpy('addListener'),
      removeListener: jasmine.createSpy('removeListener'),
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      dispatchEvent: jasmine.createSpy('dispatchEvent')
    });
  }

  /**
   * Mock IntersectionObserver
   */
  mockIntersectionObserver(): any {
    return jasmine.createSpy('IntersectionObserver').and.returnValue({
      observe: jasmine.createSpy('observe'),
      unobserve: jasmine.createSpy('unobserve'),
      disconnect: jasmine.createSpy('disconnect')
    });
  }

  /**
   * Mock ResizeObserver
   */
  mockResizeObserver(): any {
    return jasmine.createSpy('ResizeObserver').and.returnValue({
      observe: jasmine.createSpy('observe'),
      unobserve: jasmine.createSpy('unobserve'),
      disconnect: jasmine.createSpy('disconnect')
    });
  }

  /**
   * Mock fetch API
   */
  mockFetch(response: any, ok: boolean = true): any {
    return jasmine.createSpy('fetch').and.returnValue(
      Promise.resolve({
        ok,
        status: ok ? 200 : 500,
        statusText: ok ? 'OK' : 'Internal Server Error',
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
        blob: () => Promise.resolve(new Blob([JSON.stringify(response)])),
        headers: new Map([['content-type', 'application/json']])
      })
    );
  }

  /**
   * Create performance measurement mock
   */
  mockPerformance(): any {
    return {
      now: jasmine.createSpy('performance.now').and.returnValue(Date.now()),
      mark: jasmine.createSpy('performance.mark'),
      measure: jasmine.createSpy('performance.measure'),
      getEntriesByName: jasmine.createSpy('performance.getEntriesByName').and.returnValue([]),
      getEntriesByType: jasmine.createSpy('performance.getEntriesByType').and.returnValue([])
    };
  }

  /**
   * Assert element exists
   */
  assertElementExists(element: DebugElement | null, message?: string): asserts element is DebugElement {
    if (!element) {
      throw new Error(message || 'Expected element to exist');
    }
  }

  /**
   * Assert element does not exist
   */
  assertElementNotExists(element: DebugElement | null, message?: string): void {
    if (element) {
      throw new Error(message || 'Expected element to not exist');
    }
  }

  /**
   * Assert text content
   */
  assertTextContent(element: DebugElement, expectedText: string, message?: string): void {
    const actualText = this.getTextContent(element);
    if (actualText !== expectedText) {
      throw new Error(message || `Expected text "${expectedText}" but got "${actualText}"`);
    }
  }

  /**
   * Assert element has class
   */
  assertHasClass(element: DebugElement, className: string, message?: string): void {
    if (!this.hasClass(element, className)) {
      throw new Error(message || `Expected element to have class "${className}"`);
    }
  }

  /**
   * Assert element is visible
   */
  assertVisible(element: DebugElement, message?: string): void {
    if (!this.isVisible(element)) {
      throw new Error(message || 'Expected element to be visible');
    }
  }

  /**
   * Assert element is hidden
   */
  assertHidden(element: DebugElement, message?: string): void {
    if (this.isVisible(element)) {
      throw new Error(message || 'Expected element to be hidden');
    }
  }
}