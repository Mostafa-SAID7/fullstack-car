// File Upload Component - Upload documents to knowledge base

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { knowledgeService } from '../../../services/ai-agent';
import type { KnowledgeCategory } from '../../../types/ai-agent';
import { useToast } from '../../../hooks';

interface FileUploadProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface UploadFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onComplete,
  onCancel
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [category, setCategory] = useState<KnowledgeCategory>('maintenance');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: toastError } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map(file => ({
      file,
      status: 'pending' as const
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toastError('Please select at least one file');
      return;
    }

    setUploading(true);

    try {
      if (files.length === 1) {
        // Single file upload
        setFiles(prev => prev.map((f, i) => i === 0 ? { ...f, status: 'uploading' } : f));
        
        try {
          await knowledgeService.uploadDocument(files[0].file, category);
          setFiles(prev => prev.map((f, i) => i === 0 ? { ...f, status: 'success' } : f));
        } catch (error) {
          setFiles(prev => prev.map((f, i) => i === 0 ? {
            ...f,
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed'
          } : f));
        }
      } else {
        // Bulk upload
        setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const })));
        
        try {
          await knowledgeService.bulkUpload(files.map(f => f.file), category);
          setFiles(prev => prev.map(f => ({ ...f, status: 'success' as const })));
        } catch (error) {
          setFiles(prev => prev.map(f => ({
            ...f,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Upload failed'
          })));
        }
      }

      const successCount = files.filter(f => f.status === 'success').length;
      if (successCount > 0) {
        success(`${successCount} file(s) uploaded successfully`);
        
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toastError('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-border rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Upload Documents</h3>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
              disabled={uploading}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
            >
              <option value="maintenance">Maintenance</option>
              <option value="diagnostics">Diagnostics</option>
              <option value="buying_guide">Buying Guide</option>
              <option value="selling_tips">Selling Tips</option>
              <option value="modifications">Modifications</option>
              <option value="car_specs">Car Specs</option>
              <option value="community_help">Community Help</option>
            </select>
          </div>

          {/* File Drop Zone */}
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center mb-6 transition-colors ${
              uploading
                ? 'border-border bg-muted/20 cursor-not-allowed'
                : 'border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
            }`}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-semibold mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, TXT, MD, HTML files supported
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.txt,.md,.html,.htm"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2 mb-6">
              <h4 className="text-sm font-semibold text-foreground">
                Selected Files ({files.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((uploadFile, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    {getStatusIcon(uploadFile.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      {uploadFile.error && (
                        <p className="text-xs text-red-500 mt-1">
                          {uploadFile.error}
                        </p>
                      )}
                    </div>
                    {uploadFile.status === 'pending' && !uploading && (
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 rounded hover:bg-muted transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={uploading}
              className="flex-1 px-4 py-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {files.length > 0 && `(${files.length})`}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
