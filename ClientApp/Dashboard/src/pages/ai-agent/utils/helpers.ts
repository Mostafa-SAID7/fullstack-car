// AI Agent specific utility functions
export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

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

export const formatAccuracy = (accuracy: number): string => {
    return `${(accuracy * 100).toFixed(1)}%`;
};

export const generateMockChartData = (type: string = 'accuracy', points: number = 24) => {
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

export const getStatusColor = (status: string): string => {
    const normalizedStatus = status?.toLowerCase();

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
