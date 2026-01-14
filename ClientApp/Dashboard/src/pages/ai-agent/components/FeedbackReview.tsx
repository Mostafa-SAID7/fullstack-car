// Feedback Review Component - Review and manage user feedback

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  CheckSquare,
  XSquare
} from 'lucide-react';
import { feedbackService } from '../../../services/ai-agent';
import { useToast } from '../../../hooks';
import type { Feedback, FeedbackType, AgentType } from '../../../types/ai-agent';
import { FeedbackType as FeedbackTypeEnum, AgentType as AgentTypeEnum } from '../../../types/ai-agent';
import { FeedbackList } from './FeedbackList';
import { FeedbackDetail } from './FeedbackDetail';

export const FeedbackReview: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [filterType, setFilterType] = useState<FeedbackType | ''>('');
  const [filterAgent, setFilterAgent] = useState<AgentType | ''>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadFeedback();
  }, [filterType, filterAgent]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 100 };
      if (filterType) params.type = filterType;
      if (filterAgent) params.agentType = filterAgent;
      
      const response = await feedbackService.listFeedback(params);
      setFeedbackList(response.feedback || []);
    } catch (error) {
      console.error('Error loading feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (feedbackId: string) => {
    try {
      await feedbackService.approveCorrection(feedbackId);
      toast.success('Correction approved and added to knowledge base');
      loadFeedback();
      if (selectedFeedback?.id === feedbackId) {
        setSelectedFeedback(null);
      }
    } catch (error) {
      console.error('Error approving feedback:', error);
      toast.error('Failed to approve correction');
    }
  };

  const handleReject = async (feedbackId: string, reason?: string) => {
    try {
      await feedbackService.rejectFeedback(feedbackId, reason);
      toast.success('Feedback rejected');
      loadFeedback();
      if (selectedFeedback?.id === feedbackId) {
        setSelectedFeedback(null);
      }
    } catch (error) {
      console.error('Error rejecting feedback:', error);
      toast.error('Failed to reject feedback');
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) {
      toast.error('No feedback selected');
      return;
    }

    try {
      const result = await feedbackService.bulkApprove(Array.from(selectedIds));
      toast.success(`${result.approved} corrections approved`);
      setSelectedIds(new Set());
      loadFeedback();
    } catch (error) {
      console.error('Error bulk approving:', error);
      toast.error('Failed to approve corrections');
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) {
      toast.error('No feedback selected');
      return;
    }

    try {
      const result = await feedbackService.bulkReject(Array.from(selectedIds));
      toast.success(`${result.rejected} feedback items rejected`);
      setSelectedIds(new Set());
      loadFeedback();
    } catch (error) {
      console.error('Error bulk rejecting:', error);
      toast.error('Failed to reject feedback');
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setExporting(true);
      const params: any = {};
      if (filterType) params.type = filterType;
      if (filterAgent) params.agentType = filterAgent;
      
      const blob = await feedbackService.exportFeedback(format, params);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Feedback exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting feedback:', error);
      toast.error('Failed to export feedback');
    } finally {
      setExporting(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === feedbackList.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(feedbackList.map(f => f.id)));
    }
  };

  // Calculate stats
  const positiveCount = feedbackList.filter(f => f.type === FeedbackTypeEnum.POSITIVE).length;
  const negativeCount = feedbackList.filter(f => f.type === FeedbackTypeEnum.NEGATIVE).length;
  const correctionCount = feedbackList.filter(f => f.type === FeedbackTypeEnum.CORRECTION).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Feedback Review</h2>
          <p className="text-muted-foreground">Review and manage user feedback</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export */}
          <div className="relative group">
            <button
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left hover:bg-muted/50 rounded-t-lg transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left hover:bg-muted/50 rounded-b-lg transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>

          <button
            onClick={loadFeedback}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">{feedbackList.length}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Total Feedback</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <ThumbsUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold">{positiveCount}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Positive</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <ThumbsDown className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold">{negativeCount}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Negative</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <AlertCircle className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold">{correctionCount}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Corrections</p>
        </motion.div>
      </div>

      {/* Filters and Bulk Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FeedbackType | '')}
              className="px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            >
              <option value="">All Types</option>
              <option value={FeedbackTypeEnum.POSITIVE}>Positive</option>
              <option value={FeedbackTypeEnum.NEGATIVE}>Negative</option>
              <option value={FeedbackTypeEnum.CORRECTION}>Correction</option>
            </select>

            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value as AgentType | '')}
              className="px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            >
              <option value="">All Agents</option>
              <option value={AgentTypeEnum.GENERAL}>General</option>
              <option value={AgentTypeEnum.MECHANIC}>Mechanic</option>
              <option value={AgentTypeEnum.BUYER_GUIDE}>Buyer's Guide</option>
              <option value={AgentTypeEnum.SELLER_ASSISTANT}>Seller Assistant</option>
              <option value={AgentTypeEnum.MODIFICATION_EXPERT}>Modification Expert</option>
              <option value={AgentTypeEnum.COMMUNITY_HELPER}>Community Helper</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {selectedIds.size} selected
              </span>
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors"
              >
                <CheckSquare className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={handleBulkReject}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <XSquare className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback List */}
        <div>
          <FeedbackList
            feedback={feedbackList}
            selectedFeedback={selectedFeedback}
            selectedIds={selectedIds}
            onSelectFeedback={setSelectedFeedback}
            onToggleSelection={toggleSelection}
            onToggleSelectAll={toggleSelectAll}
            onApprove={handleApprove}
            onReject={handleReject}
            loading={loading}
          />
        </div>

        {/* Detail View */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {selectedFeedback ? (
            <FeedbackDetail
              feedback={selectedFeedback}
              onClose={() => setSelectedFeedback(null)}
              onApprove={() => handleApprove(selectedFeedback.id)}
              onReject={(reason) => handleReject(selectedFeedback.id, reason)}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/50 rounded-2xl p-12 text-center"
            >
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select Feedback</h3>
              <p className="text-muted-foreground">
                Click on a feedback item to view details
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
