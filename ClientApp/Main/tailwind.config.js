/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './src/**/*.{html,ts}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--color-border) / <alpha-value>)",
                input: "hsl(var(--color-input) / <alpha-value>)",
                ring: "hsl(var(--color-ring) / <alpha-value>)",
                background: "hsl(var(--color-background) / <alpha-value>)",
                foreground: "hsl(var(--color-foreground) / <alpha-value>)",
                primary: {
                    DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",
                    foreground: "hsl(var(--color-primary-foreground) / <alpha-value>)",
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
            },
            borderRadius: {
                lg: "var(--radius-lg)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
                "fade-in": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                "fade-out": {
                    from: { opacity: 1 },
                    to: { opacity: 0 },
                },
                "slide-up": {
                    from: { opacity: 0, transform: "translateY(10px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
                "zoom-in": {
                    from: { transform: "scale(0.95)", opacity: 0 },
                    to: { transform: "scale(1)", opacity: 1 },
                },
                "rotate-180": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(180deg)" },
                },
                "badge-pulse": {
                    "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(220, 38, 38, 0.4)" },
                    "70%": { transform: "scale(1.05)", boxShadow: "0 0 0 6px rgba(220, 38, 38, 0)" },
                    "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(220, 38, 38, 0)" },
                },
                "badge-bounce": {
                    "0%": { transform: "scale(0)", opacity: 0 },
                    "50%": { transform: "scale(1.2)" },
                    "100%": { transform: "scale(1)", opacity: 1 },
                },
                "sun-glow": {
                    "0%": { filter: "drop-shadow(0 0 8px hsl(var(--color-primary) / 0.4))" },
                    "100%": { filter: "drop-shadow(0 0 12px hsl(var(--color-primary) / 0.6))" },
                },
                "moon-pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.8 },
                },
                "nitro-pulse": {
                    "0%": { boxShadow: "0 0 0 0 rgba(220, 38, 38, 0.4)" },
                    "70%": { boxShadow: "0 0 0 10px rgba(220, 38, 38, 0)" },
                    "100%": { boxShadow: "0 0 0 0 rgba(220, 38, 38, 0)" },
                },
                "shine": {
                    "0%": { left: "-100%" },
                    "100%": { left: "100%" }
                },
                "typing": {
                    "0%, 80%, 100%": { transform: "scale(0)", opacity: "0.5" },
                    "40%": { transform: "scale(1)", opacity: "1" }
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-in-out",
                "fade-out": "fade-out 0.3s ease-in-out",
                "slide-up": "slide-up 0.4s ease-out forwards",
                "float": "float 3s ease-in-out infinite",
                "zoom-in": "zoom-in 0.2s ease-out",
                "rotate-slow": "rotate-180 0.5s ease-in-out",
                "badge-pulse": "badge-pulse 2s infinite ease-in-out",
                "badge-bounce": "badge-bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                "sun-glow": "sun-glow 2s ease-in-out infinite alternate",
                "moon-pulse": "moon-pulse 3s ease-in-out infinite",
                "nitro-pulse": "nitro-pulse 2s infinite",
                "shine": "shine 3s infinite",
                "typing": "typing 1.4s infinite ease-in-out both"
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            screens: {
                'xs': '475px',
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        function ({ addUtilities }) {
            const newUtilities = {
                ".custom-scroll": {
                    "scrollbar-width": "thin",
                    "scrollbar-color": "hsl(var(--color-primary) / 0.2) transparent",
                    "&::-webkit-scrollbar": {
                        "width": "6px",
                        "height": "6px"
                    },
                    "&::-webkit-scrollbar-track": {
                        "background": "transparent"
                    },
                    "&::-webkit-scrollbar-thumb": {
                        "background": "hsl(var(--color-primary) / 0.2)",
                        "border-radius": "9999px",
                        "transition": "all 0.3s ease"
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                        "background": "hsl(var(--color-primary) / 0.4)"
                    }
                },
                ".no-scrollbar": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                    "&::-webkit-scrollbar": {
                        "display": "none"
                    }
                }
            }
            addUtilities(newUtilities, ["responsive", "hover"]);
        }
    ],
}
