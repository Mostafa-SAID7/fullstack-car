import { useState, useEffect } from 'react';

/**
 * Breakpoint definitions matching Tailwind CSS
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  breakpoint: Breakpoint | 'xs';
  orientation: 'portrait' | 'landscape';
  isTouchDevice: boolean;
}

/**
 * Hook for responsive design utilities
 * Provides current screen size, breakpoint, and device information
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeDesktop: false,
        breakpoint: 'lg',
        orientation: 'landscape',
        isTouchDevice: false
      };
    }

    return getResponsiveState();
  });

  useEffect(() => {
    const handleResize = () => {
      setState(getResponsiveState());
    };

    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(() => {
        setState(getResponsiveState());
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return state;
}

/**
 * Get current responsive state
 */
function getResponsiveState(): ResponsiveState {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Determine breakpoint
  let breakpoint: Breakpoint | 'xs' = 'xs';
  if (width >= BREAKPOINTS['2xl']) {
    breakpoint = '2xl';
  } else if (width >= BREAKPOINTS.xl) {
    breakpoint = 'xl';
  } else if (width >= BREAKPOINTS.lg) {
    breakpoint = 'lg';
  } else if (width >= BREAKPOINTS.md) {
    breakpoint = 'md';
  } else if (width >= BREAKPOINTS.sm) {
    breakpoint = 'sm';
  }

  // Determine device type
  const isMobile = width < BREAKPOINTS.md;
  const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isDesktop = width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl;
  const isLargeDesktop = width >= BREAKPOINTS.xl;

  // Determine orientation
  const orientation = width > height ? 'landscape' : 'portrait';

  // Check if touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint,
    orientation,
    isTouchDevice
  };
}

/**
 * Hook to check if screen is at least a certain breakpoint
 */
export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const { width } = useResponsive();
  return width >= BREAKPOINTS[breakpoint];
}

/**
 * Hook to get current breakpoint
 */
export function useBreakpoint(): Breakpoint | 'xs' {
  const { breakpoint } = useResponsive();
  return breakpoint;
}

/**
 * Hook to check if device is mobile
 */
export function useIsMobile(): boolean {
  const { isMobile } = useResponsive();
  return isMobile;
}

/**
 * Hook to check if device is tablet
 */
export function useIsTablet(): boolean {
  const { isTablet } = useResponsive();
  return isTablet;
}

/**
 * Hook to check if device is desktop
 */
export function useIsDesktop(): boolean {
  const { isDesktop, isLargeDesktop } = useResponsive();
  return isDesktop || isLargeDesktop;
}

/**
 * Hook to check if device supports touch
 */
export function useIsTouchDevice(): boolean {
  const { isTouchDevice } = useResponsive();
  return isTouchDevice;
}
