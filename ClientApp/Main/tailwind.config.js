/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './src/**/*.{html,ts}',
        './src/**/*.{js,jsx,ts,tsx,vue}',
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "2rem",
                lg: "4rem",
                xl: "5rem",
                "2xl": "6rem",
            },
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                // Custom Red Palette
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
                // Semantic Colors
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
                // Success, Warning, Info colors
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                },
                info: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
            },
            // Enhanced Shadows
            boxShadow: {
                'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
                'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
                'glow': '0 0 20px rgb(251 44 54 / 0.3)',
                'glow-lg': '0 0 40px rgb(251 44 54 / 0.4)',
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'brutal': '8px 8px 0px 0px rgb(0, 0, 0)',
                'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
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
                'full': '9999px',
            },
            // Typography
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Georgia', 'serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                display: ['Inter', 'system-ui', 'sans-serif'],
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
            },
            // Enhanced Motion Design & Animations
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
                // Rotation animations
                "rotate-180": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(180deg)" },
                },
                "rotate-360": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
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
                // Badge animations
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
                // Shine effect
                "shine": {
                    "0%": { left: "-100%" },
                    "100%": { left: "100%" }
                },
                // Typing indicator
                "typing": {
                    "0%, 80%, 100%": { transform: "scale(0)", opacity: "0.5" },
                    "40%": { transform: "scale(1)", opacity: "1" }
                },
                // Shake animation
                "shake": {
                    "0%, 100%": { transform: "translateX(0)" },
                    "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
                    "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
                },
                // Wiggle animation
                "wiggle": {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
                // Heartbeat
                "heartbeat": {
                    "0%": { transform: "scale(1)" },
                    "14%": { transform: "scale(1.1)" },
                    "28%": { transform: "scale(1)" },
                    "42%": { transform: "scale(1.1)" },
                    "70%": { transform: "scale(1)" },
                },
            },
            animation: {
                // Basic animations
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-in-out",
                "fade-out": "fade-out 0.3s ease-in-out",
                "fade-in-up": "fade-in-up 0.4s ease-out",
                "fade-in-down": "fade-in-down 0.4s ease-out",
                "slide-up": "slide-up 0.4s ease-out forwards",
                "slide-down": "slide-down 0.4s ease-out forwards",
                "slide-left": "slide-left 0.4s ease-out forwards",
                "slide-right": "slide-right 0.4s ease-out forwards",
                "zoom-in": "zoom-in 0.2s ease-out",
                "zoom-out": "zoom-out 0.2s ease-out",
                "scale-in": "scale-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "rotate-slow": "rotate-180 0.5s ease-in-out",
                "rotate-fast": "rotate-360 0.3s ease-in-out",
                // Float and movement
                "float": "float 3s ease-in-out infinite",
                "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
                "pulse-gentle": "pulse-gentle 2s ease-in-out infinite",
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                // Badge animations
                "badge-pulse": "badge-pulse 2s infinite ease-in-out",
                "badge-bounce": "badge-bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                // Theme animations
                "sun-glow": "sun-glow 2s ease-in-out infinite alternate",
                "moon-pulse": "moon-pulse 3s ease-in-out infinite",
                // Loading states
                "spin-slow": "spin-slow 2s linear infinite",
                "ping-slow": "ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                // Interactive effects
                "shine": "shine 3s infinite",
                "typing": "typing 1.4s infinite ease-in-out both",
                "shake": "shake 0.5s ease-in-out",
                "wiggle": "wiggle 1s ease-in-out infinite",
                "heartbeat": "heartbeat 1.5s ease-in-out infinite",
            },
            // Enhanced Spacing
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
                // Height breakpoints
                'h-sm': { 'raw': '(min-height: 640px)' },
                'h-md': { 'raw': '(min-height: 768px)' },
                'h-lg': { 'raw': '(min-height: 1024px)' },
                // Orientation breakpoints
                'portrait': { 'raw': '(orientation: portrait)' },
                'landscape': { 'raw': '(orientation: landscape)' },
                // Hover capability
                'hover-hover': { 'raw': '(hover: hover)' },
                'hover-none': { 'raw': '(hover: none)' },
            },
            // Enhanced Z-index scale
            zIndex: {
                '1': '1',
                '2': '2',
                '3': '3',
                '4': '4',
                '5': '5',
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },
            // Enhanced Backdrop Blur
            backdropBlur: {
                'xs': '2px',
                '3xl': '64px',
            },
            // Enhanced Backdrop Brightness
            backdropBrightness: {
                '25': '.25',
                '175': '1.75',
            },
            // Enhanced Backdrop Saturate
            backdropSaturate: {
                '25': '.25',
                '175': '1.75',
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
            },
            // Enhanced Transition Duration
            transitionDuration: {
                '0': '0ms',
                '50': '50ms',
                '250': '250ms',
                '400': '400ms',
                '600': '600ms',
                '800': '800ms',
                '900': '900ms',
                '1200': '1200ms',
                '1500': '1500ms',
                '2000': '2000ms',
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
        require("@tailwindcss/forms"),
        require("@tailwindcss/aspect-ratio"),
        require("@tailwindcss/container-queries"),
        function ({ addUtilities, addComponents, theme }) {
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
                ".text-shadow": {
                    "text-shadow": "0 2px 4px rgba(0, 0, 0, 0.1)",
                },
                ".text-shadow-lg": {
                    "text-shadow": "0 4px 8px rgba(0, 0, 0, 0.2)",
                }
            };

            // Button Component Styles
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
                    "&:disabled": {
                        "opacity": "0.5",
                        "cursor": "not-allowed",
                    }
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
                ".btn-ghost": {
                    "background-color": "transparent",
                    "color": "#374151",
                    "border": "1px solid transparent",
                    "&:hover": {
                        "background-color": "rgba(251, 44, 54, 0.1)",
                        "color": "#fb2c36",
                    }
                }
            };

            // Card Component Styles
            const cardComponents = {
                ".card": {
                    "background-color": "white",
                    "border-radius": theme("borderRadius.lg"),
                    "box-shadow": theme("boxShadow.card"),
                    "border": "1px solid rgba(0, 0, 0, 0.05)",
                    "transition": "all 0.2s ease-in-out",
                    "&:hover": {
                        "box-shadow": theme("boxShadow.card-hover"),
                        "transform": "translateY(-2px)",
                    }
                },
                ".card-dark": {
                    "background-color": "#1f2937",
                    "border-color": "#374151",
                    "color": "white",
                }
            };

            // Form Component Styles
            const formComponents = {
                ".form-input": {
                    "border-radius": theme("borderRadius.md"),
                    "border": "1px solid #d1d5db",
                    "padding": "0.5rem 0.75rem",
                    "transition": "all 0.2s ease-in-out",
                    "&:focus": {
                        "outline": "none",
                        "border-color": "#fb2c36",
                        "box-shadow": "0 0 0 3px rgba(251, 44, 54, 0.1)",
                    }
                },
                ".form-label": {
                    "font-weight": theme("fontWeight.medium"),
                    "color": "#374151",
                    "margin-bottom": "0.25rem",
                    "display": "block",
                }
            };

            addUtilities({ ...scrollbarUtilities, ...glassUtilities, ...textUtilities }, ["responsive", "hover", "dark"]);
            addComponents({ ...buttonComponents, ...cardComponents, ...formComponents });
        }
    ],
}
