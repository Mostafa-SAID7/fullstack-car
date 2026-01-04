import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Settings,
  Bot,
  BarChart3,
  ArrowRight,
  Hash
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  category: string;
  keywords: string[];
}

export const SearchPalette: React.FC<SearchPaletteProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults: SearchResult[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'View main dashboard with analytics and stats',
      icon: BarChart3,
      path: '/dashboard',
      category: 'Pages',
      keywords: ['dashboard', 'overview', 'home', 'main']
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Detailed analytics and reporting',
      icon: TrendingUp,
      path: '/analytics',
      category: 'Pages',
      keywords: ['analytics', 'reports', 'charts', 'data']
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users, roles and permissions',
      icon: Users,
      path: '/users',
      category: 'Pages',
      keywords: ['users', 'management', 'roles', 'permissions']
    },
    {
      id: 'content',
      title: 'Content Management',
      description: 'Manage posts, comments and media',
      icon: FileText,
      path: '/content',
      category: 'Pages',
      keywords: ['content', 'posts', 'comments', 'media']
    },
    {
      id: 'ai-agent',
      title: 'AI Agent',
      description: 'Configure and monitor AI assistant',
      icon: Bot,
      path: '/ai-agent',
      category: 'Pages',
      keywords: ['ai', 'agent', 'assistant', 'bot', 'machine learning']
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'System settings and configuration',
      icon: Settings,
      path: '/settings',
      category: 'Pages',
      keywords: ['settings', 'configuration', 'preferences']
    }
  ];

  const recentSearches = [
    'User analytics',
    'Content moderation',
    'AI training status',
    'System performance'
  ];

  const filteredResults = query.length > 0
    ? searchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      )
    : searchResults;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            handleSelect(filteredResults[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredResults, onClose]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16 md:pt-[10vh]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder={t('search_anything', 'Search anything...')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-lg placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded border border-gray-300 dark:border-gray-600">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {query.length === 0 && (
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      onClick={() => setQuery(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredResults.length > 0 && (
              <div className="p-2">
                {filteredResults.map((result, index) => {
                  const Icon = result.icon;
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <motion.button
                      key={result.id}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left group",
                        isSelected
                          ? "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      )}
                      onClick={() => handleSelect(result)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-primary/20 text-primary"
                          : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={cn(
                            "font-semibold text-sm",
                            isSelected ? "text-primary" : "text-foreground"
                          )}>
                            {result.title}
                          </h4>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {result.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {result.description}
                        </p>
                      </div>
                      
                      <ArrowRight className={cn(
                        "w-4 h-4 transition-all",
                        isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                      )} />
                    </motion.button>
                  );
                })}
              </div>
            )}

            {query.length > 0 && filteredResults.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Hash className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try searching for something else or check your spelling.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">↵</kbd>
                  <span>Select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">ESC</kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};