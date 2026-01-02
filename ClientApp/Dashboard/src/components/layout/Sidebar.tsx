import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Users,
    Settings,
    Home,
    Grid,
    ChevronLeft,
    LogOut,
    Bot,
    Shield,
    Activity,
    FileText,
    Database
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    path: string;
    active?: boolean;
    collapsed?: boolean;
    onClick?: () => void;
    description?: string;
}

const SidebarItem = ({ icon: Icon, label, path, active, collapsed, onClick, description }: SidebarItemProps) => {
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
                "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 relative group",
                active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                collapsed && "justify-center px-2 py-2"
            )}
        >
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-primary-foreground rounded-r-full"
                />
            )}
            <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", active && "scale-110")} />
            {!collapsed && (
                <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{label}</div>
                    {description && (
                        <div className="text-xs text-muted-foreground/70 truncate mt-0.5">{description}</div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { 
            icon: Home, 
            label: t('dashboard'), 
            path: '/dashboard',
            description: 'Overview & Quick Stats'
        },
        { 
            icon: Activity, 
            label: t('analytics'), 
            path: '/analytics', 
            roles: ['Admin'],
            description: 'Reports & Performance Insights'
        },
        { 
            icon: Users, 
            label: t('user_management'), 
            path: '/users', 
            roles: ['Admin'],
            description: 'Manage Users & Permissions'
        },
        { 
            icon: FileText, 
            label: t('content_moderation'), 
            path: '/content', 
            roles: ['Admin'],
            description: 'Posts, Media & Community Content'
        },
        { 
            icon: Database, 
            label: t('system_management'), 
            path: '/system', 
            roles: ['Admin'],
            description: 'System Health & Configuration'
        },
        { 
            icon: Bot, 
            label: 'AI Agent Management', 
            path: '/ai-agent',
            roles: ['Admin'],
            description: 'AI Assistant & Automation'
        },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        !item.roles || item.roles.some(role => user?.roles?.includes(role))
    );

    return (
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
                        <span>ADMIN PANEL</span>
                    </motion.div>
                )}
                {collapsed && <Grid className="w-6 h-6 text-primary mx-auto" />}
                <button
                    onClick={onToggleCollapse}
                    className="p-1.5 rounded-md hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground"
                >
                    <ChevronLeft className={cn("w-5 h-5 transition-transform duration-500", collapsed && "rotate-180", i18n.language === 'ar' && "rotate-180")} />
                </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                {!collapsed && (
                    <div className="px-3 py-2 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-primary" />
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                                Admin Dashboard
                            </h3>
                        </div>
                        <p className="text-xs text-muted-foreground/60">
                            Manage your community platform
                        </p>
                    </div>
                )}
                
                {filteredMenuItems.map((item) => (
                    <SidebarItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        path={item.path}
                        active={location.pathname === item.path}
                        collapsed={collapsed}
                        description={item.description}
                    />
                ))}

                <div className="pt-4 mt-4 border-t border-border/50">
                    {!collapsed && (
                        <div className="px-3 py-2 mb-2">
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                                Account
                            </h3>
                        </div>
                    )}
                    <SidebarItem
                        icon={Settings}
                        label={t('settings')}
                        path="/settings"
                        active={location.pathname === '/settings'}
                        collapsed={collapsed}
                        description="Profile & Preferences"
                    />
                    <SidebarItem
                        icon={LogOut}
                        label={t('logout')}
                        path=""
                        collapsed={collapsed}
                        onClick={logout}
                        description="Sign out of dashboard"
                    />
                </div>
            </nav>
        </motion.aside>
    );
};