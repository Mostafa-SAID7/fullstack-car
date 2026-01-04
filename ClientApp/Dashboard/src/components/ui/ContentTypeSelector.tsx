import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, FileText, MessageSquare, Image, Video, Calendar, Users, Star, Flag, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type ContentType =
  | 'posts'
  | 'comments'
  | 'media'
  | 'events'
  | 'groups'
  | 'reviews'
  | 'reports'
  | 'announcements';

export interface ContentTypeOption {
  id: ContentType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

export const contentTypes: ContentTypeOption[] = [
  {
    id: 'posts',
    label: 'Posts',
    icon: FileText,
    description: 'User posts and articles',
    color: 'text-blue-600'
  },
  {
    id: 'comments',
    label: 'Comments',
    icon: MessageSquare,
    description: 'Post comments and replies',
    color: 'text-green-600'
  },
  {
    id: 'media',
    label: 'Media',
    icon: Image,
    description: 'Images, videos, and files',
    color: 'text-purple-600'
  },
  {
    id: 'events',
    label: 'Events',
    icon: Calendar,
    description: 'Community events and meetups',
    color: 'text-orange-600'
  },
  {
    id: 'groups',
    label: 'Groups',
    icon: Users,
    description: 'Community groups and forums',
    color: 'text-cyan-600'
  },
  {
    id: 'reviews',
    label: 'Reviews',
    icon: Star,
    description: 'Product and service reviews',
    color: 'text-yellow-600'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: Flag,
    description: 'Reported content',
    color: 'text-red-600'
  },
  {
    id: 'announcements',
    label: 'Announcements',
    icon: AlertTriangle,
    description: 'Official announcements',
    color: 'text-indigo-600'
  }
];

interface ContentTypeSelectorProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
  className?: string;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = contentTypes.find(type => type.id === selectedType);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors min-w-[200px]"
      >
        {selectedOption && (
          <>
            <selectedOption.icon className={cn("w-5 h-5", selectedOption.color)} />
            <div className="flex-1 text-left">
              <span className="font-medium text-sm">{selectedOption.label}</span>
              <p className="text-xs text-muted-foreground">{selectedOption.description}</p>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-2">
              <h3 className="text-sm font-semibold text-foreground mb-2 px-2">Content Types</h3>
              <div className="space-y-1">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        onTypeChange(type.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left hover:bg-muted/50 transition-colors",
                        selectedType === type.id && "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className={cn("w-5 h-5 flex-shrink-0", type.color)} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-muted-foreground truncate">{type.description}</div>
                      </div>
                      {selectedType === type.id && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
