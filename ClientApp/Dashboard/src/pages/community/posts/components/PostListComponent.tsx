import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageSquare, MoreVertical, Trash2, Edit, AlertCircle } from 'lucide-react';
import { usePosts } from '../hooks';
import { postManagementService } from '../services';
import { PostDto } from '@/types/community/post';

export const PostListComponent: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const { posts, loading, error, refetch } = usePosts({ pageNumber, pageSize: 20 });

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await postManagementService.deletePost(postId);
        refetch();
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) {
      try {
        await postManagementService.bulkDelete(selectedPosts);
        setSelectedPosts([]);
        refetch();
      } catch (err) {
        console.error('Failed to delete posts:', err);
      }
    }
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === posts?.items.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts?.items.map(p => p.id) || []);
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

  if (!posts || posts.items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium">
            {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
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

      {/* Posts Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === posts.items.length}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Post</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Author</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Stats</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.items.map((post) => (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => togglePostSelection(post.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-start space-x-3">
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{post.content.substring(0, 60)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {post.userProfileImageUrl && (
                        <img
                          src={post.userProfileImageUrl}
                          alt={`${post.userFirstName} ${post.userLastName}`}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="text-sm text-foreground">
                        {post.userFirstName} {post.userLastName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.viewsCount}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {post.likesCount}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {post.commentsCount}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="btn btn-sm btn-ghost">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
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
            Showing {posts.items.length} of {posts.totalCount} posts
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              disabled={!posts.hasPreviousPage}
              className="btn btn-sm btn-outline"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">
              Page {posts.pageNumber} of {posts.totalPages}
            </span>
            <button
              onClick={() => setPageNumber(p => p + 1)}
              disabled={!posts.hasNextPage}
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
