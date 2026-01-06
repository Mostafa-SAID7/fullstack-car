// Type-only definitions to work with erasableSyntaxOnly
export const ServiceType = {
  Maintenance: 1,
  Repair: 2,
  Inspection: 3,
  Cleaning: 4,
  Towing: 5,
  Insurance: 6,
  Rental: 7,
  Parts: 8,
  Consultation: 9,
  Emergency: 10
} as const;

export type ServiceType = typeof ServiceType[keyof typeof ServiceType];

export const ServiceStatus = {
  Draft: 0,
  Active: 1,
  Inactive: 2,
  Suspended: 3,
  Archived: 4
} as const;

export type ServiceStatus = typeof ServiceStatus[keyof typeof ServiceStatus];

export const BookingStatus = {
  Pending: 0,
  Confirmed: 1,
  InProgress: 2,
  Completed: 3,
  Cancelled: 4,
  Rescheduled: 5,
  NoShow: 6
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export const PaymentStatus = {
  Pending: 0,
  Processing: 1,
  Completed: 2,
  Failed: 3,
  Cancelled: 4,
  Refunded: 5,
  PartiallyRefunded: 6
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const ProviderStatus = {
  Pending: 1,
  Active: 2,
  Suspended: 3,
  Inactive: 4,
  Rejected: 5,
  UnderReview: 6
} as const;

export type ProviderStatus = typeof ProviderStatus[keyof typeof ProviderStatus];

export const PaymentMethod = {
  Cash: 1,
  CreditCard: 2,
  DebitCard: 3,
  BankTransfer: 4,
  DigitalWallet: 5,
  Cryptocurrency: 6,
  Check: 7,
  PayPal: 8,
  ApplePay: 9,
  GooglePay: 10
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

// Interfaces defined after enums
export interface ServiceAvailability {
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  notes?: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  type: ServiceType;
  typeName: string;
  status: ServiceStatus;
  statusName: string;
  basePrice: number;
  maxPrice?: number;
  currency: string;
  estimatedDurationMinutes: number;
  estimatedDuration: string;
  isEmergencyService: boolean;
  isAvailable24x7: boolean;
  imageUrl?: string;
  requirements?: string;
  includedItems?: string;
  excludedItems?: string;
  averageRating: number;
  totalReviews: number;
  totalBookings: number;
  lastBookedAt?: string;
  createdAt: string;
  updatedAt?: string;
  serviceProviderId: string;
  serviceProviderName: string;
  availability: ServiceAvailability[];
  images: string[];
  
  // Car service specific properties
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

export interface ServiceProvider {
  id: string;
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
  logoUrl?: string;
  websiteUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  businessLicense?: string;
  insuranceInfo?: string;
  verifiedAt?: string;
  createdAt: string;
  ownerName: string;
  totalServices: number;
  totalBookings: number;
}

export interface ServiceBooking {
  id: string;
  bookingNumber: string;
  scheduledDate: string;
  scheduledTime: string;
  scheduledDateTime: string;
  status: BookingStatus;
  statusName: string;
  totalAmount: number;
  currency: string;
  customerNotes?: string;
  providerNotes?: string;
  cancellationReason?: string;
  confirmedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  customerAddress?: string;
  customerLatitude?: number;
  customerLongitude?: number;
  isEmergency: boolean;
  emergencyDetails?: string;
  createdAt: string;
  
  // Customer info
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  
  // Service info
  serviceId: string;
  serviceTitle: string;
  serviceType: ServiceType;
  serviceTypeName: string;
  
  // Provider info
  serviceProviderId: string;
  serviceProviderName: string;
  serviceProviderPhone?: string;
  
  // Payment info
  paymentStatus?: PaymentStatus;
  paymentStatusName?: string;
  paidAt?: string;
  
  // Review info
  hasReview: boolean;
  reviewRating?: number;
}

export interface ServiceFilters {
  type: string;
  status: string;
  provider: string;
  priceRange: [number, number];
  rating: number;
  location: string;
  availability: string;
}

export interface ServiceStatistics {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  draftServices: number;
  emergencyServices: number;
  activeBookings: number;
  totalRevenue: number;
  averageRating: number;
  servicesGrowth: number;
  bookingsGrowth: number;
  revenueGrowth: number;
  ratingGrowth: number;
}