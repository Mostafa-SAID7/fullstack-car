import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Bell,
    CheckCircle2,
    AlertCircle,
    Info,
    X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../services/notificationService';

export const NotificationDropdown: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef<HTMLDivElement>(null);

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

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'Success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'Warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
            case 'Error': return <X className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-muted relative transition-colors text-muted-foreground"
                title="Notifications"
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
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    {unreadCount} New
                                </span>
                            )}
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
                                            <p className="text-[11px] text-muted-foreground font-medium leading-normal line-clamp-2">
                                                {n.message}
                                            </p>
                                            <p className="text-[9px] text-primary/60 font-black mt-2 uppercase tracking-tight">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </p>
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
    );
};