import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, BarChart3, List, TrendingUp, ThumbsUp } from 'lucide-react';
import { ReviewAnalyticsComponent, ReviewListComponent } from '../components';
import { useReviews } from '../hooks';

const ReviewsManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { reviews, loading } = useReviews({ pageNumber: 1, pageSize: 10 });

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
            id: 'reviews',
            label: 'All Reviews',
            icon: <List className="w-4 h-4" />
        }
    ];

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                if (loading || !reviews) {
                    return (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    );
                }

                const totalHelpful = reviews.items.reduce((sum, r) => sum + r.helpfulCount, 0);
                const verifiedReviews = reviews.items.filter(r => r.isVerified).length;
                const avgRating = reviews.items.length > 0 
                    ? (reviews.items.reduce((sum, r) => sum + r.rating, 0) / reviews.items.length).toFixed(1)
                    : 0;

                return (
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {reviews.totalCount}
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
                                            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {avgRating}
                                            </p>
                                        </div>
                                        <Star className="w-8 h-8 text-orange-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Helpful</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {totalHelpful.toLocaleString()}
                                            </p>
                                        </div>
                                        <ThumbsUp className="w-8 h-8 text-green-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Verified</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {verifiedReviews}
                                            </p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Reviews */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-foreground">Recent Reviews</h3>
                                <p className="text-sm text-muted-foreground">Latest reviews in your community</p>
                            </div>
                            <div className="card-body">
                                <div className="space-y-4">
                                    {reviews.items.slice(0, 5).map((review) => (
                                        <div key={review.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                                            {review.imageUrl && (
                                                <img
                                                    src={review.imageUrl}
                                                    alt={review.title}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {review.title}
                                                    </p>
                                                    {renderStars(review.rating)}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    By {review.userFirstName} {review.userLastName} • {new Date(review.createdAt).toLocaleDateString()}
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
                return <ReviewAnalyticsComponent />;
            case 'reviews':
                return <ReviewListComponent />;
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
                <h1 className="text-3xl font-bold text-foreground">Reviews Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage and monitor community reviews and ratings
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

export default ReviewsManagement;
