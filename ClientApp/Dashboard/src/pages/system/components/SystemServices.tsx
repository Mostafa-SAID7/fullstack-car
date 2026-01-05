import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/layout/cards/Card';
import { CheckCircle, XCircle } from 'lucide-react';
import type { SystemServicesProps } from '../../../types/pages/system';

export const SystemServices: React.FC<SystemServicesProps> = ({ systemInfo, getServiceStatus }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>System Services</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {systemInfo.services.map((service, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                            <div className="flex items-center gap-3">
                                {getServiceStatus(service.status) === 'success' ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <div>
                                    <div className="font-medium">{service.name}</div>
                                    {service.port && (
                                        <div className="text-xs text-muted-foreground">Port: {service.port}</div>
                                    )}
                                </div>
                            </div>
                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getServiceStatus(service.status) === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {service.status.toUpperCase()}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
