import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { GroupApiService } from '../../../shared/services/api/group-api.service';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { Group, CreateGroupRequest, UpdateGroupRequest } from '../../../core/models/group.model';
import { GroupDto } from '../../../shared/models/community/group.model';
import { Result, PaginatedResult } from '../../../core/models/result.model';
import { Post } from '../../../core/models/post.model';

@Injectable({
    providedIn: 'root'
})
export class GroupService {
    private groupsSubject = new BehaviorSubject<Group[]>([]);
    public groups$ = this.groupsSubject.asObservable();

    constructor(
        private groupApi: GroupApiService,
        private notificationService: NotificationService,
        private loadingService: LoadingService
    ) { }

    getGroups(pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Group>> {
        this.loadingService.show('groups-list', 'Loading groups...');

        return this.groupApi.getGroups({ pageNumber, pageSize }).pipe(
            map((result: any) => this.mapToLegacyFormat(result) as PaginatedResult<Group>),
            tap(result => {
                if (result.items) {
                    this.groupsSubject.next(result.items);
                }
            }),
            catchError(error => {
                this.notificationService.error('Failed to load groups', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('groups-list'))
        );
    }

    getGroup(id: string): Observable<Result<Group>> {
        return this.groupApi.getGroup(id).pipe(
            map(dto => ({ succeeded: true, data: this.mapDtoToGroup(dto) } as Result<Group>)),
            catchError(error => {
                this.notificationService.error('Failed to load group', error.message);
                return throwError(() => error);
            })
        );
    }

    createGroup(request: CreateGroupRequest): Observable<Result<Group>> {
        this.loadingService.show('create-group', 'Creating group...');

        return this.groupApi.createGroup(request).pipe(
            map(dto => {
                const group = this.mapDtoToGroup(dto);
                const currentGroups = this.groupsSubject.value;
                this.groupsSubject.next([group, ...currentGroups]);
                this.notificationService.success('Group created successfully');
                return { succeeded: true, data: group } as Result<Group>;
            }),
            catchError(error => {
                this.notificationService.error('Failed to create group', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('create-group'))
        );
    }

    updateGroup(id: string, request: UpdateGroupRequest): Observable<Result<Group>> {
        this.loadingService.show('update-group', 'Updating group...');

        return this.groupApi.updateGroup(id, request).pipe(
            map(dto => {
                const group = this.mapDtoToGroup(dto);
                const groups = this.groupsSubject.value.map(g => g.id === id ? group : g);
                this.groupsSubject.next(groups);
                this.notificationService.success('Group updated successfully');
                return { succeeded: true, data: group } as Result<Group>;
            }),
            catchError(error => {
                this.notificationService.error('Failed to update group', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('update-group'))
        );
    }

    deleteGroup(id: string): Observable<Result<any>> {
        this.loadingService.show('delete-group', 'Deleting group...');

        return this.groupApi.deleteGroup(id).pipe(
            tap(() => {
                const groups = this.groupsSubject.value.filter(g => g.id !== id);
                this.groupsSubject.next(groups);
                this.notificationService.success('Group deleted successfully');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.notificationService.error('Failed to delete group', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('delete-group'))
        );
    }

    joinGroup(id: string): Observable<Result<any>> {
        return this.groupApi.joinGroup({ groupId: id }).pipe(
            tap(() => {
                const groups = this.groupsSubject.value.map(g =>
                    g.id === id ? { ...g, membersCount: g.membersCount + 1 } : g
                );
                this.groupsSubject.next(groups);
                this.notificationService.success('Joined group successfully');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.notificationService.error('Failed to join group', error.message);
                return throwError(() => error);
            })
        );
    }

    leaveGroup(id: string): Observable<Result<any>> {
        return this.groupApi.leaveGroup(id).pipe(
            tap(() => {
                const groups = this.groupsSubject.value.map(g =>
                    g.id === id ? { ...g, membersCount: Math.max(0, g.membersCount - 1) } : g
                );
                this.groupsSubject.next(groups);
                this.notificationService.success('Left group successfully');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.notificationService.error('Failed to leave group', error.message);
                return throwError(() => error);
            })
        );
    }

    getGroupMembers(id: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<any>> {
        return this.groupApi.getMembers(id, pageNumber).pipe(
            map(result => this.mapToLegacyFormat(result)),
            catchError(error => {
                this.notificationService.error('Failed to load group members', error.message);
                return throwError(() => error);
            })
        );
    }

    getGroupPosts(id: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Post>> {
        // Note: This would use PostApiService with groupId filter
        this.notificationService.info('Group posts feature coming soon');
        return new Observable(observer => {
            observer.next({ items: [], pageNumber, pageSize, totalPages: 0, totalCount: 0, hasPreviousPage: false, hasNextPage: false });
            observer.complete();
        });
    }

    private mapDtoToGroup(dto: GroupDto): Group {
        return {
            id: dto.id,
            name: dto.name,
            description: dto.description,
            imageUrl: dto.imageUrl,
            type: dto.type,
            privacy: dto.privacy,
            membersCount: dto.membersCount,
            postsCount: dto.postsCount,
            createdAt: typeof dto.createdAt === 'string' ? dto.createdAt : dto.createdAt.toISOString(),
            updatedAt: dto.updatedAt ? (typeof dto.updatedAt === 'string' ? dto.updatedAt : dto.updatedAt.toISOString()) : undefined,
            ownerId: dto.ownerId,
            ownerFirstName: dto.ownerFirstName,
            ownerLastName: dto.ownerLastName,
            ownerProfileImageUrl: dto.ownerProfileImageUrl
        };
    }

    private mapToLegacyFormat<T>(result: any): PaginatedResult<T> {
        return {
            items: (result.items as any[])?.map((item: any) => this.mapDtoToGroup(item)) as T[] || [],
            pageNumber: result.pageNumber,
            pageSize: result.pageSize,
            totalPages: result.totalPages,
            totalCount: result.totalCount,
            hasPreviousPage: result.hasPreviousPage,
            hasNextPage: result.hasNextPage
        };
    }
}
