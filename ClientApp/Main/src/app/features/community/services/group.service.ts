import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { GroupApiService } from '../../../shared/services/api/group-api.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { Group, CreateGroupRequest, UpdateGroupRequest } from '../../../core/models/group.model';
import { GroupDto, GroupType, GroupPrivacy } from '../../../shared/models/community/group.model';
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
        private toastService: ToastService,
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
                this.toastService.error('Failed to load groups', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('groups-list'))
        );
    }

    getGroup(id: string): Observable<Result<Group>> {
        return this.groupApi.getGroup(id).pipe(
            map(dto => ({ succeeded: true, data: this.mapDtoToGroup(dto) } as Result<Group>)),
            catchError(error => {
                this.toastService.error('Failed to load group', error.message);
                return throwError(() => error);
            })
        );
    }

    createGroup(request: CreateGroupRequest): Observable<Result<Group>> {
        this.loadingService.show('create-group', 'Creating group...');

        // Map core model to shared model
        const apiRequest = {
            name: request.name,
            description: request.description,
            imageUrl: request.coverImage ? URL.createObjectURL(request.coverImage) : undefined,
            type: this.mapTypeToEnum(request.type),
            privacy: this.mapPrivacyToEnum(request.type) // Map type to privacy for now
        };

        return this.groupApi.createGroup(apiRequest).pipe(
            map(dto => {
                const group = this.mapDtoToGroup(dto);
                const currentGroups = this.groupsSubject.value;
                this.groupsSubject.next([group, ...currentGroups]);
                this.toastService.success('Group created successfully');
                return { succeeded: true, data: group } as Result<Group>;
            }),
            catchError(error => {
                this.toastService.error('Failed to create group', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('create-group'))
        );
    }

    updateGroup(id: string, request: UpdateGroupRequest): Observable<Result<Group>> {
        this.loadingService.show('update-group', 'Updating group...');

        // Map core model to shared model
        const apiRequest = {
            name: request.name,
            description: request.description,
            imageUrl: request.coverImage ? URL.createObjectURL(request.coverImage) : undefined,
            type: request.type ? this.mapTypeToEnum(request.type) : undefined,
            privacy: request.type ? this.mapPrivacyToEnum(request.type) : undefined
        };

        return this.groupApi.updateGroup(id, apiRequest).pipe(
            map(dto => {
                const group = this.mapDtoToGroup(dto);
                const groups = this.groupsSubject.value.map(g => g.id === id ? group : g);
                this.groupsSubject.next(groups);
                this.toastService.success('Group updated successfully');
                return { succeeded: true, data: group } as Result<Group>;
            }),
            catchError(error => {
                this.toastService.error('Failed to update group', error.message);
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
                this.toastService.success('Group deleted successfully');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to delete group', error.message);
                return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide('delete-group'))
        );
    }

    joinGroup(id: string): Observable<Result<any>> {
        return this.groupApi.joinGroup({ groupId: id }).pipe(
            tap(() => {
                const groups = this.groupsSubject.value.map(g =>
                    g.id === id ? { ...g, memberCount: g.memberCount + 1 } : g
                );
                this.groupsSubject.next(groups);
                this.toastService.success('Joined group successfully');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to join group', error.message);
                return throwError(() => error);
            })
        );
    }

    leaveGroup(id: string): Observable<Result<any>> {
        return this.groupApi.leaveGroup(id).pipe(
            tap(() => {
                const groups = this.groupsSubject.value.map(g =>
                    g.id === id ? { ...g, memberCount: Math.max(0, g.memberCount - 1) } : g
                );
                this.groupsSubject.next(groups);
                this.toastService.success('Left group successfully');
            }),
            map(() => ({ succeeded: true } as Result<any>)),
            catchError(error => {
                this.toastService.error('Failed to leave group', error.message);
                return throwError(() => error);
            })
        );
    }

    getGroupMembers(id: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<any>> {
        return this.groupApi.getMembers(id, pageNumber).pipe(
            map(result => this.mapToLegacyFormat(result)),
            catchError(error => {
                this.toastService.error('Failed to load group members', error.message);
                return throwError(() => error);
            })
        );
    }

    getGroupPosts(id: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResult<Post>> {
        // Note: This would use PostApiService with groupId filter
        this.toastService.info('Group posts feature coming soon');
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
            coverImage: dto.imageUrl,
            avatar: dto.imageUrl,
            type: this.mapEnumToType(dto.type),
            category: 'General', // Default category
            memberCount: dto.membersCount,
            postCount: dto.postsCount,
            createdAt: new Date(dto.createdAt),
            updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date(),
            ownerId: dto.ownerId,
            moderatorIds: [],
            tags: [],
            rules: [],
            settings: {
                allowMemberPosts: true,
                requirePostApproval: false,
                allowMemberInvites: true,
                allowDiscussions: true,
                allowEvents: true,
                allowPolls: true,
                autoApproveMembers: dto.privacy === 1, // Public groups auto-approve
                showMemberList: true,
                allowExternalSharing: dto.privacy === 1
            },
            stats: {
                totalMembers: dto.membersCount,
                activeMembersToday: 0,
                activeMembersWeek: 0,
                totalPosts: dto.postsCount,
                postsToday: 0,
                postsWeek: 0,
                engagementRate: 0,
                growthRate: 0
            }
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

    private mapTypeToEnum(type: 'public' | 'private' | 'secret'): GroupType {
        switch (type) {
            case 'public': return GroupType.General;
            case 'private': return GroupType.LocalCommunity;
            case 'secret': return GroupType.General;
            default: return GroupType.General;
        }
    }

    private mapPrivacyToEnum(type: 'public' | 'private' | 'secret'): GroupPrivacy {
        switch (type) {
            case 'public': return GroupPrivacy.Public;
            case 'private': return GroupPrivacy.Private;
            case 'secret': return GroupPrivacy.Secret;
            default: return GroupPrivacy.Public;
        }
    }

    private mapEnumToType(type: GroupType): 'public' | 'private' | 'secret' {
        // For simplicity, map all types to public for now
        // In a real implementation, you'd have a more sophisticated mapping
        return 'public';
    }
}
