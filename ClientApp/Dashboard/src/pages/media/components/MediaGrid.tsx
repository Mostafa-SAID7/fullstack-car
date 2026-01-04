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

interface MediaGridProps {
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
    case 'image': return 'text-blue-500 bg-blue-50';
    case 'video': return 'text-red-500 bg-red-50';
    case 'document': return 'text-green-500 bg-green-50';
    default: return 'text-gray-500 bg-gray-50';
  }
};

export const MediaGrid: React.FC<MediaGridProps> = ({ files, onFileClick, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {files.map((file, index) => {
        const Icon = getFileIcon(file.type);
        const colorClass = getFileColor(file.type);

        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => onFileClick(file)}
          >
            {/* Thumbnail/Image Preview */}
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              {file.thumbnail ? (
                <img
                  src={file.thumbnail}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className={cn("w-full h-full flex items-center justify-center", colorClass)}>
                  <Icon className="w-12 h-12" />
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Preview action
                  }}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Eye className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download action
                  }}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Download className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file.id);
                  }}
                  className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* File type indicator */}
              <div className="absolute top-2 right-2">
                <div className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                  {file.type.toUpperCase()}
                </div>
              </div>
            </div>

            {/* File Info */}
            <div className="p-4">
              <h3 className="font-medium text-sm text-foreground truncate mb-1" title={file.name}>
                {file.name}
              </h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatFileSize(file.size)}</span>
                <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
              </div>
              {file.dimensions && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {file.dimensions.width} × {file.dimensions.height}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

