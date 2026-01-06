import React, { useState, useMemo } from 'react';
import { Eye, ThumbsUp, MessageSquare, Clock, User, Image, Video, Flag, AlertTriangle } from 'lucide-react';
import { type ContentType } from '../../../../components/forms/selects/ContentTypeSelector';
import { Pagination } from '../../../../components/shared/Pagination';

interface ContentItem {
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
}

// Mock data for different content types
const mockContentData: Record<ContentType, ContentItem[]> = {
  page: [
    {
      id: '1',
      title: 'About Us Page',
      author: 'Admin',
      createdAt: '2024-01-15T10:30:00Z',
      status: 'published',
      type: 'page',
      stats: { views: 1250 },
      category: 'Static'
    },
    {
      id: '2',
      title: 'Contact Page',
      author: 'Admin',
      createdAt: '2024-01-14T15:20:00Z',
      status: 'published',
      type: 'page',
      stats: { views: 890 },
      category: 'Static'
    }
  ],
  post: [
    {
      id: '1',
      title: 'Complete Guide to Car Maintenance',
      author: 'John Doe',
      createdAt: '2024-01-15T10:30:00Z',
      status: 'published',
      type: 'post',
      stats: { views: 1250, likes: 45, comments: 12 },
      category: 'Maintenance'
    },
    {
      id: '2',
      title: 'Best Electric Vehicles for 2024',
      author: 'Jane Smith',
      createdAt: '2024-01-14T15:20:00Z',
      status: 'published',
      type: 'post',
      stats: { views: 890, likes: 32, comments: 8 },
      category: 'Reviews'
    },
    {
      id: '3',
      title: 'Winter Tire Guide',
      author: 'Mike Johnson',
      createdAt: '2024-01-13T09:15:00Z',
      status: 'draft',
      type: 'post',
      stats: { views: 0, likes: 0, comments: 0 },
      category: 'Safety'
    }
  ],
  article: [
    {
      id: '1',
      title: 'The Future of Electric Vehicles',
      author: 'Tech Writer',
      createdAt: '2024-01-15T11:00:00Z',
      status: 'published',
      type: 'article',
      stats: { views: 567, likes: 23 }
    },
    {
      id: '2',
      title: 'Understanding Car Insurance',
      author: 'Insurance Expert',
      createdAt: '2024-01-15T10:45:00Z',
      status: 'published',
      type: 'article',
      stats: { views: 234, likes: 15 }
    }
  ],
  media: [
    {
      id: '1',
      title: 'Car Detailing Tutorial.mp4',
      author: 'VideoMaker',
      createdAt: '2024-01-14T16:00:00Z',
      status: 'published',
      type: 'media',
      stats: { views: 567, likes: 23 },
      thumbnail: 'video'
    },
    {
      id: '2',
      title: 'Before/After Car Wash.jpg',
      author: 'PhotoExpert',
      createdAt: '2024-01-14T14:30:00Z',
      status: 'published',
      type: 'media',
      stats: { views: 234, likes: 15 },
      thumbnail: 'image'
    }
  ],
  document: [
    {
      id: '1',
      title: 'Car Maintenance Checklist.pdf',
      author: 'Mechanic',
      createdAt: '2024-01-10T08:00:00Z',
      status: 'published',
      type: 'document',
      stats: { views: 456 },
      category: 'Guide'
    },
    {
      id: '2',
      title: 'Insurance Policy Template.pdf',
      author: 'Admin',
      createdAt: '2024-01-09T10:00:00Z',
      status: 'published',
      type: 'document',
      stats: { views: 123 },
      category: 'Legal'
    }
  ],
  template: [
    {
      id: '1',
      title: 'Service Review Template',
      author: 'Admin',
      createdAt: '2024-01-01T00:00:00Z',
      status: 'published',
      type: 'template',
      stats: { views: 1200 },
      category: 'Review'
    },
    {
      id: '2',
      title: 'Event Announcement Template',
      author: 'Admin',
      createdAt: '2024-01-02T00:00:00Z',
      status: 'published',
      type: 'template',
      stats: { views: 890 },
      category: 'Event'
    }
  ],
  widget: [
    {
      id: '1',
      title: 'Car Price Calculator',
      author: 'Developer',
      createdAt: '2024-01-15T09:00:00Z',
      status: 'published',
      type: 'widget',
      stats: { views: 345 },
      category: 'Tool'
    },
    {
      id: '2',
      title: 'Fuel Efficiency Tracker',
      author: 'Developer',
      createdAt: '2024-01-14T16:30:00Z',
      status: 'published',
      type: 'widget',
      stats: { views: 234 },
      category: 'Tool'
    }
  ]
};

interface ContentListProps {
  contentType: ContentType;
}

export const ContentList: React.FC<ContentListProps> = ({ contentType }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const contentItems = mockContentData[contentType] || [];

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return contentItems.slice(startIndex, endIndex);
  }, [contentItems, currentPage, itemsPerPage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reported': return 'bg-red-100 text-red-800';
      case 'removed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (contentItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Content Found</h3>
        <p className="text-muted-foreground">There is no {contentType} content available at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {paginatedItems.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                  {item.thumbnail && (
                    <div className="flex-shrink-0">
                      {item.thumbnail === 'video' ? (
                        <Video className="w-4 h-4 text-red-500" />
                      ) : (
                        <Image className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  {item.category && (
                    <span className="px-2 py-1 bg-muted rounded-full text-xs">{item.category}</span>
                  )}
                </div>

                {item.stats && (
                  <div className="flex items-center gap-4 text-sm">
                    {item.stats.views !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>{item.stats.views}</span>
                      </div>
                    )}
                    {item.stats.likes !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{item.stats.likes}</span>
                      </div>
                    )}
                    {item.stats.comments !== undefined && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="w-4 h-4" />
                        <span>{item.stats.comments}</span>
                      </div>
                    )}
                    {item.stats.reports !== undefined && (
                      <div className="flex items-center gap-1 text-red-600">
                        <Flag className="w-4 h-4" />
                        <span>{item.stats.reports}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 ml-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                {item.priority && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={contentItems.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPageOptions={[5, 10, 20, 50]}
      />
    </div>
  );
};