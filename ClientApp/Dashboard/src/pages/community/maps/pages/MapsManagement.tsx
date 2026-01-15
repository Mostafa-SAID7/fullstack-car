import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, BarChart3, List, TrendingUp, Star, CheckCircle } from 'lucide-react';
import { LocationAnalyticsComponent, LocationListComponent } from '../components';
import { useLocations } from '../hooks/useLocations';

const MapsManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { locations, loading } = useLocations({ pageNumber: 1, pageSize: 10 });

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: <BarChart3 className="w-4 h-4" />
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: <TrendingUp className="w-4 h-4" />
        },
        {
            id: 'locations',
            label: 'All Locations',
            icon: <List className="w-4 h-4" />
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                if (loading || !locations) {
                    return (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    );
                }

                const totalCheckIns = locations.items.reduce((sum, l) => sum + l.checkInsCount, 0);
                const totalReviews = locations.items.reduce((sum, l) => sum + l.reviewsCount, 0);
                const avgRating = locations.items.length > 0 
                    ? (locations.items.reduce((sum, l) => sum + l.rating, 0) / locations.items.length).toFixed(1)
                    : 0;

                return (
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Locations</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {locations.totalCount}
                                            </p>
                                        </div>
                                        <MapPin className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {avgRating}
                                            </p>
                                        </div>
                                        <Star className="w-8 h-8 text-yellow-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Check-ins</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {totalCheckIns.toLocaleString()}
                                            </p>
                                        </div>
                                        <CheckCircle className="w-8 h-8 text-success" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {totalReviews.toLocaleString()}
                                            </p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-info" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Locations */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-foreground">Recent Locations</h3>
                                <p className="text-sm text-muted-foreground">Latest locations in your community</p>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {locations.items.slice(0, 5).map((location) => (
                                        <div key={location.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                                            {location.imageUrls && location.imageUrls.length > 0 ? (
                                                <img
                                                    src={location.imageUrls[0]}
                                                    alt={location.name}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                                    <MapPin className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {location.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {location.city}, {location.country} • {location.checkInsCount} check-ins
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-sm text-foreground">{location.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'analytics':
                return <LocationAnalyticsComponent />;
            case 'locations':
                return <LocationListComponent />;
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Page Header */}
            <div className="border-b border-border pb-6">
                <h1 className="text-3xl font-bold text-foreground">Maps Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage and monitor community locations and maps
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-border">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                                ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }
                            `}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div>{renderTabContent()}</div>
        </motion.div>
    );
};

export default MapsManagement;
