import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, BarChart3, List, TrendingUp, Star, Eye, Clock } from 'lucide-react';
import { GuideAnalyticsComponent, GuideListComponent } from '../components';
import { useGuides } from '../hooks/useGuides';

const GuidesManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { guides, loading } = useGuides({ pageNumber: 1, pageSize: 10 });

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
            id: 'guides',
            label: 'All Guides',
            icon: <List className="w-4 h-4" />
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                if (loading || !guides) {
                    return (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    );
                }

                const totalViews = guides.items.reduce((sum, g) => sum + g.viewsCount, 0);
                const totalBookmarks = guides.items.reduce((sum, g) => sum + g.bookmarksCount, 0);
                const avgRating = guides.items.length > 0 
                    ? (guides.items.reduce((sum, g) => sum + g.rating, 0) / guides.items.length).toFixed(1)
                    : 0;
                const avgTime = guides.items.length > 0 
                    ? Math.round(guides.items.reduce((sum, g) => sum + g.estimatedTime, 0) / guides.items.length)
                    : 0;

                return (
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Guides</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {guides.totalCount}
                                            </p>
                                        </div>
                                        <BookOpen className="w-8 h-8 text-primary" />
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
                                            <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {totalViews.toLocaleString()}
                                            </p>
                                        </div>
                                        <Eye className="w-8 h-8 text-success" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Avg Time</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {avgTime} min
                                            </p>
                                        </div>
                                        <Clock className="w-8 h-8 text-info" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Guides */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-foreground">Recent Guides</h3>
                                <p className="text-sm text-muted-foreground">Latest guides in your community</p>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {guides.items.slice(0, 5).map((guide) => (
                                        <div key={guide.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                                            {guide.imageUrl ? (
                                                <img
                                                    src={guide.imageUrl}
                                                    alt={guide.title}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {guide.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    By {guide.userFirstName} {guide.userLastName} • {guide.estimatedTime} min
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-sm text-foreground">{guide.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'analytics':
                return <GuideAnalyticsComponent />;
            case 'guides':
                return <GuideListComponent />;
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
                <h1 className="text-3xl font-bold text-foreground">Guides Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage and monitor community guides and tutorials
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

export default GuidesManagement;
