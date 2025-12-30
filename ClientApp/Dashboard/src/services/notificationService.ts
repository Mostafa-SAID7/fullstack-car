import { apiClient } from './api';
import type { ApiResult } from '../types/auth';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'Info' | 'Success' | 'Warning' | 'Error';
    isRead: boolean;
    createdAt: string;
}

class NotificationService {
    async getNotifications(): Promise<ApiResult<Notification[]>> {
        return apiClient.get<ApiResult<Notification[]>>('/v4.0/shared/notifications');
    }

    async markAsRead(id: string): Promise<ApiResult<void>> {
        return apiClient.patch<ApiResult<void>>(`/v4.0/shared/notifications/${id}/read`, {});
    }
}

export const notificationService = new NotificationService();
