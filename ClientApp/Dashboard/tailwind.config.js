/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './src/**/*.{html,ts}',
        './src/**/*.{js,jsx,ts,tsx,vue}',
        './index.html',
        './public/**/*.html',
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "1.5rem",
                lg: "2rem",
                xl: "3rem",
                "2xl": "4rem",
            },
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                // Custom Red Palette - Exact colors as requested
                red: {
                    50: '#fef2f2',   // oklch(0.971 0.013 17.38)
                    100: '#ffe2e2',  // oklch(0.936 0.032 17.717)
                    200: '#ffc9c9',  // oklch(0.885 0.062 18.334)
                    300: '#ffa2a2',  // oklch(0.808 0.114 19.571)
                    400: '#ff6467',  // oklch(0.704 0.191 22.216)
                    500: '#fb2c36',  // oklch(0.637 0.237 25.331)
                    600: '#e7000b',  // oklch(0.577 0.245 27.325)
                    700: '#c10007',  // oklch(0.505 0.213 27.518)
                    800: '#9f0712',  // oklch(0.444 0.177 26.899)
                    900: '#82181a',  // oklch(0.396 0.141 25.723)
                    950: '#460809',  // oklch(0.258 0.092 26.042)
                },
                // Dashboard-specific semantic colors
                border: "hsl(var(--color-border) / <alpha-value>)",
                input: "hsl(var(--color-input) / <alpha-value>)",
                ring: "hsl(var(--color-ring) / <alpha-value>)",
                background: "hsl(var(--color-background) / <alpha-value>)",
                foreground: "hsl(var(--color-foreground) / <alpha-value>)",
                primary: {
                    DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",
                    foreground: "hsl(var(--color-primary-foreground) / <alpha-value>)",
                    50: '#fef2f2',
                    100: '#ffe2e2',
                    200: '#ffc9c9',
                    300: '#ffa2a2',
                    400: '#ff6467',
                    500: '#fb2c36',
                    600: '#e7000b',
                    700: '#c10007',
                    800: '#9f0712',
                    900: '#82181a',
                    950: '#460809',
                },
                secondary: {
                    DEFAULT: "hsl(var(--color-secondary) / <alpha-value>)",
                    foreground: "hsl(var(--color-secondary-foreground) / <alpha-value>)",
                },
                destructive: {
                    DEFAULT: "hsl(var(--color-destructive) / <alpha-value>)",
                    foreground: "hsl(var(--color-destructive-foreground) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "hsl(var(--color-muted) / <alpha-value>)",
                    foreground: "hsl(var(--color-muted-foreground) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "hsl(var(--color-accent) / <alpha-value>)",
                    foreground: "hsl(var(--color-accent-foreground) / <alpha-value>)",
                },
                popover: {
                    DEFAULT: "hsl(var(--color-popover) / <alpha-value>)",
                    foreground: "hsl(var(--color-popover-foreground) / <alpha-value>)",
                },
                card: {
                    DEFAULT: "hsl(var(--color-card) / <alpha-value>)",
                    foreground: "hsl(var(--color-card-foreground) / <alpha-value>)",
                },
                // Dashboard-specific status colors
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    950: '#451a03',
                },
                info: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                // Dashboard sidebar and navigation
                sidebar: {
                    DEFAULT: "hsl(var(--color-sidebar) / <alpha-value>)",
                    foreground: "hsl(var(--color-sidebar-foreground) / <alpha-value>)",
                    primary: "hsl(var(--color-sidebar-primary) / <alpha-value>)",
                    'primary-foreground': "hsl(var(--color-sidebar-primary-foreground) / <alpha-value>)",
                    accent: "hsl(var(--color-sidebar-accent) / <alpha-value>)",
                    'accent-foreground': "hsl(var(--color-sidebar-accent-foreground) / <alpha-value>)",
                    border: "hsl(var(--color-sidebar-border) / <alpha-value>)",
                    ring: "hsl(var(--color-sidebar-ring) / <alpha-value>)",
                },
            },
            // Enhanced Shadows for Dashboard
            boxShadow: {
                'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
                'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
                // Dashboard-specific shadows
                'glow': '0 0 20px rgb(251 44 54 / 0.3)',
                'glow-lg': '0 0 40px rgb(251 44 54 / 0.4)',
                'glow-xl': '0 0 60px rgb(251 44 54 / 0.5)',
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'brutal': '8px 8px 0px 0px rgb(0, 0, 0)',
                'brutal-sm': '4px 4px 0px 0px rgb(0, 0, 0)',
                'brutal-lg': '12px 12px 0px 0px rgb(0, 0, 0)',
                // Card shadows
                'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                'card-active': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                // Sidebar shadows
                'sidebar': '4px 0 6px -1px rgb(0 0 0 / 0.1), 2px 0 4px -2px rgb(0 0 0 / 0.1)',
                'sidebar-lg': '8px 0 15px -3px rgb(0 0 0 / 0.1), 4px 0 6px -4px rgb(0 0 0 / 0.1)',
                // Modal and overlay shadows
                'modal': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                'dropdown': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            },
            // Enhanced Border Radius
            borderRadius: {
                'xs': '0.125rem',
                'sm': '0.25rem',
                'DEFAULT': '0.375rem',
                'md': '0.5rem',
                'lg': '0.75rem',
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '2.5rem',
                'full': '9999px',
            },
            // Typography optimized for Dashboard
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Georgia', 'serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
                display: ['Inter', 'system-ui', 'sans-serif'],
                dashboard: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
                '7xl': ['4.5rem', { lineHeight: '1' }],
                '8xl': ['6rem', { lineHeight: '1' }],
                '9xl': ['8rem', { lineHeight: '1' }],
                // Dashboard-specific sizes
                'dashboard-xs': ['0.6875rem', { lineHeight: '1rem' }],
                'dashboard-sm': ['0.8125rem', { lineHeight: '1.125rem' }],
                'dashboard-base': ['0.9375rem', { lineHeight: '1.375rem' }],
            },
            // Enhanced Motion Design & Animations for Dashboard
            keyframes: {
                // Accordion animations
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
                // Sidebar animations
                "sidebar-in": {
                    from: { transform: "translateX(-100%)" },
                    to: { transform: "translateX(0)" },
                },
                "sidebar-out": {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-100%)" },
                },
                // Fade animations
                "fade-in": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                "fade-out": {
                    from: { opacity: 1 },
                    to: { opacity: 0 },
                },
                "fade-in-up": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                "fade-in-down": {
                    from: { opacity: 0, transform: "translateY(-10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                "fade-in-left": {
                    from: { opacity: 0, transform: "translateX(-10px)" },
                    to: { opacity: 1, transform: "translateX(0)" },
                },
                "fade-in-right": {
                    from: { opacity: 0, transform: "translateX(10px)" },
                    to: { opacity: 1, transform: "translateX(0)" },
                },
                // Slide animations
                "slide-up": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                "slide-down": {
                    from: { opacity: 0, transform: "translateY(-10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                "slide-left": {
                    from: { opacity: 0, transform: "translateX(10px)" },
                    to: { opacity: 1, transform: "translateX(0)" },
                },
                "slide-right": {
                    from: { opacity: 0, transform: "translateX(-10px)" },
                    to: { opacity: 1, transform: "translateX(0)" },
                },
                // Scale animations
                "zoom-in": {
                    from: { transform: "scale(0.95)", opacity: 0 },
                    to: { transform: "scale(1)", opacity: 1 },
                },
                "zoom-out": {
                    from: { transform: "scale(1.05)", opacity: 0 },
                    to: { transform: "scale(1)", opacity: 1 },
                },
                "scale-in": {
                    from: { transform: "scale(0)", opacity: 0 },
                    to: { transform: "scale(1)", opacity: 1 },
                },
                "scale-out": {
                    from: { transform: "scale(1)", opacity: 1 },
                    to: { transform: "scale(0.95)", opacity: 0 },
                },
                // Rotation animations
                "rotate-180": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(180deg)" },
                },
                "rotate-360": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                },
                // Dashboard-specific animations
                "dashboard-slide-in": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                "dashboard-slide-out": {
                    from: { opacity: 1, transform: "translateY(0)" },
                    to: { opacity: 0, transform: "translateY(-20px)" },
                },
                // Float and bounce
                "float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
                "bounce-gentle": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-2px)" },
                },
                // Pulse animations
                "pulse-gentle": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.8 },
                },
                "pulse-glow": {
                    "0%, 100%": { boxShadow: "0 0 5px rgb(251 44 54 / 0.3)" },
                    "50%": { boxShadow: "0 0 20px rgb(251 44 54 / 0.6)" },
                },
                "pulse-success": {
                    "0%, 100%": { boxShadow: "0 0 5px rgb(34 197 94 / 0.3)" },
                    "50%": { boxShadow: "0 0 20px rgb(34 197 94 / 0.6)" },
                },
                "pulse-warning": {
                    "0%, 100%": { boxShadow: "0 0 5px rgb(245 158 11 / 0.3)" },
                    "50%": { boxShadow: "0 0 20px rgb(245 158 11 / 0.6)" },
                },
                // Badge and notification animations
                "badge-pulse": {
                    "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(251, 44, 54, 0.4)" },
                    "70%": { transform: "scale(1.05)", boxShadow: "0 0 0 6px rgba(251, 44, 54, 0)" },
                    "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(251, 44, 54, 0)" },
                },
                "badge-bounce": {
                    "0%": { transform: "scale(0)", opacity: 0 },
                    "50%": { transform: "scale(1.2)" },
                    "100%": { transform: "scale(1)", opacity: 1 },
                },
                "notification-slide": {
                    "0%": { transform: "translateX(100%)", opacity: 0 },
                    "100%": { transform: "translateX(0)", opacity: 1 },
                },
                // Theme animations
                "sun-glow": {
                    "0%": { filter: "drop-shadow(0 0 8px hsl(var(--color-primary) / 0.4))" },
                    "100%": { filter: "drop-shadow(0 0 12px hsl(var(--color-primary) / 0.6))" },
                },
                "moon-pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.8 },
                },
                // Loading animations
                "spin-slow": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                },
                "ping-slow": {
                    "75%, 100%": { transform: "scale(2)", opacity: 0 },
                },
                "loading-dots": {
                    "0%, 80%, 100%": { transform: "scale(0)", opacity: "0.5" },
                    "40%": { transform: "scale(1)", opacity: "1" }
                },
                // Progress animations
                "progress-indeterminate": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" }
                },
                // Chart animations
                "chart-draw": {
                    from: { strokeDashoffset: "1000" },
                    to: { strokeDashoffset: "0" }
                },
                "chart-fade-in": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" }
                },
                // Interactive effects
                "shine": {
                    "0%": { left: "-100%" },
                    "100%": { left: "100%" }
                },
                "typing": {
                    "0%, 80%, 100%": { transform: "scale(0)", opacity: "0.5" },
                    "40%": { transform: "scale(1)", opacity: "1" }
                },
                "shake": {
                    "0%, 100%": { transform: "translateX(0)" },
                    "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
                    "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
                },
                "wiggle": {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
                "heartbeat": {
                    "0%": { transform: "scale(1)" },
                    "14%": { transform: "scale(1.1)" },
                    "28%": { transform: "scale(1)" },
                    "42%": { transform: "scale(1.1)" },
                    "70%": { transform: "scale(1)" },
                },
                // Modal animations
                "modal-overlay-in": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                "modal-content-in": {
                    from: { opacity: 0, transform: "scale(0.95) translateY(-10px)" },
                    to: { opacity: 1, transform: "scale(1) translateY(0)" },
                },
                // Dropdown animations
                "dropdown-in": {
                    from: { opacity: 0, transform: "scale(0.95)" },
                    to: { opacity: 1, transform: "scale(1)" },
                },
                "dropdown-out": {
                    from: { opacity: 1, transform: "scale(1)" },
                    to: { opacity: 0, transform: "scale(0.95)" },
                },
            },
            animation: {
                // Basic animations
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "sidebar-in": "sidebar-in 0.3s ease-out",
                "sidebar-out": "sidebar-out 0.3s ease-in",
                "fade-in": "fade-in 0.3s ease-in-out",
                "fade-out": "fade-out 0.3s ease-in-out",
                "fade-in-up": "fade-in-up 0.4s ease-out",
                "fade-in-down": "fade-in-down 0.4s ease-out",
                "fade-in-left": "fade-in-left 0.4s ease-out",
                "fade-in-right": "fade-in-right 0.4s ease-out",
                "slide-up": "slide-up 0.4s ease-out forwards",
                "slide-down": "slide-down 0.4s ease-out forwards",
                "slide-left": "slide-left 0.4s ease-out forwards",
                "slide-right": "slide-right 0.4s ease-out forwards",
                "zoom-in": "zoom-in 0.2s ease-out",
                "zoom-out": "zoom-out 0.2s ease-out",
                "scale-in": "scale-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "scale-out": "scale-out 0.2s ease-in",
                "rotate-slow": "rotate-180 0.5s ease-in-out",
                "rotate-fast": "rotate-360 0.3s ease-in-out",
                // Dashboard-specific animations
                "dashboard-slide-in": "dashboard-slide-in 0.5s ease-out",
                "dashboard-slide-out": "dashboard-slide-out 0.3s ease-in",
                // Float and movement
                "float": "float 3s ease-in-out infinite",
                "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
                "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                "pulse-success": "pulse-success 2s ease-in-out infinite",
                "pulse-warning": "pulse-warning 2s ease-in-out infinite",
                // Badge and notification animations
                "badge-pulse": "badge-pulse 2s infinite ease-in-out",
                "badge-bounce": "badge-bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "notification-slide": "notification-slide 0.3s ease-out",
                // Theme animations
                "sun-glow": "sun-glow 2s ease-in-out infinite alternate",
                "moon-pulse": "moon-pulse 3s ease-in-out infinite",
                // Loading states
                "spin-slow": "spin-slow 2s linear infinite",
                "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                "loading-dots": "loading-dots 1.4s infinite ease-in-out both",
                "progress-indeterminate": "progress-indeterminate 2s linear infinite",
                // Chart animations
                "chart-draw": "chart-draw 2s ease-in-out",
                "chart-fade-in": "chart-fade-in 0.6s ease-out",
                // Interactive effects
                "shine": "shine 3s infinite",
                "typing": "typing 1.4s infinite ease-in-out both",
                "shake": "shake 0.5s ease-in-out",
                "wiggle": "wiggle 1s ease-in-out infinite",
                "heartbeat": "heartbeat 1.5s ease-in-out infinite",
                // Modal and dropdown animations
                "modal-overlay-in": "modal-overlay-in 0.2s ease-out",
                "modal-content-in": "modal-content-in 0.3s ease-out",
                "dropdown-in": "dropdown-in 0.15s ease-out",
                "dropdown-out": "dropdown-out 0.15s ease-in",
            },
            // Enhanced Spacing for Dashboard
            spacing: {
                '0.5': '0.125rem',
                '1.5': '0.375rem',
                '2.5': '0.625rem',
                '3.5': '0.875rem',
                '4.5': '1.125rem',
                '5.5': '1.375rem',
                '6.5': '1.625rem',
                '7.5': '1.875rem',
                '8.5': '2.125rem',
                '9.5': '2.375rem',
                '10.5': '2.625rem',
                '11.5': '2.875rem',
                '12.5': '3.125rem',
                '13': '3.25rem',
                '15': '3.75rem',
                '17': '4.25rem',
                '18': '4.5rem',
                '19': '4.75rem',
                '21': '5.25rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '30': '7.5rem',
                '34': '8.5rem',
                '38': '9.5rem',
                '42': '10.5rem',
                '46': '11.5rem',
                '50': '12.5rem',
                '54': '13.5rem',
                '58': '14.5rem',
                '62': '15.5rem',
                '66': '16.5rem',
                '70': '17.5rem',
                '74': '18.5rem',
                '78': '19.5rem',
                '82': '20.5rem',
                '86': '21.5rem',
                '90': '22.5rem',
                '94': '23.5rem',
                '98': '24.5rem',
                '128': '32rem',
                '144': '36rem',
                '160': '40rem',
                '176': '44rem',
                '192': '48rem',
                '208': '52rem',
                '224': '56rem',
                '240': '60rem',
                '256': '64rem',
                '288': '72rem',
                '320': '80rem',
                '384': '96rem',
                // Dashboard-specific spacing
                'sidebar': '16rem',
                'sidebar-collapsed': '4rem',
                'header': '4rem',
                'footer': '3rem',
            },
            // Enhanced Responsive Breakpoints
            screens: {
                'xs': '475px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
                '3xl': '1920px',
                '4xl': '2560px',
                // Dashboard-specific breakpoints
                'dashboard-sm': '768px',
                'dashboard-md': '1024px',
                'dashboard-lg': '1280px',
                'dashboard-xl': '1536px',
                // Height breakpoints
                'h-sm': { 'raw': '(min-height: 640px)' },
                'h-md': { 'raw': '(min-height: 768px)' },
                'h-lg': { 'raw': '(min-height: 1024px)' },
                'h-xl': { 'raw': '(min-height: 1280px)' },
                // Orientation breakpoints
                'portrait': { 'raw': '(orientation: portrait)' },
                'landscape': { 'raw': '(orientation: landscape)' },
                // Hover capability
                'hover-hover': { 'raw': '(hover: hover)' },
                'hover-none': { 'raw': '(hover: none)' },
                // Reduced motion
                'motion-safe': { 'raw': '(prefers-reduced-motion: no-preference)' },
                'motion-reduce': { 'raw': '(prefers-reduced-motion: reduce)' },
                // Print media
                'print': { 'raw': 'print' },
            },
            // Enhanced Z-index scale for Dashboard layers
            zIndex: {
                '1': '1',
                '2': '2',
                '3': '3',
                '4': '4',
                '5': '5',
                '10': '10',
                '20': '20',
                '30': '30',
                '40': '40',
                '50': '50',
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
                // Dashboard-specific z-index
                'sidebar': '100',
                'header': '90',
                'dropdown': '1000',
                'modal': '1050',
                'popover': '1060',
                'tooltip': '1070',
                'notification': '1080',
            },
            // Enhanced Backdrop Effects
            backdropBlur: {
                'xs': '2px',
                '3xl': '64px',
                '4xl': '128px',
            },
            backdropBrightness: {
                '25': '.25',
                '175': '1.75',
                '200': '2',
            },
            backdropSaturate: {
                '25': '.25',
                '175': '1.75',
                '200': '2',
            },
            // Enhanced Transition Timing
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
                'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
                'ease-in-out-expo': 'cubic-bezier(1, 0, 0, 1)',
                'ease-in-circ': 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
                'ease-out-circ': 'cubic-bezier(0.075, 0.82, 0.165, 1)',
                'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
                'ease-in-back': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
                'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            // Enhanced Transition Duration
            transitionDuration: {
                '0': '0ms',
                '50': '50ms',
                '100': '100ms',
                '200': '200ms',
                '250': '250ms',
                '400': '400ms',
                '500': '500ms',
                '600': '600ms',
                '700': '700ms',
                '800': '800ms',
                '900': '900ms',
                '1200': '1200ms',
                '1500': '1500ms',
                '2000': '2000ms',
            },
            // Grid Template Columns for Dashboard Layouts
            gridTemplateColumns: {
                'sidebar': '16rem 1fr',
                'sidebar-collapsed': '4rem 1fr',
                'dashboard': 'repeat(12, minmax(0, 1fr))',
                'dashboard-auto': 'repeat(auto-fit, minmax(250px, 1fr))',
            },
            // Grid Template Rows for Dashboard Layouts
            gridTemplateRows: {
                'dashboard': 'auto 1fr auto',
                'dashboard-full': '4rem 1fr 3rem',
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
        require("@tailwindcss/forms"),
        require("@tailwindcss/aspect-ratio"),
        require("@tailwindcss/container-queries"),
        function ({ addUtilities, addComponents, theme, addVariant }) {
            // Add RTL variant
            addVariant('rtl', '[dir="rtl"] &');
            addVariant('ltr', '[dir="ltr"] &');
            
            // Custom Scrollbar Utilities
            const scrollbarUtilities = {
                ".custom-scroll": {
                    "scrollbar-width": "thin",
                    "scrollbar-color": "rgb(251 44 54 / 0.2) transparent",
                    "&::-webkit-scrollbar": {
                        "width": "6px",
                        "height": "6px"
                    },
                    "&::-webkit-scrollbar-track": {
                        "background": "transparent"
                    },
                    "&::-webkit-scrollbar-thumb": {
                        "background": "rgb(251 44 54 / 0.2)",
                        "border-radius": "9999px",
                        "transition": "all 0.3s ease"
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        "background": "rgb(251 44 54 / 0.4)"
                    }
                },
                ".custom-scroll-dark": {
                    "scrollbar-width": "thin",
                    "scrollbar-color": "rgb(251 44 54 / 0.3) transparent",
                    "&::-webkit-scrollbar": {
                        "width": "6px",
                        "height": "6px"
                    },
                    "&::-webkit-scrollbar-track": {
                        "background": "transparent"
                    },
                    "&::-webkit-scrollbar-thumb": {
                        "background": "rgb(251 44 54 / 0.3)",
                        "border-radius": "9999px",
                        "transition": "all 0.3s ease"
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        "background": "rgb(251 44 54 / 0.5)"
                    }
                },
                ".no-scrollbar": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                    "&::-webkit-scrollbar": {
                        "display": "none"
                    }
                },
                ".scroll-smooth": {
                    "scroll-behavior": "smooth"
                }
            };

            // Glass Effect Utilities
            const glassUtilities = {
                ".glass": {
                    "background": "rgba(255, 255, 255, 0.1)",
                    "backdrop-filter": "blur(10px)",
                    "border": "1px solid rgba(255, 255, 255, 0.2)",
                },
                ".glass-dark": {
                    "background": "rgba(0, 0, 0, 0.1)",
                    "backdrop-filter": "blur(10px)",
                    "border": "1px solid rgba(255, 255, 255, 0.1)",
                },
                ".glass-strong": {
                    "background": "rgba(255, 255, 255, 0.2)",
                    "backdrop-filter": "blur(20px)",
                    "border": "1px solid rgba(255, 255, 255, 0.3)",
                },
                ".glass-sidebar": {
                    "background": "rgba(255, 255, 255, 0.05)",
                    "backdrop-filter": "blur(12px)",
                    "border-right": "1px solid rgba(255, 255, 255, 0.1)",
                },
                ".glass-card": {
                    "background": "rgba(255, 255, 255, 0.08)",
                    "backdrop-filter": "blur(8px)",
                    "border": "1px solid rgba(255, 255, 255, 0.15)",
                }
            };

            // Text Utilities
            const textUtilities = {
                ".text-gradient": {
                    "background": "linear-gradient(135deg, #fb2c36, #e7000b)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                    "background-clip": "text",
                },
                ".text-gradient-secondary": {
                    "background": "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                    "background-clip": "text",
                },
                ".text-gradient-success": {
                    "background": "linear-gradient(135deg, #22c55e, #15803d)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                    "background-clip": "text",
                },
                ".text-gradient-warning": {
                    "background": "linear-gradient(135deg, #f59e0b, #d97706)",
                    "-webkit-background-clip": "text",
                    "-webkit-text-fill-color": "transparent",
                    "background-clip": "text",
                },
                ".text-shadow": {
                    "text-shadow": "0 2px 4px rgba(0, 0, 0, 0.1)",
                },
                ".text-shadow-lg": {
                    "text-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)",
                },
                ".text-shadow-none": {
                    "text-shadow": "none",
                }
            };

            // Dashboard Layout Utilities
            const layoutUtilities = {
                ".dashboard-grid": {
                    "display": "grid",
                    "grid-template-columns": "16rem 1fr",
                    "grid-template-rows": "4rem 1fr 3rem",
                    "min-height": "100vh",
                },
                ".dashboard-grid-collapsed": {
                    "grid-template-columns": "4rem 1fr",
                },
                ".sidebar-width": {
                    "width": "16rem",
                },
                ".sidebar-width-collapsed": {
                    "width": "4rem",
                },
                ".main-content": {
                    "grid-column": "2",
                    "grid-row": "2",
                    "overflow": "auto",
                },
                ".dashboard-header": {
                    "grid-column": "1 / -1",
                    "grid-row": "1",
                    "height": "4rem",
                },
                ".dashboard-footer": {
                    "grid-column": "1 / -1",
                    "grid-row": "3",
                    "height": "3rem",
                }
            };

            // Button Component Styles for Dashboard
            const buttonComponents = {
                ".btn": {
                    "display": "inline-flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "border-radius": theme("borderRadius.md"),
                    "font-weight": theme("fontWeight.medium"),
                    "transition": "all 0.2s ease-in-out",
                    "cursor": "pointer",
                    "user-select": "none",
                    "white-space": "nowrap",
                    "&:disabled": {
                        "opacity": "0.5",
                        "cursor": "not-allowed",
                    },
                    "&:focus-visible": {
                        "outline": "2px solid #fb2c36",
                        "outline-offset": "2px",
                    }
                },
                ".btn-sm": {
                    "padding": "0.375rem 0.75rem",
                    "font-size": "0.875rem",
                    "line-height": "1.25rem",
                },
                ".btn-md": {
                    "padding": "0.5rem 1rem",
                    "font-size": "0.875rem",
                    "line-height": "1.25rem",
                },
                ".btn-lg": {
                    "padding": "0.75rem 1.5rem",
                    "font-size": "1rem",
                    "line-height": "1.5rem",
                },
                ".btn-primary": {
                    "background-color": "#fb2c36",
                    "color": "white",
                    "border": "1px solid #fb2c36",
                    "&:hover": {
                        "background-color": "#e7000b",
                        "border-color": "#e7000b",
                        "transform": "translateY(-1px)",
                        "box-shadow": "0 4px 12px rgba(251, 44, 54, 0.3)",
                    },
                    "&:active": {
                        "transform": "translateY(0)",
                    }
                },
                ".btn-secondary": {
                    "background-color": "transparent",
                    "color": "#fb2c36",
                    "border": "1px solid #fb2c36",
                    "&:hover": {
                        "background-color": "#fb2c36",
                        "color": "white",
                        "transform": "translateY(-1px)",
                    }
                },
                ".btn-success": {
                    "background-color": "#22c55e",
                    "color": "white",
                    "border": "1px solid #22c55e",
                    "&:hover": {
                        "background-color": "#16a34a",
                        "border-color": "#16a34a",
                        "transform": "translateY(-1px)",
                        "box-shadow": "0 4px 12px rgba(34, 197, 94, 0.3)",
                    }
                },
                ".btn-warning": {
                    "background-color": "#f59e0b",
                    "color": "white",
                    "border": "1px solid #f59e0b",
                    "&:hover": {
                        "background-color": "#d97706",
                        "border-color": "#d97706",
                        "transform": "translateY(-1px)",
                        "box-shadow": "0 4px 12px rgba(245, 158, 11, 0.3)",
                    }
                },
                ".btn-ghost": {
                    "background-color": "transparent",
                    "color": "#374151",
                    "border": "1px solid transparent",
                    "&:hover": {
                        "background-color": "rgba(251, 44, 54, 0.1)",
                        "color": "#fb2c36",
                    }
                },
                ".btn-outline": {
                    "background-color": "transparent",
                    "color": "#374151",
                    "border": "1px solid #d1d5db",
                    "&:hover": {
                        "background-color": "#f9fafb",
                        "border-color": "#9ca3af",
                    }
                }
            };

            // Card Component Styles for Dashboard
            const cardComponents = {
                ".card": {
                    "background-color": "white",
                    "border-radius": theme("borderRadius.lg"),
                    "box-shadow": theme("boxShadow.card"),
                    "border": "1px solid rgba(0, 0, 0, 0.05)",
                    "transition": "all 0.2s ease-in-out",
                    "overflow": "hidden",
                    "&:hover": {
                        "box-shadow": theme("boxShadow.card-hover"),
                        "transform": "translateY(-2px)",
                    }
                },
                ".card-dark": {
                    "background-color": "#1f2937",
                    "border-color": "#374151",
                    "color": "white",
                },
                ".card-interactive": {
                    "cursor": "pointer",
                    "&:hover": {
                        "box-shadow": theme("boxShadow.lg"),
                        "transform": "translateY(-4px)",
                    },
                    "&:active": {
                        "transform": "translateY(-1px)",
                        "box-shadow": theme("boxShadow.md"),
                    }
                },
                ".card-header": {
                    "padding": "1.5rem 1.5rem 0 1.5rem",
                },
                ".card-body": {
                    "padding": "1.5rem",
                },
                ".card-footer": {
                    "padding": "0 1.5rem 1.5rem 1.5rem",
                    "border-top": "1px solid rgba(0, 0, 0, 0.05)",
                    "margin-top": "1rem",
                    "padding-top": "1rem",
                }
            };

            // Form Component Styles for Dashboard
            const formComponents = {
                ".form-group": {
                    "margin-bottom": "1rem",
                },
                ".form-input": {
                    "width": "100%",
                    "border-radius": theme("borderRadius.md"),
                    "border": "1px solid #d1d5db",
                    "padding": "0.5rem 0.75rem",
                    "transition": "all 0.2s ease-in-out",
                    "font-size": "0.875rem",
                    "line-height": "1.25rem",
                    "&:focus": {
                        "outline": "none",
                        "border-color": "#fb2c36",
                        "box-shadow": "0 0 0 3px rgba(251, 44, 54, 0.1)",
                    },
                    "&:disabled": {
                        "background-color": "#f9fafb",
                        "color": "#6b7280",
                        "cursor": "not-allowed",
                    }
                },
                ".form-input-sm": {
                    "padding": "0.375rem 0.5rem",
                    "font-size": "0.75rem",
                    "line-height": "1rem",
                },
                ".form-input-lg": {
                    "padding": "0.75rem 1rem",
                    "font-size": "1rem",
                    "line-height": "1.5rem",
                },
                ".form-label": {
                    "font-weight": theme("fontWeight.medium"),
                    "color": "#374151",
                    "margin-bottom": "0.25rem",
                    "display": "block",
                    "font-size": "0.875rem",
                    "line-height": "1.25rem",
                },
                ".form-label-required": {
                    "&::after": {
                        "content": '" *"',
                        "color": "#fb2c36",
                        "margin-left": "0.125rem",
                    }
                },
                ".form-error": {
                    "color": "#fb2c36",
                    "font-size": "0.75rem",
                    "line-height": "1rem",
                    "margin-top": "0.25rem",
                },
                ".form-help": {
                    "color": "#6b7280",
                    "font-size": "0.75rem",
                    "line-height": "1rem",
                    "margin-top": "0.25rem",
                },
                ".form-select": {
                    "width": "100%",
                    "border-radius": theme("borderRadius.md"),
                    "border": "1px solid #d1d5db",
                    "padding": "0.5rem 2.5rem 0.5rem 0.75rem",
                    "transition": "all 0.2s ease-in-out",
                    "font-size": "0.875rem",
                    "line-height": "1.25rem",
                    "background-image": `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    "background-position": "right 0.5rem center",
                    "background-repeat": "no-repeat",
                    "background-size": "1.5em 1.5em",
                    "&:focus": {
                        "outline": "none",
                        "border-color": "#fb2c36",
                        "box-shadow": "0 0 0 3px rgba(251, 44, 54, 0.1)",
                    }
                },
                ".form-checkbox": {
                    "width": "1rem",
                    "height": "1rem",
                    "border-radius": theme("borderRadius.sm"),
                    "border": "1px solid #d1d5db",
                    "transition": "all 0.2s ease-in-out",
                    "&:checked": {
                        "background-color": "#fb2c36",
                        "border-color": "#fb2c36",
                    },
                    "&:focus": {
                        "outline": "none",
                        "box-shadow": "0 0 0 3px rgba(251, 44, 54, 0.1)",
                    }
                }
            };

            // Sidebar Component Styles
            const sidebarComponents = {
                ".sidebar": {
                    "width": "16rem",
                    "background-color": "white",
                    "border-right": "1px solid rgba(0, 0, 0, 0.05)",
                    "transition": "all 0.3s ease-in-out",
                    "overflow": "hidden",
                },
                ".sidebar-collapsed": {
                    "width": "4rem",
                },
                ".sidebar-dark": {
                    "background-color": "#1f2937",
                    "border-right-color": "#374151",
                    "color": "white",
                },
                ".sidebar-nav": {
                    "padding": "1rem 0",
                },
                ".sidebar-nav-item": {
                    "display": "flex",
                    "align-items": "center",
                    "padding": "0.75rem 1rem",
                    "color": "#6b7280",
                    "text-decoration": "none",
                    "transition": "all 0.2s ease-in-out",
                    "border-left": "3px solid transparent",
                    "&:hover": {
                        "background-color": "rgba(251, 44, 54, 0.05)",
                        "color": "#fb2c36",
                        "border-left-color": "#fb2c36",
                    }
                },
                ".sidebar-nav-item-active": {
                    "background-color": "rgba(251, 44, 54, 0.1)",
                    "color": "#fb2c36",
                    "border-left-color": "#fb2c36",
                    "font-weight": theme("fontWeight.medium"),
                },
                ".sidebar-nav-icon": {
                    "width": "1.25rem",
                    "height": "1.25rem",
                    "margin-right": "0.75rem",
                    "flex-shrink": "0",
                },
                ".sidebar-nav-text": {
                    "transition": "opacity 0.3s ease-in-out",
                },
                ".sidebar-collapsed .sidebar-nav-text": {
                    "opacity": "0",
                    "width": "0",
                    "overflow": "hidden",
                }
            };

            // RTL-specific utilities
            const rtlUtilities = {
                // RTL Layout utilities
                ".rtl-container": {
                    "&[data-rtl=\"true\"]": {
                        "direction": "rtl",
                        "text-align": "right",
                    },
                    "&[data-rtl=\"false\"]": {
                        "direction": "ltr",
                        "text-align": "left",
                    }
                },
                
                // RTL Flexbox utilities
                ".rtl-flex": {
                    "&[data-rtl=\"true\"]": {
                        "flex-direction": "row-reverse",
                    }
                },
                
                // RTL Grid utilities
                ".rtl-grid": {
                    "&[data-rtl=\"true\"]": {
                        "direction": "rtl",
                    }
                },
                
                // RTL Text utilities
                ".rtl-text": {
                    "&[data-rtl=\"true\"]": {
                        "text-align": "right",
                    },
                    "&[data-rtl=\"false\"]": {
                        "text-align": "left",
                    }
                },
                
                // RTL Sidebar utilities
                ".rtl-sidebar": {
                    "transition": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&[data-position=\"right\"]": {
                        "right": "0",
                        "left": "auto",
                        "border-left": "1px solid rgba(0, 0, 0, 0.05)",
                        "border-right": "none",
                    },
                    "&[data-position=\"left\"]": {
                        "left": "0",
                        "right": "auto",
                        "border-right": "1px solid rgba(0, 0, 0, 0.05)",
                        "border-left": "none",
                    }
                },
                
                // RTL Navigation utilities
                ".rtl-nav": {
                    "&.horizontal[data-rtl=\"true\"]": {
                        "flex-direction": "row-reverse",
                    }
                },
                
                // RTL Button utilities
                ".rtl-button": {
                    "&[data-rtl=\"true\"]": {
                        "flex-direction": "row-reverse",
                    }
                },
                
                // RTL Card utilities
                ".rtl-card": {
                    "&[data-rtl=\"true\"]": {
                        "text-align": "right",
                        "& .card-header": {
                            "text-align": "right",
                        },
                        "& .card-footer": {
                            "text-align": "right",
                            "flex-direction": "row-reverse",
                        }
                    }
                },
                
                // RTL Form utilities
                ".rtl-form-field": {
                    "&[data-rtl=\"true\"]": {
                        "& label": {
                            "text-align": "right",
                        },
                        "& input, & textarea, & select": {
                            "text-align": "right",
                        },
                        "& .form-error, & .form-help": {
                            "text-align": "right",
                        }
                    }
                },
                
                // RTL spacing utilities
                ".rtl-space-x-reverse": {
                    "&[data-rtl=\"true\"] > * + *": {
                        "margin-left": "0",
                        "margin-right": "var(--tw-space-x-reverse, 0.5rem)",
                    }
                },
                
                // RTL positioning utilities
                ".rtl-position": {
                    "&[data-rtl=\"true\"]": {
                        "&.left-0": {
                            "left": "auto",
                            "right": "0",
                        },
                        "&.right-0": {
                            "right": "auto",
                            "left": "0",
                        }
                    }
                },
                
                // RTL border utilities
                ".rtl-border": {
                    "&[data-rtl=\"true\"]": {
                        "&.border-l": {
                            "border-left": "none",
                            "border-right": "1px solid hsl(var(--border))",
                        },
                        "&.border-r": {
                            "border-right": "none",
                            "border-left": "1px solid hsl(var(--border))",
                        }
                    }
                },
                
                // RTL animation utilities
                ".rtl-animate": {
                    "&[data-rtl=\"true\"]": {
                        "&.slide-in-left": {
                            "animation": "slide-in-right 0.3s ease-out",
                        },
                        "&.slide-in-right": {
                            "animation": "slide-in-left 0.3s ease-out",
                        }
                    }
                }
            };

            addUtilities({ 
                ...scrollbarUtilities, 
                ...glassUtilities, 
                ...textUtilities, 
                ...layoutUtilities,
                ...rtlUtilities
            }, ["responsive", "hover", "dark", "rtl", "ltr"]);
            
            addComponents({ 
                ...buttonComponents, 
                ...cardComponents, 
                ...formComponents, 
                ...sidebarComponents 
            });
        }
    ],
}