import { CheckCircle, Clock, XCircle, Pause, Play } from 'lucide-react';

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'success':
      return 'bg-green-100 text-green-600';
    case 'running':
    case 'active':
    case 'in-progress':
      return 'bg-blue-100 text-blue-600';
    case 'failed':
    case 'error':
      return 'bg-red-100 text-red-600';
    case 'paused':
    case 'stopped':
      return 'bg-yellow-100 text-yellow-600';
    case 'pending':
    case 'waiting':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export const getStatusIcon = (status: string) => {
  const iconProps = { className: 'w-4 h-4' };
  
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'success':
      return <CheckCircle {...iconProps} />;
    case 'running':
    case 'active':
    case 'in-progress':
      return <Play {...iconProps} />;
    case 'failed':
    case 'error':
      return <XCircle {...iconProps} />;
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

export const formatDuration = (duration: string): string => {
  // If duration is already formatted (e.g., "2h 15m"), return as is
  if (duration.includes('h') || duration.includes('m') || duration.includes('s')) {
    return duration;
  }
  
  // If duration is in seconds, format it
  const seconds = parseInt(duration);
  if (!isNaN(seconds)) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }
  
  return duration;
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

export const generateMockChartData = (type: string = 'line', points: number = 24) => {
  const labels = [];
  const data = [];
  
  // Generate time-based labels for the last 24 hours
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
      // Accuracy data should be between 0.8 and 1.0
      for (let i = 0; i < points; i++) {
        data.push(0.8 + Math.random() * 0.2);
      }
      break;
    case 'loss':
      // Loss data should decrease over time
      for (let i = 0; i < points; i++) {
        const baseLoss = 0.5 - (i / points) * 0.3;
        data.push(Math.max(0.05, baseLoss + (Math.random() - 0.5) * 0.1));
      }
      break;
    case 'throughput':
      // Throughput data (requests per second)
      for (let i = 0; i < points; i++) {
        data.push(100 + Math.random() * 50);
      }
      break;
    case 'response_time':
      // Response time in milliseconds
      for (let i = 0; i < points; i++) {
        data.push(50 + Math.random() * 100);
      }
      break;
    case 'memory':
      // Memory usage percentage
      for (let i = 0; i < points; i++) {
        data.push(40 + Math.random() * 30);
      }
      break;
    case 'cpu':
      // CPU usage percentage
      for (let i = 0; i < points; i++) {
        data.push(20 + Math.random() * 40);
      }
      break;
    default:
      // Default random data
      for (let i = 0; i < points; i++) {
        data.push(Math.random() * 100);
      }
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