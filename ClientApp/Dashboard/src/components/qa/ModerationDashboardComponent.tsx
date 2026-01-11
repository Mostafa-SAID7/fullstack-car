import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Flag, 
  Eye, 
  Trash2, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  User,
  MessageSquare,
  RefreshCw,
  Ban,
  FileText
} from 'lucide-react';
import { Card } from '../layout/cards/Card';
import { Button } from '../forms/buttons/Button';
import { Input } from '../forms/inputs/Input';
import { DataTable } from '../shared/DataTable';
import { StatsCards } from '../shared';
import { Badge } from '../data-display/badges/Badge';
import { cn } from '../../lib/utils';
import type { 
  FlaggedContent
} from '../../types/qa/api-types';

interface ModerationDashboardComponentProps {
  className?: string;
}

export const ModerationDashboardComponent: React.FC<ModerationDashboardComponentProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'Question' | 'Answer'>('all');

  // Mock data for demonstration
  const mockFlaggedContent: FlaggedContent[] = [
    {
      id: '1',
      contentId: 'q123',
      contentType: 'Question',
      contentTitle: 'How to hack into systems?',
      flagReason: 'Inappropriate content',
      flaggedBy: 'user456',
      flaggedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'pending'
    },
    {
      id: '2',
      contentId: 'a456',
      contentType: 'Answer',
      contentTitle: 'Copy-pasted answer from Stack Overflow',
      flagReason: 'Spam/Duplicate',
      flaggedBy: 'user789',
      flaggedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      status: 'reviewed',
      moderatorNotes: 'Confirmed as duplicate content'
    },
    {
      id: '3',
      contentId: 'q789',
      contentType: 'Question',
      contentTitle: 'Offensive language in question',
      flagReason: 'Inappropriate language',
      flaggedBy: 'user123',
      flaggedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      status: 'resolved'
    }
  ];

  const mockModerationStats = [
    {
      label: 'Pending Reviews',
      value: '23',
      icon: Clock,
      change: '+5',
      changeType: 'neutral' as const,
      color: 'text-orange-600'
    },
    {
      label: 'Resolved Today',
      value: '18',
      icon: CheckCircle,
      change: '+12',
      changeType: 'positive' as const,
      color: 'text-green-600'
    },
    {
      label: 'Flagged Content',
      value: '41',
      icon: Flag,
      change: '-3',
      changeType: 'positive' as const,
      color: 'text-red-600'
    },
    {
      label: 'Active Moderators',
      value: '8',
      icon: Shield,
      change: '+1',
      changeType: 'positive' as const,
      color: 'text-blue-600'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFlaggedContent(mockFlaggedContent);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredContent = useMemo(() => {
    return flaggedContent.filter(item => {
      const matchesSearch = item.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.flagReason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesType = contentTypeFilter === 'all' || item.contentType === contentTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [flaggedContent, searchTerm, statusFilter, contentTypeFilter]);

  const handleBulkAction = async (action: 'approve' | 'delete' | 'flag') => {
    if (selectedItems.length === 0) return;
    
    console.log(`Performing bulk ${action} on items:`, selectedItems);
    // Implement bulk action logic
    setSelectedItems([]);
  };

  const handleItemAction = async (action: string, item: FlaggedContent) => {
    console.log(`Performing ${action} on item:`, item.id);
    // Implement individual action logic
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="secondary">Reviewed</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getContentTypeIcon = (type: string) => {
    return type === 'Question' ? <MessageSquare className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  const tableColumns = [
    {
      key: 'contentTitle',
      label: 'Content',
      sortable: true,
      render: (value: string, row: FlaggedContent) => (
        <div className="flex items-start gap-3">
          {getContentTypeIcon(row.contentType)}
          <div>
            <p className="font-medium truncate max-w-xs">{value}</p>
            <p className="text-sm text-muted-foreground">{row.contentType} • {row.contentId}</p>
          </div>
        </div>
      )
    },
    {
      key: 'flagReason',
      label: 'Reason',
      sortable: true
    },
    {
      key: 'flaggedBy',
      label: 'Flagged By',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          {value}
        </div>
      )
    },
    {
      key: 'flaggedAt',
      label: 'Flagged At',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString()
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    }
  ];

  const tableActions = [
    {
      label: 'View Content',
      action: 'view',
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: 'Approve',
      action: 'approve',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      label: 'Delete',
      action: 'delete',
      icon: <Trash2 className="w-4 h-4" />,
      variant: 'danger' as const
    },
    {
      label: 'Ban User',
      action: 'ban',
      icon: <Ban className="w-4 h-4" />,
      variant: 'danger' as const
    }
  ];

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Content Moderation
          </h2>
          <p className="text-muted-foreground">Review and moderate flagged content across your platform</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button>
            <Flag className="w-4 h-4 mr-2" />
            Flag Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={mockModerationStats} loading={false} />

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search flagged content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">All Types</option>
            <option value="Question">Questions</option>
            <option value="Answer">Answers</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('approve')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction('delete')}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          columns={tableColumns}
          data={filteredContent}
          loading={false}
          onRowAction={handleItemAction}
          actions={tableActions}
          showToggleColumns={true}
        />
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            High Priority
          </h3>
          <p className="text-muted-foreground mb-4">
            Content flagged multiple times or containing severe violations
          </p>
          <Button variant="outline" className="w-full">
            View High Priority ({mockFlaggedContent.filter(item => item.status === 'pending').length})
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Pending Review
          </h3>
          <p className="text-muted-foreground mb-4">
            Recently flagged content awaiting moderation
          </p>
          <Button variant="outline" className="w-full">
            Review Pending ({mockFlaggedContent.filter(item => item.status === 'pending').length})
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Ban className="w-5 h-5 text-red-600" />
            User Management
          </h3>
          <p className="text-muted-foreground mb-4">
            Manage user bans and reputation adjustments
          </p>
          <Button variant="outline" className="w-full">
            Manage Users
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ModerationDashboardComponent;