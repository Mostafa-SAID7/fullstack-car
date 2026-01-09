import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Video, 
  Mic, 
  Image, 
  X, 
  Check, 
  AlertCircle,
  FileVideo,
  FileAudio,
  Plus
} from 'lucide-react';
import { videoService } from '../../../services/media/VideoService';
import { podcastService } from '../../../services/media/PodcastService';
import { mediaService } from '../../../services/media/MediaService';
import type { VideoUploadRequest, PodcastUploadRequest } from '../../../services/media/types';

type UploadType = 'video' | 'podcast';

interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
  uploadSpeed?: string;
  timeRemaining?: string;
  bytesUploaded?: number;
  totalBytes?: number;
}

export const MediaUpload = () => {
  const [uploadType, setUploadType] = useState<UploadType>('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });

  // Upload tracking state
  const [uploadStartTime, setUploadStartTime] = useState<number>(0);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    isPublic: true,
    allowComments: true,
    allowDownload: false, // For podcasts
    quality: 'HD', // For videos
    episodeNumber: undefined as number | undefined,
    seasonNumber: undefined as number | undefined,
    seriesId: '',
    transcript: ''
  });

  const [tagInput, setTagInput] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      
      if (uploadType === 'video' && !isVideo) {
        alert('Please select a video file');
        return;
      }
      
      if (uploadType === 'podcast' && !isAudio) {
        alert('Please select an audio file');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
    } else {
      alert('Please select an image file');
    }
  };

  const calculateUploadStats = (progress: number, fileSize: number) => {
    const now = Date.now();
    const elapsed = (now - uploadStartTime) / 1000; // seconds
    const bytesUploaded = (progress / 100) * fileSize;
    
    if (elapsed > 0 && progress > 0) {
      const uploadSpeed = bytesUploaded / elapsed; // bytes per second
      const remainingBytes = fileSize - bytesUploaded;
      const timeRemaining = remainingBytes / uploadSpeed; // seconds
      
      return {
        uploadSpeed: formatSpeed(uploadSpeed),
        timeRemaining: formatTime(timeRemaining),
        bytesUploaded,
        totalBytes: fileSize
      };
    }
    
    return {
      uploadSpeed: '0 B/s',
      timeRemaining: 'Calculating...',
      bytesUploaded,
      totalBytes: fileSize
    };
  };

  const formatSpeed = (bytesPerSecond: number): string => {
    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    let size = bytesPerSecond;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return 'Calculating...';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      setUploadStartTime(Date.now());
      setUploadProgress({ 
        progress: 0, 
        status: 'uploading',
        message: 'Preparing upload...',
        bytesUploaded: 0,
        totalBytes: selectedFile.size
      });

      // Upload thumbnail first if provided
      if (thumbnailFile) {
        setUploadProgress(prev => ({ 
          ...prev, 
          progress: 5, 
          message: 'Uploading thumbnail...' 
        }));
        await mediaService.uploadThumbnail(thumbnailFile);
      }

      setUploadProgress(prev => ({ 
        ...prev, 
        progress: thumbnailFile ? 10 : 5, 
        message: 'Uploading media file...' 
      }));

      const onProgress = (progress: { loaded: number; total: number; percentage: number }) => {
        const stats = calculateUploadStats(progress.percentage, selectedFile.size);
        setUploadProgress(prev => ({
          ...prev,
          progress: Math.max(prev.progress, progress.percentage),
          message: `Uploading... ${progress.percentage}%`,
          uploadSpeed: stats.uploadSpeed,
          timeRemaining: stats.timeRemaining,
          bytesUploaded: stats.bytesUploaded,
          totalBytes: stats.totalBytes
        }));
      };

      if (uploadType === 'video') {
        const videoRequest: VideoUploadRequest = {
          title: formData.title,
          description: formData.description,
          quality: formData.quality,
          tags: formData.tags,
          isPublic: formData.isPublic,
          allowComments: formData.allowComments
        };

        await videoService.uploadVideo(selectedFile, videoRequest, onProgress);
      } else {
        const podcastRequest: PodcastUploadRequest = {
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          isPublic: formData.isPublic,
          allowComments: formData.allowComments,
          allowDownload: formData.allowDownload,
          episodeNumber: formData.episodeNumber,
          seasonNumber: formData.seasonNumber,
          seriesId: formData.seriesId || undefined,
          transcript: formData.transcript || undefined
        };

        await podcastService.uploadPodcast(selectedFile, podcastRequest, onProgress);
      }

      setUploadProgress({ 
        progress: 100, 
        status: 'success', 
        message: `${uploadType === 'video' ? 'Video' : 'Podcast'} uploaded successfully!`,
        bytesUploaded: selectedFile.size,
        totalBytes: selectedFile.size
      });

      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setThumbnailFile(null);
        setFormData({
          title: '',
          description: '',
          tags: [],
          isPublic: true,
          allowComments: true,
          allowDownload: false,
          quality: 'HD',
          episodeNumber: undefined,
          seasonNumber: undefined,
          seriesId: '',
          transcript: ''
        });
        setUploadProgress({ progress: 0, status: 'idle' });
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress({ 
        progress: 0, 
        status: 'error', 
        message: 'Upload failed. Please try again.' 
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Upload Media</h2>
        <p className="text-muted-foreground">Upload videos and podcasts to your media library</p>
      </div>

      {/* Upload Type Selection */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setUploadType('video')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            uploadType === 'video' 
              ? 'bg-primary text-primary-foreground border-primary' 
              : 'hover:bg-muted'
          }`}
        >
          <Video className="w-4 h-4" />
          Video Upload
        </button>
        <button
          onClick={() => setUploadType('podcast')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            uploadType === 'podcast' 
              ? 'bg-primary text-primary-foreground border-primary' 
              : 'hover:bg-muted'
          }`}
        >
          <Mic className="w-4 h-4" />
          Podcast Upload
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Upload Section */}
          <div className="space-y-6">
            {/* Main File Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {uploadType === 'video' ? 'Video File' : 'Audio File'}
              </label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                {selectedFile ? (
                  <div className="flex items-center gap-3">
                    {uploadType === 'video' ? (
                      <FileVideo className="w-8 h-8 text-blue-500" />
                    ) : (
                      <FileAudio className="w-8 h-8 text-green-500" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Drop your {uploadType} file here
                    </p>
                    <p className="text-muted-foreground mb-4">
                      or click to browse files
                    </p>
                    <input
                      type="file"
                      accept={uploadType === 'video' ? 'video/*' : 'audio/*'}
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Select File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail (Optional)</label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                {thumbnailFile ? (
                  <div className="flex items-center gap-3">
                    <Image className="w-6 h-6 text-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium">{thumbnailFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(thumbnailFile.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setThumbnailFile(null)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      Select Thumbnail
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress.status !== 'idle' && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Upload Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {uploadProgress.progress}%
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      uploadProgress.status === 'success' 
                        ? 'bg-green-500' 
                        : uploadProgress.status === 'error'
                        ? 'bg-red-500'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${uploadProgress.progress}%` }}
                  />
                </div>

                {/* Upload Statistics */}
                {uploadProgress.status === 'uploading' && uploadProgress.uploadSpeed && (
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Speed:</span> {uploadProgress.uploadSpeed}
                    </div>
                    <div>
                      <span className="font-medium">Time remaining:</span> {uploadProgress.timeRemaining}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Uploaded:</span> {formatFileSize(uploadProgress.bytesUploaded || 0)} of {formatFileSize(uploadProgress.totalBytes || 0)}
                    </div>
                  </div>
                )}

                {uploadProgress.message && (
                  <div className={`flex items-center gap-2 text-sm ${
                    uploadProgress.status === 'success' 
                      ? 'text-green-600' 
                      : uploadProgress.status === 'error'
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                  }`}>
                    {uploadProgress.status === 'success' && <Check className="w-4 h-4" />}
                    {uploadProgress.status === 'error' && <AlertCircle className="w-4 h-4" />}
                    {uploadProgress.status === 'uploading' && (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                    {uploadProgress.message}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={`Enter ${uploadType} title`}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={`Describe your ${uploadType}`}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add tags"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Video-specific fields */}
            {uploadType === 'video' && (
              <div>
                <label className="block text-sm font-medium mb-2">Quality</label>
                <select
                  value={formData.quality}
                  onChange={(e) => setFormData(prev => ({ ...prev, quality: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="HD">HD (720p)</option>
                  <option value="FHD">Full HD (1080p)</option>
                  <option value="4K">4K (2160p)</option>
                </select>
              </div>
            )}

            {/* Podcast-specific fields */}
            {uploadType === 'podcast' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Episode Number</label>
                    <input
                      type="number"
                      value={formData.episodeNumber || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        episodeNumber: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Season Number</label>
                    <input
                      type="number"
                      value={formData.seasonNumber || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        seasonNumber: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Series ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.seriesId}
                    onChange={(e) => setFormData(prev => ({ ...prev, seriesId: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter series identifier"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Transcript (Optional)</label>
                  <textarea
                    value={formData.transcript}
                    onChange={(e) => setFormData(prev => ({ ...prev, transcript: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter podcast transcript"
                  />
                </div>
              </>
            )}

            {/* Settings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="isPublic" className="text-sm">Make public</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowComments"
                  checked={formData.allowComments}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="allowComments" className="text-sm">Allow comments</label>
              </div>

              {uploadType === 'podcast' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowDownload"
                    checked={formData.allowDownload}
                    onChange={(e) => setFormData(prev => ({ ...prev, allowDownload: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="allowDownload" className="text-sm">Allow download</label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedFile || uploadProgress.status === 'uploading'}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              {uploadProgress.status === 'uploading' 
                ? 'Uploading...' 
                : `Upload ${uploadType === 'video' ? 'Video' : 'Podcast'}`
              }
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};