// Knowledge Entry List Component - Displays list of knowledge entries

import { motion } from 'framer-motion';
import {
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Tag,
  FileText
} from 'lucide-react';
import type { KnowledgeEntry } from '../../../types/ai-agent';

interface KnowledgeEntryListProps {
  entries: KnowledgeEntry[];
  loading: boolean;
  onEdit: (entry: KnowledgeEntry) => void;
  onDelete: (id: string) => void;
  onVerify: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  maintenance: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  diagnostics: 'bg-red-500/10 text-red-600 border-red-500/20',
  buying_guide: 'bg-green-500/10 text-green-600 border-green-500/20',
  selling_tips: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  modifications: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  car_specs: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  community_help: 'bg-pink-500/10 text-pink-600 border-pink-500/20'
};

const CATEGORY_LABELS: Record<string, string> = {
  maintenance: 'Maintenance',
  diagnostics: 'Diagnostics',
  buying_guide: 'Buying Guide',
  selling_tips: 'Selling Tips',
  modifications: 'Modifications',
  car_specs: 'Car Specs',
  community_help: 'Community Help'
};

export const KnowledgeEntryList: React.FC<KnowledgeEntryListProps> = ({
  entries,
  loading,
  onEdit,
  onDelete,
  onVerify
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-muted rounded" />
                <div className="w-8 h-8 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-2xl p-12 text-center"
      >
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Knowledge Entries Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters, or add a new entry to get started.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  CATEGORY_COLORS[entry.category] || 'bg-gray-500/10 text-gray-600 border-gray-500/20'
                }`}>
                  <Tag className="w-3 h-3" />
                  {CATEGORY_LABELS[entry.category] || entry.category}
                </span>

                {entry.verified && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 border border-green-500/20">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              {/* Content Preview */}
              <p className="text-sm text-foreground mb-3 line-clamp-3">
                {entry.content}
              </p>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>Source: {entry.source}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
                {entry.score && (
                  <div className="flex items-center gap-1">
                    <span>Relevance: {(entry.score * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {!entry.verified && (
                <button
                  onClick={() => onVerify(entry.id)}
                  className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                  title="Verify entry"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onEdit(entry)}
                className="p-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                title="Edit entry"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                title="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
