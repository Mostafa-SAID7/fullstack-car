import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Send,
    Users,
    Search,
    Trash2,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
    Info,
    X,
    Plus,
    Settings
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components';
import { notificationService } from '../../../services/notification';
import { formatNotificationTime } from '../../../utils/notification';
import type { NotificationDto, NotificationFilters, NotificationType, NotificationCategory, NotificationStatsResponse } from '../../../types/notification';

interface NotificationStats {
    total: number;
    unread: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
}

export const NotificationManagement: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const [stats, setStats] = useState<NotificationStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
    const [filter, setFilter] = useState<{
        type: NotificationType | '';
        category: NotificationCategory | '';
        read: 'read' | 'unread' | '';
        search: string;
    }>({
        type: '',
        category: '',
        read: '',
        search: ''
    });

    useEffect(() => {
        fetchNotifications();
        fetchStats();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const filters: NotificationFilters = {
                page: 1,
                pageSize: 100
            };

            if (filter.type) filters.type = filter.type as string;
            if (filter.category) filters.category = filter.category as string;
            if (filter.read === 'read') filters.isRead = true;
            if (filter.read === 'unread') filters.isRead = false;

            const response = await notificationService.getNotifications(filters);
            setNotifications(response.notifications);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await notificationService.getStats();
            setStats(response);
        } catch (error) {
            console.error('Failed to fetch notification stats:', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            fetchStats();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            fetchStats();
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            setSelectedNotifications(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
            fetchStats();
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleBulkDelete = async () => {
        const promises = Array.from(selectedNotifications).map(id => 
            notificationService.deleteNotification(id)
        );
        
        try {
            await Promise.all(promises);
            setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
            setSelectedNotifications(new Set());
            fetchStats();
        } catch (error) {
            console.error('Failed to delete notifications:', error);
        }
    };

    const handleSelectNotification = (id: string) => {
        setSelectedNotifications(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedNotifications.size === notifications.length) {
            setSelectedNotifications(new Set());
        } else {
            setSelectedNotifications(new Set(notifications.map(n => n.id)));
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
            case 'error': return <X className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'success': return 'bg-emerald-100 text-emerald-800';
            case 'warning': return 'bg-orange-100 text-orange-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'system': return 'bg-blue-100 text-blue-800';
            case 'marketplace': return 'bg-green-100 text-green-800';
            case 'security': return 'bg-red-100 text-red-800';
            case 'promotion': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        if (filter.type && notification.type !== filter.type) return false;
        if (filter.category && notification.category !== filter.category) return false;
        if (filter.read === 'read' && !notification.isRead) return false;
        if (filter.read === 'unread' && notification.isRead) return false;
        if (filter.search && !notification.title.toLowerCase().includes(filter.search.toLowerCase()) && 
            !notification.message.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
                    <p className="text-gray-600 mt-1">Manage system notifications and user communications</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => console.log('Broadcast modal - TODO: implement')}
                        className="flex items-center gap-2"
                        variant="outline"
                    >
                        <Send className="w-4 h-4" />
                        Broadcast
                    </Button>
                    <Button
                        onClick={() => console.log('Create modal - TODO: implement')}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Notification
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Bell className="w-8 h-8 text-blue-500" />
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Unread</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.unread}</p>
                            </div>
                            <EyeOff className="w-8 h-8 text-orange-500" />
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">System Notifications</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.byCategory.system || 0}</p>
                            </div>
                            <Settings className="w-8 h-8 text-blue-500" />
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Marketplace</p>
                                <p className="text-2xl font-bold text-green-600">{stats.byCategory.marketplace || 0}</p>
                            </div>
                            <Users className="w-8 h-8 text-green-500" />
                        </div>
                    </Card>
                </div>
            )}

            {/* Filters and Actions */}
            <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={filter.search}
                                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <select
                            value={filter.type}
                            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as NotificationType | '' }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Types</option>
                            <option value="success">Success</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                            <option value="info">Info</option>
                        </select>

                        <select
                            value={filter.category}
                            onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value as NotificationCategory | '' }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            <option value="system">System</option>
                            <option value="marketplace">Marketplace</option>
                            <option value="security">Security</option>
                            <option value="promotion">Promotion</option>
                        </select>

                        <select
                            value={filter.read}
                            onChange={(e) => setFilter(prev => ({ ...prev, read: e.target.value as 'read' | 'unread' | '' }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="read">Read</option>
                            <option value="unread">Unread</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        {selectedNotifications.size > 0 && (
                            <Button
                                onClick={handleBulkDelete}
                                variant="outline"
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Selected ({selectedNotifications.size})
                            </Button>
                        )}
                        <Button
                            onClick={handleMarkAllAsRead}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            Mark All Read
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Notifications List */}
            <Card>
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Notifications ({filteredNotifications.length})</h3>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedNotifications.size === notifications.length && notifications.length > 0}
                                onChange={handleSelectAll}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Select All</span>
                        </label>
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading notifications...</p>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-6 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedNotifications.has(notification.id)}
                                        onChange={() => handleSelectNotification(notification.id)}
                                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />

                                    <div className="mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                                {notification.title}
                                            </h4>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Badge className={getTypeColor(notification.type)}>
                                                    {notification.type}
                                                </Badge>
                                                <Badge className={getCategoryColor(notification.category)}>
                                                    {notification.category}
                                                </Badge>
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {notification.message}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-500">
                                                {formatNotificationTime(notification.createdAt)}
                                            </p>

                                            <div className="flex items-center gap-2">
                                                {!notification.isRead && (
                                                    <Button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Mark Read
                                                    </Button>
                                                )}
                                                <Button
                                                    onClick={() => handleDeleteNotification(notification.id)}
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-xs text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">No notifications found</p>
                            <p className="text-sm text-gray-500">Try adjusting your filters or create a new notification</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};