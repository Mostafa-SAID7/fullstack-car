import React from 'react';
import { Skeleton } from './Skeleton';

/**
 * Comprehensive skeleton loader for the entire dashboard page
 * Matches the actual dashboard layout structure
 */
export const DashboardSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Dashboard Header Skeleton */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    {/* Welcome message */}
                    <div className="space-y-2">
                        <Skeleton width={200} height={32} />
                        <Skeleton width={300} height={16} />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                        <Skeleton width={120} height={40} className="rounded-lg" />
                        <Skeleton width={120} height={40} className="rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Tab Navigation Skeleton */}
            <div className="bg-card border border-border/50 rounded-2xl p-2">
                <div className="flex gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} width={120} height={40} className="rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton width={40} height={40} className="rounded-lg" />
                            <Skeleton width={20} height={20} className="rounded-full" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton width="80%" height={24} />
                            <Skeleton width="60%" height={16} />
                            <div className="flex items-center space-x-2">
                                <Skeleton width={16} height={16} className="rounded" />
                                <Skeleton width="40%" height={12} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Controls Skeleton */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <Skeleton width={180} height={20} />
                        <Skeleton width={320} height={14} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton width={140} height={40} className="rounded-lg" />
                        <Skeleton width={140} height={40} className="rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Charts Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border/50 rounded-2xl p-6">
                        {/* Chart header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="space-y-2">
                                <Skeleton width={150} height={20} />
                                <Skeleton width={200} height={14} />
                            </div>
                            <Skeleton width={80} height={32} className="rounded-lg" />
                        </div>

                        {/* Chart area */}
                        <div className="space-y-4">
                            {/* Chart visualization */}
                            <div className="h-64 bg-muted/30 rounded-lg p-4">
                                <div className="h-full flex items-end justify-between gap-2">
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <div key={j} className="flex-1 flex flex-col items-center">
                                            <Skeleton
                                                width="100%"
                                                height={`${40 + Math.random() * 60}%`}
                                                className="rounded-t"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Chart legend */}
                            <div className="flex justify-center gap-6">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="flex items-center gap-2">
                                        <Skeleton width={12} height={12} className="rounded-full" />
                                        <Skeleton width={60} height={12} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;
