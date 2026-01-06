import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Eye, Check } from 'lucide-react';
import { useTheme } from '../../../contexts/theme';
import { availableThemes } from './index';

export const ThemesManagement: React.FC = () => {
  const { currentTheme, setTheme, previewTheme, isPreviewMode, confirmPreview, cancelPreview } = useTheme();

  const handleThemeSelect = (themeId: string) => {
    if (isPreviewMode) {
      confirmPreview();
    }
    setTheme(themeId);
  };

  const handlePreview = (themeId: string) => {
    previewTheme(themeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Theme Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize the appearance and visual style of your dashboard
          </p>
        </div>
        {isPreviewMode && (
          <div className="flex gap-2">
            <button
              onClick={confirmPreview}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Apply Theme
            </button>
            <button
              onClick={cancelPreview}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>

      {/* Current Theme Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Current Theme</h3>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: currentTheme.preview.primary }}
            />
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: currentTheme.preview.secondary }}
            />
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: currentTheme.preview.background }}
            />
            <div 
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: currentTheme.preview.surface }}
            />
          </div>
          <div>
            <p className="font-medium">{currentTheme.name}</p>
            <p className="text-sm text-muted-foreground">{currentTheme.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Available Themes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Available Themes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableThemes.map((theme) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`relative p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${
                currentTheme.id === theme.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              {/* Theme Preview */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex gap-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.preview.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.preview.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.preview.background }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: theme.preview.surface }}
                  />
                </div>
                {currentTheme.id === theme.id && (
                  <Check className="w-4 h-4 text-primary ml-auto" />
                )}
              </div>

              {/* Theme Info */}
              <div className="mb-3">
                <h4 className="font-medium text-sm">{theme.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(theme.id);
                  }}
                  className="flex-1 px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThemeSelect(theme.id);
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                >
                  <Palette className="w-3 h-3" />
                  Apply
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Theme Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Theme Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Color Palette</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Each theme includes a carefully crafted color palette with primary, secondary, and accent colors.
            </p>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary"></div>
              <div className="w-8 h-8 rounded-lg bg-secondary"></div>
              <div className="w-8 h-8 rounded-lg bg-accent"></div>
              <div className="w-8 h-8 rounded-lg bg-muted"></div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Typography</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Custom font families and sizing scales optimized for readability and aesthetics.
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-bold">Heading Text</p>
              <p className="text-base">Regular paragraph text</p>
              <p className="text-sm text-muted-foreground">Muted secondary text</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};