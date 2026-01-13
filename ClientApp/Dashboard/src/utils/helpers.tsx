// General Utility Functions
import {
    Play,
    CheckCircle,
    AlertTriangle,
    Pause,
    Clock
} from 'lucide-react';
import { TRAINING_STATUS_COLORS } from '../constants/training';

export const getStatusColor = (status: string): string => {
    const normalizedStatus = status?.toLowerCase();

    // Try training status colors first
    if (normalizedStatus in TRAINING_STATUS_COLORS) {
        return TRAINING_STATUS_COLORS[normalizedStatus as keyof typeof TRAINING_STATUS_COLORS];
    }

    // Fallback map for more statuses
    const statusMap: Record<string, string> = {
        'completed': 'bg-green-100 text-green-600',
        'success': 'bg-green-100 text-green-600',
        'running': 'bg-blue-100 text-blue-600',
        'active': 'bg-blue-100 text-blue-600',
        'in-progress': 'bg-blue-100 text-blue-600',
        'failed': 'bg-red-100 text-red-600',
        'error': 'bg-red-100 text-red-600',
        'paused': 'bg-yellow-100 text-yellow-600',
        'stopped': 'bg-yellow-100 text-yellow-600',
        'pending': 'bg-gray-100 text-gray-600',
        'waiting': 'bg-gray-100 text-gray-600'
    };

    return statusMap[normalizedStatus] || 'text-gray-500 bg-gray-500/10';
};

export const getStatusIcon = (status: string) => {
    const iconProps = { className: 'w-3 h-3' };

    switch (status?.toLowerCase()) {
        case 'running':
        case 'active':
        case 'in-progress':
            return <Play {...iconProps} />;
        case 'completed':
        case 'success':
            return <CheckCircle {...iconProps} />;
        case 'failed':
        case 'error':
            return <AlertTriangle {...iconProps} />;
        case 'paused':
        case 'stopped':
            return <Pause {...iconProps} />;
        case 'pending':
        case 'waiting':
            return <Clock {...iconProps} />;
        default:
            return <Clock {...iconProps} />;
    }
};

export const formatDuration = (secondsOrString: number | string): string => {
    if (typeof secondsOrString === 'string') {
        // If duration is already formatted (e.g., "2h 15m"), return as is
        if (secondsOrString.includes('h') || secondsOrString.includes('m') || secondsOrString.includes('s')) {
            return secondsOrString;
        }
        const parsed = parseInt(secondsOrString);
        if (isNaN(parsed)) return secondsOrString;
        secondsOrString = parsed;
    }

    const hours = Math.floor(secondsOrString / 3600);
    const minutes = Math.floor((secondsOrString % 3600) / 60);
    const remainingSeconds = secondsOrString % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
};

export const formatBytes = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export const formatProgress = (progress: number): string => {
    return `${Math.round(progress)}%`;
};

export const formatAccuracy = (accuracy: number): string => {
    return `${(accuracy * 100).toFixed(1)}%`;
};

export const formatLoss = (loss: number): string => {
    return loss.toFixed(3);
};

export const generateMockChartData = (pointsOrType: number | string = 24, points: number = 24) => {
    if (typeof pointsOrType === 'number') {
        return Array.from({ length: pointsOrType }, () => Math.random() * 80 + 20);
    }

    const type = pointsOrType;
    const labels = [];
    const data = [];

    // Generate time-based labels for the last points hours
    for (let i = points - 1; i >= 0; i--) {
        const date = new Date();
        date.setHours(date.getHours() - i);
        labels.push(date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }));
    }

    // Generate mock data based on type
    switch (type) {
        case 'accuracy':
            for (let i = 0; i < points; i++) data.push(0.8 + Math.random() * 0.2);
            break;
        case 'loss':
            for (let i = 0; i < points; i++) {
                const baseLoss = 0.5 - (i / points) * 0.3;
                data.push(Math.max(0.05, baseLoss + (Math.random() - 0.5) * 0.1));
            }
            break;
        case 'throughput':
            for (let i = 0; i < points; i++) data.push(100 + Math.random() * 50);
            break;
        case 'response_time':
            for (let i = 0; i < points; i++) data.push(50 + Math.random() * 100);
            break;
        case 'memory':
            for (let i = 0; i < points; i++) data.push(40 + Math.random() * 30);
            break;
        case 'cpu':
            for (let i = 0; i < points; i++) data.push(20 + Math.random() * 40);
            break;
        default:
            for (let i = 0; i < points; i++) data.push(Math.random() * 100);
    }

    return {
        labels,
        datasets: [{
            label: type.charAt(0).toUpperCase() + type.slice(1),
            data,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
};

export const generateMockPerformanceData = () => {
    return {
        accuracy: generateMockChartData('accuracy', 12),
        loss: generateMockChartData('loss', 12),
        throughput: generateMockChartData('throughput', 24),
        responseTime: generateMockChartData('response_time', 24),
        memoryUsage: generateMockChartData('memory', 24),
        cpuUsage: generateMockChartData('cpu', 24)
    };
};

// Import culture-aware formatting utilities
import { 
    legacyFormatDate, 
    legacyFormatNumber, 
    legacyFormatCurrency,
    formatRelativeTime as cultureAwareRelativeTime,
    formatPercentage as cultureAwarePercentage,
    getCurrentCulture
} from './cultureFormatting';

// Date and Time Utilities - Now culture-aware
export const formatDate = legacyFormatDate;

export const getRelativeTime = (date: string | Date): string => {
    return cultureAwareRelativeTime(date, getCurrentCulture());
};

// Number Utilities - Now culture-aware
export const formatNumber = legacyFormatNumber;

export const formatPercentage = (value: number, total: number): string => {
    if (total === 0) return cultureAwarePercentage(0, undefined, getCurrentCulture());
    return cultureAwarePercentage(value, total, getCurrentCulture());
};

export const formatCurrency = legacyFormatCurrency;

// String Utilities
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const capitalizeFirst = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const camelToTitle = (text: string): string => {
    return text
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
};

// Array Utilities
export const groupBy = <T extends unknown>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((groups, item) => {
        const group = String(item[key]);
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {} as Record<string, T[]>);
};

export const sortBy = <T extends unknown>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
        const aVal = a[key] as any;
        const bVal = b[key] as any;

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
};

export const unique = <T extends unknown>(array: T[]): T[] => {
    return [...new Set(array)];
};

// Validation Utilities
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};

// Color Utilities
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Performance Utilities
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void => {
    let timeout: any;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};
