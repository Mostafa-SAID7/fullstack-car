import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Check, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useFriendRequests } from '../hooks';
import { friendManagementService } from '../services';

export const FriendRequestsComponent: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const { requests, loading, error, refetch } = useFriendRequests(pageNumber);

  const handleAccept = async (requestId: string) => {
    try {
      await friendManagementService.acceptFriendRequest(requestId);
      refetch();
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await friendManagementService.rejectFriendRequest(requestId);
      refetch();
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
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

  if (!requests || requests.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No pending friend requests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-foreground">Pending Friend Requests</h3>
          <p className="text-sm text-muted-foreground">{requests.totalCount} pending requests</p>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {requests.items.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  {request.senderProfileImageUrl && (
                    <img
                      src={request.senderProfileImageUrl}
                      alt={`${request.senderFirstName} ${request.senderLastName}`}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {request.senderFirstName} {request.senderLastName}
                      {request.senderIsVerified && (
                        <CheckCircle className="w-4 h-4 inline ml-1 text-primary" />
                      )}
                    </p>
                    {request.message && (
                      <p className="text-xs text-muted-foreground mt-1">{request.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="btn btn-sm btn-success"
                    title="Accept request"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="btn btn-sm btn-outline"
                    title="Reject request"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {requests.totalPages > 1 && (
          <div className="card-footer">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Page {requests.pageNumber} of {requests.totalPages}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                  disabled={!requests.hasPreviousPage}
                  className="btn btn-sm btn-outline"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPageNumber(p => p + 1)}
                  disabled={!requests.hasNextPage}
                  className="btn btn-sm btn-outline"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
