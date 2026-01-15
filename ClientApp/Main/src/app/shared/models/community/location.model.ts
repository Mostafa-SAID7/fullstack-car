/**
 * Location/Maps-related models matching backend DTOs
 */

export enum LocationCategory {
  Dealership = 1,
  ServiceCenter = 2,
  BodyShop = 3,
  PartsStore = 4,
  GasStation = 5,
  CarWash = 6,
  ParkingLot = 7,
  ChargingStation = 8,
  RacingTrack = 9,
  Museum = 10
}

export interface LocationDto {
  id: string;
  name: string;
  description: string;
  category: LocationCategory;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  imageUrls?: string[];
  rating: number;
  reviewsCount: number;
  checkInsCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface LocationHourDto {
  id: string;
  locationId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
  isClosed: boolean;
}

export interface CreateLocationRequest {
  name: string;
  description: string;
  category: LocationCategory;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  imageUrls?: string[];
}

export interface CheckInDto {
  id: string;
  locationId: string;
  userId: string;
  comment?: string;
  imageUrls?: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  
  userFirstName: string;
  userLastName: string;
  userProfileImageUrl?: string;
  
  locationName: string;
  locationCategory: LocationCategory;
}

export interface CreateCheckInRequest {
  locationId: string;
  comment?: string;
  imageUrls?: string[];
}

export interface PlaceReviewDto {
  id: string;
  locationId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  imageUrls?: string[];
  helpfulCount: number;
  createdAt: Date;
  
  userFirstName: string;
  userLastName: string;
  userProfileImageUrl?: string;
}

export interface CreatePlaceReviewRequest {
  locationId: string;
  rating: number;
  title: string;
  content: string;
  imageUrls?: string[];
}
