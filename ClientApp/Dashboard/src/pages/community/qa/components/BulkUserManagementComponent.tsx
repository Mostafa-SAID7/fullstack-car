import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  Ban,
  UserCheck,
  Download,
  RefreshCw,
  CheckSquare,
  Square,
  AlertTriangle,
  CheckCircle,
  X,
  Settings
} from 'lucide-react';
import { Card } from '@/components/layout/cards/Card';
import { Button } from '@/components/forms/buttons/Button';
import { Input } from '@/components/forms/inputs/Input';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/data-display/badges/Badge';
import { DynamicModal } from '@/components/shared/DynamicModal';
import { StatsCards } from '@/components/shared';
import { cn } from '@/lib/utils';
import { bulkOperationsService } from '@/services/qa/BulkOperationsService';
import type {
  UserModerationInfo
} from '@/types/qa/api-types';
import type { FormField } from '@/types/shared';

interface BulkUserManagementComponentProps {
  className?: string;
}

interface BulkOperationResult {
  success: boolean;
  message: string;
  processedCount: number;
  failedCount: number;
  errors?: string[];
}

export const BulkUserManagementComponent: React.FC<BulkUserManagementComponentProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<UserModerationInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'flagged' | 'banned' | 'expert'>('all');
  const [reputationFilter, setReputationFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [operationResult, setOperationResult] = useState<BulkOperationResult | null>(null);

  // Modal states
  const [showReputationModal, setShowReputationModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock data for demonstration - in real implementation, this would come from API
  const mockUsers: UserModerationInfo[] = [
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
    },
    {
      userId: 'user4',
      userName: 'Alice Johnson',
      reputationScore: 4200,
      questionsAsked: 12,
      answersGiven: 78,
      flaggedContentCount: 0,
      moderationActions: [],
      isBanned: false
    },
    {
      userId: 'user5',
      userName: 'Charlie Brown',
      reputationScore: 850,
      questionsAsked: 30,
      answersGiven: 18,
      flaggedContentCount: 2,
      moderationActions: [],
      isBanned: false
    }
  ];

  useEffect(() => {
    // Load data - in real implementation, this would be API calls
    setUsers(mockUsers);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && !user.isBanned && user.flaggedContentCount === 0) ||
        (statusFilter === 'flagged' && user.flaggedContentCount > 0) ||
        (statusFilter === 'banned' && user.isBanned) ||
        (statusFilter === 'expert' && user.reputationScore > 2000);

      const matchesReputation = reputationFilter === 'all' ||
        (reputationFilter === 'low' && user.reputationScore < 500) ||
        (reputationFilter === 'medium' && user.reputationScore >= 500 && user.reputationScore < 2000) ||
        (reputationFilter === 'high' && user.reputationScore >= 2000);

      return matchesSearch && matchesStatus && matchesReputation;
    });
  }, [users, searchTerm, statusFilter, reputationFilter]);

  const userStats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => !u.isBanned && u.flaggedContentCount === 0).length;
    const flaggedUsers = users.filter(u => u.flaggedContentCount > 0).length;
    const expertUsers = users.filter(u => u.reputationScore > 2000).length;

    return [
      {
        label: 'Total Users',
        value: totalUsers.toString(),
        icon: Users,
        change: '+12%',
        changeType: 'positive' as const,
        color: 'text-blue-600'
      },
      {
        label: 'Active Users',
        value: activeUsers.toString(),
        icon: UserCheck,
        change: '+8%',
        changeType: 'positive' as const,
        color: 'text-green-600'
      },
      {
        label: 'Flagged Users',
        value: flaggedUsers.toString(),
        icon: AlertTriangle,
        change: '-5%',
        changeType: 'positive' as const,
        color: 'text-orange-600'
      },
      {
        label: 'Expert Users',
        value: expertUsers.toString(),
        icon: Award,
        change: '+15%',
        changeType: 'positive' as const,
        color: 'text-purple-600'
      }
    ];
  }, [users]);

  // Bulk reputation adjustment
  const handleBulkReputationAdjustment = async (adjustment: number, reason: string) => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      await bulkOperationsService.bulkAdjustUserReputation(selectedUsers, adjustment, reason);

      setOperationResult({
        success: true,
        message: 'Reputation adjusted successfully',
        processedCount: selectedUsers.length,
        failedCount: 0
      });

      // Update local state
      setUsers(prev => prev.map(user =>
        selectedUsers.includes(user.userId)
          ? { ...user, reputationScore: Math.max(0, user.reputationScore + adjustment) }
          : user
      ));
      setSelectedUsers([]);
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Failed to adjust reputation',
        processedCount: 0,
        failedCount: selectedUsers.length,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
    }
  };

  // Bulk badge awarding
  const handleBulkBadgeAwarding = async (badgeType: string) => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      await bulkOperationsService.bulkAwardBadges(selectedUsers, badgeType);

      setOperationResult({
        success: true,
        message: 'Badges awarded successfully',
        processedCount: selectedUsers.length,
        failedCount: 0
      });

      setSelectedUsers([]);
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Failed to award badges',
        processedCount: 0,
        failedCount: selectedUsers.length,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
    }
  };

  // Bulk user banning
  const handleBulkBanUsers = async (duration: number, reason: string) => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      await bulkOperationsService.bulkBanUsers(selectedUsers, duration, reason);

      setOperationResult({
        success: true,
        message: 'Users banned successfully',
        processedCount: selectedUsers.length,
        failedCount: 0
      });

      // Update local state
      const banExpiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();
      setUsers(prev => prev.map(user =>
        selectedUsers.includes(user.userId)
          ? { ...user, isBanned: true, banReason: reason, banExpiresAt }
          : user
      ));
      setSelectedUsers([]);
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Failed to ban users',
        processedCount: 0,
        failedCount: selectedUsers.length,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
    }
  };

  // Bulk user unbanning
  const handleBulkUnbanUsers = async () => {
    const bannedUsers = selectedUsers.filter(userId =>
      users.find(u => u.userId === userId)?.isBanned
    );

    if (bannedUsers.length === 0) return;

    setLoading(true);
    try {
      await bulkOperationsService.bulkUnbanUsers(bannedUsers);

      setOperationResult({
        success: true,
        message: 'Users unbanned successfully',
        processedCount: bannedUsers.length,
        failedCount: 0
      });

      // Update local state
      setUsers(prev => prev.map(user =>
        bannedUsers.includes(user.userId)
          ? { ...user, isBanned: false, banReason: undefined, banExpiresAt: undefined }
          : user
      ));
      setSelectedUsers([]);
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Failed to unban users',
        processedCount: 0,
        failedCount: bannedUsers.length,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
    }
  };

  // Bulk role updates
  const handleBulkRoleUpdate = async (rolesToAdd: string[], rolesToRemove: string[]) => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      await bulkOperationsService.bulkUpdateUserRoles(selectedUsers, rolesToAdd, rolesToRemove);

      setOperationResult({
        success: true,
        message: 'User roles updated successfully',
        processedCount: selectedUsers.length,
        failedCount: 0
      });

      setSelectedUsers([]);
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Failed to update user roles',
        processedCount: 0,
        failedCount: selectedUsers.length,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
    }
  };

  // Bulk expertise area updates
  const handleBulkExpertiseUpdate = async (expertiseAreas: string[]) => {
    if (selectedUsers.length === 0) return;

    setLoading(true);
    try {
      await bulkOperationsService.bulkUpdateUserExpertise(selectedUsers, expertiseAreas);

      setOperationResult({
        success: true,
        message: 'User expertise areas updated successfully',
        processedCount: selectedUsers.length,
        failedCount: 0
      });

      setSelectedUsers([]);
    } catch (error) {
      setOperationResult({
        success: false,
        message: 'Failed to update expertise areas',
        processedCount: 0,
        failedCount: selectedUsers.length,
        errors: [String(error)]
      });
    } finally {
      setLoading(false);
    }
  };

  // Export user data
  const handleUserExport = async (format: 'csv' | 'json' | 'xlsx', includeHistory: boolean) => {
    setLoading(true);
    try {
      const userIds = selectedUsers.length > 0 ? selectedUsers : undefined;
      const result = await bulkOperationsService.exportUserData(
        userIds,
        format,
        includeHistory,
        includeHistory
      );

      if (result.succeeded && result.data) {
        // Create download link
        const url = URL.createObjectURL(result.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-export-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setOperationResult({
          success: true,
          message: `User data exported successfully as ${format.toUpperCase()}`,
          processedCount: selectedUsers.length || users.length,
          failedCount: 0
        });
      }
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

  // Table configuration
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
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {value.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-muted-foreground">
              ID: {row.userId.substring(0, 8)}...
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'reputationScore',
      label: 'Reputation',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-medium',
            value >= 2000 ? 'text-purple-600' :
              value >= 500 ? 'text-blue-600' : 'text-muted-foreground'
          )}>
            {value.toLocaleString()}
          </span>
          {value >= 2000 && <Award className="w-4 h-4 text-purple-600" />}
        </div>
      )
    },
    {
      key: 'questionsAsked',
      label: 'Questions',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'answersGiven',
      label: 'Answers',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'flaggedContentCount',
      label: 'Flags',
      sortable: true,
      render: (value: number) => (
        <span className={cn(
          'font-medium text-sm',
          value > 0 ? 'text-red-600' : 'text-muted-foreground'
        )}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (_: any, row: UserModerationInfo) => {
        if (row.isBanned) {
          return <Badge variant="destructive">Banned</Badge>;
        }
        if (row.flaggedContentCount > 0) {
          return <Badge variant="warning">Flagged</Badge>;
        }
        if (row.reputationScore >= 2000) {
          return <Badge variant="secondary">Expert</Badge>;
        }
        return <Badge variant="success">Active</Badge>;
      }
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
        { value: 'Scholar', label: 'Knowledge Scholar' },
        { value: 'Guardian', label: 'Community Guardian' }
      ]
    }
  ];

  const banFormFields: FormField[] = [
    {
      key: 'duration',
      label: 'Ban Duration (days)',
      type: 'number',
      placeholder: 'Enter number of days',
      required: true,
      validation: { min: 1, max: 365 }
    },
    {
      key: 'reason',
      label: 'Ban Reason',
      type: 'textarea',
      placeholder: 'Explain the reason for this ban',
      required: true,
      validation: { min: 10, max: 500 }
    }
  ];

  const roleFormFields: FormField[] = [
    {
      key: 'rolesToAdd',
      label: 'Roles to Add',
      type: 'multiselect',
      options: [
        { value: 'moderator', label: 'Moderator' },
        { value: 'expert', label: 'Expert' },
        { value: 'mentor', label: 'Mentor' },
        { value: 'reviewer', label: 'Content Reviewer' }
      ]
    },
    {
      key: 'rolesToRemove',
      label: 'Roles to Remove',
      type: 'multiselect',
      options: [
        { value: 'moderator', label: 'Moderator' },
        { value: 'expert', label: 'Expert' },
        { value: 'mentor', label: 'Mentor' },
        { value: 'reviewer', label: 'Content Reviewer' }
      ]
    }
  ];

  const expertiseFormFields: FormField[] = [
    {
      key: 'expertiseAreas',
      label: 'Expertise Areas',
      type: 'multiselect',
      required: true,
      options: [
        { value: 'Web Development', label: 'Web Development' },
        { value: 'Mobile Development', label: 'Mobile Development' },
        { value: 'Database Design', label: 'Database Design' },
        { value: 'DevOps & Cloud', label: 'DevOps & Cloud' },
        { value: 'Data Science', label: 'Data Science' },
        { value: 'Cybersecurity', label: 'Cybersecurity' },
        { value: 'UI/UX Design', label: 'UI/UX Design' },
        { value: 'Machine Learning', label: 'Machine Learning' }
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
      key: 'includeHistory',
      label: 'Include Reputation & Moderation History',
      type: 'checkbox'
    }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6" />
            Bulk User Management
          </h2>
          <p className="text-muted-foreground">
            Efficiently manage user accounts, reputation, and roles in bulk
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setUsers(mockUsers);
              setSelectedUsers([]);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Button onClick={() => setShowExportModal(true)}>
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={userStats} loading={loading} />

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
      {selectedUsers.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Bulk Actions ({selectedUsers.length} users selected)
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedUsers([])}
            >
              <Square className="w-4 h-4 mr-2" />
              Clear Selection
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReputationModal(true)}
              disabled={loading}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Adjust Reputation
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBadgeModal(true)}
              disabled={loading}
            >
              <Award className="w-4 h-4 mr-2" />
              Award Badges
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRoleModal(true)}
              disabled={loading}
            >
              <Settings className="w-4 h-4 mr-2" />
              Update Roles
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExpertiseModal(true)}
              disabled={loading}
            >
              <Award className="w-4 h-4 mr-2" />
              Set Expertise
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBanModal(true)}
              disabled={loading}
            >
              <Ban className="w-4 h-4 mr-2" />
              Ban Users
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkUnbanUsers}
              disabled={loading || !selectedUsers.some(id => users.find(u => u.userId === id)?.isBanned)}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Unban Users
            </Button>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search users by name..."
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
            <option value="active">Active Users</option>
            <option value="flagged">Flagged Users</option>
            <option value="banned">Banned Users</option>
            <option value="expert">Expert Users</option>
          </select>

          <select
            value={reputationFilter}
            onChange={(e) => setReputationFilter(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">All Reputation</option>
            <option value="low">Low (&lt; 500)</option>
            <option value="medium">Medium (500-2000)</option>
            <option value="high">High (&gt; 2000)</option>
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedUsers(filteredUsers.map(user => user.userId));
            }}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Select All Visible
          </Button>
        </div>

        {/* User Table */}
        <DataTable
          columns={userTableColumns}
          data={filteredUsers}
          loading={loading}
          showToggleColumns={true}
        />
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
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        type="custom"
        title="Bulk User Banning"
        description={`Ban ${selectedUsers.length} selected users`}
        fields={banFormFields}
        onSubmit={async (data) => {
          await handleBulkBanUsers(parseInt(data.duration), data.reason);
          setShowBanModal(false);
        }}
        submitLabel="Ban Users"
        size="md"
      />

      <DynamicModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        type="custom"
        title="Bulk Role Management"
        description={`Update roles for ${selectedUsers.length} selected users`}
        fields={roleFormFields}
        onSubmit={async (data) => {
          await handleBulkRoleUpdate(data.rolesToAdd || [], data.rolesToRemove || []);
          setShowRoleModal(false);
        }}
        submitLabel="Update Roles"
        size="md"
      />

      <DynamicModal
        isOpen={showExpertiseModal}
        onClose={() => setShowExpertiseModal(false)}
        type="custom"
        title="Bulk Expertise Assignment"
        description={`Set expertise areas for ${selectedUsers.length} selected users`}
        fields={expertiseFormFields}
        onSubmit={async (data) => {
          await handleBulkExpertiseUpdate(data.expertiseAreas || []);
          setShowExpertiseModal(false);
        }}
        submitLabel="Update Expertise"
        size="md"
      />

      <DynamicModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        type="custom"
        title="Export User Data"
        description="Export user data to various formats"
        fields={exportFormFields}
        onSubmit={async (data) => {
          await handleUserExport(data.format, data.includeHistory || false);
        }}
        submitLabel="Export"
        size="md"
      />
    </div>
  );
};

export default BulkUserManagementComponent;