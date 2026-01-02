import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SearchPalette } from './SearchPalette';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t, i18n } = useTranslation();
    const [collapsed, setCollapsed] = useState(false);
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
        <div className={cn("flex h-screen bg-background overflow-hidden flex-col", i18n.language.startsWith('ar') && "font-arabic text-right")} dir={i18n.language.startsWith('ar') ? 'rtl' : 'ltr'}>
            {/* Search Palette Modal */}
            <SearchPalette 
                isOpen={showSearch} 
                onClose={() => setShowSearch(false)} 
            />

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
                <Sidebar 
                    collapsed={collapsed} 
                    onToggleCollapse={() => setCollapsed(!collapsed)} 
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    {/* Background Decor */}
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] -z-10" />

                    {/* Header */}
                    <Header onSearchClick={() => setShowSearch(true)} />

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
