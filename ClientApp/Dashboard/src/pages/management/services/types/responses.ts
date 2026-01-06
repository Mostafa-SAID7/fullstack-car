import type { Service, ServiceProvider, ServiceBooking, ServiceStatistics } from './service';

export interface ApiResult<T> {
  succeeded: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ServicesResponse extends PaginatedResult<Service> {}

export interface ServiceResponse {
  service: Service;
}

export interface ServiceProvidersResponse extends PaginatedResult<ServiceProvider> {}

export interface ServiceProviderResponse {
  provider: ServiceProvider;
}

export interface BookingsResponse extends PaginatedResult<ServiceBooking> {}

export interface BookingResponse {
  booking: ServiceBooking;
}

export interface ServiceStatisticsResponse {
  statistics: ServiceStatistics;
}

export interface ServiceDetailResponse extends Service {
  provider: ServiceProvider;
  recentBookings: ServiceBooking[];
  reviews: ServiceReview[];
}

export interface ServiceReview {
  id: string;
  rating: number;
  comment?: string;
  customerName: string;
  customerAvatar?: string;
  createdAt: string;
  isVerified: boolean;
}

export interface ProviderDetailResponse extends ServiceProvider {
  services: Service[];
  recentBookings: ServiceBooking[];
  reviews: ServiceReview[];
  certifications: ProviderCertification[];
  specialties: ProviderSpecialty[];
}

export interface ProviderCertification {
  id: string;
  certificationName: string;
  issuingOrganization: string;
  certificationNumber?: string;
  issuedDate: string;
  expiryDate?: string;
  isActive: boolean;
  isVerified: boolean;
  documentUrl?: string;
}

export interface ProviderSpecialty {
  id: string;
  specialtyName: string;
  description?: string;
  category: string;
  yearsOfExperience: number;
  isPrimary: boolean;
  certificationLevel?: string;
  certifiedDate?: string;
  expiryDate?: string;
}

export interface BookingDetailResponse extends ServiceBooking {
  service: Service;
  provider: ServiceProvider;
  customer: BookingCustomer;
  statusHistory: BookingStatusHistory[];
  attachments: BookingAttachment[];
}

export interface BookingCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface BookingStatusHistory {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedAt: string;
  changedByUserName?: string;
  reason?: string;
  notes?: string;
  isSystemGenerated: boolean;
}

export interface BookingAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
  uploadedByUserName: string;
}

export interface ServiceAnalytics {
  totalServices: number;
  activeServices: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  topServices: TopService[];
  revenueByMonth: MonthlyRevenue[];
  bookingsByStatus: BookingStatusCount[];
  servicesByType: ServiceTypeCount[];
}

export interface TopService {
  id: string;
  title: string;
  bookings: number;
  revenue: number;
  rating: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

export interface BookingStatusCount {
  status: string;
  count: number;
  percentage: number;
}

export interface ServiceTypeCount {
  type: string;
  count: number;
  percentage: number;
}