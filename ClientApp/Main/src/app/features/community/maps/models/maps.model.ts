export interface Location {
  id: string;
  name: string;
  address: string;
  type: LocationType;
  latitude: number;
  longitude: number;
  description?: string;
  imageUrl?: string;
  featuredImageUrl?: string;
  rating?: number;
  reviewCount?: number;
  isVerified: boolean;
  status: number;
  phoneNumber?: string;
  email?: string;
  website?: string;
  hours?: any;
  createdAt: Date;
  updatedAt?: Date;
}

export enum LocationType {
  Dealership = 'dealership',
  ServiceCenter = 'service_center',
  CarWash = 'car_wash',
  GasStation = 'gas_station',
  ParkingLot = 'parking_lot',
  ChargingStation = 'charging_station',
  AutoParts = 'auto_parts',
  Other = 'other'
}

export interface LocationSearchFilters {
  query?: string;
  type?: LocationType;
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  sortBy?: 'distance' | 'rating' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface PlaceReview {
  id: string;
  locationId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
  visitDate: Date;
  user: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export interface CheckIn {
  id: string;
  locationId: string;
  userId: string;
  checkInTime: Date;
  comment?: string;
  user: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  location?: Location;
}