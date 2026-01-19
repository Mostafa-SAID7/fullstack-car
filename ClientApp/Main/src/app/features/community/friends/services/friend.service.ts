import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { environment } from '../../../../../environments/environment';

// Simple type definitions to avoid missing model errors
interface Friend {
    id: string;
    userId: string;
    friendId: string;
    status: string;
    createdAt: string;
    acceptedAt?: string;
    friendFirstName: string;
    friendLastName: string;
    friendProfileImageUrl?: string;
    friendIsVerified: boolean;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    friendsSince: string;
}

interface FriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: string;
    message?: string;
    createdAt: string;
    respondedAt?: string;
    senderFirstName: string;
    senderLastName: string;
    senderProfileImageUrl?: string;
    senderIsVerified: boolean;
    requesterId: string;
    requesterFirstName: string;
    requesterLastName: string;
    requesterProfileImageUrl?: string;
    requestedAt: string;
}

interface FriendDto {
    id: string;
    userId: string;
    friendId: string;
    status: string;
    createdAt: Date | string;
    acceptedAt?: Date | string;
    friendFirstName: string;
    friendLastName: string;
    friendProfileImageUrl?: string;
    friendIsVerified: boolean;
}

interface FriendRequestDto {
    id: string;
    senderId: string;
    receiverId: string;
    status: string;
    message?: string;
    createdAt: Date | string;
    respondedAt?: Date | string;
    senderFirstName: string;
    senderLastName: string;
    senderProfileImageUrl?: string;
    senderIsVerified: boolean;
}

interface Result<T> {
    succeeded: boolean;
    data?: T;
    errors?: string[];
}

interface PaginatedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class FriendService {
    private friendsSubject = new BehaviorSubject<Friend[]>([]);
    public friends$ = this.friendsSubject.asObservable();

    private requestsSubject = new BehaviorSubject<FriendRequest[]>([]);
    public requests$ = this.requestsSubject.asObservable();

    constructor(
        private http: HttpClient,
        private toastService: ToastService,
        private loadingService: LoadingService
    ) { }

    getFriends(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Friend>> {
        this.loadingService.show('friends-list', 'Loading friends...');

        const params = { pageNumber, pageSize };
        return this.http.get<any>(`${environment.apiUrl}/v1/friends`, { params }).pipe(
            map((result: any) => this.mapToLegacyFormat(result)),
            tap((result: PaginatedResult<Friend>) => {
                if (result.items) {
                    this.friendsSubject.next(result.items);
                }
            }),
            catchError(error => {
                this.toastService.error('Failed to load friends', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('friends-list'))
        );
    }

    getFriendRequests(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<FriendRequest>> {
        this.loadingService.show('friend-requests', 'Loading friend requests...');

        const params = { pageNumber, pageSize };
        return this.http.get<any>(`${environment.apiUrl}/v1/friends/requests`, { params }).pipe(
            map((result: any) => this.mapRequestsToLegacyFormat(result)),
            tap((result: PaginatedResult<FriendRequest>) => {
                if (result.items) {
                    this.requestsSubject.next(result.items);
                }
            }),
            catchError(error => {
                this.toastService.error('Failed to load friend requests', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('friend-requests'))
        );
    }

    sendFriendRequest(friendId: string): Observable<Result<any>> {
        const request = { receiverId: friendId };
        return this.http.post<any>(`${environment.apiUrl}/v1/friends/requests`, request).pipe(
            tap(() => {
                this.toastService.success('Friend request sent successfully');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to send friend request', error.message);
                return throwError(() => error);
            })
        );
    }

    acceptFriendRequest(requestId: string): Observable<Result<any>> {
        const request = { requestId, accept: true };
        return this.http.post<any>(`${environment.apiUrl}/v1/friends/requests/respond`, request).pipe(
            tap(() => {
                const requests = this.requestsSubject.value.filter(r => r.id !== requestId);
                this.requestsSubject.next(requests);
                this.toastService.success('Friend request accepted');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to accept friend request', error.message);
                return throwError(() => error);
            })
        );
    }

    declineFriendRequest(requestId: string): Observable<Result<any>> {
        const request = { requestId, accept: false };
        return this.http.post<any>(`${environment.apiUrl}/v1/friends/requests/respond`, request).pipe(
            tap(() => {
                const requests = this.requestsSubject.value.filter(r => r.id !== requestId);
                this.requestsSubject.next(requests);
                this.toastService.success('Friend request declined');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to decline friend request', error.message);
                return throwError(() => error);
            })
        );
    }

    removeFriend(friendId: string): Observable<Result<any>> {
        return this.http.delete<any>(`${environment.apiUrl}/v1/friends/${friendId}`).pipe(
            tap(() => {
                const friends = this.friendsSubject.value.filter(f => f.id !== friendId);
                this.friendsSubject.next(friends);
                this.toastService.success('Friend removed successfully');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to remove friend', error.message);
                return throwError(() => error);
            })
        );
    }

    private mapDtoToFriend(dto: FriendDto): Friend {
        return {
            id: dto.id,
            userId: dto.userId,
            friendId: dto.friendId,
            status: dto.status,
            createdAt: typeof dto.createdAt === 'string' ? dto.createdAt : dto.createdAt.toISOString(),
            acceptedAt: dto.acceptedAt ? (typeof dto.acceptedAt === 'string' ? dto.acceptedAt : dto.acceptedAt.toISOString()) : undefined,
            friendFirstName: dto.friendFirstName,
            friendLastName: dto.friendLastName,
            friendProfileImageUrl: dto.friendProfileImageUrl,
            friendIsVerified: dto.friendIsVerified,
            // Legacy field mapping
            firstName: dto.friendFirstName,
            lastName: dto.friendLastName,
            profileImageUrl: dto.friendProfileImageUrl,
            friendsSince: typeof dto.createdAt === 'string' ? dto.createdAt : dto.createdAt.toISOString()
        };
    }

    private mapDtoToRequest(dto: FriendRequestDto): FriendRequest {
        return {
            id: dto.id,
            senderId: dto.senderId,
            receiverId: dto.receiverId,
            status: dto.status,
            message: dto.message,
            createdAt: typeof dto.createdAt === 'string' ? dto.createdAt : dto.createdAt.toISOString(),
            respondedAt: dto.respondedAt ? (typeof dto.respondedAt === 'string' ? dto.respondedAt : dto.respondedAt.toISOString()) : undefined,
            senderFirstName: dto.senderFirstName,
            senderLastName: dto.senderLastName,
            senderProfileImageUrl: dto.senderProfileImageUrl,
            senderIsVerified: dto.senderIsVerified,
            // Legacy field mapping
            requesterId: dto.senderId,
            requesterFirstName: dto.senderFirstName,
            requesterLastName: dto.senderLastName,
            requesterProfileImageUrl: dto.senderProfileImageUrl,
            requestedAt: typeof dto.createdAt === 'string' ? dto.createdAt : dto.createdAt.toISOString()
        };
    }

    private mapToLegacyFormat(result: any): PaginatedResult<Friend> {
        return {
            items: result.items?.map((item: any) => this.mapDtoToFriend(item)) || [],
            pageNumber: result.pageNumber,
            pageSize: result.pageSize,
            totalPages: result.totalPages,
            totalCount: result.totalCount,
            hasPreviousPage: result.hasPreviousPage,
            hasNextPage: result.hasNextPage
        };
    }

    private mapRequestsToLegacyFormat(result: any): PaginatedResult<FriendRequest> {
        return {
            items: result.items?.map((item: any) => this.mapDtoToRequest(item)) || [],
            pageNumber: result.pageNumber,
            pageSize: result.pageSize,
            totalPages: result.totalPages,
            totalCount: result.totalCount,
            hasPreviousPage: result.hasPreviousPage,
            hasNextPage: result.hasNextPage
        };
    }
}