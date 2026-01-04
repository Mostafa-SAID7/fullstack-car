import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileImage, Upload, Grid3X3, List, Search } from 'lucide-react';

interface MediaHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MediaHeader: React.FC<MediaHeaderProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 md:p-8 shadow-lg">
        {/* Background decoration */}

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl">
              <FileImage className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                {t('media', 'Media Library')}
              </h1>
              <div className="w-16 h-1 md:w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-3" />
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {t('media_description', 'Manage and organize your media files, images, and documents with powerful search and filtering capabilities')}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground font-medium">2,847 Files</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-card border border-border/30 p-1 rounded-2xl shadow-sm">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-200 font-semibold text-sm md:text-base"
            >
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">{t('upload', 'Upload')}</span>
              <Upload className="w-4 h-4 sm:hidden" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
