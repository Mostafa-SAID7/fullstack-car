// Jest setup file
import '@testing-library/jest-dom';

// Mock global objects that might not be available in test environment
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock XMLHttpRequest
Object.defineProperty(window, 'XMLHttpRequest', {
  value: jest.fn(() => ({
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),
    addEventListener: jest.fn(),
    upload: {
      addEventListener: jest.fn()
    },
    status: 200,
    statusText: 'OK',
    responseText: '',
    getResponseHeader: jest.fn(),
    timeout: 0
  })),
  writable: true,
});

// Mock fetch if not available
if (!(globalThis as any).fetch) {
  (globalThis as any).fetch = jest.fn();
}

// Mock window.dispatchEvent
Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
  writable: true,
});

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
});