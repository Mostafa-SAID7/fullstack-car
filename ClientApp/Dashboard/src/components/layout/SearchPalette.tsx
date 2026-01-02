import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Search,
    ChevronLeft,
    Settings,
    LogOut,
    Sun,
    Moon,
    Home,
    Activity,
    Users,
    FileText,
    Database,
    Bot
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchPalette: React.FC<SearchPaletteProps> = ({ isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { setTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleSearchShortcut = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleSearchShortcut);
            return () => window.removeEventListener('keydown', handleSearchShortcut);
        }
    }, [isOpen, onClose]);

    const menuItems = [
        { 
            icon: Home, 
            label: t('dashboard'), 
            path: '/dashboard',
            type: 'page'
        },
        { 
            icon: Activity, 
            label: t('analytics'), 
            path: '/analytics', 
            roles: ['Admin'],
            type: 'page'
        },
        { 
            icon: Users, 
            label: t('user_management'), 
            path: '/users', 
            roles: ['Admin'],
            type: 'page'
        },
        { 
            icon: FileText, 
            label: t('content_moderation'), 
            path: '/content', 
            roles: ['Admin'],
            type: 'page'
        },
        { 
            icon: Database, 
            label: t('system_management'), 
            path: '/system', 
            roles: ['Admin'],
            type: 'page'
        },
        { 
            icon: Bot, 
            label: 'AI Agent Management', 
            path: '/ai-agent',
            roles: ['Admin'],
            type: 'page'
        },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        !item.roles || item.roles.some(role => user?.roles?.includes(role))
    );

    const searchItems = [
        ...filteredMenuItems,
        { icon: Settings, label: t('settings'), path: '/settings', type: 'page' },
        { icon: LogOut, label: t('logout'), path: '', type: 'action', onClick: logout },
        { icon: Moon, label: 'Dark Mode', type: 'theme', onClick: () => setTheme('dark') },
        { icon: Sun, label: 'Light Mode', type: 'theme', onClick: () => setTheme('light') },
    ];

    const filteredSearchItems = searchQuery
        ? searchItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : searchItems.slice(0, 5);

    const handleSearchClick = (item: any) => {
        if (item.onClick) {
            item.onClick();
        } else if (item.path) {
            navigate(item.path);
        }
        onClose();
        setSearchQuery('');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden relative z-[110]"
                    ref={searchRef}
                >
                    <div className="p-4 border-b border-border flex items-center gap-4">
                        <Search className="w-5 h-5 text-primary" />
                        <input
                            autoFocus
                            type="text"
                            placeholder={t('search_anything')}
                            className="flex-1 bg-transparent border-none outline-none text-lg font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="flex items-center gap-1">
                            <kbd className="px-2 py-1 rounded bg-muted text-[10px] font-bold text-muted-foreground border border-border">ESC</kbd>
                        </div>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                        {filteredSearchItems.length > 0 ? (
                            <div className="space-y-1">
                                <p className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Suggestions</p>
                                {filteredSearchItems.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSearchClick(item)}
                                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-primary/10 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-muted rounded-xl group-hover:bg-primary/20 transition-colors">
                                                <item.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="font-bold">{item.label}</span>
                                        </div>
                                        <ChevronLeft className={cn("w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all rotate-180", i18n.language === 'ar' && "rotate-0")} />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-sm font-bold text-muted-foreground">No results found for "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-muted/30 border-t border-border flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-card border border-border text-[9px]">↵</kbd> Select</span>
                            <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-card border border-border text-[9px]">↓↑</kbd> Navigate</span>
                        </div>
                        <span>Press Esc to close</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};