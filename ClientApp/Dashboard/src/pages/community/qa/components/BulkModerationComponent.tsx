import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  CheckSquare, 
  Square, 
  Trash2, 
  Ban, 
  Award,
  Users,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  X,
  Filter
} from 'lucide-react';
import { Card } from '../layout/cards/Card';
import { Button } from '../forms/buttons/Button';
import { Input } from '../forms/inputs/Input';
import { DataTable } from '../shared/DataTable';
import { Badge } from '../data-display/badges/Badge';
import { DynamicModal } from '../shared/DynamicModal';
import { cn } from '../../lib/utils';
import { useTranslation, useRTL } from '../../hooks/useTranslation';
import { qaService } from '../../services/qa/QAService';
import type { 
  UserModerationInfo,
  Question,
  Answer
} from '../../types/qa/api-types';
import type { FormField } from '../../types/shared';

interface BulkModerationComponentProps {
  className?: string;
}

interface BulkOperationResult {
  success: boolean;
  message: string;
  processedCount: number;
  failedCount: number;
  errors?: string[];
}

export const BulkModerationComponent: React.FC<BulkModerationComponentProps> = ({ className }) => {
  const { t, ready: translationsReady } = useTranslation('qa');
  const { isRTL, getRTLClass } = useRTL();
  
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [contentItems, setContentItems] = useState<(Question | Answer)[]>([]);
  const [userItems, setUserItems] = useState<UserModerationInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'Question' | 'Answer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'flagged' | 'banned'>('all');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [operationResult, setOperationResult] = useState<BulkOperationResult | null>(null);

  // Modal states
  const [showReputationModal, setShowReputationModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock data for demonstration - in real implementation, this would come from API
  const mockContentItems: (Question | Answer)[] = [
    {
      id: '1',
      title: 'How to implement authentication?',
      content: 'I need help with JWT authentication...',
      userId: 'user1',
      userName: 'John Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      voteScore: 5,
      viewCount: 150,
      category: 'Web Development',
      tags: ['authentication', 'jwt'],
      answerCount: 3,
      isClosed: false
    } as Question,
    {
      id: '2',
      questionId: '1',
      content: 'You can use JWT tokens for authentication...',
      userId: 'user2',
      userName: 'Jane Smith',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      voteScore: 8,
      isAccepted: true
    } as Answer
  ];

  const mockUserItems: UserModerationInfo[] = [
    {
      userId: 'user1',
      userName: 'John Doe',
      reputationScore: 1250,
      questionsAsked: 15,
      answersGiven: 32,
      flaggedContentCount: 0,
      moderationActions: [],
      isBanned: false
    },
    {
      userId: 'user2',
      userName: 'Jane Smith',
      reputationScore: 2850,
      questionsAsked: 8,
      answersGiven: 45,
      flaggedContentCount: 1,
      moderationActions: [],
      isBanned: false
    },
    {
      userId: 'user3',
      userName: 'Bob Wilson',
      reputationScore: 150,
      questionsAsked: 25,
      answersGiven: 5,
      flaggedContentCount: 3,
      moderationActions: [],
      isBanned: true,
      banReason: 'Spam content',
      banExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    // Load data - in real implementation, this would be API calls
    setContentItems(mockContentItems);
    setUserItems(mockUserItems);
  }, []);

  const filteredContentItems = useMemo(() => {
    return contentItems.filter(item => {
      const matchesSearch = 
        ('title' in item && item.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = contentTypeFilter === 'all' || 
        (contentTypeFilter === 'Question' && 'title' in item) ||
        (contentTypeFilter === 'Answer' && 'questionId' in item);
      
      return matchesSearch && matchesType;
    });
  }, [contentItems, searchTerm, contentTypeFilter]);

  const filteredUserItems = useMemo(() => {
    return userItems.filter(user => {
      const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && !user.isBanned && user.flaggedContentCount === 0) ||
        (statusFilter === 'flagged' && user.flaggedContentCount > 0) ||
        (statusFilter === 'banned' && user.isBanned);
      
      return matchesSearch && matchesStatus;
    });
  }, [userItems, searchTerm, statusFilter]);

  // Bulk content operations
  const handleBulkDeleteContent = async () => {
    if (selectedItems.length === 0) return;
    
    setLoading(true);
    try {
      const questionIds = selectedItems.filter(id => 
        contentItems.find(item => item.id === id && 'title' in item)
      );
      const answerIds = selectedItems.filter(id => 
        contentItems.find(item => item.id === id && 'questionId' in item)
      );

      let processedCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      if (questionIds.length > 0) {
        try {
          await qaService.bulkDeleteQuestions(questionIds);
          processedCount += questionIds.length;
        } catch (error) {
          failedCount += questionIds.length;
          errors.push(`Failed to delete questions: ${error}`);
        }
      }

      if (answerIds.length > 0) {
        try {
          await qaService.bulkDeleteAnswers(answerIds);
          processedCount += answerIds.length;
        } catch (error) {
          failedCount += answerIds.length;
          errors.push(`Failed to delete answers: ${error}`);
        }
      }

      setOperationResult({
        success: failedCount === 0,
        message: failedCount === 0 ? 'Content deleted successfully' : 'Some items failed to delete',
        processedCount,
        failedCount,
        errors: errors.length > 0 ? errors : undefined
      });

      if (failedCount === 0) {
        // Remove deleted items from local state
        setContentItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
      }
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Bulk delete operation failed',
        processedCount: 0,
        failedCount: selectedItems.length,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCloseQuestions = async (reason: string) => {
    const questionIds = selectedItems.filter(id => 
      contentItems.find(item => item.id === id && 'title' in item)
    );
    
    if (questionIds.length === 0) return;
    
    setLoading(true);
    try {
      await qaService.bulkCloseQuestions(questionIds, reason);
      
      setOperationResult({
        success: true,
        message: 'Questions closed successfully',
        processedCount: questionIds.length,
        failedCount: 0
      });

      // Update local state
      setContentItems(prev => prev.map(item => 
        questionIds.includes(item.id) && 'title' in item 
          ? { ...item, isClosed: true } as Question
          : item
      ));
      setSelectedItems([]);
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Failed to close questions',
        processedCount: 0,
        failedCount: questionIds.length,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
    }
  };

  // Bulk user operations
  const handleBulkReputationAdjustment = async (adjustment: number, reason: string) => {
    if (selectedUsers.length === 0) return;
    
    setLoading(true);
    try {
      let processedCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const userId of selectedUsers) {
        try {
          await qaService.adjustUserReputation(userId, adjustment, reason);
          processedCount++;
        } catch (error) {
          failedCount++;
          errors.push(`Failed to adjust reputation for user ${userId}: ${error}`);
        }
      }

      setOperationResult({
        success: failedCount === 0,
        message: failedCount === 0 ? 'Reputation adjusted successfully' : 'Some adjustments failed',
        processedCount,
        failedCount,
        errors: errors.length > 0 ? errors : undefined
      });

      if (failedCount === 0) {
        // Update local state
        setUserItems(prev => prev.map(user => 
          selectedUsers.includes(user.userId)
            ? { ...user, reputationScore: user.reputationScore + adjustment }
            : user
        ));
        setSelectedUsers([]);
      }
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Bulk reputation adjustment failed',
        processedCount: 0,
        failedCount: selectedUsers.length,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkBadgeAwarding = async (badgeType: string) => {
    if (selectedUsers.length === 0) return;
    
    setLoading(true);
    try {
      let processedCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const userId of selectedUsers) {
        try {
          await qaService.awardBadge(userId, badgeType);
          processedCount++;
        } catch (error) {
          failedCount++;
          errors.push(`Failed to award badge to user ${userId}: ${error}`);
        }
      }

      setOperationResult({
        success: failedCount === 0,
        message: failedCount === 0 ? 'Badges awarded successfully' : 'Some badge awards failed',
        processedCount,
        failedCount,
        errors: errors.length > 0 ? errors : undefined
      });

      if (failedCount === 0) {
        setSelectedUsers([]);
      }
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Bulk badge awarding failed',
        processedCount: 0,
        failedCount: selectedUsers.length,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
    }
  };

  // Content export functionality
  const handleContentExport = async (format: 'csv' | 'json' | 'xlsx') => {
    setLoading(true);
    try {
      // In real implementation, this would call an API endpoint
      const exportData = selectedItems.length > 0 
        ? contentItems.filter(item => selectedItems.includes(item.id))
        : contentItems;

      const dataToExport = exportData.map(item => ({
        id: item.id,
        type: 'title' in item ? 'Question' : 'Answer',
        title: 'title' in item ? item.title : 'N/A',
        content: item.content.substring(0, 100) + '...',
        author: item.userName,
        voteScore: item.voteScore,
        createdAt: item.createdAt,
        category: 'category' in item ? item.category : 'N/A'
      }));

      // Simulate export process
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qa-content-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setOperationResult({
        success: true,
        message: `Content exported successfully as ${format.toUpperCase()}`,
        processedCount: dataToExport.length,
        failedCount: 0
      });
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Export failed',
        processedCount: 0,
        failedCount: 0,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
      setShowExportModal(false);
    }
  };

  // Table configurations
  const contentTableColumns = [
    {
      key: 'select',
      label: '',
      width: '50px',
      render: (_: any, row: Question | Answer) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems(prev => [...prev, row.id]);
            } else {
              setSelectedItems(prev => prev.filter(id => id !== row.id));
            }
          }}
          className="rounded border-border"
        />
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (_: any, row: Question | Answer) => (
        <Badge variant={'title' in row ? 'default' : 'secondary'}>
          {'title' in row ? 'Question' : 'Answer'}
        </Badge>
      )
    },
    {
      key: 'title',
      label: 'Content',
      render: (_: any, row: Question | Answer) => (
        <div>
          <p className="font-medium truncate max-w-xs">
            {'title' in row ? row.title : 'Answer'}
          </p>
          <p className="text-sm text-muted-foreground truncate max-w-xs">
            {row.content.substring(0, 80)}...
          </p>
        </div>
      )
    },
    {
      key: 'userName',
      label: 'Author',
      sortable: true
    },
    {
      key: 'voteScore',
      label: 'Score',
      sortable: true,
      render: (value: number) => (
        <span className={cn(
          'font-medium',
          value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-muted-foreground'
        )}>
          {value > 0 ? '+' : ''}{value}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const userTableColumns = [
    {
      key: 'select',
      label: '',
      width: '50px',
      render: (_: any, row: UserModerationInfo) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(row.userId)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers(prev => [...prev, row.userId]);
            } else {
              setSelectedUsers(prev => prev.filter(id => id !== row.userId));
            }
          }}
          className="rounded border-border"
        />
      )
    },
    {
      key: 'userName',
      label: 'User',
      sortable: true,
      render: (value: string, row: UserModerationInfo) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {value.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">
              {row.reputationScore} reputation
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'questionsAsked',
      label: 'Questions',
      sortable: true
    },
    {
      key: 'answersGiven',
      label: 'Answers',
      sortable: true
    },
    {
      key: 'flaggedContentCount',
      label: 'Flags',
      sortable: true,
      render: (value: number) => (
        <span className={cn(
          'font-medium',
          value > 0 ? 'text-red-600' : 'text-muted-foreground'
        )}>
          {value}
        </span>
      )
    },
    {
      key: 'isBanned',
      label: 'Status',
      render: (value: boolean, row: UserModerationInfo) => (
        <Badge variant={value ? 'destructive' : row.flaggedContentCount > 0 ? 'warning' : 'success'}>
          {value ? 'Banned' : row.flaggedContentCount > 0 ? 'Flagged' : 'Active'}
        </Badge>
      )
    }
  ];

  // Form fields for modals
  const reputationFormFields: FormField[] = [
    {
      key: 'adjustment',
      label: 'Reputation Adjustment',
      type: 'number',
      placeholder: 'Enter adjustment amount (positive or negative)',
      required: true,
      validation: { min: -1000, max: 1000 }
    },
    {
      key: 'reason',
      label: 'Reason',
      type: 'textarea',
      placeholder: 'Explain the reason for this adjustment',
      required: true,
      validation: { min: 10, max: 500 }
    }
  ];

  const badgeFormFields: FormField[] = [
    {
      key: 'badgeType',
      label: 'Badge Type',
      type: 'select',
      required: true,
      options: [
        { value: 'Helpful', label: 'Helpful Contributor' },
        { value: 'Expert', label: 'Subject Expert' },
        { value: 'Mentor', label: 'Community Mentor' },
        { value: 'Pioneer', label: 'Early Adopter' },
        { value: 'Scholar', label: 'Knowledge Scholar' }
      ]
    }
  ];

  const exportFormFields: FormField[] = [
    {
      key: 'format',
      label: 'Export Format',
      type: 'select',
      required: true,
      options: [
        { value: 'csv', label: 'CSV (Comma Separated Values)' },
        { value: 'json', label: 'JSON (JavaScript Object Notation)' },
        { value: 'xlsx', label: 'Excel Spreadsheet' }
      ]
    },
    {
      key: 'includeContent',
      label: 'Include Full Content',
      type: 'checkbox'
    }
  ];

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
            {t('bulk_operations.title', 'Bulk Operations')}
          </h2>
          <p className="text-muted-foreground">
            {t('bulk_operations.description', 'Manage content and users efficiently with bulk operations')}
          </p>
        </div>
        
        <div className={cn(
          'flex items-center gap-3',
          getRTLClass('', 'flex-row-reverse')
        )}>
          <Button
            variant="outline"
            onClick={() => setShowBulkActions(!showBulkActions)}
          >
            <Filter className={cn('w-4 h-4', getRTLClass('mr-2', 'ml-2'))} />
            {showBulkActions ? t('bulk_operations.actions.hide_actions', 'Hide Actions') : t('bulk_operations.actions.show_actions', 'Show Actions')}
          </Button>
          
          <Button onClick={() => setShowExportModal(true)}>
            <Download className={cn('w-4 h-4', getRTLClass('mr-2', 'ml-2'))} />
            {t('bulk_operations.actions.export_data', 'Export Data')}
          </Button>
        </div>
      </div>

      {/* Operation Result */}
      {operationResult && (
        <Card className={cn(
          'p-4 border-l-4',
          operationResult.success 
            ? 'border-l-green-500 bg-green-50 dark:bg-green-900/20' 
            : 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
        )}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {operationResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div>
                <h4 className="font-medium">{operationResult.message}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Processed: {operationResult.processedCount}, Failed: {operationResult.failedCount}
                </p>
                {operationResult.errors && (
                  <ul className="text-sm text-red-600 mt-2 space-y-1">
                    {operationResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOperationResult(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Bulk Actions Panel */}
      {showBulkActions && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Bulk Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Content Actions */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Content Actions</h4>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={handleBulkDeleteContent}
                disabled={selectedItems.length === 0 || loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedItems.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleBulkCloseQuestions('Bulk closure')}
                disabled={selectedItems.length === 0 || loading}
              >
                <Ban className="w-4 h-4 mr-2" />
                Close Questions
              </Button>
            </div>

            {/* User Actions */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">User Actions</h4>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowReputationModal(true)}
                disabled={selectedUsers.length === 0 || loading}
              >
                <Users className="w-4 h-4 mr-2" />
                Adjust Reputation ({selectedUsers.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowBadgeModal(true)}
                disabled={selectedUsers.length === 0 || loading}
              >
                <Award className="w-4 h-4 mr-2" />
                Award Badges
              </Button>
            </div>

            {/* Selection Actions */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Selection</h4>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedItems(filteredContentItems.map(item => item.id));
                  setSelectedUsers(filteredUserItems.map(user => user.userId));
                }}
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Select All Visible
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedItems([]);
                  setSelectedUsers([]);
                }}
              >
                <Square className="w-4 h-4 mr-2" />
                Clear Selection
              </Button>
            </div>

            {/* Export Actions */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Export</h4>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowExportModal(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleContentExport('json')}
                disabled={loading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Quick Export JSON
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search content and users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">All Content Types</option>
            <option value="Question">Questions Only</option>
            <option value="Answer">Answers Only</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">All User Status</option>
            <option value="active">Active Users</option>
            <option value="flagged">Flagged Users</option>
            <option value="banned">Banned Users</option>
          </select>
        </div>

        {/* Content Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Content Management ({selectedItems.length} selected)
          </h3>
          <DataTable
            columns={contentTableColumns}
            data={filteredContentItems}
            loading={loading}
            showToggleColumns={true}
          />
        </div>

        {/* User Table */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            User Management ({selectedUsers.length} selected)
          </h3>
          <DataTable
            columns={userTableColumns}
            data={filteredUserItems}
            loading={loading}
            showToggleColumns={true}
          />
        </div>
      </Card>

      {/* Modals */}
      <DynamicModal
        isOpen={showReputationModal}
        onClose={() => setShowReputationModal(false)}
        type="custom"
        title="Bulk Reputation Adjustment"
        description={`Adjust reputation for ${selectedUsers.length} selected users`}
        fields={reputationFormFields}
        onSubmit={async (data) => {
          await handleBulkReputationAdjustment(
            parseInt(data.adjustment), 
            data.reason
          );
          setShowReputationModal(false);
        }}
        submitLabel="Apply Adjustment"
        size="md"
      />

      <DynamicModal
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        type="custom"
        title="Bulk Badge Awarding"
        description={`Award badges to ${selectedUsers.length} selected users`}
        fields={badgeFormFields}
        onSubmit={async (data) => {
          await handleBulkBadgeAwarding(data.badgeType);
          setShowBadgeModal(false);
        }}
        submitLabel="Award Badges"
        size="md"
      />

      <DynamicModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        type="custom"
        title="Export Content"
        description="Export selected content to various formats"
        fields={exportFormFields}
        onSubmit={async (data) => {
          await handleContentExport(data.format);
        }}
        submitLabel="Export"
        size="md"
      />
    </div>
  );
};

export default BulkModerationComponent;