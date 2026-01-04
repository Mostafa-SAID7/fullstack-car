import React from 'react';
import { motion } from 'framer-motion';
import { FileImage, FileVideo, FileText, File, Download, Eye, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  dimensions?: { width: number; height: number };
}

interface MediaListProps {
  files: MediaFile[];
  onFileClick: (file: MediaFile) => void;
  onDelete: (fileId: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image': return FileImage;
    case 'video': return FileVideo;
    case 'document': return FileText;
    default: return File;
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case 'image': return 'text-blue-500';
    case 'video': return 'text-red-500';
    case 'document': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

export const MediaList: React.FC<MediaListProps> = ({ files, onFileClick, onDelete }) => {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-xl text-sm font-medium text-muted-foreground">
        <div className="col-span-6">Name</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-2">Date</div>
      </div>

      {/* Files */}
      {files.map((file, index) => {
        const Icon = getFileIcon(file.type);
        const colorClass = getFileColor(file.type);

        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group grid grid-cols-12 gap-4 px-4 py-4 bg-card border border-border/50 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => onFileClick(file)}
          >
            {/* File Info */}
            <div className="col-span-6 flex items-center gap-3">
              <div className="relative">
                {file.thumbnail ? (
                  <img
                    src={file.thumbnail}
                    alt={file.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className={cn("w-5 h-5", colorClass)} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-foreground truncate" title={file.name}>
                  {file.name}
                </p>
                {file.dimensions && (
                  <p className="text-xs text-muted-foreground">
                    {file.dimensions.width} × {file.dimensions.height}
                  </p>
                )}
              </div>
            </div>

            {/* Type */}
            <div className="col-span-2 flex items-center">
              <span className="text-sm text-muted-foreground capitalize">{file.type}</span>
            </div>

            {/* Size */}
            <div className="col-span-2 flex items-center">
              <span className="text-sm text-muted-foreground">{formatFileSize(file.size)}</span>
            </div>

            {/* Date */}
            <div className="col-span-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {new Date(file.uploadedAt).toLocaleDateString()}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Preview action
                  }}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download action
                  }}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file.id);
                  }}
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

