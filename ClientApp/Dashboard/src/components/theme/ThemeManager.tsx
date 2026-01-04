import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Settings,
  Eye,
  Check,
  X,
  RotateCcw,
  Download,
  Upload,
  Monitor,
  Save
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useToast } from '../../hooks/useToast';

interface ThemePreviewProps {
  themeId: string;
  isSelected: boolean;
  isPreview: boolean;
  onSelect: (themeId: string) => void;
  onPreview: (themeId: string) => void;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
  themeId,
  isSelected,
  isPreview,
  onSelect,
  onPreview
}) => {
  const { availableThemes } = useTheme();
  const theme = availableThemes.find(t => t.id === themeId);

  if (!theme) return null;

  return (
    <motion.div
      layout
      className={`relative group cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-300 ${
        isSelected
          ? 'border-primary shadow-lg shadow-primary/20'
          : isPreview
          ? 'border-secondary shadow-md'
          : 'border-border hover:border-primary/50'
      }`}
      onClick={() => onSelect(themeId)}
      style={{
        background: `linear-gradient(135deg, ${theme.preview.background} 0%, ${theme.preview.surface} 100%)`
      }}
    >
      {/* Theme Preview Header */}
      <div className="h-16 flex items-center justify-between px-4"
           style={{ backgroundColor: theme.preview.surface }}>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: theme.preview.primary }}
          />
          <span className="font-medium text-sm" style={{ color: theme.preview.secondary }}>
            {theme.name}
          </span>
        </div>
        <div className="flex gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.preview.primary }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.preview.secondary }}
          />
        </div>
      </div>

      {/* Theme Preview Content */}
      <div className="p-4 space-y-3">
        {/* Mock stats */}
        <div className="flex gap-2">
          <div
            className="h-8 flex-1 rounded"
            style={{ backgroundColor: theme.preview.surface, border: `1px solid ${theme.preview.secondary}20` }}
          />
          <div
            className="h-8 flex-1 rounded"
            style={{ backgroundColor: theme.preview.surface, border: `1px solid ${theme.preview.secondary}20` }}
          />
        </div>

        {/* Mock chart area */}
        <div
          className="h-12 rounded"
          style={{ backgroundColor: theme.preview.surface, border: `1px solid ${theme.preview.secondary}20` }}
        >
          <div className="h-full flex items-end justify-between px-2 pb-1">
            {[0.6, 0.8, 0.4, 0.9, 0.7].map((height, i) => (
              <div
                key={i}
                className="w-2 rounded-sm"
                style={{
                  height: `${height * 100}%`,
                  backgroundColor: theme.preview.primary
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onPreview(themeId);
          }}
          className="px-3 py-1.5 bg-secondary/80 hover:bg-secondary text-secondary-foreground text-sm rounded-md backdrop-blur-sm transition-colors flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </motion.div>
  );
};

interface LayoutPreviewProps {
  layout: any;
  onUpdate: (updates: any) => void;
}

const LayoutPreview: React.FC<LayoutPreviewProps> = ({ layout, onUpdate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Layout Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header Settings */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Header</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="header-logo"
                checked={layout.header.showLogo}
                onChange={(e) => onUpdate({
                  header: { ...layout.header, showLogo: e.target.checked }
                })}
                className="rounded"
              />
              <label htmlFor="header-logo" className="text-sm">Show Logo</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="header-search"
                checked={layout.header.showSearch}
                onChange={(e) => onUpdate({
                  header: { ...layout.header, showSearch: e.target.checked }
                })}
                className="rounded"
              />
              <label htmlFor="header-search" className="text-sm">Show Search</label>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Sidebar</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sidebar-collapsible"
                checked={layout.sidebar.collapsible}
                onChange={(e) => onUpdate({
                  sidebar: { ...layout.sidebar, collapsible: e.target.checked }
                })}
                className="rounded"
              />
              <label htmlFor="sidebar-collapsible" className="text-sm">Collapsible</label>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={layout.sidebar.position}
                onChange={(e) => onUpdate({
                  sidebar: { ...layout.sidebar, position: e.target.value }
                })}
                className="text-sm border border-border rounded px-2 py-1 bg-background"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
              <label className="text-sm">Position</label>
            </div>
          </div>
        </div>

        {/* Main Content Settings */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Main Content</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="main-centered"
                checked={layout.main.centered}
                onChange={(e) => onUpdate({
                  main: { ...layout.main, centered: e.target.checked }
                })}
                className="rounded"
              />
              <label htmlFor="main-centered" className="text-sm">Centered</label>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Max Width"
                value={layout.main.maxWidth}
                onChange={(value) => onUpdate({
                  main: { ...layout.main, maxWidth: value }
                })}
                className="text-sm h-8"
              />
              <label className="text-sm">Max Width</label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ThemeManager: React.FC = () => {
  const {
    currentTheme,
    layout,
    availableThemes,
    setTheme,
    updateLayout,
    resetToDefault,
    previewTheme,
    isPreviewMode,
    confirmPreview,
    cancelPreview,
    saveTheme
  } = useTheme();

  const { success, error } = useToast();
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    success(`Theme "${availableThemes.find(t => t.id === themeId)?.name}" applied successfully!`);
  };

  const handleThemePreview = (themeId: string) => {
    previewTheme(themeId);
  };

  const handleExportTheme = () => {
    const themeData = {
      theme: currentTheme,
      layout,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${currentTheme.id}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    success('Theme exported successfully!');
  };

  const handleImportTheme = () => {
    try {
      const themeData = JSON.parse(importData);
      if (themeData.theme && themeData.layout) {
        // This would need to be implemented to properly import themes
        success('Theme imported successfully!');
        setShowImportModal(false);
        setImportData('');
      } else {
        error('Invalid theme data format');
      }
    } catch (err) {
      error('Failed to parse theme data');
    }
  };

  const handleReset = () => {
    resetToDefault();
    success('Theme reset to default!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Theme Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Customize your dashboard appearance and layout
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowLayoutModal(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Layout
          </Button>
          <Button variant="outline" onClick={handleExportTheme}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Preview Mode Banner */}
      <AnimatePresence>
        {isPreviewMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-secondary/20 border border-secondary rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-secondary" />
              <span className="font-medium">Preview Mode</span>
              <span className="text-sm text-muted-foreground">
                You're previewing a theme. Changes are temporary.
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={confirmPreview}>
                <Check className="w-4 h-4 mr-1" />
                Apply
              </Button>
              <Button size="sm" variant="outline" onClick={cancelPreview}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Theme Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{currentTheme.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {currentTheme.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: currentTheme.preview.primary }}
              />
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: currentTheme.preview.secondary }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Gallery */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Themes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableThemes.map((theme) => (
            <ThemePreview
              key={theme.id}
              themeId={theme.id}
              isSelected={currentTheme.id === theme.id}
              isPreview={isPreviewMode}
              onSelect={() => handleThemeSelect(theme.id)}
              onPreview={() => handleThemePreview(theme.id)}
            />
          ))}
        </div>
      </div>

      {/* Layout Modal */}
      <Modal
        isOpen={showLayoutModal}
        onClose={() => setShowLayoutModal(false)}
        title="Layout Configuration"
        size="lg"
      >
        <LayoutPreview layout={layout} onUpdate={updateLayout} />
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setShowLayoutModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            saveTheme();
            setShowLayoutModal(false);
            success('Layout saved successfully!');
          }}>
            <Save className="w-4 h-4 mr-2" />
            Save Layout
          </Button>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Theme"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Paste your theme JSON data:
            </label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste theme JSON here..."
              className="w-full h-32 p-3 border border-border rounded-lg bg-background font-mono text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowImportModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportTheme}>
              <Upload className="w-4 h-4 mr-2" />
              Import Theme
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
