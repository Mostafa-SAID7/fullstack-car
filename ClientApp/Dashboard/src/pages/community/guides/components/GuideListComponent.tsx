import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trash2, Edit, Star, Eye, Bookmark, Clock } from 'lucide-react';
import { useGuides } from '../hooks/useGuides';
import { guideManagementService } from '../services/GuideManagementService';
import { GuideCategory, GuideDifficulty } from '@/types/community/guide';

export const GuideListComponent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<number | undefined>();
  const [filterDifficulty, setFilterDifficulty] = useState<number | undefined>();

  const { guides, loading, error, refetch } = useGuides({
    pageNumber: currentPage,
    pageSize,
    category: filterCategory,
    difficulty: filterDifficulty
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && guides) {
      setSelectedIds(guides.items.map(g => g.id));
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
    if (selectedIds.length === 0 || !confirm(`Delete ${selectedIds.length} guide(s)?`)) return;
    try {
      await guideManagementService.bulkDelete(selectedIds);
      setSelectedIds([]);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete guides');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this guide?')) return;
    try {
      await guideManagementService.deleteGuide(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete guide');
    }
  };

  const getCategoryName = (category: GuideCategory): string => {
    switch (category) {
      case GuideCategory.Maintenance: return 'Maintenance';
      case GuideCategory.Repair: return 'Repair';
      case GuideCategory.Modification: return 'Modification';
      case GuideCategory.Cleaning: return 'Cleaning';
      case GuideCategory.Inspection: return 'Inspection';
      case GuideCategory.Installation: return 'Installation';
      case GuideCategory.Troubleshooting: return 'Troubleshooting';
      default: return 'Unknown';
    }
  };

  const getDifficultyName = (difficulty: GuideDifficulty): string => {
    switch (difficulty) {
      case GuideDifficulty.Beginner: return 'Beginner';
      case GuideDifficulty.Intermediate: return 'Intermediate';
      case GuideDifficulty.Advanced: return 'Advanced';
      case GuideDifficulty.Expert: return 'Expert';
      default: return 'Unknown';
    }
  };

  const getDifficultyColor = (difficulty: GuideDifficulty): string => {
    switch (difficulty) {
      case GuideDifficulty.Beginner: return 'bg-green-100 text-green-800';
      case GuideDifficulty.Intermediate: return 'bg-blue-100 text-blue-800';
      case GuideDifficulty.Advanced: return 'bg-orange-100 text-orange-800';
      case GuideDifficulty.Expert: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: GuideCategory): string => {
    switch (category) {
      case GuideCategory.Maintenance: return 'bg-blue-100 text-blue-800';
      case GuideCategory.Repair: return 'bg-red-100 text-red-800';
      case GuideCategory.Modification: return 'bg-purple-100 text-purple-800';
      case GuideCategory.Cleaning: return 'bg-cyan-100 text-cyan-800';
      case GuideCategory.Inspection: return 'bg-yellow-100 text-yellow-800';
      case GuideCategory.Installation: return 'bg-green-100 text-green-800';
      case GuideCategory.Troubleshooting: return 'bg-orange-100 text-orange-800';
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

  if (!guides) return null;

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
              <option value={GuideCategory.Maintenance}>Maintenance</option>
              <option value={GuideCategory.Repair}>Repair</option>
              <option value={GuideCategory.Modification}>Modification</option>
              <option value={GuideCategory.Cleaning}>Cleaning</option>
              <option value={GuideCategory.Inspection}>Inspection</option>
              <option value={GuideCategory.Installation}>Installation</option>
              <option value={GuideCategory.Troubleshooting}>Troubleshooting</option>
            </select>

            <select
              value={filterDifficulty || ''}
              onChange={(e) => setFilterDifficulty(e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2 border border-border rounded-md text-sm"
            >
              <option value="">All Difficulties</option>
              <option value={GuideDifficulty.Beginner}>Beginner</option>
              <option value={GuideDifficulty.Intermediate}>Intermediate</option>
              <option value={GuideDifficulty.Advanced}>Advanced</option>
              <option value={GuideDifficulty.Expert}>Expert</option>
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

      {/* Guides Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === guides.items.length && guides.items.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Bookmarks</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {guides.items.map((guide) => (
                  <tr key={guide.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(guide.id)}
                        onChange={(e) => handleSelectOne(guide.id, e.target.checked)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {guide.imageUrl ? (
                          <img
                            src={guide.imageUrl}
                            alt={guide.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">{guide.title}</p>
                          <p className="text-xs text-muted-foreground">
                            By {guide.userFirstName} {guide.userLastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(guide.category)}`}>
                        {getCategoryName(guide.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                        {getDifficultyName(guide.difficulty)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{guide.estimatedTime} min</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-foreground">{guide.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({guide.ratingsCount})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>{guide.viewsCount}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Bookmark className="w-4 h-4" />
                        <span>{guide.bookmarksCount}</span>
                      </div>
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
                          onClick={() => handleDelete(guide.id)}
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
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, guides.totalCount)} of {guides.totalCount} guides
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
            Page {currentPage} of {guides.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(guides.totalPages, p + 1))}
            disabled={currentPage === guides.totalPages}
            className="btn btn-sm"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};
