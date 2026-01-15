import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart3, List, TrendingUp, Eye } from 'lucide-react';
import { PageAnalyticsComponent, PageListComponent } from '../components';
import { usePages } from '../hooks/usePages';
import { PageStatus } from '@/types/community/page';

const PagesManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { pages, loading } = usePages({ pageNumber: 1, pageSize: 10 });

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
            id: 'pages',
            label: 'All Pages',
            icon: <List className="w-4 h-4" />
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                if (loading || !pages) {
                    return (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    );
                }

                const totalViews = pages.items.reduce((sum, p) => sum + p.viewsCount, 0);
                const publishedPages = pages.items.filter(p => p.status === PageStatus.Published).length;
                const draftPages = pages.items.filter(p => p.status === PageStatus.Draft).length;

                return (
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Pages</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {pages.totalCount}
                                            </p>
                                        </div>
                                        <FileText className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Published</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {publishedPages}
                                            </p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-success" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {draftPages}
                                            </p>
                                        </div>
                                        <FileText className="w-8 h-8 text-warning" />
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
                                        <Eye className="w-8 h-8 text-info" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Pages */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-foreground">Recent Pages</h3>
                                <p className="text-sm text-muted-foreground">Latest pages in your community</p>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {pages.items.slice(0, 5).map((page) => (
                                        <div key={page.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                                            <FileText className="w-5 h-5 text-muted-foreground mt-1" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {page.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    By {page.authorFirstName} {page.authorLastName} • {new Date(page.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                                <Eye className="w-4 h-4" />
                                                <span>{page.viewsCount}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'analytics':
                return <PageAnalyticsComponent />;
            case 'pages':
                return <PageListComponent />;
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
                <h1 className="text-3xl font-bold text-foreground">Pages Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage and monitor community pages and content
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

export default PagesManagement;
