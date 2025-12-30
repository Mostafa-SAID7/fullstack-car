import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    BarChart2,
    Users,
    Settings,
    Home,
    Search,
    Bell,
    Grid,
    ChevronLeft,
    LogOut,
    Package,
    Sun,
    Moon,
    Laptop,
    Languages,
    CheckCircle2,
    AlertCircle,
    Info,
    X,
    Bot
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../services/notificationService';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    path: string;
    active?: boolean;
    collapsed?: boolean;
    onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, path, active, collapsed, onClick }: SidebarItemProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(path);
        }
    };

    return (
        <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 relative group",
                active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                collapsed && "justify-center px-2"
            )}
        >
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-primary-foreground rounded-r-full"
                />
            )}
            <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", active && "scale-110")} />
            {!collapsed && <span className="font-medium truncate">{label}</span>}
        </motion.div>
    );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const location = useLocation();

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

    const menuItems = [
        { icon: Home, label: t('overview'), path: '/dashboard' },
        { icon: BarChart2, label: t('analytics'), path: '/analytics', roles: ['Administrator'] },
        { icon: Users, label: t('customers'), path: '/customers', roles: ['Administrator'] },
        { icon: Package, label: t('products'), path: '/products' },
        { icon: Bot, label: 'AI Agent', path: '/ai-agent' },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        !item.roles || item.roles.some(role => user?.roles?.includes(role))
    );

    const userRole = user?.roles?.includes('Administrator') ? 'Administrator' : 'User';

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'Success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'Warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
            case 'Error': return <X className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    // Search state
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleSearchShortcut = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearch(true);
            }
            if (e.key === 'Escape') {
                setShowSearch(false);
            }
        };

        window.addEventListener('keydown', handleSearchShortcut);
        return () => window.removeEventListener('keydown', handleSearchShortcut);
    }, []);

    const searchItems = [
        ...filteredMenuItems.map(item => ({ ...item, type: 'page' })),
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
        setShowSearch(false);
        setSearchQuery('');
    };

    return (
        <div className={cn("flex h-screen bg-background overflow-hidden flex-col", i18n.language.startsWith('ar') && "font-arabic text-right")} dir={i18n.language.startsWith('ar') ? 'rtl' : 'ltr'}>
            {/* Search Palette Modal */}
            <AnimatePresence>
                {showSearch && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                            onClick={() => setShowSearch(false)}
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
                )}
            </AnimatePresence>

            {/* Email Confirmation Banner */}
            {user && !user.isEmailConfirmed && (
                <div className="bg-primary/10 text-primary border-b border-primary/20 px-4 py-2 text-sm font-bold flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4" />
                    {t('confirm_email_notice', 'Please confirm your email address to access all features.')}
                    <button className="underline hover:opacity-80 transition-opacity ml-2">{t('resend_confirmation', 'Resend confirmation')}</button>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{ width: collapsed ? 64 : 256 }}
                    className={cn(
                        "flex flex-col border-r border-border bg-card/50 backdrop-blur-xl transition-colors duration-300 ease-in-out z-20",
                    )}
                >
                    <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary px-2"
                            >
                                <Grid className="w-6 h-6" />
                                <span>DASHBOARD</span>
                            </motion.div>
                        )}
                        {collapsed && <Grid className="w-6 h-6 text-primary mx-auto" />}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-1.5 rounded-md hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground"
                        >
                            <ChevronLeft className={cn("w-5 h-5 transition-transform duration-500", collapsed && "rotate-180", i18n.language === 'ar' && "rotate-180")} />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {filteredMenuItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                path={item.path}
                                active={location.pathname === item.path}
                                collapsed={collapsed}
                            />
                        ))}

                        <div className="pt-4 mt-4 border-t border-border/50">
                            <SidebarItem
                                icon={Settings}
                                label={t('settings')}
                                path="/settings"
                                active={location.pathname === '/settings'}
                                collapsed={collapsed}
                            />
                            <SidebarItem
                                icon={LogOut}
                                label={t('logout')}
                                path=""
                                collapsed={collapsed}
                                onClick={logout}
                            />
                        </div>
                    </nav>
                </motion.aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    {/* Background Decor */}
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] -z-10" />

                    {/* Topbar */}
                    <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
                        <div className="flex-1 max-w-xl">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <input
                                    type="text"
                                    placeholder={t('search_anything')}
                                    className="w-full bg-muted/50 border border-transparent focus:border-primary/20 focus:bg-background h-10 pl-10 pr-4 rounded-lg outline-none transition-all"
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

                    {/* Scrollable Content */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/40 transition-colors">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-7xl mx-auto"
                        >
                            {children}
                        </motion.div>
                    </main>
                </div>
            </div>
        </div>
    );
};
