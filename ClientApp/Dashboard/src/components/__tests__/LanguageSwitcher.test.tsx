import { describe, it, expect, vi, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';

// Mock the useTranslation hook
const mockChangeLanguage = vi.fn();
const mockSupportedLanguages = [
  { code: 'en-US', name: 'English', nativeName: 'English', isRTL: false },
  { code: 'ar-EG', name: 'Arabic (Egypt)', nativeName: 'العربية (مصر)', isRTL: true },
  { code: 'ar-AE', name: 'Arabic (UAE)', nativeName: 'العربية (الإمارات)', isRTL: true },
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', nativeName: 'العربية (السعودية)', isRTL: true }
];

vi.mock('../hooks/useTranslation', () => ({
  useTranslation: () => ({
    changeLanguage: mockChangeLanguage,
    currentLanguage: 'en-US',
    supportedLanguages: mockSupportedLanguages,
    loadingLanguages: false,
    error: null,
    isRTL: false
  })
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true
    });
  });

  it('renders with all 4 supported languages', () => {
    render(<LanguageSwitcher />);
    
    // Click to open dropdown
    const button = screen.getByRole('button', { name: /change language/i });
    fireEvent.click(button);
    
    // Verify all 4 languages are present
    expect(screen.getByText(/English/i)).toBeInTheDocument();
    expect(screen.getByText(/العربية \(مصر\)/i)).toBeInTheDocument();
    expect(screen.getByText(/العربية \(الإمارات\)/i)).toBeInTheDocument();
    expect(screen.getByText(/العربية \(السعودية\)/i)).toBeInTheDocument();
  });

  it('displays flag icons for all languages', () => {
    render(<LanguageSwitcher showFlags={true} />);
    
    // Click to open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Verify flags are displayed (checking for emoji flags)
    const dropdown = screen.getByRole('listbox');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown.textContent).toContain('🇺🇸');
    expect(dropdown.textContent).toContain('🇪🇬');
    expect(dropdown.textContent).toContain('🇦🇪');
    expect(dropdown.textContent).toContain('🇸🇦');
  });

  it('changes language immediately without reload', async () => {
    render(<LanguageSwitcher />);
    
    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Click on Arabic (Egypt) option
    const arabicOption = screen.getByRole('option', { name: /Arabic \(Egypt\)/i });
    fireEvent.click(arabicOption);
    
    // Verify changeLanguage was called
    await waitFor(() => {
      expect(mockChangeLanguage).toHaveBeenCalledWith('ar-EG');
    });
  });

  it('persists user preference to localStorage', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    
    render(<LanguageSwitcher />);
    
    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Click on Arabic (UAE) option
    const uaeOption = screen.getByRole('option', { name: /Arabic \(UAE\)/i });
    fireEvent.click(uaeOption);
    
    // Verify localStorage.setItem was called with correct language
    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('preferred-language', 'ar-AE');
    });
  });

  it('shows RTL indicator for Arabic languages', () => {
    render(<LanguageSwitcher />);
    
    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Verify RTL badges are shown for Arabic languages
    const rtlBadges = screen.getAllByText('RTL');
    expect(rtlBadges).toHaveLength(3); // 3 Arabic variants
  });

  it('displays loading state correctly', () => {
    // Mock loading state
    vi.mock('../hooks/useTranslation', () => ({
      useTranslation: () => ({
        changeLanguage: mockChangeLanguage,
        currentLanguage: 'en-US',
        supportedLanguages: mockSupportedLanguages,
        loadingLanguages: true,
        error: null,
        isRTL: false
      })
    }));
    
    render(<LanguageSwitcher />);
    
    // Verify loading message is displayed
    expect(screen.getByText(/Loading languages/i)).toBeInTheDocument();
  });

  it('supports inline variant', () => {
    render(<LanguageSwitcher variant="inline" />);
    
    // Verify all language buttons are visible without dropdown
    expect(screen.getByTitle(/Switch to English/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Switch to Arabic \(Egypt\)/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Switch to Arabic \(UAE\)/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Switch to Arabic \(Saudi Arabia\)/i)).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(<LanguageSwitcher />);
    
    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Verify dropdown is open
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    
    // Verify dropdown is closed
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows language count in dropdown footer', () => {
    render(<LanguageSwitcher />);
    
    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Verify language count is displayed
    expect(screen.getByText('4 languages available')).toBeInTheDocument();
  });
});
