/**
 * Customer Types for Marketplace Integration
 */

export const CustomerStatus = {
    Active: 'Active',
    Inactive: 'Inactive',
    Suspended: 'Suspended',
    Pending: 'Pending'
} as const;

export type CustomerStatus = typeof CustomerStatus[keyof typeof CustomerStatus];

export const CustomerType = {
    Regular: 'Regular',
    Premium: 'Premium',
    VIP: 'VIP',
    Corporate: 'Corporate'
} as const;

export type CustomerType = typeof CustomerType[keyof typeof CustomerType];

export interface CustomerDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    status: CustomerStatus;
    type: CustomerType;
    company?: string;
    jobTitle?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate?: string;
    lastLoginDate?: string;
    preferredLanguage?: string;
    preferredCurrency?: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    marketingOptIn: boolean;
    notes?: string;
    tags?: string;
    assignedSalesRepId?: string;
    lifetimeValue: number;
    loyaltyPoints: number;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerFilters {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: CustomerStatus;
    type?: CustomerType;
    country?: string;
    city?: string;
    minSpent?: number;
    maxSpent?: number;
    registeredAfter?: string;
    registeredBefore?: string;
    hasOrders?: boolean;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export interface CustomerAnalytics {
    overview: {
        totalOrders: number;
        totalSpent: number;
        averageOrderValue: number;
        lifetimeValue: number;
        loyaltyPoints: number;
        lastActivity: string;
    };
    orderHistory: any[];
    purchasePatterns: any[];
    preferences: any[];
    interactions: any[];
}
