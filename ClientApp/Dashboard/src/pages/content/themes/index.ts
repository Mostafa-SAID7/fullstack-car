// Theme Management System
export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  };
  colors: {
    // Base colors
    background: string;
    foreground: string;
    card: string;
    'card-foreground': string;
    popover: string;
    'popover-foreground': string;

    // Primary colors
    primary: string;
    'primary-foreground': string;

    // Secondary colors
    secondary: string;
    'secondary-foreground': string;

    // Muted colors
    muted: string;
    'muted-foreground': string;

    // Accent colors
    accent: string;
    'accent-foreground': string;

    // Destructive colors
    destructive: string;
    'destructive-foreground': string;

    // Border and input
    border: string;
    input: string;
    ring: string;

    // Border radius
    radius: string;
  };
  layout: {
    header: {
      height: string;
      background: string;
      borderBottom: string;
      boxShadow: string;
    };
    footer: {
      height: string;
      background: string;
      borderTop: string;
    };
    sidebar: {
      width: string;
      background: string;
      borderRight: string;
    };
    main: {
      background: string;
      padding: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  effects: {
    shadows: {
      sm: string;
      base: string;
      md: string;
      lg: string;
      xl: string;
    };
    blur: {
      sm: string;
      base: string;
      md: string;
      lg: string;
    };
    transitions: {
      fast: string;
      base: string;
      slow: string;
    };
  };
}

// Modern Professional Theme
export const modernTheme: ThemeConfig = {
  id: 'modern',
  name: 'Modern Professional',
  description: 'Clean, minimal design with subtle gradients and professional aesthetics',
  preview: {
    primary: '#3b82f6',
    secondary: '#64748b',
    background: '#f8fafc',
    surface: '#ffffff'
  },
  colors: {
    background: '220 15% 96%',
    foreground: '220 13% 9%',
    card: '220 20% 98%',
    'card-foreground': '220 15% 12%',
    popover: '220 20% 98%',
    'popover-foreground': '220 15% 12%',
    primary: '221.2 83.2% 53.3%',
    'primary-foreground': '210 40% 98%',
    secondary: '220 15% 92%',
    'secondary-foreground': '220 10% 25%',
    muted: '220 12% 94%',
    'muted-foreground': '220 8% 45%',
    accent: '220 15% 92%',
    'accent-foreground': '220 10% 25%',
    destructive: '0 84.2% 60.2%',
    'destructive-foreground': '0 0% 98%',
    border: '220 15% 88%',
    input: '220 15% 90%',
    ring: '221.2 83.2% 53.3%',
    radius: '0.75rem'
  },
  layout: {
    header: {
      height: '4rem',
      background: 'rgba(255, 255, 255, 0.8)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    footer: {
      height: '3rem',
      background: 'rgba(255, 255, 255, 0.9)',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)'
    },
    sidebar: {
      width: '16rem',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRight: '1px solid rgba(0, 0, 0, 0.05)'
    },
    main: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '2rem'
    }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  effects: {
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    blur: {
      sm: 'blur(4px)',
      base: 'blur(8px)',
      md: 'blur(12px)',
      lg: 'blur(16px)'
    },
    transitions: {
      fast: '150ms ease-in-out',
      base: '250ms ease-in-out',
      slow: '350ms ease-in-out'
    }
  }
};

// Warm & Inviting Theme
export const warmTheme: ThemeConfig = {
  id: 'warm',
  name: 'Warm & Inviting',
  description: 'Cozy, warm colors with soft gradients and inviting atmosphere',
  preview: {
    primary: '#ea580c',
    secondary: '#dc2626',
    background: '#fef7ed',
    surface: '#ffffff'
  },
  colors: {
    background: '32 100% 97%',
    foreground: '20 14% 4%',
    card: '32 100% 98%',
    'card-foreground': '20 14% 4%',
    popover: '32 100% 98%',
    'popover-foreground': '20 14% 4%',
    primary: '24.6 95% 53.1%',
    'primary-foreground': '60 9.1% 97.8%',
    secondary: '32 81% 94%',
    'secondary-foreground': '24 9.8% 10%',
    muted: '32 81% 96%',
    'muted-foreground': '25 5.3% 44.7%',
    accent: '32 81% 94%',
    'accent-foreground': '24 9.8% 10%',
    destructive: '0 72.2% 50.6%',
    'destructive-foreground': '0 0% 98%',
    border: '32 81% 88%',
    input: '32 81% 90%',
    ring: '24.6 95% 53.1%',
    radius: '1rem'
  },
  layout: {
    header: {
      height: '4rem',
      background: 'linear-gradient(135deg, rgba(255, 247, 237, 0.9) 0%, rgba(255, 237, 213, 0.9) 100%)',
      borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
      boxShadow: '0 2px 4px rgba(245, 158, 11, 0.1)'
    },
    footer: {
      height: '3rem',
      background: 'rgba(255, 247, 237, 0.95)',
      borderTop: '1px solid rgba(245, 158, 11, 0.2)'
    },
    sidebar: {
      width: '16rem',
      background: 'rgba(255, 251, 235, 0.95)',
      borderRight: '1px solid rgba(245, 158, 11, 0.2)'
    },
    main: {
      background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)',
      padding: '2rem'
    }
  },
  typography: {
    fontFamily: '"Nunito", "Inter", system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  effects: {
    shadows: {
      sm: '0 1px 2px 0 rgba(245, 158, 11, 0.15)',
      base: '0 1px 3px 0 rgba(245, 158, 11, 0.2), 0 1px 2px 0 rgba(245, 158, 11, 0.1)',
      md: '0 4px 6px -1px rgba(245, 158, 11, 0.2), 0 2px 4px -1px rgba(245, 158, 11, 0.1)',
      lg: '0 10px 15px -3px rgba(245, 158, 11, 0.2), 0 4px 6px -2px rgba(245, 158, 11, 0.1)',
      xl: '0 20px 25px -5px rgba(245, 158, 11, 0.2), 0 10px 10px -5px rgba(245, 158, 11, 0.1)'
    },
    blur: {
      sm: 'blur(4px)',
      base: 'blur(8px)',
      md: 'blur(12px)',
      lg: 'blur(16px)'
    },
    transitions: {
      fast: '150ms ease-in-out',
      base: '250ms ease-in-out',
      slow: '350ms ease-in-out'
    }
  }
};

// Dark Elegant Theme
export const darkElegantTheme: ThemeConfig = {
  id: 'dark-elegant',
  name: 'Dark Elegant',
  description: 'Sophisticated dark theme with deep colors and elegant contrasts',
  preview: {
    primary: '#8b5cf6',
    secondary: '#374151',
    background: '#0f172a',
    surface: '#1e293b'
  },
  colors: {
    background: '222.2 84% 4.9%',
    foreground: '210 40% 98%',
    card: '222.2 84% 6.2%',
    'card-foreground': '210 40% 98%',
    popover: '222.2 84% 6.2%',
    'popover-foreground': '210 40% 98%',
    primary: '263.4 70% 50.4%',
    'primary-foreground': '210 40% 98%',
    secondary: '217.2 32.6% 17.5%',
    'secondary-foreground': '210 40% 98%',
    muted: '217.2 32.6% 17.5%',
    'muted-foreground': '215 20.2% 65.1%',
    accent: '217.2 32.6% 17.5%',
    'accent-foreground': '210 40% 98%',
    destructive: '0 62.8% 30.6%',
    'destructive-foreground': '210 40% 98%',
    border: '217.2 32.6% 17.5%',
    input: '217.2 32.6% 17.5%',
    ring: '263.4 70% 50.4%',
    radius: '0.75rem'
  },
  layout: {
    header: {
      height: '4rem',
      background: 'rgba(15, 23, 42, 0.95)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
    },
    footer: {
      height: '3rem',
      background: 'rgba(15, 23, 42, 0.98)',
      borderTop: '1px solid rgba(148, 163, 184, 0.1)'
    },
    sidebar: {
      width: '16rem',
      background: 'rgba(30, 41, 59, 0.98)',
      borderRight: '1px solid rgba(148, 163, 184, 0.1)'
    },
    main: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '2rem'
    }
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  effects: {
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.6), 0 1px 2px 0 rgba(0, 0, 0, 0.4)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)'
    },
    blur: {
      sm: 'blur(4px)',
      base: 'blur(8px)',
      md: 'blur(12px)',
      lg: 'blur(16px)'
    },
    transitions: {
      fast: '150ms ease-in-out',
      base: '250ms ease-in-out',
      slow: '350ms ease-in-out'
    }
  }
};

// Nature Inspired Theme
export const natureTheme: ThemeConfig = {
  id: 'nature',
  name: 'Nature Inspired',
  description: 'Fresh, organic design with natural greens and calming colors',
  preview: {
    primary: '#16a34a',
    secondary: '#65a30d',
    background: '#f0fdf4',
    surface: '#ffffff'
  },
  colors: {
    background: '120 60% 97%',
    foreground: '120 10% 9%',
    card: '120 50% 96%',
    'card-foreground': '120 10% 9%',
    popover: '120 50% 96%',
    'popover-foreground': '120 10% 9%',
    primary: '142.1 76.2% 36.3%',
    'primary-foreground': '355.7 100% 97.3%',
    secondary: '80 60% 90%',
    'secondary-foreground': '80 10% 25%',
    muted: '80 40% 92%',
    'muted-foreground': '80 5% 45%',
    accent: '80 60% 90%',
    'accent-foreground': '80 10% 25%',
    destructive: '0 84.2% 60.2%',
    'destructive-foreground': '0 0% 98%',
    border: '80 30% 82%',
    input: '80 30% 85%',
    ring: '142.1 76.2% 36.3%',
    radius: '1rem'
  },
  layout: {
    header: {
      height: '4rem',
      background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.9) 0%, rgba(187, 247, 208, 0.9) 100%)',
      borderBottom: '1px solid rgba(34, 197, 94, 0.2)',
      boxShadow: '0 2px 4px rgba(34, 197, 94, 0.1)'
    },
    footer: {
      height: '3rem',
      background: 'rgba(240, 253, 244, 0.95)',
      borderTop: '1px solid rgba(34, 197, 94, 0.2)'
    },
    sidebar: {
      width: '16rem',
      background: 'rgba(220, 252, 231, 0.95)',
      borderRight: '1px solid rgba(34, 197, 94, 0.2)'
    },
    main: {
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      padding: '2rem'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Inter", system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  effects: {
    shadows: {
      sm: '0 1px 2px 0 rgba(34, 197, 94, 0.15)',
      base: '0 1px 3px 0 rgba(34, 197, 94, 0.2), 0 1px 2px 0 rgba(34, 197, 94, 0.1)',
      md: '0 4px 6px -1px rgba(34, 197, 94, 0.2), 0 2px 4px -1px rgba(34, 197, 94, 0.1)',
      lg: '0 10px 15px -3px rgba(34, 197, 94, 0.2), 0 4px 6px -2px rgba(34, 197, 94, 0.1)',
      xl: '0 20px 25px -5px rgba(34, 197, 94, 0.2), 0 10px 10px -5px rgba(34, 197, 94, 0.1)'
    },
    blur: {
      sm: 'blur(4px)',
      base: 'blur(8px)',
      md: 'blur(12px)',
      lg: 'blur(16px)'
    },
    transitions: {
      fast: '150ms ease-in-out',
      base: '250ms ease-in-out',
      slow: '350ms ease-in-out'
    }
  }
};

// Vibrant Creative Theme
export const vibrantTheme: ThemeConfig = {
  id: 'vibrant',
  name: 'Vibrant Creative',
  description: 'Bold, energetic design with vibrant colors and creative flair',
  preview: {
    primary: '#ec4899',
    secondary: '#8b5cf6',
    background: '#fdf2f8',
    surface: '#ffffff'
  },
  colors: {
    background: '324 100% 97%',
    foreground: '324 10% 9%',
    card: '324 80% 96%',
    'card-foreground': '324 10% 9%',
    popover: '324 80% 96%',
    'popover-foreground': '324 10% 9%',
    primary: '316.7 73.7% 69%',
    'primary-foreground': '0 0% 100%',
    secondary: '280 60% 92%',
    'secondary-foreground': '280 10% 25%',
    muted: '280 40% 94%',
    'muted-foreground': '280 5% 45%',
    accent: '280 60% 92%',
    'accent-foreground': '280 10% 25%',
    destructive: '0 84.2% 60.2%',
    'destructive-foreground': '0 0% 98%',
    border: '280 30% 82%',
    input: '280 30% 85%',
    ring: '316.7 73.7% 69%',
    radius: '1.5rem'
  },
  layout: {
    header: {
      height: '4rem',
      background: 'linear-gradient(135deg, rgba(253, 242, 248, 0.9) 0%, rgba(251, 207, 232, 0.9) 100%)',
      borderBottom: '1px solid rgba(236, 72, 153, 0.2)',
      boxShadow: '0 2px 4px rgba(236, 72, 153, 0.1)'
    },
    footer: {
      height: '3rem',
      background: 'rgba(253, 242, 248, 0.95)',
      borderTop: '1px solid rgba(236, 72, 153, 0.2)'
    },
    sidebar: {
      width: '16rem',
      background: 'rgba(249, 250, 251, 0.95)',
      borderRight: '1px solid rgba(236, 72, 153, 0.2)'
    },
    main: {
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      padding: '2rem'
    }
  },
  typography: {
    fontFamily: '"Dancing Script", "Inter", cursive',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  effects: {
    shadows: {
      sm: '0 1px 2px 0 rgba(236, 72, 153, 0.15)',
      base: '0 1px 3px 0 rgba(236, 72, 153, 0.2), 0 1px 2px 0 rgba(236, 72, 153, 0.1)',
      md: '0 4px 6px -1px rgba(236, 72, 153, 0.2), 0 2px 4px -1px rgba(236, 72, 153, 0.1)',
      lg: '0 10px 15px -3px rgba(236, 72, 153, 0.2), 0 4px 6px -2px rgba(236, 72, 153, 0.1)',
      xl: '0 20px 25px -5px rgba(236, 72, 153, 0.2), 0 10px 10px -5px rgba(236, 72, 153, 0.1)'
    },
    blur: {
      sm: 'blur(4px)',
      base: 'blur(8px)',
      md: 'blur(12px)',
      lg: 'blur(16px)'
    },
    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};

// Oceanic Theme
export const oceanicTheme: ThemeConfig = {
  id: 'oceanic',
  name: 'Oceanic Calm',
  description: 'Serene, water-inspired design with calming blues and peaceful tones',
  preview: {
    primary: '#0ea5e9',
    secondary: '#0284c7',
    background: '#f0f9ff',
    surface: '#ffffff'
  },
  colors: {
    background: '204 100% 97%',
    foreground: '204 10% 9%',
    card: '204 80% 96%',
    'card-foreground': '204 10% 9%',
    popover: '204 80% 96%',
    'popover-foreground': '204 10% 9%',
    primary: '199.4 89.1% 48%',
    'primary-foreground': '0 0% 100%',
    secondary: '200 60% 92%',
    'secondary-foreground': '200 10% 25%',
    muted: '200 40% 94%',
    'muted-foreground': '200 5% 45%',
    accent: '200 60% 92%',
    'accent-foreground': '200 10% 25%',
    destructive: '0 84.2% 60.2%',
    'destructive-foreground': '0 0% 98%',
    border: '200 30% 82%',
    input: '200 30% 85%',
    ring: '199.4 89.1% 48%',
    radius: '0.875rem'
  },
  layout: {
    header: {
      height: '4rem',
      background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.9) 0%, rgba(186, 230, 253, 0.9) 100%)',
      borderBottom: '1px solid rgba(14, 165, 233, 0.2)',
      boxShadow: '0 2px 4px rgba(14, 165, 233, 0.1)'
    },
    footer: {
      height: '3rem',
      background: 'rgba(240, 249, 255, 0.95)',
      borderTop: '1px solid rgba(14, 165, 233, 0.2)'
    },
    sidebar: {
      width: '16rem',
      background: 'rgba(224, 242, 254, 0.95)',
      borderRight: '1px solid rgba(14, 165, 233, 0.2)'
    },
    main: {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)',
      padding: '2rem'
    }
  },
  typography: {
    fontFamily: '"Quicksand", "Inter", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  effects: {
    shadows: {
      sm: '0 1px 2px 0 rgba(14, 165, 233, 0.15)',
      base: '0 1px 3px 0 rgba(14, 165, 233, 0.2), 0 1px 2px 0 rgba(14, 165, 233, 0.1)',
      md: '0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -1px rgba(14, 165, 233, 0.1)',
      lg: '0 10px 15px -3px rgba(14, 165, 233, 0.2), 0 4px 6px -2px rgba(14, 165, 233, 0.1)',
      xl: '0 20px 25px -5px rgba(14, 165, 233, 0.2), 0 10px 10px -5px rgba(14, 165, 233, 0.1)'
    },
    blur: {
      sm: 'blur(4px)',
      base: 'blur(8px)',
      md: 'blur(12px)',
      lg: 'blur(16px)'
    },
    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};

// Available themes
export const availableThemes = [
  modernTheme,
  warmTheme,
  darkElegantTheme,
  natureTheme,
  vibrantTheme,
  oceanicTheme
];

// Get theme by ID
export const getThemeById = (id: string): ThemeConfig | undefined => {
  return availableThemes.find(theme => theme.id === id);
};

// Default theme
export const defaultTheme = modernTheme;

// Theme Management Component
export { ThemesManagement } from './ThemesManagement';
