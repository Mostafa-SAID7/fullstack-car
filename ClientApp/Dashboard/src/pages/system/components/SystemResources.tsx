import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/layout/cards/Card';
import { HardDrive, Network } from 'lucide-react';

interface SystemResourcesProps {
    formatBytes: (bytes: number) => string;
}

export const SystemResources: React.FC<SystemResourcesProps> = ({ formatBytes }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-primary" />
                        Storage Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span>Primary Disk (SSD)</span>
                        <span className="font-mono">{formatBytes(500 * 1024 * 1024 * 1024)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span>Backup Storage</span>
                        <span className="font-mono">{formatBytes(2048 * 1024 * 1024 * 1024)}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Network className="w-5 h-5 text-primary" />
                        Network Interfaces
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span>eth0 (Public)</span>
                        <span className="text-green-600 text-sm font-medium">10 Gbps / Up</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <span>eth1 (Private)</span>
                        <span className="text-green-600 text-sm font-medium">1 Gbps / Up</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
