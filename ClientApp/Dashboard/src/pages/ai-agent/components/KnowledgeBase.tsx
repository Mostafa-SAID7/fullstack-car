// Knowledge Base Component - Main knowledge management interface

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { knowledgeService } from '../../../services/ai-agent';
import type { KnowledgeEntry, KnowledgeCategory } from '../../../types/ai-agent';
import { KnowledgeEntryList } from './KnowledgeEntryList';
import { KnowledgeEntryForm } from './KnowledgeEntryForm';
import { FileUpload } from './FileUpload';
import { useToast } from '../../../hooks';

export const KnowledgeBase: React.FC = () => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | ''>('');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [stats, setStats] = useState({ total: 0, verified: 0, byCategory: {} });
  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadEntries();
    loadStats();
  }, [searchQuery, selectedCategory, showVerifiedOnly]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await knowledgeService.search({
        query: searchQuery || undefined,
        category: selectedCategory || undefined,
        verified: showVerifiedOnly || undefined,
        limit: 100
      });
      setEntries(response.results);
    } catch (error) {
      console.error('Error loading entries:', error);
      toastError('Failed to load knowledge entries');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await knowledgeService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAdd = async (data: { content: string; category: KnowledgeCategory; source: string }) => {
    try {
      await knowledgeService.addEntry(data);
      success('Knowledge entry added successfully');
      setShowAddForm(false);
      loadEntries();
      loadStats();
    } catch (error) {
      console.error('Error adding entry:', error);
      toastError('Failed to add knowledge entry');
    }
  };

  const handleEdit = async (id: string, data: { content?: string; category?: KnowledgeCategory }) => {
    try {
      await knowledgeService.updateEntry(id, data);
      success('Knowledge entry updated successfully');
      setEditingEntry(null);
      loadEntries();
    } catch (error) {
      console.error('Error updating entry:', error);
      toastError('Failed to update knowledge entry');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this knowledge entry?')) {
      return;
    }

    try {
      await knowledgeService.deleteEntry(id);
      success('Knowledge entry deleted successfully');
      loadEntries();
      loadStats();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toastError('Failed to delete knowledge entry');
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await knowledgeService.verifyEntry(id);
      success('Knowledge entry verified');
      loadEntries();
      loadStats();
    } catch (error) {
      console.error('Error verifying entry:', error);
      toastError('Failed to verify knowledge entry');
    }
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    loadEntries();
    loadStats();
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Knowledge Base</h2>
          <p className="text-muted-foreground">Manage automotive knowledge and documentation</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Documents
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Database className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold">{stats.total}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Total Entries</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold">{stats.verified}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Verified Entries</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold">{stats.total - stats.verified}</h3>
          </div>
          <p className="text-sm text-muted-foreground">Pending Verification</p>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as KnowledgeCategory | '')}
              className="px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            >
              <option value="">All Categories</option>
              <option value="maintenance">Maintenance</option>
              <option value="diagnostics">Diagnostics</option>
              <option value="buying_guide">Buying Guide</option>
              <option value="selling_tips">Selling Tips</option>
              <option value="modifications">Modifications</option>
              <option value="car_specs">Car Specs</option>
              <option value="community_help">Community Help</option>
            </select>
          </div>

          {/* Verified Filter */}
          <button
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showVerifiedOnly
                ? 'bg-green-500/10 border-green-500/50 text-green-600'
                : 'bg-background border-border hover:bg-muted/50'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Verified Only
          </button>

          {/* Refresh */}
          <button
            onClick={loadEntries}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Knowledge Entry List */}
      <KnowledgeEntryList
        entries={entries}
        loading={loading}
        onEdit={(entry) => setEditingEntry(entry)}
        onDelete={handleDelete}
        onVerify={handleVerify}
      />

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingEntry) && (
        <KnowledgeEntryForm
          entry={editingEntry}
          onSubmit={editingEntry ? (data) => handleEdit(editingEntry.id, data) : handleAdd}
          onCancel={() => {
            setShowAddForm(false);
            setEditingEntry(null);
          }}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <FileUpload
          onComplete={handleUploadComplete}
          onCancel={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};
