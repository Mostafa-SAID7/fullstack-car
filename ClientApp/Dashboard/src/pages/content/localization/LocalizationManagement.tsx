import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Languages,
  FileCode,
  History,
} from 'lucide-react';
import { localizationService, type TranslationDto, type TranslationStatsDto, type PagedResult, type TranslationCacheMetrics, type ResourceFileDto } from '../../../components/services/localization';
import { useToast } from '../../../hooks';
import { SkeletonTable as TableSkeleton, StatsSkeleton as StatsSkeleton } from '../../../components/feedback/skeletons/Skeleton';
import { cn } from '../../../lib/utils';

// Sub-components
import { LocalizationHeader } from './components/LocalizationHeader';
import { LocalizationStats } from './components/LocalizationStats';
import { LocalizationFilters } from './components/LocalizationFilters';
import { TranslationsTable } from './components/TranslationsTable';
import { TranslationForm } from './components/TranslationForm';
import { CacheMetrics } from './components/CacheMetrics';
import { ResourceFilesTable } from './components/ResourceFilesTable';
import { MissingTranslations } from './components/MissingTranslations';
import { ImportExport } from './components/ImportExport';
import { TranslationActivity } from './components/TranslationActivity';

type ActiveTab = 'translations' | 'files' | 'validate' | 'import-export' | 'activity';

export const LocalizationManagement: React.FC = () => {
  const { success, error } = useToast();

  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>('translations');
  const [translations, setTranslations] = useState<PagedResult<TranslationDto>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [resourceFiles, setResourceFiles] = useState<ResourceFileDto[]>([]);
  const [stats, setStats] = useState<TranslationStatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<TranslationDto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cacheMetrics, setCacheMetrics] = useState<TranslationCacheMetrics | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [warmingCulture, setWarmingCulture] = useState('en-US');
  const [isWarming, setIsWarming] = useState(false);

  // Load translations and stats
  const loadData = async () => {
    setLoading(true);
    try {
      const [translationsResult, statsResult, metricsResult] = await Promise.all([
        localizationService.getTranslations({
          search: searchQuery || undefined,
          language: selectedLanguage || undefined,
          category: selectedCategory || undefined,
          page: currentPage,
          pageSize: 20
        }),
        localizationService.getTranslationStats(),
        localizationService.getCacheMetrics()
      ]);

      if (translationsResult.succeeded && translationsResult.data) {
        setTranslations(translationsResult.data);
      }

      if (statsResult.succeeded && statsResult.data) {
        setStats(statsResult.data);
      }

      if (metricsResult.succeeded && metricsResult.data) {
        setCacheMetrics(metricsResult.data);
      }
    } catch (err) {
      console.error('Failed to load localization data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadResourceFiles = async () => {
    setFilesLoading(true);
    try {
      const result = await localizationService.getResourceFiles();
      if (result.succeeded && result.data) {
        setResourceFiles(result.data);
      }
    } catch (err) {
      console.error('Failed to load resource files:', err);
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedLanguage, selectedCategory, currentPage]);

  useEffect(() => {
    if (activeTab === 'files') {
      loadResourceFiles();
    }
  }, [activeTab]);

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

  const handleRefreshCache = async () => {
    const result = await localizationService.invalidateCache({});
    if (result.succeeded) {
      success('Translation cache refreshed successfully!');
      loadData();
    } else {
      error(result.message || 'Failed to refresh cache');
    }
  };

  const handleWarmCache = async () => {
    if (!warmingCulture) return;
    setIsWarming(true);
    try {
      const result = await localizationService.warmCache({
        culture: warmingCulture,
        features: ['common', 'dashboard', 'auth', 'navigation']
      });
      if (result.succeeded) {
        success(`Cache warmed for ${warmingCulture} successfully!`);
        loadData();
      } else {
        error(result.message || 'Failed to warm cache');
      }
    } finally {
      setIsWarming(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <StatsSkeleton count={4} />
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LocalizationHeader
        showMetrics={showMetrics}
        setShowMetrics={setShowMetrics}
        onRefreshCache={handleRefreshCache}
        onAddTranslation={() => setShowForm(true)}
        onExport={() => success('Export triggered')}
        onImport={() => success('Import triggered')}
      />

      <AnimatePresence>
        {showMetrics && cacheMetrics && (
          <CacheMetrics
            metrics={cacheMetrics}
            warmingCulture={warmingCulture}
            onWarmingCultureChange={setWarmingCulture}
            onWarmCache={handleWarmCache}
            isWarming={isWarming}
          />
        )}
      </AnimatePresence>

      <LocalizationStats stats={stats} />

      {/* Tabs */}
      <div className="flex border-b border-border/50">
        <button
          onClick={() => setActiveTab('translations')}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors border-b-2 relative",
            activeTab === 'translations'
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Translations List
          </div>
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors border-b-2 relative",
            activeTab === 'files'
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            Resource Files
          </div>
        </button>
        <button
          onClick={() => setActiveTab('validate')}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors border-b-2 relative",
            activeTab === 'validate'
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Validate & Missing
          </div>
        </button>
        <button
          onClick={() => setActiveTab('import-export')}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors border-b-2 relative",
            activeTab === 'import-export'
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            Import / Export
          </div>
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors border-b-2 relative",
            activeTab === 'activity'
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Activity
          </div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'translations' ? (
          <motion.div
            key="translations-tab"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <LocalizationFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <TranslationsTable
              translations={translations.items}
              totalCount={translations.totalCount}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onEdit={setEditingTranslation}
              onDelete={handleDeleteTranslation}
              onToggleStatus={handleToggleStatus}
            />
          </motion.div>
        ) : activeTab === 'files' ? (
          <motion.div
            key="files-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ResourceFilesTable
              files={resourceFiles}
              loading={filesLoading}
            />
          </motion.div>
        ) : activeTab === 'validate' ? (
          <motion.div
            key="validate-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <MissingTranslations />
          </motion.div>
        ) : activeTab === 'activity' ? (
          <motion.div
            key="activity-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <TranslationActivity />
          </motion.div>
        ) : (
          <motion.div
            key="import-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ImportExport />
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
};
