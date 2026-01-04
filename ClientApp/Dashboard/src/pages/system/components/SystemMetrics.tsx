import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

interface Metrics {
    usage?: number;
    used?: number;
    total?: number;
    percentage?: number;
    cores?: number;
    in?: number;
    out?: number;
}

interface SystemMetricsProps {
    performanceMetrics: {
        cpu: Metrics;
        memory: Metrics;
        disk: Metrics;
        network: Metrics;
    };
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ performanceMetrics }) => {
    const getProgressColor = (value: number) => {
        if (value > 80) return 'bg-red-500';
        if (value > 60) return 'bg-yellow-500';
        return 'bg-blue-500';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CPU Usage */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold mb-2">{performanceMetrics.cpu.usage}%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getProgressColor(performanceMetrics.cpu.usage || 0)}`}
                            style={{ width: `${performanceMetrics.cpu.usage}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{performanceMetrics.cpu.cores} Cores Active</p>
                </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold mb-2">{performanceMetrics.memory.percentage}%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getProgressColor(performanceMetrics.memory.percentage || 0)}`}
                            style={{ width: `${performanceMetrics.memory.percentage}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {performanceMetrics.memory.used}GB / {performanceMetrics.memory.total}GB
                    </p>
                </CardContent>
            </Card>

            {/* Disk Usage */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Disk Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold mb-2">{performanceMetrics.disk.percentage}%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getProgressColor(performanceMetrics.disk.percentage || 0)}`}
                            style={{ width: `${performanceMetrics.disk.percentage}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {performanceMetrics.disk.used}GB / {performanceMetrics.disk.total}GB
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
