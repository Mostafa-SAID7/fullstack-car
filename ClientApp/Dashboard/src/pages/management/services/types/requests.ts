import type { ServiceType } from './service';

export interface CreateServiceRequest {
  title: string;
  description?: string;
  type: ServiceType;
  basePrice: number;
  maxPrice?: number;
  currency: string;
  estimatedDurationMinutes: number;
  isEmergencyService: boolean;
  isAvailable24x7: boolean;
  requirements?: string;
  includedItems?: string;
  excludedItems?: string;
  availability?: ServiceAvailabilityRequest[];
  
  // Car service specific
  vehicleTypes?: string[];
  supportedBrands?: string[];
  isMobileService?: boolean;
  requiresSpecialEquipment?: boolean;
  specialEquipmentDetails?: string;
  emergencyPriceMultiplier?: number;
  serviceLocation?: string;
  maxVehicleAge?: number;
  warrantyPeriod?: string;
  requiresAppointment?: boolean;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  id: string;
}

export interface ServiceAvailabilityRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  notes?: string;
}

export interface CreateServiceProviderRequest {
  businessName: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  websiteUrl?: string;
  businessLicense?: string;
  insuranceInfo?: string;
}

export interface UpdateServiceProviderRequest extends Partial<CreateServiceProviderRequest> {
  id: string;
  isActive?: boolean;
}

export interface CreateBookingRequest {
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  customerNotes?: string;
  customerAddress?: string;
  customerLatitude?: number;
  customerLongitude?: number;
  isEmergency: boolean;
  emergencyDetails?: string;
  
  // Vehicle information
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleColor?: string;
  vehicleLicensePlate?: string;
  vehicleVin?: string;
}

export interface ServicesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: ServiceType;
  status?: string;
  providerId?: string;
  minPrice?: number;
  maxPrice?: number;
  isEmergencyService?: boolean;
  isAvailable24x7?: boolean;
  minRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  location?: string;
  radius?: number;
}

export interface ServiceProvidersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  state?: string;
  isVerified?: boolean;
  isActive?: boolean;
  minRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BookingsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  serviceId?: string;
  providerId?: string;
  customerId?: string;
  fromDate?: string;
  toDate?: string;
  isEmergency?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}