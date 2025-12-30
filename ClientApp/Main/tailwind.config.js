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
                border: "hsl(var(--color-border))",
                input: "hsl(var(--color-input))",
                ring: "hsl(var(--color-ring))",
                background: "hsl(var(--color-background))",
                foreground: "hsl(var(--color-foreground))",
                primary: {
                    DEFAULT: "hsl(var(--color-primary))",
                    foreground: "hsl(var(--color-primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--color-secondary))",
                    foreground: "hsl(var(--color-secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--color-destructive))",
                    foreground: "hsl(var(--color-destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--color-muted))",
                    foreground: "hsl(var(--color-muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--color-accent))",
                    foreground: "hsl(var(--color-accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--color-popover))",
                    foreground: "hsl(var(--color-popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--color-card))",
                    foreground: "hsl(var(--color-card-foreground))",
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
                "zoom-in": {
                    from: { transform: "scale(0.95)", opacity: 0 },
                    to: { transform: "scale(1)", opacity: 1 },
                },
                "rotate-180": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(180deg)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-in-out",
                "fade-out": "fade-out 0.3s ease-in-out",
                "zoom-in": "zoom-in 0.2s ease-out",
                "rotate-slow": "rotate-180 0.5s ease-in-out",
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
    plugins: [require("tailwindcss-animate")],
}
