// UI Constants

export const BUTTON_VARIANTS = [
  'primary',
  'secondary', 
  'outline',
  'ghost',
  'destructive'
] as const;

export const BUTTON_SIZES = [
  'sm',
  'md', 
  'lg'
] as const;

export const INPUT_TYPES = [
  'text',
  'email',
  'password',
  'number',
  'tel',
  'url',
  'search'
] as const;

export const MODAL_SIZES = [
  'sm',
  'md',
  'lg', 
  'xl',
  'full'
] as const;

export const TOAST_TYPES = [
  'success',
  'error',
  'warning',
  'info'
] as const;

export const TOAST_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right'
] as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080
} as const;

export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    900: '#14532d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    900: '#78350f'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    900: '#7f1d1d'
  }
} as const;

export const LOADING_STATES = [
  'idle',
  'loading',
  'success',
  'error'
] as const;

export const PAGINATION_SIZES = [
  10,
  25,
  50,
  100
] as const;