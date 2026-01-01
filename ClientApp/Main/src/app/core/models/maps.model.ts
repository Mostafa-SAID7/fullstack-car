export interface Location {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    description?: string;
    type: LocationType;
    status: number;
    phoneNumber?: string;
    email?: string;
    website?: string;
    rating: number;
    reviewCount: number;
    featuredImageUrl?: string;
    isVerified: boolean;
    hours?: LocationHour[];
    createdAt: Date;
}

export enum LocationType {
    Showroom = 0,
    ServiceCenter = 1,
    SpareParts = 2,
    ChargingStation = 3,
    GasStation = 4,
    Other = 5
}

export interface LocationHour {
    id: string;
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed: boolean;
    is24Hours: boolean;
}

export interface CheckIn {
    id: string;
    locationId: string;
    userId: string;
    checkInTime: Date;
    comment?: string;
    user?: any;
    location?: Location;
}

export interface PlaceReview {
    id: string;
    locationId: string;
    userId: string;
    rating: number;
    title: string;
    content: string;
    visitDate: Date;
    user?: any;
    createdAt: Date;
}
