import React, { useState, useEffect, useMemo } from 'react';
import { 
  Download, 
  FileText, 
  Database,
  Calendar,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Eye,
  X
} from 'lucide-react';
import { Card } from '../layout/cards/Card';
import { Button } from '../forms/buttons/Button';
import { Input } from '../forms/inputs/Input';
import { DataTable } from '../shared/DataTable';
import { Badge } from '../data-display/badges/Badge';
import { DynamicModal } from '../shared/DynamicModal';
import { StatsCards } from '../shared';
import { cn } from '../../lib/utils';
import { bulkOperationsService } from '../../services/qa/BulkOperationsService';
import type { FormField } from '../../types/shared';

interface ContentExportComponentProps {
  className?: string;
}

interface ExportJob {
  id: string;
  name: string;
  type: 'content' | 'users' | 'analytics' | 'moderation';
  format: 'csv' | 'json' | 'xlsx';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalItems: number;
  processedItems: number;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  error?: string;
}

export const ContentExportComponent: React.FC<ContentExportComponentProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'running' | 'completed' | 'failed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'content' | 'users' | 'analytics' | 'moderation'>('all');

  // Modal states
  const [showContentExportModal, setShowContentExportModal] = useState(false);
  const [showUserExportModal, setShowUserExportModal] = useState(false);
  const [showAnalyticsExportModal, setShowAnalyticsExportModal] = useState(false);
  const [showModerationExportModal, setShowModerationExportModal] = useState(false);

  // Mock data for demonstration
  const mockExportJobs: ExportJob[] = [
    {
      id: 'job1',
      name: 'Q&A Content Export - December 2024',
      type: 'content',
      format: 'xlsx',
      status: 'completed',
      progress: 100,
      totalItems: 1250,
      processedItems: 1250,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      downloadUrl: '/downloads/qa-content-export-dec2024.xlsx'
    },
    {
      id: 'job2',
      name: 'User Reputation Report',
      type: 'users',
      format: 'csv',
      status: 'running',
      progress: 65,
      totalItems: 850,
      processedItems: 552,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'job3',
      name: 'Moderation Actions Log',
      type: 'moderation',
      format: 'json',
      status: 'failed',
      progress: 25,
      totalItems: 320,
      processedItems: 80,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      error: 'Database connection timeout'
    },
    {
      id: 'job4',
      name: 'Analytics Dashboard Data',
      type: 'analytics',
      format: 'json',
      status: 'pending',
      progress: 0,
      totalItems: 0,
      processedItems: 0,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    // Load data - in real implementation, this would be API calls
    setExportJobs(mockExportJobs);

    // Set up polling for running jobs
    const interval = setInterval(() => {
      setExportJobs(prev => prev.map(job => {
        if (job.status === 'running' && job.progress < 100) {
          const newProgress = Math.min(100, job.progress + Math.random() * 10);
          return {
            ...job,
            progress: newProgress,
            processedItems: Math.floor((newProgress / 100) * job.totalItems),
            ...(newProgress >= 100 && {
              status: 'completed' as const,
              completedAt: new Date().toISOString(),
              downloadUrl: `/downloads/${job.name.toLowerCase().replace(/\s+/g, '-')}.${job.format}`
            })
          };
        }
        return job;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredJobs = useMemo(() => {
    return exportJobs.filter(job => {
      const matchesSearch = job.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const matchesType = typeFilter === 'all' || job.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [exportJobs, searchTerm, statusFilter, typeFilter]);

  const exportStats = useMemo(() => {
    const totalJobs = exportJobs.length;
    const completedJobs = exportJobs.filter(j => j.status === 'completed').length;
    const runningJobs = exportJobs.filter(j => j.status === 'running').length;
    const failedJobs = exportJobs.filter(j => j.status === 'failed').length;

    return [
      {
        label: 'Total Exports',
        value: totalJobs.toString(),
        icon: Database,
        change: '+5',
        changeType: 'positive' as const,
        color: 'text-blue-600'
      },
      {
        label: 'Completed',
        value: completedJobs.toString(),
        icon: CheckCircle,
        change: '+3',
        changeType: 'positive' as const,
        color: 'text-green-600'
      },
      {
        label: 'Running',
        value: runningJobs.toString(),
        icon: Clock,
        change: '0',
        changeType: 'neutral' as const,
        color: 'text-orange-600'
      },
      {
        label: 'Failed',
        value: failedJobs.toString(),
        icon: AlertTriangle,
        change: '-1',
        changeType: 'positive' as const,
        color: 'text-red-600'
      }
    ];
  }, [exportJobs]);

  // Export handlers
  const handleContentExport = async (data: Record<string, any>) => {
    setLoading(true);
    try {
      const newJob: ExportJob = {
        id: `job_${Date.now()}`,
        name: data.name || `Content Export - ${new Date().toLocaleDateString()}`,
        type: 'content',
        format: data.format,
        status: 'pending',
        progress: 0,
        totalItems: 0,
        processedItems: 0,
        createdAt: new Date().toISOString()
      };

      setExportJobs(prev => [newJob, ...prev]);

      // Simulate API call
      setTimeout(() => {
        setExportJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'running', totalItems: 1000 }
            : job
        ));
      }, 1000);

      setShowContentExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserExport = async (data: Record<string, any>) => {
    setLoading(true);
    try {
      const newJob: ExportJob = {
        id: `job_${Date.now()}`,
        name: data.name || `User Export - ${new Date().toLocaleDateString()}`,
        type: 'users',
        format: data.format,
        status: 'pending',
        progress: 0,
        totalItems: 0,
        processedItems: 0,
        createdAt: new Date().toISOString()
      };

      setExportJobs(prev => [newJob, ...prev]);

      // Simulate API call
      setTimeout(() => {
        setExportJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'running', totalItems: 500 }
            : job
        ));
      }, 1000);

      setShowUserExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyticsExport = async (data: Record<string, any>) => {
    setLoading(true);
    try {
      const result = await bulkOperationsService.exportAnalyticsData(
        data.dateFrom,
        data.dateTo,
        data.format
      );

      if (result.succeeded && result.data) {
        // Create download link
        const url = URL.createObjectURL(result.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-export-${data.dateFrom}-${data.dateTo}.${data.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setShowAnalyticsExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerationExport = async (data: Record<string, any>) => {
    setLoading(true);
    try {
      const result = await bulkOperationsService.exportModerationActions(
        data.dateFrom,
        data.dateTo,
        data.moderatorId,
        data.format
      );

      if (result.succeeded && result.data) {
        // Create download link
        const url = URL.createObjectURL(result.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `moderation-export-${data.dateFrom}-${data.dateTo}.${data.format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setShowModerationExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (job: ExportJob) => {
    if (job.downloadUrl) {
      // In real implementation, this would be a proper download
      const a = document.createElement('a');
      a.href = job.downloadUrl;
      a.download = job.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await bulkOperationsService.cancelBatchOperation(jobId);
      setExportJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'failed', error: 'Cancelled by user' }
          : job
      ));
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  };

  // Table configuration
  const jobTableColumns = [
    {
      key: 'name',
      label: 'Export Job',
      sortable: true,
      render: (value: string, row: ExportJob) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Badge variant="outline">{row.type}</Badge>
            <Badge variant="secondary">{row.format.toUpperCase()}</Badge>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string, row: ExportJob) => (
        <div>
          <Badge variant={
            value === 'completed' ? 'success' :
            value === 'running' ? 'warning' :
            value === 'failed' ? 'destructive' : 'secondary'
          }>
            {value}
          </Badge>
          {value === 'running' && (
            <div className="mt-1">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${row.progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {row.processedItems} / {row.totalItems} ({row.progress.toFixed(0)}%)
              </div>
            </div>
          )}
          {value === 'failed' && row.error && (
            <div className="text-xs text-red-600 mt-1">{row.error}</div>
          )}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => (
        <div className="text-sm">
          <div>{new Date(value).toLocaleDateString()}</div>
          <div className="text-muted-foreground">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      key: 'completedAt',
      label: 'Completed',
      render: (value: string | undefined) => (
        <div className="text-sm">
          {value ? (
            <>
              <div>{new Date(value).toLocaleDateString()}</div>
              <div className="text-muted-foreground">
                {new Date(value).toLocaleTimeString()}
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      )
    }
  ];

  const jobTableActions = [
    {
      label: 'Download',
      action: 'download',
      icon: <Download className="w-4 h-4" />
    },
    {
      label: 'View Details',
      action: 'view',
      icon: <Eye className="w-4 h-4" />
    },
    {
      label: 'Cancel',
      action: 'cancel',
      icon: <X className="w-4 h-4" />,
      variant: 'danger' as const
    }
  ];

  // Form fields for export modals
  const contentExportFields: FormField[] = [
    {
      key: 'name',
      label: 'Export Name',
      type: 'text',
      placeholder: 'Enter export job name',
      required: true
    },
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
      key: 'dateFrom',
      label: 'From Date',
      type: 'date',
      required: true
    },
    {
      key: 'dateTo',
      label: 'To Date',
      type: 'date',
      required: true
    },
    {
      key: 'includeAnswers',
      label: 'Include Answers',
      type: 'checkbox'
    },
    {
      key: 'includeVotes',
      label: 'Include Vote Data',
      type: 'checkbox'
    },
    {
      key: 'minVoteScore',
      label: 'Minimum Vote Score',
      type: 'number',
      placeholder: '0'
    }
  ];

  const userExportFields: FormField[] = [
    {
      key: 'name',
      label: 'Export Name',
      type: 'text',
      placeholder: 'Enter export job name',
      required: true
    },
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
      key: 'includeReputationHistory',
      label: 'Include Reputation History',
      type: 'checkbox'
    },
    {
      key: 'includeModerationHistory',
      label: 'Include Moderation History',
      type: 'checkbox'
    },
    {
      key: 'minReputation',
      label: 'Minimum Reputation',
      type: 'number',
      placeholder: '0'
    }
  ];

  const analyticsExportFields: FormField[] = [
    {
      key: 'dateFrom',
      label: 'From Date',
      type: 'date',
      required: true
    },
    {
      key: 'dateTo',
      label: 'To Date',
      type: 'date',
      required: true
    },
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
    }
  ];

  const moderationExportFields: FormField[] = [
    {
      key: 'dateFrom',
      label: 'From Date',
      type: 'date',
      required: true
    },
    {
      key: 'dateTo',
      label: 'To Date',
      type: 'date',
      required: true
    },
    {
      key: 'moderatorId',
      label: 'Specific Moderator (Optional)',
      type: 'text',
      placeholder: 'Enter moderator ID'
    },
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
    }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Download className="w-6 h-6" />
            Content Export
          </h2>
          <p className="text-muted-foreground">
            Export QA system data using existing reporting infrastructure
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setExportJobs(mockExportJobs);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={exportStats} loading={loading} />

      {/* Quick Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Content Export
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Export questions, answers, and related content data
          </p>
          <Button 
            className="w-full" 
            onClick={() => setShowContentExportModal(true)}
          >
            Export Content
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            User Export
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Export user profiles, reputation, and activity data
          </p>
          <Button 
            className="w-full" 
            onClick={() => setShowUserExportModal(true)}
          >
            Export Users
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Analytics Export
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Export analytics and performance metrics
          </p>
          <Button 
            className="w-full" 
            onClick={() => setShowAnalyticsExportModal(true)}
          >
            Export Analytics
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-600" />
            Moderation Export
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Export moderation actions and audit logs
          </p>
          <Button 
            className="w-full" 
            onClick={() => setShowModerationExportModal(true)}
          >
            Export Moderation
          </Button>
        </Card>
      </div>

      {/* Export Jobs Table */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search export jobs..."
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
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="all">All Types</option>
            <option value="content">Content</option>
            <option value="users">Users</option>
            <option value="analytics">Analytics</option>
            <option value="moderation">Moderation</option>
          </select>
        </div>

        <DataTable
          columns={jobTableColumns}
          data={filteredJobs}
          loading={loading}
          actions={jobTableActions}
          onRowAction={(action, row) => {
            switch (action) {
              case 'download':
                if (row.status === 'completed') {
                  handleDownload(row);
                }
                break;
              case 'cancel':
                if (row.status === 'running' || row.status === 'pending') {
                  handleCancelJob(row.id);
                }
                break;
              case 'view':
                console.log('View job details:', row);
                break;
            }
          }}
          showToggleColumns={true}
        />
      </Card>

      {/* Export Modals */}
      <DynamicModal
        isOpen={showContentExportModal}
        onClose={() => setShowContentExportModal(false)}
        type="custom"
        title="Export Content Data"
        description="Export questions, answers, and related content"
        fields={contentExportFields}
        onSubmit={handleContentExport}
        submitLabel="Start Export"
        size="lg"
      />

      <DynamicModal
        isOpen={showUserExportModal}
        onClose={() => setShowUserExportModal(false)}
        type="custom"
        title="Export User Data"
        description="Export user profiles and activity data"
        fields={userExportFields}
        onSubmit={handleUserExport}
        submitLabel="Start Export"
        size="lg"
      />

      <DynamicModal
        isOpen={showAnalyticsExportModal}
        onClose={() => setShowAnalyticsExportModal(false)}
        type="custom"
        title="Export Analytics Data"
        description="Export analytics and performance metrics"
        fields={analyticsExportFields}
        onSubmit={handleAnalyticsExport}
        submitLabel="Export Now"
        size="md"
      />

      <DynamicModal
        isOpen={showModerationExportModal}
        onClose={() => setShowModerationExportModal(false)}
        type="custom"
        title="Export Moderation Data"
        description="Export moderation actions and audit logs"
        fields={moderationExportFields}
        onSubmit={handleModerationExport}
        submitLabel="Export Now"
        size="md"
      />
    </div>
  );
};

export default ContentExportComponent;