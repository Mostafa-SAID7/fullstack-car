/**
 * Service Types for Marketplace Integration
 * These types match the backend Service entity and DTOs
 */

/**
 * Service type enum matching backend ServiceType
 */
export const ServiceType = {
  Maintenance: 'Maintenance',
  Repair: 'Repair',
  Inspection: 'Inspection',
  Cleaning: 'Cleaning',
  Towing: 'Towing',
  Insurance: 'Insurance',
  Rental: 'Rental',
  Parts: 'Parts',
  Consultation: 'Consultation',
  Emergency: 'Emergency'
} as const;

export type ServiceType = typeof ServiceType[keyof typeof ServiceType];

/**
 * Service status enum matching backend ServiceStatus
 */
export const ServiceStatus = {
  Draft: 'Draft',
  Active: 'Active',
  Inactive: 'Inactive',
  Suspended: 'Suspended',
  Archived: 'Archived'
} as const;

export type ServiceStatus = typeof ServiceStatus[keyof typeof ServiceStatus];

/**
 * Service DTO matching backend ServiceDto
 */
export interface ServiceDto {
  /** Unique identifier */
  id: string;
  /** Service provider ID */
  serviceProviderId: string;
  /** Service name */
  name: string;
  /** Service title */
  title: string;
  /** Full description */
  description: string;
  /** Short description */
  shortDescription: string;
  /** Base price */
  basePrice: number;
  /** Maximum price (optional) */
  maxPrice?: number;
  /** Estimated duration in minutes */
  estimatedDuration: number;
  /** Maximum duration in minutes (optional) */
  maxDuration?: number;
  /** Service type */
  serviceType: ServiceType;
  /** Service category */
  category: string;
  /** Service sub-category (optional) */
  subCategory?: string;
  /** Service status */
  status: ServiceStatus;
  /** Whether service is active */
  isActive: boolean;
  /** Whether service is popular */
  isPopular: boolean;
  /** Whether service requires approval */
  requiresApproval: boolean;
  /** Service requirements (optional) */
  requirements?: string;
  /** What's included (optional) */
  inclusions?: string;
  /** What's excluded (optional) */
  exclusions?: string;
  /** Comma-separated tags (optional) */
  tags?: string;
  /** Sort order */
  sortOrder: number;
  /** Average rating */
  averageRating: number;
  /** Total number of reviews */
  totalReviews: number;
  /** Total number of bookings */
  totalBookings: number;
  /** Primary image URL (optional) */
  imageUrl?: string;
  /** Additional service images (optional) */
  images?: string[];
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** User who created the service */
  createdByUserId?: string;
  /** User who last updated the service */
  updatedByUserId?: string;
}

/**
 * Request DTO for creating a new service
 */
export interface CreateServiceRequest {
  /** Service provider ID */
  serviceProviderId: string;
  /** Service name */
  name: string;
  /** Service title */
  title: string;
  /** Full description */
  description: string;
  /** Short description */
  shortDescription: string;
  /** Base price */
  basePrice: number;
  /** Maximum price (optional) */
  maxPrice?: number;
  /** Estimated duration in minutes */
  estimatedDuration: number;
  /** Maximum duration in minutes (optional) */
  maxDuration?: number;
  /** Service type */
  serviceType: ServiceType;
  /** Service category */
  category: string;
  /** Service sub-category (optional) */
  subCategory?: string;
  /** Service requirements (optional) */
  requirements?: string;
  /** What's included (optional) */
  inclusions?: string;
  /** What's excluded (optional) */
  exclusions?: string;
  /** Comma-separated tags (optional) */
  tags?: string;
  /** Whether service requires approval (optional, defaults to false) */
  requiresApproval?: boolean;
  /** Sort order (optional, defaults to 0) */
  sortOrder?: number;
}

/**
 * Request DTO for updating an existing service
 * All fields are optional except id
 */
export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  /** Service ID */
  id: string;
  /** Whether service is active (optional) */
  isActive?: boolean;
  /** Whether service is popular (optional) */
  isPopular?: boolean;
  /** Service status (optional) */
  status?: ServiceStatus;
}

/**
 * Filter parameters for service queries
 */
export interface ServiceFilters {
  /** Page number for pagination */
  page?: number;
  /** Page size for pagination */
  pageSize?: number;
  /** Search term for name/description */
  searchTerm?: string;
  /** Filter by service type */
  type?: ServiceType;
  /** Filter by category */
  category?: string;
  /** Filter by status */
  status?: ServiceStatus;
  /** Filter by provider ID */
  serviceProviderId?: string;
  /** Minimum price filter */
  minPrice?: number;
  /** Maximum price filter */
  maxPrice?: number;
  /** Filter emergency services */
  isEmergencyService?: boolean;
  /** Filter 24x7 available services */
  isAvailable24x7?: boolean;
  /** Minimum rating filter */
  minRating?: number;
  /** Filter active services */
  isActive?: boolean;
  /** Filter popular services */
  isPopular?: boolean;
  /** Sort field */
  sortBy?: string;
  /** Sort descending */
  sortDescending?: boolean;
}

/**
 * Service statistics DTO
 */
export interface ServiceStatistics {
  /** Total number of services */
  totalServices: number;
  /** Number of active services */
  activeServices: number;
  /** Number of inactive services */
  inactiveServices: number;
  /** Number of suspended services */
  suspendedServices: number;
  /** Total revenue from all services */
  totalRevenue: number;
  /** Total bookings count */
  totalBookings: number;
  /** Average service rating */
  averageRating: number;
  /** Most popular services */
  popularServices?: ServiceDto[];
  /** Services by type breakdown */
  servicesByType?: Record<ServiceType, number>;
  /** Booking trends */
  bookingTrends?: {
    date: string;
    bookings: number;
    revenue: number;
  }[];
}

/**
 * Service provider DTO (basic info)
 */
export interface ServiceProviderDto {
  /** Unique identifier */
  id: string;
  /** Provider name */
  name: string;
  /** Provider description */
  description?: string;
  /** Contact email */
  email?: string;
  /** Contact phone */
  phone?: string;
  /** Provider address */
  address?: string;
  /** Provider city */
  city?: string;
  /** Provider rating */
  rating: number;
  /** Total reviews */
  totalReviews: number;
  /** Whether provider is verified */
  isVerified: boolean;
  /** Whether provider is active */
  isActive: boolean;
}

import { PagedResult } from '../api';

/**
 * Location-based search parameters
 */
export interface LocationSearchParams {
  /** Latitude coordinate */
  latitude: number;
  /** Longitude coordinate */
  longitude: number;
  /** Search radius in kilometers */
  radiusKm?: number;
  /** Additional filters */
  filters?: Partial<ServiceFilters>;
}
