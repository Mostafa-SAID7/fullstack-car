import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Trash2, Eye, Edit, CheckCircle, XCircle } from 'lucide-react';
import { usePages } from '../hooks/usePages';
import { pageManagementService } from '../services/PageManagementService';
import { PageStatus, PageType } from '@/types/community/page';

export const PageListComponent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<number | undefined>();
  const [filterStatus, setFilterStatus] = useState<number | undefined>();

  const { pages, loading, error, refetch } = usePages({
    pageNumber: currentPage,
    pageSize,
    type: filterType,
    status: filterStatus
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && pages) {
      setSelectedIds(pages.items.map(p => p.id));
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
    if (selectedIds.length === 0 || !confirm(`Delete ${selectedIds.length} page(s)?`)) return;
    try {
      await pageManagementService.bulkDelete(selectedIds);
      setSelectedIds([]);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete pages');
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) return;
    try {
      await pageManagementService.bulkPublish(selectedIds);
      setSelectedIds([]);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to publish pages');
    }
  };

  const handleBulkUnpublish = async () => {
    if (selectedIds.length === 0) return;
    try {
      await pageManagementService.bulkUnpublish(selectedIds);
      setSelectedIds([]);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to unpublish pages');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page?')) return;
    try {
      await pageManagementService.deletePage(id);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to delete page');
    }
  };

  const getPageTypeName = (type: PageType): string => {
    switch (type) {
      case PageType.Article: return 'Article';
      case PageType.Guide: return 'Guide';
      case PageType.FAQ: return 'FAQ';
      case PageType.Policy: return 'Policy';
      case PageType.About: return 'About';
      case PageType.Help: return 'Help';
      default: return 'Unknown';
    }
  };

  const getPageStatusName = (status: PageStatus): string => {
    switch (status) {
      case PageStatus.Draft: return 'Draft';
      case PageStatus.Published: return 'Published';
      case PageStatus.Archived: return 'Archived';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: PageStatus): string => {
    switch (status) {
      case PageStatus.Draft: return 'bg-yellow-100 text-yellow-800';
      case PageStatus.Published: return 'bg-green-100 text-green-800';
      case PageStatus.Archived: return 'bg-gray-100 text-gray-800';
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

  if (!pages) return null;

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
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2 border border-border rounded-md text-sm"
            >
              <option value="">All Types</option>
              <option value={PageType.Article}>Article</option>
              <option value={PageType.Guide}>Guide</option>
              <option value={PageType.FAQ}>FAQ</option>
              <option value={PageType.Policy}>Policy</option>
              <option value={PageType.About}>About</option>
              <option value={PageType.Help}>Help</option>
            </select>

            <select
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2 border border-border rounded-md text-sm"
            >
              <option value="">All Statuses</option>
              <option value={PageStatus.Draft}>Draft</option>
              <option value={PageStatus.Published}>Published</option>
              <option value={PageStatus.Archived}>Archived</option>
            </select>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </span>
                <button
                  onClick={handleBulkPublish}
                  className="btn btn-sm btn-success"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Publish
                </button>
                <button
                  onClick={handleBulkUnpublish}
                  className="btn btn-sm btn-warning"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Unpublish
                </button>
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

      {/* Pages Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === pages.items.length && pages.items.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Author</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Created</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pages.items.map((page) => (
                  <tr key={page.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(page.id)}
                        onChange={(e) => handleSelectOne(page.id, e.target.checked)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{page.title}</p>
                          <p className="text-xs text-muted-foreground">/{page.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{getPageTypeName(page.type)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                        {getPageStatusName(page.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>{page.viewsCount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">
                        {page.authorFirstName} {page.authorLastName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {new Date(page.createdAt).toLocaleDateString()}
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
                          onClick={() => handleDelete(page.id)}
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
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pages.totalCount)} of {pages.totalCount} pages
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
            Page {currentPage} of {pages.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(pages.totalPages, p + 1))}
            disabled={currentPage === pages.totalPages}
            className="btn btn-sm"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};
