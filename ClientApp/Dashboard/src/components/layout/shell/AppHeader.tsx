import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Menu } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationDropdown } from './NotificationDropdown';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
    onSearchClick?: () => void;
    onToggleMobileSidebar?: () => void;
}

export const AppHeader: React.FC<HeaderProps> = ({ onSearchClick, onToggleMobileSidebar }) => {
    const { t } = useTranslation();

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-border main-content-bg sticky top-0 z-50">
            {/* Mobile Menu Button */}
            <button
                onClick={onToggleMobileSidebar}
                className="md:hidden p-2 mr-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Open sidebar"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Spacer for center alignment on larger screens */}
            <div className="flex-1 hidden lg:block"></div>

            <div className="flex items-center gap-1 md:gap-2">
                {/* Search - Hidden on mobile, visible on md+ */}
                <div className="hidden md:flex flex-1 max-w-xl ml-4">
                    <button
                        onClick={onSearchClick}
                        className="relative group w-full text-left"
                    >
                        <div className="w-full bg-muted/50 border border-transparent hover:border-primary/20 hover:bg-background h-10 pl-10 pr-4 rounded-lg outline-none transition-all flex items-center">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <span className="text-muted-foreground text-sm">{t('search_anything')}</span>
                            <div className="ml-auto hidden lg:flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 rounded border border-border bg-card text-[10px] font-bold text-muted-foreground">⌘</kbd>
                                <kbd className="px-1.5 py-0.5 rounded border border-border bg-card text-[10px] font-bold text-muted-foreground">K</kbd>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-1">
                    {/* Mobile Search Button */}
                    <button
                        onClick={onSearchClick}
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                        title="Search"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Language Switcher */}
                    <LanguageSwitcher />

                    {/* Notifications */}
                    <NotificationDropdown />

                    {/* Theme Toggle */}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

