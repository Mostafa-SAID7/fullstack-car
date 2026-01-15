import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart3, List, TrendingUp } from 'lucide-react';
import { PostAnalyticsComponent, PostListComponent } from '../components';
import { usePostAnalytics } from '../hooks';

const PostsManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { analytics } = usePostAnalytics();

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
            id: 'posts',
            label: 'All Posts',
            icon: <List className="w-4 h-4" />
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {analytics?.totalPosts || 0}
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
                                                {analytics?.publishedPosts || 0}
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
                                                {analytics?.totalViews.toLocaleString() || 0}
                                            </p>
                                        </div>
                                        <BarChart3 className="w-8 h-8 text-info" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {analytics?.averageEngagement.toFixed(1) || 0}%
                                            </p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-warning" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-foreground">Recent Posts</h3>
                                <p className="text-sm text-muted-foreground">Latest posts in your community</p>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {analytics?.recentPosts.slice(0, 5).map((post) => (
                                        <div key={post.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                                            {post.imageUrl && (
                                                <img
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {post.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    By {post.userFirstName} {post.userLastName} • {new Date(post.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'analytics':
                return <PostAnalyticsComponent />;
            case 'posts':
                return <PostListComponent />;
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
                <h1 className="text-3xl font-bold text-foreground">Posts Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage and monitor community posts and content
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

export default PostsManagement;
