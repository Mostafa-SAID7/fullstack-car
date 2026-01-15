import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { LocationApiService } from '../../../shared/services/api/location-api.service';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import {
    LocationDto,
    CheckInDto,
    PlaceReviewDto,
    CreateLocationRequest,
    CreateCheckInRequest,
    CreatePlaceReviewRequest,
    LocationCategory,
    LocationHourDto
} from '../../../shared/models/community/location.model';
import { PagedResult } from '../../../shared/models/community/common.model';
import { Location, CheckIn, PlaceReview, LocationType } from '../../../core/models/maps.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';

@Injectable({
    providedIn: 'root'
})
export class MapsService {
    private locationsSubject = new BehaviorSubject<Location[]>([]);
    public locations$ = this.locationsSubject.asObservable();

    private currentLocationSubject = new BehaviorSubject<Location | null>(null);
    public currentLocation$ = this.currentLocationSubject.asObservable();

    constructor(
        private locationApi: LocationApiService,
        private notificationService: NotificationService,
        private loadingService: LoadingService
    ) { }

    /**
     * Get paginated list of locations
     */
    getLocations(type?: number, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Location>> {
        this.loadingService.show('locations-list', 'Loading locations...');

        return this.locationApi.getLocations({
            pageNumber,
            pageSize,
            category: type
        }).pipe(
            map(result => this.mapToLegacyPaginatedFormat(result)),
            tap(result => {
                if (result.items) {
                    this.locationsSubject.next(result.items);
                }
            }),
            catchError(error => {
                this.notificationService.error('Failed to load locations', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('locations-list'))
        );
    }

    /**
     * Get a single location by ID
     */
    getLocation(id: string): Observable<Result<Location>> {
        this.loadingService.show('location-detail', 'Loading location...');

        return this.locationApi.getLocation(id).pipe(
            map(dto => {
                const location = this.mapDtoToLocation(dto);
                this.currentLocationSubject.next(location);
                return { succeeded: true, data: location } as Result<Location>;
            }),
            catchError(error => {
                this.notificationService.error('Failed to load location', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('location-detail'))
        );
    }

    /**
     * Check in at a location
     */
    checkIn(locationId: string, comment?: string): Observable<Result<CheckIn>> {
        this.loadingService.show('check-in', 'Checking in...');

        return this.locationApi.checkIn({ locationId, comment }).pipe(
            map(dto => {
                const checkIn = this.mapDtoToCheckIn(dto);
                this.notificationService.success('Checked in successfully');
                return { succeeded: true, data: checkIn } as Result<CheckIn>;
            }),
            catchError(error => {
                this.notificationService.error('Failed to check in', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('check-in'))
        );
    }

    /**
     * Add a review for a location
     */
    addReview(locationId: string, rating: number, title: string, content: string): Observable<Result<PlaceReview>> {
        this.loadingService.show('add-review', 'Adding review...');

        return this.locationApi.createReview({ locationId, rating, title, content }).pipe(
            map(dto => {
                const review = this.mapDtoToPlaceReview(dto);
                this.notificationService.success('Review added successfully');
                return { succeeded: true, data: review } as Result<PlaceReview>;
            }),
            catchError(error => {
                this.notificationService.error('Failed to add review', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('add-review'))
        );
    }

    /**
     * Get nearby locations (not implemented in new API yet)
     */
    getNearbyLocations(lat: number, lng: number, radiusInKm: number = 10): Observable<Result<Location[]>> {
        // TODO: Implement when backend supports nearby search
        this.notificationService.info('Nearby search coming soon');
        return new Observable(observer => {
            observer.next({ succeeded: true, data: [], errors: [] } as Result<Location[]>);
            observer.complete();
        });
    }

    /**
     * Get check-ins for a location
     */
    getCheckIns(locationId: string, pageNumber: number = 1): Observable<PaginatedResult<CheckIn>> {
        return this.locationApi.getCheckIns(locationId, pageNumber).pipe(
            map(result => ({
                items: result.items.map(dto => this.mapDtoToCheckIn(dto)),
                pageNumber: result.pageNumber,
                pageSize: result.pageSize,
                totalPages: result.totalPages,
                totalCount: result.totalCount,
                hasPreviousPage: result.hasPreviousPage,
                hasNextPage: result.hasNextPage
            })),
            catchError(error => {
                this.notificationService.error('Failed to load check-ins', error.message);
                return throwError(() => error);
            })
        );
    }

    /**
     * Get reviews for a location
     */
    getReviews(locationId: string, pageNumber: number = 1): Observable<PaginatedResult<PlaceReview>> {
        return this.locationApi.getReviews(locationId, pageNumber).pipe(
            map(result => ({
                items: result.items.map(dto => this.mapDtoToPlaceReview(dto)),
                pageNumber: result.pageNumber,
                pageSize: result.pageSize,
                totalPages: result.totalPages,
                totalCount: result.totalCount,
                hasPreviousPage: result.hasPreviousPage,
                hasNextPage: result.hasNextPage
            })),
            catchError(error => {
                this.notificationService.error('Failed to load reviews', error.message);
                return throwError(() => error);
            })
        );
    }

    /**
     * Get location hours
     */
    getLocationHours(locationId: string): Observable<LocationHourDto[]> {
        return this.locationApi.getHours(locationId).pipe(
            catchError(error => {
                this.notificationService.error('Failed to load hours', error.message);
                return throwError(() => error);
            })
        );
    }

    /**
     * Clear current location
     */
    clearCurrentLocation(): void {
        this.currentLocationSubject.next(null);
    }

    // Helper methods to map between DTOs and legacy models
    private mapDtoToLocation(dto: LocationDto): Location {
        return {
            id: dto.id,
            name: dto.name,
            address: dto.address,
            latitude: dto.latitude,
            longitude: dto.longitude,
            description: dto.description,
            type: this.mapCategoryToType(dto.category),
            status: 1, // Active
            phoneNumber: dto.phone,
            email: undefined,
            website: dto.website,
            rating: dto.rating,
            reviewCount: dto.reviewsCount,
            featuredImageUrl: dto.imageUrls?.[0],
            isVerified: true,
            hours: undefined,
            createdAt: typeof dto.createdAt === 'string' ? new Date(dto.createdAt) : dto.createdAt
        };
    }

    private mapDtoToCheckIn(dto: CheckInDto): CheckIn {
        return {
            id: dto.id,
            locationId: dto.locationId,
            userId: dto.userId,
            checkInTime: typeof dto.createdAt === 'string' ? new Date(dto.createdAt) : dto.createdAt,
            comment: dto.comment,
            user: {
                firstName: dto.userFirstName,
                lastName: dto.userLastName,
                profileImageUrl: dto.userProfileImageUrl
            },
            location: undefined
        };
    }

    private mapDtoToPlaceReview(dto: PlaceReviewDto): PlaceReview {
        return {
            id: dto.id,
            locationId: dto.locationId,
            userId: dto.userId,
            rating: dto.rating,
            title: dto.title,
            content: dto.content,
            visitDate: typeof dto.createdAt === 'string' ? new Date(dto.createdAt) : dto.createdAt,
            user: {
                firstName: dto.userFirstName,
                lastName: dto.userLastName,
                profileImageUrl: dto.userProfileImageUrl
            },
            createdAt: typeof dto.createdAt === 'string' ? new Date(dto.createdAt) : dto.createdAt
        };
    }

    private mapCategoryToType(category: LocationCategory): LocationType {
        switch (category) {
            case LocationCategory.Dealership: return LocationType.Showroom;
            case LocationCategory.ServiceCenter: return LocationType.ServiceCenter;
            case LocationCategory.PartsStore: return LocationType.SpareParts;
            case LocationCategory.ChargingStation: return LocationType.ChargingStation;
            case LocationCategory.GasStation: return LocationType.GasStation;
            default: return LocationType.Other;
        }
    }

    private mapToLegacyPaginatedFormat(result: PagedResult<LocationDto>): PaginatedResult<Location> {
        return {
            items: result.items?.map(dto => this.mapDtoToLocation(dto)) || [],
            pageNumber: result.pageNumber,
            pageSize: result.pageSize,
            totalPages: result.totalPages,
            totalCount: result.totalCount,
            hasPreviousPage: result.hasPreviousPage,
            hasNextPage: result.hasNextPage
        };
    }
}
