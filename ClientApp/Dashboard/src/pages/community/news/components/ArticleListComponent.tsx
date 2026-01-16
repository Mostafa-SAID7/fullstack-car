import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Trash2, Edit, Eye, Heart, Share2, MessageCircle } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { articleManagementService } from '../services/ArticleManagementService';
import { ArticleCategory, ArticleStatus } from '@/types/community/article';

export const ArticleListComponent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<number | undefined>();
  const [filterStatus, setFilterStatus] = useState<number | undefined>();

  const { articles, loading, error, refetch } = useArticles({
    pageNumber: currentPage,
    pageSize,
    category: filterCategory,
    status: filterStatus
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && articles) {
      setSelectedIds(articles.items.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0 || !confirm(`Delete ${selectedIds.length} article(s)?`)) return;
    try {
      await articleManagementService.bulkDelete(selectedIds);
      setSelectedIds([]);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete articles');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await articleManagementService.deleteArticle(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete article');
    }
  };

  const getCategoryName = (category: ArticleCategory): string => {
    switch (category) {
      case ArticleCategory.Industry: return 'Industry';
      case ArticleCategory.Technology: return 'Technology';
      case ArticleCategory.Reviews: return 'Reviews';
      case ArticleCategory.Events: return 'Events';
      case ArticleCategory.Tips: return 'Tips';
      case ArticleCategory.Maintenance: return 'Maintenance';
      case ArticleCategory.Lifestyle: return 'Lifestyle';
      case ArticleCategory.Racing: return 'Racing';
      default: return 'Unknown';
    }
  };

  const getStatusName = (status: ArticleStatus): string => {
    switch (status) {
      case ArticleStatus.Draft: return 'Draft';
      case ArticleStatus.Published: return 'Published';
      case ArticleStatus.Archived: return 'Archived';
      case ArticleStatus.Featured: return 'Featured';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: ArticleStatus): string => {
    switch (status) {
      case ArticleStatus.Draft: return 'bg-yellow-100 text-yellow-800';
      case ArticleStatus.Published: return 'bg-green-100 text-green-800';
      case ArticleStatus.Archived: return 'bg-gray-100 text-gray-800';
      case ArticleStatus.Featured: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: ArticleCategory): string => {
    switch (category) {
      case ArticleCategory.Industry: return 'bg-blue-100 text-blue-800';
      case ArticleCategory.Technology: return 'bg-purple-100 text-purple-800';
      case ArticleCategory.Reviews: return 'bg-orange-100 text-orange-800';
      case ArticleCategory.Events: return 'bg-pink-100 text-pink-800';
      case ArticleCategory.Tips: return 'bg-green-100 text-green-800';
      case ArticleCategory.Maintenance: return 'bg-cyan-100 text-cyan-800';
      case ArticleCategory.Lifestyle: return 'bg-indigo-100 text-indigo-800';
      case ArticleCategory.Racing: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="card">
        <div className="card-body">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!articles) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Filters and Bulk Actions */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filters */}
            <select
              value={filterCategory || ''}
              onChange={(e) => setFilterCategory(e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2 border border-border rounded-md text-sm"
            >
              <option value="">All Categories</option>
              <option value={ArticleCategory.Industry}>Industry</option>
              <option value={ArticleCategory.Technology}>Technology</option>
              <option value={ArticleCategory.Reviews}>Reviews</option>
              <option value={ArticleCategory.Events}>Events</option>
              <option value={ArticleCategory.Tips}>Tips</option>
              <option value={ArticleCategory.Maintenance}>Maintenance</option>
              <option value={ArticleCategory.Lifestyle}>Lifestyle</option>
              <option value={ArticleCategory.Racing}>Racing</option>
            </select>

            <select
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2 border border-border rounded-md text-sm"
            >
              <option value="">All Statuses</option>
              <option value={ArticleStatus.Draft}>Draft</option>
              <option value={ArticleStatus.Published}>Published</option>
              <option value={ArticleStatus.Archived}>Archived</option>
              <option value={ArticleStatus.Featured}>Featured</option>
            </select>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="btn btn-sm btn-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === articles.items.length && articles.items.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Engagement</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Published</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.items.map((article) => (
                  <tr key={article.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(article.id)}
                        onChange={(e) => handleSelectOne(article.id, e.target.checked)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {article.imageUrl ? (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">{article.title}</p>
                          <p className="text-xs text-muted-foreground">
                            By {article.authorFirstName} {article.authorLastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {getCategoryName(article.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                        {getStatusName(article.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>{article.viewsCount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{article.likesCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="w-3 h-3" />
                          <span>{article.sharesCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{article.commentsCount}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-1 hover:bg-muted rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-1 hover:bg-destructive/10 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, articles.totalCount)} of {articles.totalCount} articles
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-sm"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {articles.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(articles.totalPages, p + 1))}
            disabled={currentPage === articles.totalPages}
            className="btn btn-sm"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};
