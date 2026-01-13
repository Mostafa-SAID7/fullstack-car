import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RTLLayout, RTLErrorBoundary } from '../RTLLayout';
import { RTLContainer, RTLFlex, RTLText, RTLButton } from '../RTLUtils';

// Mock the useTranslation hook
const mockUseTranslation = {
  isRTL: false,
  currentLanguage: 'en-US',
  changeLanguage: jest.fn(),
  t: jest.fn((key: string) => key),
  i18n: { language: 'en-US' },
  ready: true,
  supportedLanguages: [],
  loadingLanguages: false,
  error: null
};

jest.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => mockUseTranslation,
  useRTL: () => ({
    isRTL: mockUseTranslation.isRTL,
    currentLanguage: mockUseTranslation.currentLanguage,
    getRTLClass: (ltr: string, rtl: string) => mockUseTranslation.isRTL ? rtl : ltr,
    getRTLStyle: (ltr: any, rtl: any) => mockUseTranslation.isRTL ? { ...ltr, ...rtl } : ltr,
    direction: mockUseTranslation.isRTL ? 'rtl' : 'ltr'
  })
}));

describe('RTLLayout', () => {
  beforeEach(() => {
    // Reset DOM
    document.documentElement.dir = '';
    document.documentElement.lang = '';
    document.documentElement.className = '';
    document.body.className = '';
    
    // Reset mock
    mockUseTranslation.isRTL = false;
    mockUseTranslation.currentLanguage = 'en-US';
  });

  it('renders children correctly', () => {
    render(
      <RTLLayout>
        <div data-testid="child">Test Content</div>
      </RTLLayout>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies LTR direction for English language', async () => {
    render(
      <RTLLayout>
        <div data-testid="content">English Content</div>
      </RTLLayout>
    );

    await waitFor(() => {
      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('en-US');
    });
  });

  it('applies RTL direction for Arabic language', async () => {
    mockUseTranslation.isRTL = true;
    mockUseTranslation.currentLanguage = 'ar-EG';

    render(
      <RTLLayout>
        <div data-testid="content">Arabic Content</div>
      </RTLLayout>
    );

    await waitFor(() => {
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang).toBe('ar-EG');
    });
  });

  it('adds RTL classes to document and body', async () => {
    mockUseTranslation.isRTL = true;
    mockUseTranslation.currentLanguage = 'ar-SA';

    render(
      <RTLLayout>
        <div>RTL Content</div>
      </RTLLayout>
    );

    await waitFor(() => {
      expect(document.documentElement.classList.contains('rtl')).toBe(true);
      expect(document.body.classList.contains('rtl')).toBe(true);
    });
  });

  it('applies custom className', () => {
    render(
      <RTLLayout className="custom-class">
        <div>Content</div>
      </RTLLayout>
    );

    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('sets data attributes correctly', () => {
    mockUseTranslation.isRTL = true;
    mockUseTranslation.currentLanguage = 'ar-AE';

    render(
      <RTLLayout>
        <div>Content</div>
      </RTLLayout>
    );

    const container = screen.getByText('Content').parentElement;
    expect(container).toHaveAttribute('data-rtl', 'true');
    expect(container).toHaveAttribute('data-language', 'ar-AE');
  });
});

describe('RTLErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <RTLErrorBoundary>
        <div data-testid="child">Normal Content</div>
      </RTLErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <RTLErrorBoundary>
        <ThrowError />
      </RTLErrorBoundary>
    );

    expect(screen.getByText('Layout Error Detected')).toBeInTheDocument();
    expect(screen.getByText(/There was an issue with the layout rendering/)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

    render(
      <RTLErrorBoundary fallback={customFallback}>
        <ThrowError />
      </RTLErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
  });
});

describe('RTL Utility Components', () => {
  beforeEach(() => {
    mockUseTranslation.isRTL = false;
    mockUseTranslation.currentLanguage = 'en-US';
  });

  describe('RTLContainer', () => {
    it('renders with LTR direction', () => {
      render(
        <RTLContainer data-testid="container">
          <div>Content</div>
        </RTLContainer>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveAttribute('dir', 'ltr');
      expect(container).toHaveAttribute('data-rtl', 'false');
    });

    it('renders with RTL direction', () => {
      mockUseTranslation.isRTL = true;

      render(
        <RTLContainer data-testid="container">
          <div>Content</div>
        </RTLContainer>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveAttribute('dir', 'rtl');
      expect(container).toHaveAttribute('data-rtl', 'true');
    });
  });

  describe('RTLText', () => {
    it('applies correct text alignment for LTR', () => {
      render(
        <RTLText data-testid="text">
          Text Content
        </RTLText>
      );

      const text = screen.getByTestId('text');
      expect(text).toHaveClass('text-left');
    });

    it('applies correct text alignment for RTL', () => {
      mockUseTranslation.isRTL = true;

      render(
        <RTLText data-testid="text">
          Text Content
        </RTLText>
      );

      const text = screen.getByTestId('text');
      expect(text).toHaveClass('text-right');
    });

    it('renders as different HTML elements', () => {
      render(
        <RTLText as="h1" data-testid="heading">
          Heading
        </RTLText>
      );

      const heading = screen.getByTestId('heading');
      expect(heading.tagName).toBe('H1');
    });
  });

  describe('RTLButton', () => {
    it('renders button with correct content', () => {
      render(
        <RTLButton data-testid="button">
          Click Me
        </RTLButton>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveTextContent('Click Me');
      expect(button.tagName).toBe('BUTTON');
    });

    it('handles click events', () => {
      const handleClick = jest.fn();

      render(
        <RTLButton onClick={handleClick} data-testid="button">
          Click Me
        </RTLButton>
      );

      const button = screen.getByTestId('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies RTL classes when in RTL mode', () => {
      mockUseTranslation.isRTL = true;

      render(
        <RTLButton data-testid="button">
          Click Me
        </RTLButton>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('flex-row-reverse');
    });
  });

  describe('RTLFlex', () => {
    it('applies correct flex direction for LTR', () => {
      render(
        <RTLFlex data-testid="flex">
          <div>Item 1</div>
          <div>Item 2</div>
        </RTLFlex>
      );

      const flex = screen.getByTestId('flex');
      expect(flex).toHaveClass('flex-row');
    });

    it('applies correct flex direction for RTL', () => {
      mockUseTranslation.isRTL = true;

      render(
        <RTLFlex data-testid="flex">
          <div>Item 1</div>
          <div>Item 2</div>
        </RTLFlex>
      );

      const flex = screen.getByTestId('flex');
      expect(flex).toHaveClass('flex-row-reverse');
    });
  });
});