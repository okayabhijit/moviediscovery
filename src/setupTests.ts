import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';

// Extend Jest matchers
expect.extend({
  toHaveBeenCalledExactlyOnceWith(received: jest.Mock, ...args: any[]) {
    const pass = received.mock.calls.length === 1 && 
                 JSON.stringify(received.mock.calls[0]) === JSON.stringify(args);
    return {
      message: () => `expected ${received.getMockName()} to have been called exactly once with ${args}`,
      pass,
    };
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn(),
};

// Global test setup
beforeAll(() => {
  // Suppress console warnings in tests
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  // Only show error for unexpected errors
  jest.spyOn(console, 'error').mockImplementation((message, ...args) => {
    if (typeof message === 'string' && (
      message.includes('Warning: An update to') ||
      message.includes('Error parsing saved genre') ||
      message.includes('Error fetching genres'))
    ) {
      return;
    }
    console.error(message, ...args);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Reset mocks between tests
beforeEach(() => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.clear.mockClear();
  localStorageMock.removeItem.mockClear();
});

global.localStorage = localStorageMock as Storage;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Increase test timeout for async operations
jest.setTimeout(10000);
