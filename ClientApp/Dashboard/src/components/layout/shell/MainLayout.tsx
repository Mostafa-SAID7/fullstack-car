import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { useAuth } from '../../../hooks';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { SearchPalette } from './SearchPalette';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const location = useLocation();

    // Sidebar state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        // Start collapsed on smaller screens
        if (typeof window !== 'undefined') {
            return window.innerWidth < 1024; // lg breakpoint
        }
        return false;
    });
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Search state
    const [showSearch, setShowSearch] = useState(false);

    // Handle search shortcut
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

    // Handle window resize for responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint
            setSidebarCollapsed(!isLargeScreen);

            // Close mobile sidebar on large screens
            if (isLargeScreen && mobileSidebarOpen) {
                setMobileSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mobileSidebarOpen]);

    // Close mobile sidebar when route changes
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className={cn("flex h-screen bg-background overflow-hidden max-w-full", i18n.language.startsWith('ar') && "font-arabic text-right")} dir={i18n.language.startsWith('ar') ? 'rtl' : 'ltr'}>
            {/* Search Palette Modal */}
            <SearchPalette
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
            />

            {/* Email Confirmation Banner */}
            {user && !user.isEmailConfirmed && (
                <div className="bg-pink-50 text-pink-600 border-b border-pink-200 px-4 py-2 text-sm font-bold flex items-center justify-center gap-2">
                    <Bell className="w-4 h-4" />
                    {t('confirm_email_notice', 'Please confirm your email address to access all features.')}
                    <button className="underline hover:opacity-80 transition-opacity ml-2">{t('resend_confirmation', 'Resend confirmation')}</button>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                    isMobileOpen={mobileSidebarOpen}
                    onMobileClose={() => setMobileSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative main-content-bg max-w-full">
                    {/* Header */}
                    <AppHeader
                        onSearchClick={() => setShowSearch(true)}
                        onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
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
        </div>
    );
};
