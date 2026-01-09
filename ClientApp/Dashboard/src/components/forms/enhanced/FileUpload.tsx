import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image, Video, Music, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../buttons/Button';
import { validateFile } from '../../../lib/validation';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  fileType?: 'image' | 'video' | 'audio' | 'any';
  onFilesChange?: (files: File[]) => void;
  onUploadProgress?: (progress: number, file: File) => void;
  onUploadComplete?: (file: File, url: string) => void;
  onUploadError?: (file: File, error: string) => void;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  uploadEndpoint?: string;
}

interface FileWithPreview extends File {
  preview?: string;
  progress?: number;
  error?: string;
  uploaded?: boolean;
  url?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  fileType = 'any',
  onFilesChange,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  className,
  disabled = false,
  showPreview = true,
  uploadEndpoint
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptString = () => {
    if (accept) return accept;
    
    switch (fileType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'audio':
        return 'audio/*';
      default:
        return '*/*';
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    if (file.type.startsWith('audio/')) return Music;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFiles = (fileList: File[]): FileWithPreview[] => {
    return fileList.map(file => {
      const fileWithPreview = file as FileWithPreview;
      
      // Size validation
      if (file.size > maxSize) {
        fileWithPreview.error = `File size exceeds ${formatFileSize(maxSize)}`;
        return fileWithPreview;
      }

      // Type validation
      if (fileType !== 'any') {
        const validation = validateFile(file, fileType);
        if (!validation.isValid) {
          fileWithPreview.error = Object.values(validation.errors)[0];
          return fileWithPreview;
        }
      }

      // Create preview for images
      if (showPreview && file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }

      return fileWithPreview;
    });
  };

  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    const totalFiles = files.length + selectedFiles.length;
    
    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validatedFiles = validateFiles(selectedFiles);
    const newFiles = multiple ? [...files, ...validatedFiles] : validatedFiles;
    
    setFiles(newFiles);
    onFilesChange?.(newFiles.filter(f => !f.error));
  }, [files, multiple, maxFiles, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  }, [disabled, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFileSelect(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange?.(newFiles.filter(f => !f.error));
  };

  const uploadFile = async (file: FileWithPreview, index: number) => {
    if (!uploadEndpoint) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, progress } : f
          ));
          onUploadProgress?.(progress, file);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFiles(prev => prev.map((f, i) => 
            i === index ? { ...f, uploaded: true, url: response.url, progress: 100 } : f
          ));
          onUploadComplete?.(file, response.url);
        } else {
          throw new Error('Upload failed');
        }
      });

      xhr.addEventListener('error', () => {
        setFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, error: 'Upload failed' } : f
        ));
        onUploadError?.(file, 'Upload failed');
      });

      xhr.open('POST', uploadEndpoint);
      xhr.send(formData);
    } catch (error) {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, error: 'Upload failed' } : f
      ));
      onUploadError?.(file, 'Upload failed');
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
          isDragOver && !disabled && 'border-primary bg-primary/5',
          !isDragOver && 'border-border hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Upload className={cn(
          'w-12 h-12 mx-auto mb-4 transition-colors',
          isDragOver ? 'text-primary' : 'text-muted-foreground'
        )} />
        
        <h3 className="text-lg font-medium text-foreground mb-2">
          {isDragOver ? 'Drop files here' : 'Upload files'}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop files here, or click to select files
        </p>
        
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          Select Files
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Maximum file size: {formatFileSize(maxSize)}</p>
          {multiple && <p>Maximum files: {maxFiles}</p>}
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file);
              
              return (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    'flex items-center gap-3 p-3 border rounded-lg bg-card',
                    file.error && 'border-destructive bg-destructive/5',
                    file.uploaded && 'border-green-500 bg-green-50'
                  )}
                >
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                    
                    {/* Progress Bar */}
                    {file.progress !== undefined && file.progress < 100 && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">
                            Uploading...
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(file.progress)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1">
                          <div
                            className="bg-primary h-1 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {file.error && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-destructive" />
                        <span className="text-xs text-destructive">{file.error}</span>
                      </div>
                    )}
                    
                    {/* Success Message */}
                    {file.uploaded && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">Uploaded successfully</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {uploadEndpoint && !file.uploaded && !file.error && file.progress === undefined && (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => uploadFile(file, index)}
                      >
                        Upload
                      </Button>
                    )}
                    
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;