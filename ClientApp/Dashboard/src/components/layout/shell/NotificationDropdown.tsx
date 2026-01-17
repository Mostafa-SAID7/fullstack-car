import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Bell,
    CheckCircle2,
    Info,
    X,
    AlertTriangle,
    Settings,
    Trash2
} from 'lucide-react';
import { useAuth } from '../../../hooks';
import { notificationService } from '../../../services/notification';
import { signalRManager } from '../../../services/notification/signalr';
import { formatNotificationTime } from '../../../utils/notification';
import type { NotificationDto } from '../../../types/notification';

export const NotificationDropdown: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'marketplace'>('all');
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);

    const handleNotificationSettings = () => {
        setShowNotificationSettings(!showNotificationSettings);
        // You can also navigate to a settings page if you have routing
        // navigate('/settings/notifications');
    };
    const notificationRef = useRef<HTMLDivElement>(null);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        
        setLoading(true);
        try {
            const res = await notificationService.getNotifications({ page: 1, pageSize: 50 });
            setNotifications(res.notifications);
            setUnreadCount(res.unreadCount);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Set up real-time notifications
    useEffect(() => {
        if (user) {
            fetchNotifications();
            
            // Connect to SignalR
            signalRManager.connect().catch(console.error);
            
            // Subscribe to real-time notifications
            const unsubscribe = signalRManager.subscribe((notification: NotificationDto) => {
                setNotifications(prev => [notification, ...prev]);
                if (!notification.isRead) {
                    setUnreadCount(prev => prev + 1);
                }
                
                // Show browser notification if permission granted
                if (Notification.permission === 'granted') {
                    new Notification(notification.title, {
                        body: notification.message,
                        icon: '/favicon.ico',
                        tag: notification.id
                    });
                }
            });
            
            unsubscribeRef.current = unsubscribe;
            
            return () => {
                if (unsubscribeRef.current && typeof unsubscribeRef.current === 'function') {
                    unsubscribeRef.current();
                    unsubscribeRef.current = null;
                }
            };
        }
        
        return () => {
            if (unsubscribeRef.current && typeof unsubscribeRef.current === 'function') {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [user, fetchNotifications]);

    // Request notification permission
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
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

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all notifications as read:', err);
        }
    };

    const handleDeleteNotification = async (id: string, event: React.MouseEvent) => {
        event.stopPropagation();
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            const deletedNotification = notifications.find(n => n.id === id);
            if (deletedNotification && !deletedNotification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
            case 'error': return <X className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    const getPriorityIndicator = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />;
            case 'critical': return <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />;
            default: return null;
        }
    };

    const getCategoryBadge = (category: string) => {
        const colors = {
            system: 'bg-blue-100 text-blue-800',
            marketplace: 'bg-green-100 text-green-800',
            security: 'bg-red-100 text-red-800',
            promotion: 'bg-purple-100 text-purple-800',
            user: 'bg-gray-100 text-gray-800'
        };
        
        return (
            <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                colors[category as keyof typeof colors] || colors.user
            )}>
                {category}
            </span>
        );
    };

    const filteredNotifications = notifications.filter(notification => {
        switch (filter) {
            case 'unread': return !notification.isRead;
            case 'system': return notification.category === 'system';
            case 'marketplace': return notification.category === 'marketplace';
            default: return true;
        }
    });

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors text-gray-500"
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>
            
            <AnimatePresence>
                {showNotifications && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200/50 bg-gray-50/80 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-black text-sm uppercase tracking-widest">{t('notifications')}</h4>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllAsRead}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                    <span className="text-[10px] font-bold bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full">
                                        {unreadCount} New
                                    </span>
                                </div>
                            </div>
                            
                            {/* Filter tabs */}
                            <div className="flex gap-1">
                                {(['all', 'unread', 'system', 'marketplace'] as const).map((filterType) => (
                                    <button
                                        key={filterType}
                                        onClick={() => setFilter(filterType)}
                                        className={cn(
                                            'px-3 py-1 text-xs font-medium rounded-full transition-colors capitalize',
                                            filter === filterType
                                                ? 'bg-blue-500 text-white shadow-sm'
                                                : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                                        )}
                                    >
                                        {filterType}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notifications list */}
                        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                    <p className="text-sm text-muted-foreground">Loading notifications...</p>
                                </div>
                            ) : filteredNotifications.length > 0 ? (
                                filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                                        className={cn(
                                            "p-4 border-b border-gray-200/50 cursor-pointer transition-colors hover:bg-gray-50/80 relative group",
                                            !notification.isRead && "bg-blue-50/80"
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1 flex items-center gap-2">
                                                {getNotificationIcon(notification.type)}
                                                {getPriorityIndicator(notification.priority)}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <p className="text-xs font-black line-clamp-1">{notification.title}</p>
                                                    {getCategoryBadge(notification.category)}
                                                </div>
                                                
                                                <p className="text-[11px] text-gray-600 font-medium leading-normal line-clamp-2 mb-2">
                                                    {notification.message}
                                                </p>
                                                
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[9px] text-pink-500/60 font-black uppercase tracking-tight">
                                                        {formatNotificationTime(notification.createdAt)}
                                                    </p>
                                                    
                                                    <button
                                                        onClick={(e) => handleDeleteNotification(notification.id, e)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-red-500 transition-all"
                                                        title="Delete notification"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center text-gray-400">
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">
                                        {filter === 'all' ? 'All caught up!' : `No ${filter} notifications`}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {filter === 'all' ? 'No new notifications.' : `No ${filter} notifications found.`}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200/50 bg-gray-50/80 backdrop-blur-sm">
                            <button 
                                onClick={handleNotificationSettings}
                                className="w-full p-3 text-[10px] font-black uppercase text-center hover:bg-gray-100/80 transition-colors text-blue-600 tracking-widest flex items-center justify-center gap-2"
                            >
                                <Settings className="w-3 h-3" />
                                Notification Settings
                            </button>
                            
                            {/* Settings dropdown */}
                            {showNotificationSettings && (
                                <div className="border-t border-gray-200/50 bg-white/95 p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-700">Browser Notifications</span>
                                        <button className="w-8 h-4 bg-blue-500 rounded-full relative">
                                            <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-700">Email Notifications</span>
                                        <button className="w-8 h-4 bg-gray-300 rounded-full relative">
                                            <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform"></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-700">Sound Alerts</span>
                                        <button className="w-8 h-4 bg-blue-500 rounded-full relative">
                                            <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
