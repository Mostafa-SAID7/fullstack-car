export interface ServiceProvider {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  profileImageUrl?: string;
  businessHours?: BusinessHours[];
  services?: CarService[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface CarService {
  id: string;
  serviceProviderId: string;
  name: string;
  description: string;
  type: ServiceType;
  basePrice: number;
  duration: number;
  isEmergencyService: boolean;
  isAvailable24x7: boolean;
  isActive: boolean;
  rating: number;
  totalBookings: number;
  imageUrl?: string;
  serviceProvider?: ServiceProvider;
  pricing?: ServicePricing[];
  createdAt: string;
  updatedAt: string;
}

export interface ServicePricing {
  id: string;
  carServiceId: string;
  vehicleType: VehicleType;
  price: number;
  description?: string;
}

export interface ServiceBooking {
  id: string;
  customerId: string;
  carServiceId: string;
  serviceProviderId: string;
  scheduledDate: string;
  status: BookingStatus;
  totalAmount: number;
  customerNotes?: string;
  providerNotes?: string;
  completionNotes?: string;
  cancellationReason?: string;
  vehicleInfo: VehicleInfo;
  customerInfo: CustomerInfo;
  serviceInfo: CarService;
  providerInfo: ServiceProvider;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export enum ServiceType {
  Maintenance = 'Maintenance',
  Repair = 'Repair',
  Emergency = 'Emergency',
  Inspection = 'Inspection',
  Cleaning = 'Cleaning',
  Towing = 'Towing',
  Roadside = 'Roadside'
}

export enum VehicleType {
  Sedan = 'Sedan',
  SUV = 'SUV',
  Truck = 'Truck',
  Motorcycle = 'Motorcycle',
  Van = 'Van',
  Coupe = 'Coupe',
  Convertible = 'Convertible'
}

export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  NoShow = 'NoShow'
}

export interface CreateServiceProviderRequest {
  businessName: string;
  description?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  businessHours?: BusinessHours[];
}

export interface UpdateServiceProviderRequest extends CreateServiceProviderRequest {
  isActive?: boolean;
}

export interface CreateCarServiceRequest {
  name: string;
  description: string;
  type: ServiceType;
  basePrice: number;
  duration: number;
  isEmergencyService: boolean;
  isAvailable24x7: boolean;
  imageUrl?: string;
  pricing?: Omit<ServicePricing, 'id' | 'carServiceId'>[];
}

export interface CreateBookingRequest {
  carServiceId: string;
  scheduledDate: string;
  customerNotes?: string;
  vehicleInfo: VehicleInfo;
}

export interface MarketplaceFilters {
  searchTerm?: string;
  serviceType?: ServiceType;
  minPrice?: number;
  maxPrice?: number;
  isEmergencyService?: boolean;
  isAvailable24x7?: boolean;
  minRating?: number;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface BookingFilters {
  status?: BookingStatus;
  fromDate?: string;
  toDate?: string;
  serviceProviderId?: string;
}