// Media Page Component Types

export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  dimensions?: { width: number; height: number };
  metadata?: Record<string, any>;
}

export interface MediaListProps {
  files: MediaFile[];
  onFileClick: (file: MediaFile) => void;
  onDelete: (fileId: string) => void;
  loading?: boolean;
  error?: string;
}

export interface MediaGridProps {
  files: MediaFile[];
  onFileClick: (file: MediaFile) => void;
  onDelete: (fileId: string) => void;
  loading?: boolean;
  error?: string;
  columns?: number;
}

export interface MediaHeaderProps {
  title?: string;
  description?: string;
  totalFiles?: number;
  totalSize?: number;
  onUpload?: () => void;
  onFilter?: (filter: string) => void;
}
