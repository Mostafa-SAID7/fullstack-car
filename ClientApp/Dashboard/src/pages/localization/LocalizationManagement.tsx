import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Languages,
  FileText,
  CheckCircle
} from 'lucide-react';
import { localizationService, type TranslationDto, type TranslationStatsDto, type PagedResult } from '../../components/services/localization';
import { useToast } from '../../hooks';
import { SkeletonTable as TableSkeleton, StatsSkeleton as StatsSkeleton } from '../../components/feedback/skeletons/Skeleton';
import { cn } from '../../lib/utils';

// Components
const StatCard = ({ title, value, icon: Icon, color = 'blue', trend }: {
  title: string;
  value: string | number;
  icon: any;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-3 rounded-xl", `bg-${color}-500/10`)}>
        <Icon className={cn("w-6 h-6", `text-${color}-500`)} />
      </div>
      {trend && (
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          trend === 'up' ? 'bg-green-100 text-green-700' :
            trend === 'down' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
        )}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        </div>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  </motion.div>
);

const TranslationForm = ({ translation, onSave, onCancel, isEditing = false }: {
  translation?: TranslationDto;
  onSave: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
}) => {
  const [formData, setFormData] = useState({
    key: translation?.key || '',
    value: translation?.value || '',
    language: translation?.language || 'en-US',
    category: translation?.category || 'common',
    description: translation?.description || '',
    isActive: translation?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Translation' : 'Add New Translation'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Translation Key</label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="e.g., welcome_message"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="en-US">English (en-US)</option>
              <option value="ar-SA">Arabic (ar-SA)</option>
              <option value="ar-AE">Arabic UAE (ar-AE)</option>
              <option value="ar-EG">Arabic Egypt (ar-EG)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Translation Value</label>
          <textarea
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[80px]"
            placeholder="Enter the translated text..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="common">Common</option>
              <option value="auth">Authentication</option>
              <option value="navigation">Navigation</option>
              <option value="dashboard">Dashboard</option>
              <option value="settings">Settings</option>
              <option value="errors">Errors</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.isActive.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (Optional)</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Brief description of this translation..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {isEditing ? 'Update' : 'Create'} Translation
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export const LocalizationManagement: React.FC = () => {
  const { success, error } = useToast();
  const [translations, setTranslations] = useState<PagedResult<TranslationDto>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [stats, setStats] = useState<TranslationStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<TranslationDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load translations and stats
  const loadData = async () => {
    setLoading(true);
    try {
      const [translationsResult, statsResult] = await Promise.all([
        localizationService.getTranslations({
          search: searchQuery || undefined,
          language: selectedLanguage || undefined,
          category: selectedCategory || undefined,
          page: currentPage,
          pageSize: 20
        }),
        localizationService.getTranslationStats()
      ]);

      if (translationsResult.succeeded && translationsResult.data) {
        setTranslations(translationsResult.data);
      }

      if (statsResult.succeeded && statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error('Failed to load localization data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedLanguage, selectedCategory, currentPage]);

  const handleCreateTranslation = async (data: any) => {
    const result = await localizationService.createTranslation(data);
    if (result.succeeded) {
      success('Translation created successfully!');
      setShowForm(false);
      loadData();
    } else {
      error(result.message || 'Failed to create translation');
    }
  };

  const handleUpdateTranslation = async (data: any) => {
    if (!editingTranslation) return;

    const result = await localizationService.updateTranslation({
      ...data,
      id: editingTranslation.id
    });

    if (result.succeeded) {
      success('Translation updated successfully!');
      setEditingTranslation(null);
      loadData();
    } else {
      error(result.message || 'Failed to update translation');
    }
  };

  const handleDeleteTranslation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this translation?')) return;

    const result = await localizationService.deleteTranslation(id);
    if (result.succeeded) {
      success('Translation deleted successfully!');
      loadData();
    } else {
      error(result.message || 'Failed to delete translation');
    }
  };

  const handleToggleStatus = async (translation: TranslationDto) => {
    const result = await localizationService.updateTranslation({
      ...translation,
      isActive: !translation.isActive
    });

    if (result.succeeded) {
      success(`Translation ${translation.isActive ? 'deactivated' : 'activated'} successfully!`);
      loadData();
    } else {
      error(result.message || 'Failed to update translation status');
    }
  };

  const filteredTranslations = useMemo(() => {
    return translations.items.filter(translation => {
      const matchesSearch = !searchQuery ||
        translation.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translation.value.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage = !selectedLanguage || translation.language === selectedLanguage;
      const matchesCategory = !selectedCategory || translation.category === selectedCategory;

      return matchesSearch && matchesLanguage && matchesCategory;
    });
  }, [translations.items, searchQuery, selectedLanguage, selectedCategory]);

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gradient-to-r from-muted to-muted/80 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-primary/10 rounded-lg animate-pulse"></div>
        </div>

        {/* Stats skeleton */}
        <StatsSkeleton count={4} />

        {/* Filters skeleton */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="h-10 w-full bg-muted rounded-lg animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-muted rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-muted rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Table skeleton */}
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Localization Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage translations and localization across all supported languages
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Translation
        </button>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Translations"
            value={stats.totalTranslations}
            icon={Languages}
            color="blue"
          />
          <StatCard
            title="Active Translations"
            value={stats.activeTranslations}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Languages Supported"
            value={stats.totalLanguages}
            icon={Globe}
            color="purple"
          />
          <StatCard
            title="Categories"
            value={stats.totalCategories}
            icon={FileText}
            color="orange"
          />
        </div>
      )}

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search translations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Languages</option>
              <option value="en-US">English</option>
              <option value="ar-SA">Arabic (Saudi)</option>
              <option value="ar-AE">Arabic (UAE)</option>
              <option value="ar-EG">Arabic (Egypt)</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Categories</option>
              <option value="common">Common</option>
              <option value="auth">Authentication</option>
              <option value="navigation">Navigation</option>
              <option value="dashboard">Dashboard</option>
              <option value="settings">Settings</option>
              <option value="errors">Errors</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Form Modal */}
      {(showForm || editingTranslation) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowForm(false);
            setEditingTranslation(null);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TranslationForm
              translation={editingTranslation || undefined}
              onSave={editingTranslation ? handleUpdateTranslation : handleCreateTranslation}
              onCancel={() => {
                setShowForm(false);
                setEditingTranslation(null);
              }}
              isEditing={!!editingTranslation}
            />
          </div>
        </motion.div>
      )}

      {/* Translations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border/50 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border/50">
          <h3 className="text-lg font-semibold">Translations</h3>
          <p className="text-sm text-muted-foreground">
            {filteredTranslations.length} of {translations.totalCount} translations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTranslations.map((translation) => (
                <motion.tr
                  key={translation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{translation.key}</div>
                    {translation.description && (
                      <div className="text-xs text-muted-foreground">{translation.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground max-w-xs truncate" title={translation.value}>
                      {translation.value}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {translation.language}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {translation.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(translation)}
                      className={cn(
                        "inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors",
                        translation.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      )}
                    >
                      {translation.isActive ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                      {translation.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingTranslation(translation)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTranslation(translation.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {translations.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, translations.totalCount)} of {translations.totalCount} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!translations.hasPreviousPage}
                className="px-3 py-1 text-sm border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(translations.totalPages, prev + 1))}
                disabled={!translations.hasNextPage}
                className="px-3 py-1 text-sm border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
