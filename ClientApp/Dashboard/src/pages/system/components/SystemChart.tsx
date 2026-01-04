import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { generateMockChartData } from '../../../utils/helpers';

export const SystemChart: React.FC = () => {
    const chartData = generateMockChartData(24) as number[];

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Load History (24h)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full flex items-end gap-1">
                    {chartData.map((value, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
                            style={{ height: `${value}%` }}
                            title={`Time: ${i}:00 - Load: ${Math.round(value)}%`}
                        />
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:00</span>
                </div>
            </CardContent>
        </Card>
    );
};
