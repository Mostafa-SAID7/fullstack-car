import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Friend, FriendRequest } from '../../../core/models/friend.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';

@Injectable({
    providedIn: 'root'
})
export class FriendService {
    private apiUrl = `${environment.apiUrl}/v2.0/community/social/friends`;

    constructor(private http: HttpClient) { }

    getFriends(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Friend>> {
        return this.http.get<PaginatedResult<Friend>>(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    getFriendRequests(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<FriendRequest>> {
        return this.http.get<PaginatedResult<FriendRequest>>(`${this.apiUrl}/requests?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    sendFriendRequest(friendId: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/request/${friendId}`, {});
    }

    acceptFriendRequest(requestId: string): Observable<Result<any>> {
        return this.http.put<Result<any>>(`${this.apiUrl}/request/${requestId}/accept`, {});
    }

    declineFriendRequest(requestId: string): Observable<Result<any>> {
        return this.http.put<Result<any>>(`${this.apiUrl}/request/${requestId}/decline`, {});
    }

    removeFriend(friendId: string): Observable<Result<any>> {
        return this.http.delete<Result<any>>(`${this.apiUrl}/${friendId}`);
    }
}
