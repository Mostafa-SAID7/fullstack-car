import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SearchPalette } from './SearchPalette';
import { AIAssistant } from '../../pages/dashboard/components/AIAssistant';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t, i18n } = useTranslation();
    const [collapsed, setCollapsed] = useState(() => {
        // Start collapsed on mobile screens
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768;
        }
        return false;
    });
    const { user } = useAuth();
    const location = useLocation();

    // Search state
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const handleSearchShortcut = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearch(true);
            }
        };

        window.addEventListener('keydown', handleSearchShortcut);
        return () => window.removeEventListener('keydown', handleSearchShortcut);
    }, []);

    return (
        <div className={cn("flex h-screen bg-white dark:bg-gray-900 overflow-hidden flex-col", i18n.language.startsWith('ar') && "font-arabic text-right")} dir={i18n.language.startsWith('ar') ? 'rtl' : 'ltr'}>
            {/* Mobile Sidebar Backdrop */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}

            {/* Search Palette Modal */}
            <SearchPalette
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
            />

            {/* Email Confirmation Banner */}
            {user && !user.isEmailConfirmed && (
                <div className="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-b border-pink-200 dark:border-pink-800 px-4 py-2 text-sm font-bold flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4" />
                    {t('confirm_email_notice', 'Please confirm your email address to access all features.')}
                    <button className="underline hover:opacity-80 transition-opacity ml-2">{t('resend_confirmation', 'Resend confirmation')}</button>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    collapsed={collapsed}
                    onToggleCollapse={() => setCollapsed(!collapsed)}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative main-content-bg">
                    {/* Background Decor */}
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/5 dark:bg-pink-400/10 rounded-full blur-[120px] -z-10" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-pink-500/10 dark:bg-pink-400/20 rounded-full blur-[100px] -z-10" />

                    {/* Header */}
                    <Header
                        onSearchClick={() => setShowSearch(true)}
                        onToggleSidebar={() => setCollapsed(!collapsed)}
                    />

                    {/* Scrollable Content */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-transparent transition-colors custom-scrollbar">
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
            <AIAssistant />
        </div>
    );
};
