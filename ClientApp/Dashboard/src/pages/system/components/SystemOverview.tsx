import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Monitor, Clock, Tag, Cpu } from 'lucide-react';

interface SystemOverviewProps {
    systemInfo: {
        hostname: string;
        os: string;
        uptime: string;
        version: string;
    };
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ systemInfo }) => {
    const items = [
        { label: 'Hostname', value: systemInfo.hostname, icon: Monitor, color: 'text-blue-500' },
        { label: 'OS Version', value: systemInfo.os, icon: Cpu, color: 'text-purple-500' },
        { label: 'Uptime', value: systemInfo.uptime, icon: Clock, color: 'text-green-500' },
        { label: 'Version', value: systemInfo.version, icon: Tag, color: 'text-orange-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
                <Card key={i}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-card border ${item.color.replace('text-', 'border-').replace('500', '200')}`}>
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className="font-semibold">{item.value}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
