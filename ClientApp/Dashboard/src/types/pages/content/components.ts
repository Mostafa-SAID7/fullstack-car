// Content Page Component Types

import type { ContentType } from '../../../components/forms/selects/ContentTypeSelector';

export interface ContentItem {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  status: 'published' | 'draft' | 'pending' | 'reported' | 'removed';
  type: ContentType;
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
    reports?: number;
  };
  thumbnail?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  excerpt?: string;
}

export interface ContentListProps {
  items: ContentItem[];
  loading?: boolean;
  error?: string;
  onItemClick?: (item: ContentItem) => void;
  onStatusChange?: (itemId: string, status: ContentItem['status']) => void;
  onDelete?: (itemId: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}
