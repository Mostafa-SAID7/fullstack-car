# Media Streaming Platform - Complete Integration Plan

## Overview

This comprehensive integration plan enhances the existing media streaming platform by implementing missing backend features, improving Dashboard admin capabilities, and creating seamless Main frontend integration. The plan follows Clean Architecture principles and ensures optimal performance, scalability, and user experience.

## Current State Analysis

### ✅ Existing Components
- Basic video and podcast controllers (v7.0 API)
- Dashboard video management interface
- Main frontend video detail component
- Basic CRUD o response formats
4. **Performance Optimizations** - Caching, streaming, and efficient data handling
5. **Modern UI/UX** - Responsive design with real-time updates and intuitive workflows

The plan ensures all components work together seamlessly while maintaining clean architecture principles and optimal performance. Would you like me to continue with Phase 3 (Main Frontend Integration) or focus on any specific aspect of the current implementation?ocessing...' : 'Upload Video'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
```

This comprehensive integration plan provides:

1. **Enhanced Backend Infrastructure** - Complete CQRS implementation with file upload, processing, streaming, and analytics
2. **Advanced Dashboard Admin Interface** - Full-featured video management with upload, analytics, and bulk operations
3. **Seamless Integration Points** - Proper API versioning and consistente || !state.title.trim() || state.uploading || state.processing}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {state.uploading || state.processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {state.uploading ? 'Uploading...' : state.processing ? 'Pr</div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t">
            <button
              onClick={handleClose}
              disabled={state.uploading || state.processing}
              className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!state.file="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
                              <span className="text-sm">Allow download</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.allowDownload}
                        onChange={(e) => setState(prev => ({ ...prev, allowDownload: e.target.checked }))}
                        disabled={state.uploading || state.processing}
                        classNamg-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
      tems-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.allowComments}
                        onChange={(e) => setState(prev => ({ ...prev, allowComments: e.target.checked }))}
                        disabled={state.uploading || state.processing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:rin-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Allow comments</span>
                    </div>
                    <label className="relative inline-flex ilic}
                        onChange={(e) => setState(prev => ({ ...prev, isPublic: e.target.checked }))}
                        disabled={state.uploading || state.processing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:leftlassName="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {state.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      <span className="text-sm">Make video public</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.isPub                  className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <h3 className="font-medium">Privacy & Settings</h3>
                  
                  <div c     <div className="flex flex-wrap gap-2">
                      {state.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            disabled={state.uploading || state.processing}
                        />
                    <button
                      onClick={handleAddTag}
                      disabled={!tagInput.trim() || state.uploading || state.processing}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <Tag className="w-4 h-4" />
                    </button>
                  </div>
                  {state.tags.length > 0 && (
               assName="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={state.uploading || state.processing}
       description: e.target.value }))}
                    placeholder="Enter video description"
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    disabled={state.uploading || state.processing}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div cl                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={state.uploading || state.processing}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={state.description}
                    onChange={(e) => setState(prev => ({ ...prev,   </div>
            )}

            {/* Video Details Form */}
            {state.file && (
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={state.title}
                    onChange={(e) => setState(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter video title"
 se 2s infinite' : 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {state.error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm text-destructive">{state.error}</p>
                          {state.uploading ? `${Math.round(state.uploadProgress)}%` : 'Please wait'}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: state.uploading ? `${state.uploadProgress}%` : '100%',
                          animation: state.processing ? 'pulton>
                  )}
                </div>

                {/* Upload Progress */}
                {(state.uploading || state.processing) && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {state.uploading ? 'Uploading...' : 'Processing...'}
                      </span>
                      <span className="text-sm text-muted-foreground">
         te.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(state.file.size)}
                    </p>
                  </div>
                  {!state.uploading && !state.processing && (
                    <button
                      onClick={() => setState(prev => ({ ...prev, file: null }))}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="w-4 h-4" />
                    </buto file here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: MP4, AVI, MOV, WebM, MKV (Max 2GB)
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <File className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{staActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'Drop your video here' : 'Upload a video'}
                </p>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your videe.uploading || state.processing}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* File Upload */}
            {!state.file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDrag.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card rounded-lg border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Upload Video</h2>
            <button
              onClick={handleClose}
              disabled={stat return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.uploading && !state.processing) {
      setState({
        file: null,
        title: '',
        description: '',
        tags: [],
        categoryId: '',
        isPublic: false,
        allowComments: true,
        allowDownload: false,
        uploading: false,
        uploadProgress: 0,
        processing: false,
        error: null
      });
      setTagInput('');
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0)     } else {
            setTimeout(pollProcessing, 2000);
          }
        } catch (error) {
          setTimeout(pollProcessing, 2000);
        }
      };

      setTimeout(pollProcessing, 2000);

    } catch (error) {
      setState(prev => ({
        ...prev,
        uploading: false,
        uploadProgress: 0,
        error: error instanceof Error ? error.message : 'Upload failed'
      }));
      showToast('Failed to upload video', 'error');
    }
  };

  const handleClose = () => {
    if (!stateeo = await videoService.getVideo(result.videoId);
          if (video.processingStatus === 'completed') {
            setState(prev => ({ ...prev, processing: false }));
            showToast('Video uploaded and processed successfully!', 'success');
            onSuccess();
          } else if (video.processingStatus === 'failed') {
            setState(prev => ({ 
              ...prev, 
              processing: false,
              error: 'Video processing failed. Please try again.'
            }));
     gs: state.tags,
        categoryId: state.categoryId || undefined,
        isPublic: state.isPublic,
        allowComments: state.allowComments,
        allowDownload: state.allowDownload,
        quality: 'high'
      });

      clearInterval(progressInterval);
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        uploadProgress: 100,
        processing: true 
      }));

      // Poll for processing status
      const pollProcessing = async () => {
        try {
          const vid = async () => {
    if (!state.file) return;

    try {
      setState(prev => ({ ...prev, uploading: true, error: null }));

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + Math.random() * 10, 90)
        }));
      }, 500);

      const result = await videoService.uploadVideo(state.file, {
        title: state.title,
        description: state.description,
        ta'.webm', '.mkv']
    },
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
    multiple: false
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !state.tags.includes(tagInput.trim())) {
      setState(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleUploadll
  });

  const [tagInput, setTagInput] = useState('');
  const { showToast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setState(prev => ({
        ...prev,
        file,
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        error: null
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', load: boolean;
  uploading: boolean;
  uploadProgress: number;
  processing: boolean;
  error: string | null;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [state, setState] = useState<UploadState>({
    file: null,
    title: '',
    description: '',
    tags: [],
    categoryId: '',
    isPublic: false,
    allowComments: true,
    allowDownload: false,
    uploading: false,
    uploadProgress: 0,
    processing: false,
    error: nu,
  MessageCircle, Download
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { videoService } from '../../../../services/media/VideoService';
import { useToast } from '../../../../hooks/useToast';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadState {
  file: File | null;
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
  isPublic: boolean;
  allowComments: boolean;
  allowDownsModal}
        video={selectedVideo}
        onClose={() => {
          setShowAnalyticsModal(false);
          setSelectedVideo(null);
        }}
      />
    </motion.div>
  );
};
```

### 2.2 Video Upload Component

```typescript
// ClientApp/Dashboard/src/pages/media/components/VideoUploadModal.tsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, X, File, CheckCircle, AlertCircle, 
  Loader2, Play, Image, Tag, Globe, Lock
        onSuccess={() => {
          setShowUploadModal(false);
          loadVideos();
          loadAnalytics();
        }}
      />

      <VideoEditModal
        isOpen={showEditModal}
        video={selectedVideo}
        onClose={() => {
          setShowEditModal(false);
          setSelectedVideo(null);
        }}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedVideo(null);
          loadVideos();
        }}
      />

      <VideoAnalyticsModal
        isOpen={showAnalyticr! + 1)}
                    disabled={state.filters.pageNumber! >= totalPages}
                    className="px-3 py-2 border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}               disabled={state.filters.pageNumber === 1}
                    className="px-3 py-2 border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2">
                    Page {state.filters.pageNumber} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(state.filters.pageNumbeeen p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {((state.filters.pageNumber! - 1) * state.filters.pageSize!) + 1} to{' '}
                  {Math.min(state.filters.pageNumber! * state.filters.pageSize!, state.totalCount)} of {state.totalCount} videos
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, state.filters.pageNumber! - 1))}
     ideoSelect}
                onVideoAction={handleVideoAction}
              />
            ) : (
              <VideoTable
                videos={state.videos}
                selectedVideos={state.selectedVideos}
                onVideoSelect={handleVideoSelect}
                onSelectAll={handleSelectAll}
                onVideoAction={handleVideoAction}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-betwon
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Upload Video
              </button>
            </div>
          </div>
        ) : (
          <>
            {state.viewMode === 'grid' ? (
              <VideoCard
                videos={state.videos}
                selectedVideos={state.selectedVideos}
                onVideoSelect={handleV        >
                Try Again
              </button>
            </div>
          </div>
        ) : state.videos.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No videos found</p>
              <p className="text-muted-foreground mb-4">Upload your first video to get started</p>
              <butt8 h-8 animate-spin" />
          </div>
        ) : state.error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-medium">{state.error}</p>
              <button
                onClick={loadVideos}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      electedVideos.size > 0 && (
            <BulkActionsToolbar
              selectedCount={state.selectedVideos.size}
              onAction={handleBulkAction}
              onClear={() => setState(prev => ({ ...prev, selectedVideos: new Set() }))}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="bg-card rounded-lg border">
        {state.loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-: prev.viewMode === 'grid' ? 'table' : 'grid' }))}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              {state.viewMode === 'grid' ? 'Table View' : 'Grid View'}
            </button>
            
            <VideoFilters
              filters={state.filters}
              onFiltersChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {state.sted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setState(prev => ({ ...prev, viewModev className="text-xs text-muted-foreground">
                {state.analytics.engagementChange > 0 ? '+' : ''}{state.analytics.engagementChange}% vs last month
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                +{state.analytics.watchTimeThisMonth} this month
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium">Engagement</span>
              </div>
              <div className="text-2xl font-bold">{state.analytics.engagementRate}%</div>
              <di.analytics.viewsThisMonth.toLocaleString()} this month
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Watch Time</span>
              </div>
              <div className="text-2xl font-bold">{state.analytics.totalWatchTime}</div>
              <div className="text-xs text-mumonth
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Total Views</span>
              </div>
              <div className="text-2xl font-bold">{state.analytics.totalViews.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                +{stated-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Total Videos</span>
              </div>
              <div className="text-2xl font-bold">{state.analytics.totalVideos.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                +{state.analytics.newVideosThisMonth} this -muted-foreground">Manage and organize your video content</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </button>
        </div>

        {/* Analytics Cards */}
        {state.analytics && (
          <div className="grid grid-cols-1 md:gri, pageNumber: page }
    }));
  };

  const totalPages = Math.ceil(state.totalCount / (state.filters.pageSize || 12));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header with Analytics */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Video Management</h1>
            <p className="textprev, selectedVideos: new Set() }));
      loadVideos();
    } catch (error) {
      showToast(`Failed to ${action} selected videos`, 'error');
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<MediaFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters, pageNumber: 1 }
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filtersre you want to delete ${selectedIds.length} videos?`)) {
            await Promise.all(selectedIds.map(id => videoService.deleteVideo(id)));
            showToast(`${selectedIds.length} videos deleted successfully`, 'success');
          }
          break;
        case 'publish':
          await Promise.all(selectedIds.map(id => videoService.publishVideo(id)));
          showToast(`${selectedIds.length} videos published successfully`, 'success');
          break;
      }
      
      setState(prev => ({ ...ticsVideo);
            setShowAnalyticsModal(true);
          }
          break;
      }
      
      if (action !== 'edit' && action !== 'analytics') {
        loadVideos();
      }
    } catch (error) {
      showToast(`Failed to ${action} video`, 'error');
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    const selectedIds = Array.from(state.selectedVideos);
    
    try {
      switch (action) {
        case 'delete':
          if (window.confirm(`Are you suwait videoService.deleteVideo(videoId);
            showToast('Video deleted successfully', 'success');
          }
          break;
        case 'edit':
          const video = state.videos.find(v => v.id === videoId);
          if (video) {
            setSelectedVideo(video);
            setShowEditModal(true);
          }
          break;
        case 'analytics':
          const analyticsVideo = state.videos.find(v => v.id === videoId);
          if (analyticsVideo) {
            setSelectedVideo(analy     ...prev,
      selectedVideos: selected ? new Set(prev.videos.map(v => v.id)) : new Set()
    }));
  };

  // Handle video actions
  const handleVideoAction = async (action: string, videoId: string) => {
    try {
      switch (action) {
        case 'publish':
          await videoService.publishVideo(videoId);
          showToast('Video published successfully', 'success');
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this video?')) {
            aect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Handle video selection
  const handleVideoSelect = (videoId: string, selected: boolean) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedVideos);
      if (selected) {
        newSelected.add(videoId);
      } else {
        newSelected.delete(videoId);
      }
      return { ...prev, selectedVideos: newSelected };
    });
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    setState(prev => ({
        loading: false
      }));
      showToast('Failed to load videos', 'error');
    }
  }, [state.filters, debouncedSearchQuery, showToast]);

  // Load analytics dashboard
  const loadAnalytics = useCallback(async () => {
    try {
      const analytics = await videoService.getVideoDashboard();
      setState(prev => ({ ...prev, analytics }));
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  useEffos = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await videoService.getVideos({
        ...state.filters,
        search: debouncedSearchQuery || undefined
      });
      
      setState(prev => ({
        ...prev,
        videos: result.items,
        totalCount: result.totalCount,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load videos',
 Count: 0,
    analytics: null
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const { showToast } = useToast();

  // Load videos with current filters
  const loadVideboolean;
  error: string | null;
  selectedVideos: Set<string>;
  viewMode: 'grid' | 'table';
  filters: MediaFilters;
  totalCount: number;
  analytics: VideoAnalytics | null;
}

export const VideoManagement: React.FC = () => {
  const [state, setState] = useState<VideoManagementState>({
    videos: [],
    loading: true,
    error: null,
    selectedVideos: new Set(),
    viewMode: 'grid',
    filters: {
      pageNumber: 1,
      pageSize: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    },
    totalicsModal';
import { BulkActionsToolbar } from './components/BulkActionsToolbar';
import { VideoFilters } from './components/VideoFilters';
import { VideoCard } from './components/VideoCard';
import { VideoTable } from './components/VideoTable';
import { useToast } from '../../../hooks/useToast';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Video as VideoType, MediaFilters, VideoAnalytics } from '../../../types/media';

interface VideoManagementState {
  videos: VideoType[];
  loading: ion';
import { 
  Video, Upload, Play, Pause, Edit, Trash2, Eye, Heart, 
  MessageCircle, Calendar, Clock, Search, Filter, Plus, 
  MoreHorizontal, Settings, BarChart3, Download, Share2,
  CheckCircle, XCircle, AlertCircle, Loader2
} from 'lucide-react';
import { videoService } from '../../../services/media/VideoService';
import { VideoUploadModal } from './components/VideoUploadModal';
import { VideoEditModal } from './components/VideoEditModal';
import { VideoAnalyticsModal } from './components/VideoAnalyt   var query = new GetTrendingVideosQuery 
        { 
            Count = count, 
            Days = days 
        };
        
        var result = await Mediator.Send(query);
        return HandleResult(result);
    }
}
```

## Phase 2: Dashboard Admin Enhancement (Weeks 5-8)

### 2.1 Enhanced Video Management Interface

```typescript
// ClientApp/Dashboard/src/pages/media/VideoManagement.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motmQuery] AnalyticsPeriod period = AnalyticsPeriod.LastMonth)
    {
        var query = new GetVideoAnalyticsQuery 
        { 
            VideoId = id, 
            Period = period 
        };
        
        var result = await Mediator.Send(query);
        return HandleResult(result);
    }

    [HttpGet("analytics/trending")]
    [OutputCache(PolicyName = "MediumCache")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTrendingVideos([FromQuery] int count = 10, [FromQuery] int days = 7)
    {
     lytics/dashboard")]
    [OutputCache(PolicyName = "UserSpecific")]
    public async Task<IActionResult> GetAnalyticsDashboard([FromQuery] AnalyticsPeriod period = AnalyticsPeriod.LastMonth)
    {
        var query = new GetVideoAnalyticsDashboardQuery { Period = period };
        var result = await Mediator.Send(query);
        return HandleResult(result);
    }

    [HttpGet("{id:guid}/analytics")]
    [OutputCache(PolicyName = "ShortCache")]
    public async Task<IActionResult> GetVideoAnalytics(Guid id, [Froew RecordVideoViewCommand
        {
            VideoId = id,
            WatchDuration = request.WatchDuration,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        };

        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
}

// WebAPI/Controllers/v7/Media/VideoAnalyticsController.cs
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/videos")]
[Authorize]
public class VideoAnalyticsController : BaseApiController
{
    [HttpGet("anapublic async Task<IActionResult> GetHlsPlaylist(Guid id)
    {
        var query = new GetHlsPlaylistQuery { VideoId = id };
        var result = await Mediator.Send(query);
        
        if (result.Succeeded)
        {
            return Content(result.Data.PlaylistContent, "application/vnd.apple.mpegurl");
        }

        return NotFound();
    }

    [HttpPost("{id:guid}/view")]
    public async Task<IActionResult> RecordView(Guid id, [FromBody] RecordViewRequest request)
    {
        var command = n] VideoQuality? quality = null)
    {
        var query = new GetVideoStreamQuery 
        { 
            VideoId = id, 
            Quality = quality ?? VideoQuality.Medium 
        };
        
        var result = await Mediator.Send(query);
        
        if (result.Succeeded)
        {
            return Redirect(result.Data.StreamUrl);
        }

        return NotFound();
    }

    [HttpGet("{id:guid}/hls/playlist.m3u8")]
    [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
    cessingStatusQuery { VideoId = id };
        var result = await Mediator.Send(query);
        return HandleResult(result);
    }
}

// WebAPI/Controllers/v7/Media/VideoStreamingController.cs
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/videos")]
[AllowAnonymous]
public class VideoStreamingController : BaseApiController
{
    [HttpGet("{id:guid}/stream")]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> StreamVideo(Guid id, [FromQuery      }

        return HandleResult(result);
    }

    [HttpPost("{id:guid}/process")]
    [Authorize(Roles = "Admin,ContentModerator")]
    public async Task<IActionResult> ProcessVideo(Guid id)
    {
        var command = new ProcessVideoCommand { VideoId = id };
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }

    [HttpGet("{id:guid}/processing-status")]
    public async Task<IActionResult> GetProcessingStatus(Guid id)
    {
        var query = new GetVideoProring>(),
            CategoryId = request.CategoryId,
            IsPublic = request.IsPublic,
            AllowComments = request.AllowComments,
            AllowDownload = request.AllowDownload
        };

        var result = await Mediator.Send(command);
        
        if (result.Succeeded)
        {
            return CreatedAtAction(
                nameof(VideosController.GetVideo),
                "Videos",
                new { id = result.Data.VideoId },
                HandleResult(result));
  * 1024 * 1024)] // 2GB limit
    [ProducesResponseType(typeof(ApiResponse<VideoUploadResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadVideo([FromForm] UploadVideoRequest request)
    {
        var command = new UploadVideoCommand
        {
            File = request.File,
            Title = request.Title,
            Description = request.Description,
            Tags = request.Tags ?? new List<stutPath).Length,
                Bitrate = quality.Bitrate,
                Resolution = $"{quality.Width}x{quality.Height}",
                Format = "mp4"
            });
        }

        return streams;
    }
}
```

### 1.3 Enhanced API Controllers

```csharp
// WebAPI/Controllers/v7/Media/VideoUploadController.cs
[ApiVersion("7.0")]
[Route("api/v{version:apiVersion}/media/videos")]
[Authorize]
public class VideoUploadController : BaseApiController
{
    [HttpPost("upload")]
    [RequestSizeLimit(2L * 1024  options
                .WithVideoCodec(VideoCodec.LibX264)
                .WithAudioCodec(AudioCodec.Aac)
                .WithVideoBitrate(quality.Bitrate)
                .Resize(quality.Width, quality.Height));

            var uploadResult = await _fileStorageService.UploadFileAsync(outputPath, "video/mp4");
            
            streams.Add(new VideoStreamInfo
            {
                Quality = quality.Quality,
                Url = uploadResult.Url,
                FileSize = new FileInfo(outp      new { Quality = VideoQuality.Low, Width = 640, Height = 360, Bitrate = 800 },
            new { Quality = VideoQuality.Medium, Width = 1280, Height = 720, Bitrate = 2500 },
            new { Quality = VideoQuality.High, Width = 1920, Height = 1080, Bitrate = 5000 }
        };

        foreach (var quality in qualities)
        {
            var outputPath = $"videos/{videoId}/{quality.Quality.ToString().ToLower()}.mp4";
            
            await FFMpeg.ConvertAsync(sourceUrl, outputPath, options =>enerate thumbnail at 10% of video duration
        await FFMpeg.SnapshotAsync(sourceUrl, thumbnailPath, TimeSpan.FromSeconds(10));
        
        // Upload to storage
        var uploadResult = await _fileStorageService.UploadFileAsync(thumbnailPath, "image/jpeg");
        
        return uploadResult.Url;
    }

    private async Task<List<VideoStreamInfo>> TranscodeVideoAsync(string sourceUrl, Guid videoId)
    {
        var streams = new List<VideoStreamInfo>();
        var qualities = new[]
        {
      mbnailUrl, streams, hlsUrl);
            
            _logger.LogInformation("Successfully processed video {VideoId}", videoId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to process video {VideoId}", videoId);
            await UpdateVideoProcessingErrorAsync(videoId, ex.Message);
        }
    }

    private async Task<string> GenerateThumbnailAsync(string sourceUrl, Guid videoId)
    {
        var thumbnailPath = $"thumbnails/{videoId}.jpg";
        
        // G    {
        try
        {
            // Generate thumbnail
            var thumbnailUrl = await GenerateThumbnailAsync(sourceUrl, videoId);
            
            // Transcode to multiple qualities
            var streams = await TranscodeVideoAsync(sourceUrl, videoId);
            
            // Generate HLS playlist
            var hlsUrl = await GenerateHlsPlaylistAsync(streams, videoId);
            
            // Update video entity
            await UpdateVideoProcessingResultAsync(videoId, thuo = mediaInfo.VideoStreams.Any()
        };
    }

    public async Task QueueForProcessingAsync(Guid videoId, string sourceUrl)
    {
        var message = new ProcessVideoMessage
        {
            VideoId = videoId,
            SourceUrl = sourceUrl,
            QueuedAt = DateTime.UtcNow
        };

        await _serviceBus.PublishAsync(message);
        _logger.LogInformation("Queued video {VideoId} for processing", videoId);
    }

    public async Task ProcessVideoAsync(Guid videoId, string sourceUrl)
wait FFProbe.AnalyseAsync(stream);
        
        return new MediaMetadata
        {
            Duration = mediaInfo.Duration,
            Width = mediaInfo.PrimaryVideoStream?.Width ?? 0,
            Height = mediaInfo.PrimaryVideoStream?.Height ?? 0,
            Bitrate = (int)(mediaInfo.PrimaryVideoStream?.BitRate ?? 0),
            FrameRate = mediaInfo.PrimaryVideoStream?.FrameRate ?? 0,
            Format = mediaInfo.Format.FormatName,
            HasAudio = mediaInfo.AudioStreams.Any(),
            HasVide
// Infrastructure/Services/Media/MediaProcessingService.cs
public class MediaProcessingService : IMediaProcessingService
{
    private readonly IServiceBus _serviceBus;
    private readonly ILogger<MediaProcessingService> _logger;
    private readonly MediaProcessingOptions _options;

    public async Task<MediaMetadata> ExtractMetadataAsync(IFormFile file)
    {
        using var stream = file.OpenReadStream();
        
        // Use FFMpegCore or similar library to extract metadata
        var mediaInfo = aContains(extension))
            errors.Add($"File type {extension} is not supported");
            
        // Check MIME type
        var allowedMimeTypes = new[] { "video/mp4", "video/avi", "video/quicktime", "video/webm", "video/x-matroska" };
        if (!allowedMimeTypes.Contains(file.ContentType))
            errors.Add($"MIME type {file.ContentType} is not supported");

        return new FileValidationResult
        {
            IsValid = !errors.Any(),
            Errors = errors
        };
    }
}
   }
    }

    private FileValidationResult ValidateVideoFile(IFormFile file)
    {
        var errors = new List<string>();
        
        // Check file size (2GB limit)
        if (file.Length > 2L * 1024 * 1024 * 1024)
            errors.Add("File size cannot exceed 2GB");
            
        // Check file extension
        var allowedExtensions = new[] { ".mp4", ".avi", ".mov", ".webm", ".mkv" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.    Title = video.Title,
                Status = video.Status.ToString(),
                ProcessingStatus = video.ProcessingStatus.ToString(),
                UploadUrl = uploadResult.Url,
                ThumbnailUrl = video.ThumbnailUrl
            };

            return Result<VideoUploadResponse>.Success(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading video");
            return Result<VideoUploadResponse>.Failure("Failed to upload video");
     st.CategoryId,
                request.IsPublic,
                request.AllowComments,
                request.AllowDownload);

            await _videoRepository.AddAsync(video, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Queue for processing
            await _mediaProcessingService.QueueForProcessingAsync(video.Id, uploadResult.Url);

            var response = new VideoUploadResponse
            {
                VideoId = video.Id,
                      $"videos/{userId}/{Guid.NewGuid()}", 
                cancellationToken);

            // Create video entity
            var video = Video.Create(
                request.Title,
                request.Description,
                userId,
                request.File.FileName,
                request.File.Length,
                metadata.Duration);

            video.UpdateMetadata(
                request.Title,
                request.Description,
                request.Tags,
                requeateVideoFile(request.File);
            if (!validationResult.IsValid)
                return Result<VideoUploadResponse>.Failure(validationResult.Errors);

            var userId = Guid.Parse(_currentUserService.UserId!);
            
            // Extract metadata
            var metadata = await _mediaProcessingService.ExtractMetadataAsync(request.File);
            
            // Upload file to storage
            var uploadResult = await _fileStorageService.UploadAsync(
                request.File, 
      e readonly IFileStorageService _fileStorageService;
    private readonly IMediaProcessingService _mediaProcessingService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<UploadVideoCommandHandler> _logger;

    public async Task<Result<VideoUploadResponse>> Handle(UploadVideoCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Validate file
            var validationResult = Valid.Empty;
    public List<string> Tags { get; init; } = new();
    public string? CategoryId { get; init; }
    public bool IsPublic { get; init; } = false;
    public bool AllowComments { get; init; } = true;
    public bool AllowDownload { get; init; } = false;
}

// Application/Features/Media/Upload/Handlers/UploadVideoCommandHandler.cs
public class UploadVideoCommandHandler : IRequestHandler<UploadVideoCommand, Result<VideoUploadResponse>>
{
    private readonly IVideoRepository _videoRepository;
    privat Url = url,
            FileSize = fileSize,
            Bitrate = bitrate,
            Resolution = resolution,
            Format = format
        };
    }
}
```

### 1.2 File Upload and Processing System

```csharp
// Application/Features/Media/Upload/Commands/UploadVideoCommand.cs
public record UploadVideoCommand : IRequest<Result<VideoUploadResponse>>
{
    public IFormFile File { get; init; } = null!;
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = stringnt Bitrate { get; private set; }
    public string Resolution { get; private set; } = string.Empty;
    public string Format { get; private set; } = string.Empty;
    
    public Video Video { get; private set; } = null!;
    
    public static VideoStream Create(Guid videoId, VideoQuality quality, string url, 
        long fileSize, int bitrate, string resolution, string format)
    {
        return new VideoStream(Guid.NewGuid())
        {
            VideoId = videoId,
            Quality = quality,
           ewCount++;
        
        var view = VideoView.Create(Id, userId, ipAddress, watchDuration);
        Views.Add(view);
        
        AddDomainEvent(new VideoViewedEvent(Id, userId, watchDuration));
    }
}

// Domain/Entities/Media/VideoStream.cs
public class VideoStream : Entity<Guid>
{
    public Guid VideoId { get; private set; }
    public VideoQuality Quality { get; private set; }
    public string Url { get; private set; } = string.Empty;
    public long FileSize { get; private set; }
    public iow;
            AddDomainEvent(new VideoProcessedEvent(Id, CreatorId));
        }
    }
    
    public void Publish()
    {
        if (ProcessingStatus != VideoProcessingStatus.Completed)
            throw new DomainException("Cannot publish video that is not fully processed");
            
        Status = VideoStatus.Published;
        AddDomainEvent(new VideoPublishedEvent(Id, CreatorId));
    }
    
    public void RecordView(Guid? userId, string ipAddress, TimeSpan? watchDuration = null)
    {
        Vi       Tags = tags;
        CategoryId = categoryId;
        IsPublic = isPublic;
        AllowComments = allowComments;
        AllowDownload = allowDownload;
        
        AddDomainEvent(new VideoUpdatedEvent(Id, CreatorId));
    }
    
    public void SetProcessingStatus(VideoProcessingStatus status, string? error = null)
    {
        ProcessingStatus = status;
        ProcessingError = error;
        
        if (status == VideoProcessingStatus.Completed)
        {
            ProcessedAt = DateTime.UtcNVideoProcessingStatus.Pending,
            IsPublic = false,
            AllowComments = true,
            AllowDownload = false
        };
        
        video.AddDomainEvent(new VideoCreatedEvent(video.Id, creatorId));
        return video;
    }
    
    // Business methods
    public void UpdateMetadata(string title, string description, List<string> tags, 
        string? categoryId, bool isPublic, bool allowComments, bool allowDownload)
    {
        Title = title;
        Description = description;
  Factory method
    public static Video Create(string title, string description, Guid creatorId, 
        string originalFileName, long fileSize, TimeSpan duration)
    {
        var video = new Video(Guid.NewGuid())
        {
            Title = title,
            Description = description,
            CreatorId = creatorId,
            OriginalFileName = originalFileName,
            FileSize = fileSize,
            Duration = duration,
            Status = VideoStatus.Draft,
            ProcessingStatus =  get; private set; }
    public string? DashManifestUrl { get; private set; }
    
    // Navigation properties
    public ApplicationUser Creator { get; private set; } = null!;
    public Category? Category { get; private set; }
    public List<VideoComment> Comments { get; private set; } = new();
    public List<VideoLike> Likes { get; private set; } = new();
    public List<VideoView> Views { get; private set; } = new();
    public List<PlaylistVideo> PlaylistVideos { get; private set; } = new();
    
    //; }
    public long CommentCount { get; private set; }
    public long ShareCount { get; private set; }
    public double AverageRating { get; private set; }
    
    // Processing properties
    public VideoProcessingStatus ProcessingStatus { get; private set; }
    public string? ProcessingError { get; private set; }
    public DateTime? ProcessedAt { get; private set; }
    
    // Streaming properties
    public List<VideoStream> Streams { get; private set; } = new();
    public string? HlsPlaylistUrl {us { get; private set; }
    public bool IsPublic { get; private set; }
    public bool AllowComments { get; private set; }
    public bool AllowDownload { get; private set; }
    public Guid CreatorId { get; private set; }
    public string? CategoryId { get; private set; }
    public List<string> Tags { get; private set; } = new();
    
    // Analytics properties
    public long ViewCount { get; private set; }
    public long LikeCount { get; private set; }
    public long DislikeCount { get; private sets Video : AggregateRoot<Guid>
{
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string? ThumbnailUrl { get; private set; }
    public string? PreviewUrl { get; private set; }
    public TimeSpan Duration { get; private set; }
    public long FileSize { get; private set; }
    public string OriginalFileName { get; private set; } = string.Empty;
    public VideoQuality Quality { get; private set; }
    public VideoStatus Statperations for media content
- Authentication and authorization framework

### ❌ Missing Components
- File upload and processing system
- Media transcoding and optimization
- Advanced analytics and reporting
- Real-time streaming capabilities
- Content discovery algorithms
- Comprehensive admin tools
- Mobile-optimized player
- Advanced search and filtering

## Phase 1: Backend Infrastructure Enhancement (Weeks 1-4)

### 1.1 Enhanced Media Domain Models

```csharp
// Domain/Entities/Media/Video.cs
public clas