import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Search,
    Bell,
    Sun,
    Moon,
    Laptop,
    Languages,
    CheckCircle2,
    AlertCircle,
    Info,
    X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../services/notificationService';

interface HeaderProps {
    onSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme, setTheme, resolvedTheme } = useTheme();

    // Notifications state
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Language state
    const [showLangMenu, setShowLangMenu] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    // Theme state
    const [showThemeMenu, setShowThemeMenu] = useState(false);
    const themeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await notificationService.getNotifications();
                if (res.succeeded && res.data) {
                    setNotifications(res.data);
                    setUnreadCount(res.data.filter(n => !n.isRead).length);
                }
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };

        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000); // Poll every minute
            return () => clearInterval(interval);
        }
    }, [user]);

    // Handle clicks outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setShowLangMenu(false);
            }
            if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
                setShowThemeMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const toggleLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setShowLangMenu(false);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    };

    const userRole = user?.roles?.includes('Admin') ? 'Administrator' : 'User';

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'Success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'Warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
            case 'Error': return <X className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <input
                        type="text"
                        placeholder={t('search_anything')}
                        className="w-full bg-muted/50 border border-transparent focus:border-primary/20 focus:bg-background h-10 pl-10 pr-4 rounded-lg outline-none transition-all"
                        onClick={onSearchClick}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-bold text-muted-foreground">⌘</kbd>
                        <kbd className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-bold text-muted-foreground">K</kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Theme Toggle */}
                <div className="relative" ref={themeRef}>
                    <button
                        onClick={() => setShowThemeMenu(!showThemeMenu)}
                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                        title="Toggle theme"
                    >
                        {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                    <AnimatePresence>
                        {showThemeMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50"
                            >
                                {[
                                    { id: 'light', icon: Sun, label: 'Light' },
                                    { id: 'dark', icon: Moon, label: 'Dark' },
                                    { id: 'system', icon: Laptop, label: 'System' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setTheme(item.id as any); setShowThemeMenu(false); }}
                                        className={cn(
                                            "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted",
                                            theme === item.id && "bg-primary/10 text-primary"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Language Switcher */}
                <div className="relative" ref={langRef}>
                    <button
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                        title="Switch language"
                    >
                        <Languages className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                        {showLangMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50"
                            >
                                {[
                                    { id: 'en-US', label: 'English', flag: '🇺🇸' },
                                    { id: 'ar-SA', label: 'العربية', flag: '🇸🇦' }
                                ].map((lang) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => toggleLanguage(lang.id)}
                                        className={cn(
                                            "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-muted",
                                            i18n.language === lang.id && "bg-primary/10 text-primary"
                                        )}
                                    >
                                        <span className="text-base">{lang.flag}</span>
                                        {lang.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-full hover:bg-muted relative transition-colors text-muted-foreground"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-50"
                            >
                                <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                                    <h4 className="font-black text-sm uppercase tracking-widest">{t('notifications')}</h4>
                                    {unreadCount > 0 && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                                </div>
                                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                                                className={cn(
                                                    "p-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/50 flex gap-4 ring-inset",
                                                    !n.isRead && "bg-primary/5"
                                                )}
                                            >
                                                <div className="mt-1">{getNotificationIcon(n.type)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-black mb-0.5">{n.title}</p>
                                                    <p className="text-[11px] text-muted-foreground font-medium leading-normal line-clamp-2">{n.message}</p>
                                                    <p className="text-[9px] text-primary/60 font-black mt-2 uppercase tracking-tight">{new Date(n.createdAt).toLocaleString()}</p>
                                                </div>
                                                {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-muted-foreground">
                                                <Bell className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-bold text-muted-foreground">All caught up!</p>
                                            <p className="text-xs text-muted-foreground/60 mt-1">No new notifications.</p>
                                        </div>
                                    )}
                                </div>
                                <button className="w-full p-3 text-[10px] font-black uppercase text-center hover:bg-muted transition-colors text-primary tracking-widest bg-muted/10">
                                    View All Notifications
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-8 w-px bg-border mx-1" />

                {/* User Menu */}
                <div className="flex items-center gap-3 cursor-pointer pl-1 group" onClick={() => navigate('/settings')}>
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-semibold group-hover:text-primary transition-colors">{user?.firstName} {user?.lastName}</div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded leading-none mt-1">{userRole}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary overflow-hidden group-hover:border-primary/50 transition-all group-hover:scale-105 shadow-lg shadow-primary/5">
                        {user?.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm font-black tracking-tighter">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};