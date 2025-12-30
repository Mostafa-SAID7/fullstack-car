import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Group, CreateGroupRequest, UpdateGroupRequest } from '../../../core/models/group.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';
import { Post } from '../../../core/models/post.model';

@Injectable({
    providedIn: 'root'
})
export class GroupService {
    private apiUrl = `${environment.apiUrl}/v2.0/community/groups`;

    constructor(private http: HttpClient) { }

    getGroups(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Group>> {
        return this.http.get<PaginatedResult<Group>>(`${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    getGroup(id: string): Observable<Result<Group>> {
        return this.http.get<Result<Group>>(`${this.apiUrl}/${id}`);
    }

    createGroup(request: CreateGroupRequest): Observable<Result<Group>> {
        return this.http.post<Result<Group>>(this.apiUrl, request);
    }

    updateGroup(id: string, request: UpdateGroupRequest): Observable<Result<Group>> {
        return this.http.put<Result<Group>>(`${this.apiUrl}/${id}`, request);
    }

    deleteGroup(id: string): Observable<Result<any>> {
        return this.http.delete<Result<any>>(`${this.apiUrl}/${id}`);
    }

    joinGroup(id: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/${id}/join`, {});
    }

    leaveGroup(id: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/${id}/leave`, {});
    }

    getGroupMembers(id: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<any>> {
        return this.http.get<PaginatedResult<any>>(`${this.apiUrl}/${id}/members?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    getGroupPosts(id: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Post>> {
        return this.http.get<PaginatedResult<Post>>(`${this.apiUrl}/${id}/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }
}
