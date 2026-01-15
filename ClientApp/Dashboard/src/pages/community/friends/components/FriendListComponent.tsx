import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Trash2, Ban, AlertCircle, CheckCircle } from 'lucide-react';
import { useFriends } from '../hooks';
import { friendManagementService } from '../services';

export const FriendListComponent: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const { friends, loading, error, refetch } = useFriends({ pageNumber, pageSize: 20 });

  const handleRemove = async (friendId: string) => {
    if (confirm('Are you sure you want to remove this friend?')) {
      try {
        await friendManagementService.removeFriend(friendId);
        refetch();
      } catch (err) {
        console.error('Failed to remove friend:', err);
      }
    }
  };

  const handleBlock = async (userId: string) => {
    if (confirm('Are you sure you want to block this user?')) {
      try {
        await friendManagementService.blockUser(userId);
        refetch();
      } catch (err) {
        console.error('Failed to block user:', err);
      }
    }
  };

  const handleBulkRemove = async () => {
    if (selectedFriends.length === 0) return;
    if (confirm(`Are you sure you want to remove ${selectedFriends.length} friends?`)) {
      try {
        await friendManagementService.bulkRemoveFriends(selectedFriends);
        setSelectedFriends([]);
        refetch();
      } catch (err) {
        console.error('Failed to remove friends:', err);
      }
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFriends.length === friends?.items.length) {
      setSelectedFriends([]);
    } else {
      setSelectedFriends(friends?.items.map(f => f.id) || []);
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

  if (!friends || friends.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No friends found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedFriends.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium">
            {selectedFriends.length} friend{selectedFriends.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkRemove}
            className="btn btn-sm btn-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Selected
          </button>
        </div>
      )}

      {/* Friends Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedFriends.length === friends.items.length}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">User</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Friends Since</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {friends.items.map((friend) => (
                <motion.tr
                  key={friend.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend.id)}
                      onChange={() => toggleFriendSelection(friend.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      {friend.friendProfileImageUrl && (
                        <img
                          src={friend.friendProfileImageUrl}
                          alt={`${friend.friendFirstName} ${friend.friendLastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {friend.friendFirstName} {friend.friendLastName}
                          {friend.friendIsVerified && (
                            <CheckCircle className="w-4 h-4 inline ml-1 text-primary" />
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      friend.status === 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {friend.status === 2 ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {friend.acceptedAt 
                        ? new Date(friend.acceptedAt).toLocaleDateString()
                        : new Date(friend.createdAt).toLocaleDateString()
                      }
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBlock(friend.friendId)}
                        className="btn btn-sm btn-ghost text-warning"
                        title="Block user"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(friend.id)}
                        className="btn btn-sm btn-ghost text-destructive"
                        title="Remove friend"
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
            Showing {friends.items.length} of {friends.totalCount} friends
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={!friends.hasPreviousPage}
              className="btn btn-sm btn-outline"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {friends.pageNumber} of {friends.totalPages}
            </span>
            <button
              onClick={() => setPageNumber(p => p + 1)}
              disabled={!friends.hasNextPage}
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
