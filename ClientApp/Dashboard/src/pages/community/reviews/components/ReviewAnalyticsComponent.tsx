import React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, TrendingUp, CheckCircle } from 'lucide-react';
import { useReviews } from '../hooks';

export const ReviewAnalyticsComponent: React.FC = () => {
  const { reviews, loading } = useReviews({ pageNumber: 1, pageSize: 100 });

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

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.items.filter(r => r.rating === rating).length,
    percentage: reviews.items.length > 0 
      ? ((reviews.items.filter(r => r.rating === rating).length / reviews.items.length) * 100).toFixed(0)
      : 0
  }));

  const stats = [
    {
      label: 'Total Reviews',
      value: reviews.totalCount,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      label: 'Average Rating',
      value: avgRating,
      icon: Star,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Total Helpful',
      value: totalHelpful.toLocaleString(),
      icon: ThumbsUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Verified Reviews',
      value: verifiedReviews,
      icon: CheckCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
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

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rating Distribution */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Rating Distribution</h3>
          <p className="text-sm text-muted-foreground">Breakdown of ratings</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 w-24">
                  <span className="text-sm font-medium text-foreground">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {count} ({percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Rated Reviews */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Top Rated Reviews</h3>
          <p className="text-sm text-muted-foreground">Highest rated reviews</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {reviews.items
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 10)
              .map((review) => (
                <div key={review.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                  {review.imageUrl && (
                    <img
                      src={review.imageUrl}
                      alt={review.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground truncate">{review.title}</h4>
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>By {review.userFirstName} {review.userLastName}</span>
                      <span className="flex items-center">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {review.helpfulCount} helpful
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
            {reviews.items
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 10)
              .map((review) => (
                <div key={review.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50">
                  {review.imageUrl && (
                    <img
                      src={review.imageUrl}
                      alt={review.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground truncate">{review.title}</h4>
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
};
