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
import { useTranslation, useRTL } from '../../hooks/useTranslation';
import type { 
  FlaggedContent
} from '../../types/qa/api-types';

interface ModerationDashboardComponentProps {
  className?: string;
}

export const ModerationDashboardComponent: React.FC<ModerationDashboardComponentProps> = ({ className }) => {
  const { t, ready: translationsReady } = useTranslation('qa');
  const { isRTL, getRTLClass } = useRTL();
  
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
      contentTitle: t('moderation.examples.inappropriate_question', 'How to hack into systems?'),
      flagReason: t('moderation.reasons.inappropriate_content', 'Inappropriate content'),
      flaggedBy: 'user456',
      flaggedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'pending'
    },
    {
      id: '2',
      contentId: 'a456',
      contentType: 'Answer',
      contentTitle: t('moderation.examples.duplicate_answer', 'Copy-pasted answer from Stack Overflow'),
      flagReason: t('moderation.reasons.spam_duplicate', 'Spam/Duplicate'),
      flaggedBy: 'user789',
      flaggedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      status: 'reviewed',
      moderatorNotes: t('moderation.notes.confirmed_duplicate', 'Confirmed as duplicate content')
    },
    {
      id: '3',
      contentId: 'q789',
      contentType: 'Question',
      contentTitle: t('moderation.examples.offensive_language', 'Offensive language in question'),
      flagReason: t('moderation.reasons.inappropriate_language', 'Inappropriate language'),
      flaggedBy: 'user123',
      flaggedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      status: 'resolved'
    }
  ];

  const mockModerationStats = [
    {
      label: t('moderation.stats.pending_reviews', 'Pending Reviews'),
      value: '23',
      icon: Clock,
      change: t('moderation.stats.today_change', { count: 5 }),
      changeType: 'neutral' as const,
      color: 'text-orange-600',
      subtitle: t('moderation.stats.response_rate', '85% response rate')
    },
    {
      label: t('moderation.stats.resolved_today', 'Resolved Today'),
      value: '18',
      icon: CheckCircle,
      change: t('moderation.stats.increase', { count: 12 }),
      changeType: 'positive' as const,
      color: 'text-green-600',
      subtitle: t('moderation.stats.acceptance_rate', '92% acceptance rate')
    },
    {
      label: t('moderation.stats.flagged_content', 'Flagged Content'),
      value: '41',
      icon: Flag,
      change: t('moderation.stats.decrease', { count: 3 }),
      changeType: 'positive' as const,
      color: 'text-red-600',
      subtitle: t('moderation.stats.total_flags', 'Total flags this week')
    },
    {
      label: t('moderation.stats.active_moderators', 'Active Moderators'),
      value: '8',
      icon: Shield,
      change: t('moderation.stats.increase', { count: 1 }),
      changeType: 'positive' as const,
      color: 'text-blue-600',
      subtitle: t('moderation.stats.online_now', 'Online now')
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
        return <Badge variant="warning">{t('moderation.status.pending', 'Pending')}</Badge>;
      case 'reviewed':
        return <Badge variant="secondary">{t('moderation.status.reviewed', 'Reviewed')}</Badge>;
      case 'resolved':
        return <Badge variant="success">{t('moderation.status.resolved', 'Resolved')}</Badge>;
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
      label: t('moderation.table.content', 'Content'),
      sortable: true,
      render: (value: string, row: FlaggedContent) => (
        <div className={cn(
          'flex items-start gap-3',
          getRTLClass('', 'flex-row-reverse')
        )}>
          {getContentTypeIcon(row.contentType)}
          <div>
            <p className="font-medium truncate max-w-xs">{value}</p>
            <p className="text-sm text-muted-foreground">
              {t(`content.${row.contentType.toLowerCase()}`, row.contentType)} • {row.contentId}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'flagReason',
      label: t('moderation.table.reason', 'Reason'),
      sortable: true
    },
    {
      key: 'flaggedBy',
      label: t('moderation.table.flagged_by', 'Flagged By'),
      sortable: true,
      render: (value: string) => (
        <div className={cn(
          'flex items-center gap-2',
          getRTLClass('', 'flex-row-reverse')
        )}>
          <User className="w-4 h-4" />
          {value}
        </div>
      )
    },
    {
      key: 'flaggedAt',
      label: t('moderation.table.flagged_at', 'Flagged At'),
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString(isRTL ? 'ar' : 'en-US')
    },
    {
      key: 'status',
      label: t('moderation.table.status', 'Status'),
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    }
  ];

  const tableActions = [
    {
      label: t('moderation.actions.view_content', 'View Content'),
      action: 'view',
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: t('moderation.actions.approve', 'Approve'),
      action: 'approve',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      label: t('moderation.actions.delete', 'Delete'),
      action: 'delete',
      icon: <Trash2 className="w-4 h-4" />,
      variant: 'danger' as const
    },
    {
      label: t('moderation.actions.ban_user', 'Ban User'),
      action: 'ban',
      icon: <Ban className="w-4 h-4" />,
      variant: 'danger' as const
    }
  ];

  if (loading || !translationsReady) {
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
        {translationsReady && (
          <div className="text-center text-muted-foreground">
            {t('common:loading', 'Loading...')}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
        getRTLClass('', 'flex-row-reverse')
      )}>
        <div>
          <h2 className={cn(
            'text-2xl font-bold text-foreground flex items-center gap-2',
            getRTLClass('', 'flex-row-reverse')
          )}>
            <Shield className="w-6 h-6" />
            {t('moderation.title', 'Content Moderation')}
          </h2>
          <p className="text-muted-foreground">
            {t('moderation.description', 'Review and moderate flagged content across your platform')}
          </p>
        </div>
        
        <div className={cn(
          'flex items-center gap-3',
          getRTLClass('', 'flex-row-reverse')
        )}>
          <Button variant="outline">
            <RefreshCw className={cn('w-4 h-4', getRTLClass('mr-2', 'ml-2'))} />
            {t('common:refresh', 'Refresh')}
          </Button>
          
          <Button>
            <Flag className={cn('w-4 h-4', getRTLClass('mr-2', 'ml-2'))} />
            {t('moderation.actions.flag_content', 'Flag Content')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={mockModerationStats} loading={false} />

      {/* Filters and Search */}
      <Card className="p-6">
        <div className={cn(
          'flex flex-col sm:flex-row gap-4 mb-6',
          getRTLClass('', 'sm:flex-row-reverse')
        )}>
          <div className="flex-1">
            <Input
              placeholder={t('moderation.search.placeholder', 'Search flagged content...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="all">{t('moderation.filters.all_status', 'All Status')}</option>
            <option value="pending">{t('moderation.status.pending', 'Pending')}</option>
            <option value="reviewed">{t('moderation.status.reviewed', 'Reviewed')}</option>
            <option value="resolved">{t('moderation.status.resolved', 'Resolved')}</option>
          </select>
          
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="all">{t('moderation.filters.all_types', 'All Types')}</option>
            <option value="Question">{t('content.questions', 'Questions')}</option>
            <option value="Answer">{t('content.answers', 'Answers')}</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className={cn(
            'flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg',
            getRTLClass('', 'flex-row-reverse')
          )}>
            <span className="text-sm font-medium">
              {t('moderation.bulk.items_selected', {
                count: selectedItems.length,
                s: selectedItems.length > 1 ? 's' : ''
              })}
            </span>
            <div className={cn(
              'flex items-center gap-2',
              getRTLClass('', 'flex-row-reverse')
            )}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('approve')}
              >
                <CheckCircle className={cn('w-4 h-4', getRTLClass('mr-1', 'ml-1'))} />
                {t('moderation.actions.approve', 'Approve')}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction('delete')}
              >
                <Trash2 className={cn('w-4 h-4', getRTLClass('mr-1', 'ml-1'))} />
                {t('moderation.actions.delete', 'Delete')}
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
          <h3 className={cn(
            'text-lg font-semibold mb-4 flex items-center gap-2',
            getRTLClass('', 'flex-row-reverse')
          )}>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            {t('moderation.quick_actions.high_priority.title', 'High Priority')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('moderation.quick_actions.high_priority.description', 'Content flagged multiple times or containing severe violations')}
          </p>
          <Button variant="outline" className="w-full">
            {t('moderation.quick_actions.high_priority.action', {
              count: mockFlaggedContent.filter(item => item.status === 'pending').length
            })}
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className={cn(
            'text-lg font-semibold mb-4 flex items-center gap-2',
            getRTLClass('', 'flex-row-reverse')
          )}>
            <Clock className="w-5 h-5 text-blue-600" />
            {t('moderation.quick_actions.pending_review.title', 'Pending Review')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('moderation.quick_actions.pending_review.description', 'Recently flagged content awaiting moderation')}
          </p>
          <Button variant="outline" className="w-full">
            {t('moderation.quick_actions.pending_review.action', {
              count: mockFlaggedContent.filter(item => item.status === 'pending').length
            })}
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className={cn(
            'text-lg font-semibold mb-4 flex items-center gap-2',
            getRTLClass('', 'flex-row-reverse')
          )}>
            <Ban className="w-5 h-5 text-red-600" />
            {t('moderation.quick_actions.user_management.title', 'User Management')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('moderation.quick_actions.user_management.description', 'Manage user bans and reputation adjustments')}
          </p>
          <Button variant="outline" className="w-full">
            {t('moderation.quick_actions.user_management.action', 'Manage Users')}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ModerationDashboardComponent;