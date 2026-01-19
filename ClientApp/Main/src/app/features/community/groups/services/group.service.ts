import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  Group,
  GroupMember,
  GroupPost,
  GroupJoinRequest,
  GroupEvent,
  GroupDiscussion,
  GroupReport,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupSearchFilters
} from '../models/group.model';
import { Result, PaginatedResult } from '../../../../core/models/result.model';
import { ToastService } from '../../../../core/services/toast.service';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupsSubject = new BehaviorSubject<Group[]>([]);
  public groups$ = this.groupsSubject.asObservable();

  private currentGroupSubject = new BehaviorSubject<Group | null>(null);
  public currentGroup$ = this.currentGroupSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  /**
   * Get all groups with optional filters
   */
  getGroups(filters?: GroupSearchFilters): Observable<PaginatedResult<Group>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.query) params = params.set('query', filters.query);
      if (filters.category) params = params.set('category', filters.category);
      if (filters.type) params = params.set('type', filters.type);
      if (filters.pageNumber) params = params.set('pageNumber', filters.pageNumber.toString());
      if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
      if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
      if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http.get<PaginatedResult<Group>>(`${environment.apiUrl}/v1/groups`, { params }).pipe(
      tap(result => {
        if (result.items) {
          this.groupsSubject.next(result.items);
        }
      }),
      catchError(error => {
        this.toastService.error('Failed to load groups', error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a single group by ID
   */
  getGroup(id: string): Observable<Group> {
    return this.http.get<Group>(`${environment.apiUrl}/v1/groups/${id}`).pipe(
      tap(group => {
        this.currentGroupSubject.next(group);
      }),
      catchError(error => {
        this.toastService.error('Failed to load group', error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new group
   */
  createGroup(request: CreateGroupRequest): Observable<Result<Group>> {
    return this.http.post<Group>(`${environment.apiUrl}/v1/groups`, request).pipe(
      map(group => {
        // Add new group to the list
        const currentGroups = this.groupsSubject.value;
        this.groupsSubject.next([group, ...currentGroups]);
        this.toastService.success('Group created successfully');
        return { succeeded: true, data: group, errors: [] } as Result<Group>;
      }),
      catchError(error => {
        this.toastService.error('Failed to create group', error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing group
   */
  updateGroup(id: string, request: UpdateGroupRequest): Observable<Result<Group>> {
    return this.http.put<Group>(`${environment.apiUrl}/v1/groups/${id}`, request).pipe(
      map(group => {
        // Update group in the list
        const groups = this.groupsSubject.value.map(g =>
          g.id === id ? group : g
        );
        this.groupsSubject.next(groups);

        // Update current group if it's the one being edited
        if (this.currentGroupSubject.value?.id === id) {
          this.currentGroupSubject.next(group);
        }

        this.toastService.success('Group updated successfully');
        return { succeeded: true, data: group, errors: [] } as Result<Group>;
      }),
      catchError(error => {
        this.toastService.error('Failed to update group', error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a group
   */
  deleteGroup(id: string): Observable<Result<boolean>> {
    return this.http.delete(`${environment.apiUrl}/v1/groups/${id}`).pipe(
      map(() => {
        // Remove group from the list
        const groups = this.groupsSubject.value.filter(group => group.id !== id);
        this.groupsSubject.next(groups);

        // Clear current group if it's the one being deleted
        if (this.currentGroupSubject.value?.id === id) {
          this.currentGroupSubject.next(null);
        }

        this.toastService.success('Group deleted successfully');
        return { succeeded: true, data: true, errors: [] } as Result<boolean>;
      }),
      catchError(error => {
        this.toastService.error('Failed to delete group', error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Join a group
   */
  joinGroup(id: string): Observable<Result<boolean>> {
    return this.http.post(`${environment.apiUrl}/v1/groups/${id}/join`, {}).pipe(
      map(() => {
        this.toastService.success('Successfully joined group');
        return { succeeded: true, data: true, errors: [] } as Result<boolean>;
      }),
      catchError(error => {
        this.toastService.error('Failed to join group', error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Leave a group
   */
  leaveGroup(id: string): Observable<Result<boolean>> {
    return this.http.post(`${environment.apiUrl}/v1/groups/${id}/leave`, {}).pipe(
      map(() => {
        this.toastService.success('Successfully left group');
        return { succeeded: true, data: true, errors: [] } as Result<boolean>;
      }),
      catchError(error => {
        this.toastService.error('Failed to leave group', error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get group members
   */
  getGroupMembers(groupId: string, pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResult<GroupMember>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult<GroupMember>>(`${environment.apiUrl}/v1/groups/${groupId}/members`, { params }).pipe(
      catchError(error => {
        this.toastService.error('Failed to load group members', error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Clear current group
   */
  clearCurrentGroup(): void {
    this.currentGroupSubject.next(null);
  }
}