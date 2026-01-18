// Chart Theme Constants
export const CHART_COLORS = {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    muted: '#94a3b8'
} as const;

export const CHART_PALETTE = [
    CHART_COLORS.primary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.danger,
    CHART_COLORS.secondary,
    CHART_COLORS.info
];

export const COMMON_CHART_PROPS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                usePointStyle: true,
                padding: 20
            }
        },
        tooltip: {
            padding: 12,
            cornerRadius: 8
        }
    }
};

export const chartThemeService = {
    getColors: () => CHART_COLORS,
    getPalette: () => CHART_PALETTE,
    getCommonProps: () => COMMON_CHART_PROPS
};
