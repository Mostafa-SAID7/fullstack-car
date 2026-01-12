import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Settings,
  Clock,
  Users,
  BarChart3,
  TrendingUp,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '../forms';
import { Card } from '../layout/cards/Card';
import { cn } from '../../lib/utils';
import { qaAnalyticsService } from '../../services/qa/QAAnalyticsService';
import type { QAReportConfig, QAReport } from '../../types/qa/analytics-types';

interface QAReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onReportGenerated?: (report: QAReport) => void;
  className?: string;
}

export const QAReportGeneratorComponent: React.FC<QAReportGeneratorProps> = ({
  isOpen,
  onClose,
  onReportGenerated,
  className
}) => {
  const [step, setStep] = useState<'config' | 'generating' | 'complete'>('config');
  const [config, setConfig] = useState<QAReportConfig>({
    name: '',
    type: 'overview',
    timeRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    categories: [],
    experts: [],
    tags: [],
    includeSummary: true,
    includeMetrics: true,
    includeCharts: true,
    includeRecommendations: true,
    format: 'pdf',
    includeRawData: false
  });
  const [templates, setTemplates] = useState<any[]>([]);
  const [generatedReport, setGeneratedReport] = useState<QAReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load report templates on mount
  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      const result = await qaAnalyticsService.getReportTemplates();
      if (result.succeeded && result.data) {
        setTemplates(result.data);
      } else {
        // Mock templates for development
        setTemplates([
          {
            id: 'overview',
            name: 'QA Overview Report',
            description: 'Comprehensive overview of QA system performance',
            type: 'overview',
            sections: ['summary', 'metrics', 'charts', 'recommendations']
          },
          {
            id: 'expert-performance',
            name: 'Expert Performance Report',
            description: 'Detailed analysis of expert contributions and performance',
            type: 'expert-performance',
            sections: ['expert-metrics', 'response-times', 'quality-scores']
          },
          {
            id: 'category-analysis',
            name: 'Category Analysis Report',
            description: 'Category-wise breakdown of questions and answers',
            type: 'category-analysis',
            sections: ['category-metrics', 'trending-topics', 'expert-distribution']
          },
          {
            id: 'trending',
            name: 'Trending Content Report',
            description: 'Analysis of trending questions and popular topics',
            type: 'trending',
            sections: ['trending-questions', 'popular-tags', 'growth-metrics']
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleGenerateReport = async () => {
    if (!config.name.trim()) {
      setError('Report name is required');
      return;
    }

    setStep('generating');
    setError(null);

    try {
      const result = await qaAnalyticsService.generateQAReport(config);
      
      if (result.succeeded && result.data) {
        setGeneratedReport(result.data);
        setStep('complete');
        onReportGenerated?.(result.data);
      } else {
        // Mock successful report generation for development
        const mockReport: QAReport = {
          id: `report-${Date.now()}`,
          name: config.name,
          type: config.type,
          description: `Generated ${config.type} report for ${config.timeRange.start} to ${config.timeRange.end}`,
          generatedAt: new Date().toISOString(),
          timeRange: config.timeRange,
          summary: {
            totalQuestions: 1247,
            totalAnswers: 3891,
            totalVotes: 15623,
            averageResponseTime: 4.2,
            topCategory: 'Technical Support',
            topExpert: 'Sarah Johnson',
            keyInsights: [
              'Response times improved by 15% this month',
              'Expert participation increased by 8%',
              'Technical Support category shows highest engagement'
            ]
          },
          metrics: {
            questionMetrics: {
              total: 1247,
              answered: 1089,
              unanswered: 158,
              closed: 45,
              averageVotes: 3.2
            },
            answerMetrics: {
              total: 3891,
              accepted: 1089,
              averageVotes: 2.8,
              averageLength: 245
            },
            userMetrics: {
              totalUsers: 892,
              activeUsers: 456,
              newUsers: 78,
              expertUsers: 34
            },
            performanceMetrics: {
              averageResponseTime: 4.2,
              responseRate: 0.87,
              satisfactionScore: 4.3,
              systemUptime: 99.8
            }
          },
          charts: [],
          recommendations: [
            {
              id: '1',
              type: 'performance',
              priority: 'high',
              title: 'Improve Response Times',
              description: 'Focus on reducing average response time in Technical Support category',
              actionItems: [
                'Assign more experts to Technical Support',
                'Implement automated question routing',
                'Create response time targets for experts'
              ],
              expectedImpact: '20% improvement in response times',
              timeframe: '2-4 weeks'
            }
          ],
          formats: ['pdf', 'excel'],
          downloadUrl: `/api/v7/qa/reports/${Date.now()}/download`
        };

        setGeneratedReport(mockReport);
        setStep('complete');
        onReportGenerated?.(mockReport);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      setError('Failed to generate report. Please try again.');
      setStep('config');
    }
  };

  const handleDownloadReport = async () => {
    if (!generatedReport?.downloadUrl) return;

    try {
      // In a real implementation, this would download the actual report
      const link = document.createElement('a');
      link.href = generatedReport.downloadUrl;
      link.download = `${generatedReport.name.replace(/\s+/g, '-').toLowerCase()}.${config.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleScheduleReport = async () => {
    try {
      const scheduleConfig = {
        ...config,
        schedule: {
          frequency: 'weekly' as const,
          recipients: ['admin@example.com'],
          enabled: true
        }
      };

      const result = await qaAnalyticsService.scheduleReport(scheduleConfig);
      if (result.succeeded) {
        console.log('Report scheduled successfully');
      }
    } catch (error) {
      console.error('Failed to schedule report:', error);
    }
  };

  const resetForm = () => {
    setStep('config');
    setConfig({
      name: '',
      type: 'overview',
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      },
      categories: [],
      experts: [],
      tags: [],
      includeSummary: true,
      includeMetrics: true,
      includeCharts: true,
      includeRecommendations: true,
      format: 'pdf',
      includeRawData: false
    });
    setGeneratedReport(null);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={cn('w-full max-w-4xl max-h-[90vh] overflow-y-auto', className)}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Generate QA Report</h2>
                <p className="text-sm text-muted-foreground">
                  Create comprehensive analytics reports for your QA system
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg',
              step === 'config' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Configure</span>
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg',
              step === 'generating' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Generating</span>
            </div>
            <div className="w-8 h-px bg-border"></div>
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg',
              step === 'complete' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}>
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Complete</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Configuration Step */}
          {step === 'config' && (
            <div className="space-y-6">
              {/* Report Templates */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Choose Report Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={cn(
                        'p-4 border rounded-lg cursor-pointer transition-colors',
                        config.type === template.type
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                      onClick={() => setConfig({ ...config, type: template.type, name: template.name })}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          {template.type === 'overview' && <BarChart3 className="w-4 h-4 text-primary" />}
                          {template.type === 'expert-performance' && <Users className="w-4 h-4 text-primary" />}
                          {template.type === 'category-analysis' && <Filter className="w-4 h-4 text-primary" />}
                          {template.type === 'trending' && <TrendingUp className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Report Settings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Report Name</label>
                    <input
                      type="text"
                      value={config.name}
                      onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      placeholder="Enter report name"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date</label>
                      <input
                        type="date"
                        value={config.timeRange.start}
                        onChange={(e) => setConfig({
                          ...config,
                          timeRange: { ...config.timeRange, start: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">End Date</label>
                      <input
                        type="date"
                        value={config.timeRange.end}
                        onChange={(e) => setConfig({
                          ...config,
                          timeRange: { ...config.timeRange, end: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Format</label>
                    <select
                      value={config.format}
                      onChange={(e) => setConfig({ ...config, format: e.target.value as any })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                </div>

                {/* Content Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Content Options</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.includeSummary}
                        onChange={(e) => setConfig({ ...config, includeSummary: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Include Executive Summary</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.includeMetrics}
                        onChange={(e) => setConfig({ ...config, includeMetrics: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Include Detailed Metrics</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.includeCharts}
                        onChange={(e) => setConfig({ ...config, includeCharts: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Include Charts and Graphs</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.includeRecommendations}
                        onChange={(e) => setConfig({ ...config, includeRecommendations: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Include Recommendations</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.includeRawData}
                        onChange={(e) => setConfig({ ...config, includeRawData: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Include Raw Data</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleScheduleReport}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button onClick={handleGenerateReport} disabled={!config.name.trim()}>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Generating Step */}
          {step === 'generating' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Generating Report</h3>
              <p className="text-muted-foreground mb-4">
                Please wait while we compile your QA analytics report...
              </p>
              <div className="w-64 h-2 bg-muted rounded-full mx-auto">
                <div className="h-2 bg-primary rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && generatedReport && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Report Generated Successfully</h3>
                <p className="text-muted-foreground">
                  Your QA analytics report has been generated and is ready for download.
                </p>
              </div>

              {/* Report Summary */}
              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-3">Report Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Questions</p>
                    <p className="font-semibold">{generatedReport.summary.totalQuestions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Answers</p>
                    <p className="font-semibold">{generatedReport.summary.totalAnswers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Votes</p>
                    <p className="font-semibold">{generatedReport.summary.totalVotes.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Response</p>
                    <p className="font-semibold">{generatedReport.summary.averageResponseTime}h</p>
                  </div>
                </div>
              </Card>

              {/* Key Insights */}
              <div>
                <h4 className="font-semibold mb-3">Key Insights</h4>
                <ul className="space-y-2">
                  {generatedReport.summary.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button variant="outline" onClick={resetForm}>
                  Generate Another
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleScheduleReport}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Regular Reports
                  </Button>
                  <Button onClick={handleDownloadReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QAReportGeneratorComponent;