import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, BarChart3, List, TrendingUp, Eye, Heart } from 'lucide-react';
import { ArticleAnalyticsComponent, ArticleListComponent } from '../components';
import { useArticles } from '../hooks/useArticles';
import { ArticleStatus } from '@/types/community/article';

const NewsManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { articles, loading } = useArticles({ pageNumber: 1, pageSize: 10 });

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
            id: 'articles',
            label: 'All Articles',
            icon: <List className="w-4 h-4" />
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                if (loading || !articles) {
                    return (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    );
                }

                const totalViews = articles.items.reduce((sum, a) => sum + a.viewsCount, 0);
                const totalLikes = articles.items.reduce((sum, a) => sum + a.likesCount, 0);
                const publishedArticles = articles.items.filter(a => a.status === ArticleStatus.Published).length;
                const featuredArticles = articles.items.filter(a => a.status === ArticleStatus.Featured).length;

                return (
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {articles.totalCount}
                                            </p>
                                        </div>
                                        <Newspaper className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Published</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {publishedArticles}
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
                                            <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {totalViews.toLocaleString()}
                                            </p>
                                        </div>
                                        <Eye className="w-8 h-8 text-info" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Likes</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {totalLikes.toLocaleString()}
                                            </p>
                                        </div>
                                        <Heart className="w-8 h-8 text-warning" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Articles */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-foreground">Recent Articles</h3>
                                <p className="text-sm text-muted-foreground">Latest articles in your community</p>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {articles.items.slice(0, 5).map((article) => (
                                        <div key={article.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                                            {article.imageUrl ? (
                                                <img
                                                    src={article.imageUrl}
                                                    alt={article.title}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                                                    <Newspaper className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {article.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    By {article.authorFirstName} {article.authorLastName} • {new Date(article.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Eye className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm text-foreground">{article.viewsCount}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'analytics':
                return <ArticleAnalyticsComponent />;
            case 'articles':
                return <ArticleListComponent />;
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
                <h1 className="text-3xl font-bold text-foreground">News Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage and monitor community news and articles
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

export default NewsManagement;
