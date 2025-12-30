import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Post, CreatePostRequest } from '../../../core/models/post.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = `${environment.apiUrl}/v2.0/community/posts`;

    constructor(private http: HttpClient) { }

    getPosts(pageNumber: number = 1, pageSize: number = 10, groupId?: string): Observable<PaginatedResult<Post>> {
        let url = `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        if (groupId) {
            url += `&groupId=${groupId}`;
        }
        return this.http.get<PaginatedResult<Post>>(url);
    }

    getPost(id: string): Observable<Result<Post>> {
        return this.http.get<Result<Post>>(`${this.apiUrl}/${id}`);
    }

    createPost(request: CreatePostRequest): Observable<Result<Post>> {
        return this.http.post<Result<Post>>(this.apiUrl, request);
    }

    likePost(id: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/${id}/like`, {});
    }

    unlikePost(id: string): Observable<Result<any>> {
        return this.http.delete<Result<any>>(`${this.apiUrl}/${id}/like`);
    }

    addComment(id: string, content: string): Observable<Result<any>> {
        return this.http.post<Result<any>>(`${this.apiUrl}/${id}/comments`, { content });
    }
}
