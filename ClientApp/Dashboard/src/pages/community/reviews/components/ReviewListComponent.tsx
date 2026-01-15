import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, Trash2, Edit, AlertCircle, CheckCircle } from 'lucide-react';
import { useReviews } from '../hooks';
import { reviewManagementService } from '../services';

export const ReviewListComponent: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const { reviews, loading, error, refetch } = useReviews({ pageNumber, pageSize: 20 });

  const handleDelete = async (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewManagementService.deleteReview(reviewId);
        refetch();
      } catch (err) {
        console.error('Failed to delete review:', err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedReviews.length} reviews?`)) {
      try {
        await reviewManagementService.bulkDelete(selectedReviews);
        setSelectedReviews([]);
        refetch();
      } catch (err) {
        console.error('Failed to delete reviews:', err);
      }
    }
  };

  const toggleReviewSelection = (reviewId: string) => {
    setSelectedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReviews.length === reviews?.items.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews?.items.map(r => r.id) || []);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No reviews found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium">
            {selectedReviews.length} review{selectedReviews.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="btn btn-sm btn-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Reviews Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReviews.length === reviews.items.length}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Review</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Author</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Rating</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Helpful</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.items.map((review) => (
                <motion.tr
                  key={review.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.id)}
                      onChange={() => toggleReviewSelection(review.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-start space-x-3">
                      {review.imageUrl && (
                        <img
                          src={review.imageUrl}
                          alt={review.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {review.title}
                          {review.isVerified && (
                            <CheckCircle className="w-4 h-4 inline ml-1 text-primary" />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{review.content.substring(0, 60)}...</p>
                        {review.carBrand && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {review.carBrand} {review.carModel} {review.carYear}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {review.userProfileImageUrl && (
                        <img
                          src={review.userProfileImageUrl}
                          alt={`${review.userFirstName} ${review.userLastName}`}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm text-foreground">
                        {review.userFirstName} {review.userLastName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {renderStars(review.rating)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{review.helpfulCount}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="btn btn-sm btn-ghost">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="btn btn-sm btn-ghost text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Showing {reviews.items.length} of {reviews.totalCount} reviews
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={!reviews.hasPreviousPage}
              className="btn btn-sm btn-outline"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {reviews.pageNumber} of {reviews.totalPages}
            </span>
            <button
              onClick={() => setPageNumber(p => p + 1)}
              disabled={!reviews.hasNextPage}
              className="btn btn-sm btn-outline"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
