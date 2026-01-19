export interface Location {
  id: string;
  name: string;
  address: string;
  type: LocationType;
  latitude: number;
  longitude: number;
  description?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export interface LocationReview {
  id: string;
  locationId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userName: string;
  userAvatar?: string;
}