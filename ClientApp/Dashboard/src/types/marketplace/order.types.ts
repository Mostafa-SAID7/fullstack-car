/**
 * Order Types for Marketplace Integration
 */

export const OrderStatus = {
    Pending: 'Pending',
    Confirmed: 'Confirmed',
    InProgress: 'InProgress',
    Completed: 'Completed',
    Cancelled: 'Cancelled',
    Rescheduled: 'Rescheduled'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface OrderDto {
    id: string;
    orderNumber: string;
    customerId: string;
    serviceId?: string;
    productId?: string;
    status: OrderStatus;
    totalAmount: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderFilters {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: OrderStatus;
    customerId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface TransactionDto {
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    createdAt: string;
}
