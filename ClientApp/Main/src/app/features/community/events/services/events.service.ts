import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import {
  EventDto,
  EventSummaryDto,
  EventsPagedResponse,
  EventCategoryDto,
  EventAttendanceDto,
  EventAttendeesPagedResponse,
  EventCommentDto,
  EventCommentsPagedResponse,
  EventInvitationDto,
  EventUpdateDto,
  EventCalendarDto,
  EventsStatsDto,
  EventAttendanceStatsDto,
  CreateEventRequest,
  UpdateEventRequest,
  GetEventsRequest,
  AttendEventRequest,
  CreateEventCommentRequest,
  UpdateEventCommentRequest,
  InviteToEventRequest,
  CreateEventUpdateRequest,
  ApiResponse,
  EventFilter
} from '../models/event-api.types';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private readonly apiUrl = `${environment.apiUrl}/community/events`;
  
  // State management
  private eventsSubject = new BehaviorSubject<EventSummaryDto[]>([]);
  private currentEventSubject = new BehaviorSubject<EventDto | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Public observables
  public events$ = this.eventsSubject.asObservable();
  public currentEvent$ = this.currentEventSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Event Management
  createEvent(request: CreateEventRequest): Observable<ApiResponse<EventDto>> {
    this.setLoading(true);
    return this.http.post<ApiResponse<EventDto>>(`${this.apiUrl}`, request)
      .pipe(
        map(response => {
          this.setLoading(false);
          if (response.succeeded) {
            this.refreshEvents();
          }
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          this.setError('Failed to create event');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  updateEvent(eventId: string, request: UpdateEventRequest): Observable<ApiResponse<EventDto>> {
    this.setLoading(true);
    return this.http.put<ApiResponse<EventDto>>(`${this.apiUrl}/${eventId}`, request)
      .pipe(
        map(response => {
          this.setLoading(false);
          if (response.succeeded) {
            this.refreshEvents();
            if (this.currentEventSubject.value?.id === eventId) {
              this.getEventById(eventId).subscribe();
            }
          }
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          this.setError('Failed to update event');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  deleteEvent(eventId: string, reason?: string): Observable<ApiResponse<boolean>> {
    this.setLoading(true);
    const params = reason ? new HttpParams().set('reason', reason) : new HttpParams();
    
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${eventId}`, { params })
      .pipe(
        map(response => {
          this.setLoading(false);
          if (response.succeeded) {
            this.refreshEvents();
            if (this.currentEventSubject.value?.id === eventId) {
              this.currentEventSubject.next(null);
            }
          }
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          this.setError('Failed to delete event');
          return of({ succeeded: false, data: false, message: error.message });
        })
      );
  }

  getEventById(eventId: string): Observable<ApiResponse<EventDto>> {
    this.setLoading(true);
    return this.http.get<ApiResponse<EventDto>>(`${this.apiUrl}/${eventId}`)
      .pipe(
        map(response => {
          this.setLoading(false);
          if (response.succeeded) {
            this.currentEventSubject.next(response.data);
          }
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          this.setError('Failed to load event');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  getEvents(filter?: EventFilter): Observable<ApiResponse<EventsPagedResponse>> {
    this.setLoading(true);
    let params = new HttpParams();
    
    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<EventsPagedResponse>>(`${this.apiUrl}`, { params })
      .pipe(
        map(response => {
          this.setLoading(false);
          if (response.succeeded) {
            this.eventsSubject.next(response.data.items);
          }
          return response;
        }),
        catchError(error => {
          this.setLoading(false);
          this.setError('Failed to load events');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  getFeaturedEvents(count: number = 6): Observable<ApiResponse<EventSummaryDto[]>> {
    return this.http.get<ApiResponse<EventSummaryDto[]>>(`${this.apiUrl}/featured?count=${count}`)
      .pipe(
        catchError(error => {
          this.setError('Failed to load featured events');
          return of({ succeeded: false, data: [], message: error.message });
        })
      );
  }

  getTrendingEvents(count: number = 10, timeframe: string = 'week'): Observable<ApiResponse<EventSummaryDto[]>> {
    const params = new HttpParams()
      .set('count', count.toString())
      .set('timeframe', timeframe);

    return this.http.get<ApiResponse<EventSummaryDto[]>>(`${this.apiUrl}/trending`, { params })
      .pipe(
        catchError(error => {
          this.setError('Failed to load trending events');
          return of({ succeeded: false, data: [], message: error.message });
        })
      );
  }

  getUpcomingEvents(count: number = 10): Observable<ApiResponse<EventSummaryDto[]>> {
    return this.http.get<ApiResponse<EventSummaryDto[]>>(`${this.apiUrl}/upcoming?count=${count}`)
      .pipe(
        catchError(error => {
          this.setError('Failed to load upcoming events');
          return of({ succeeded: false, data: [], message: error.message });
        })
      );
  }

  getUserEvents(userId: string, pageNumber: number = 1, pageSize: number = 10, type?: string): Observable<ApiResponse<EventsPagedResponse>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<ApiResponse<EventsPagedResponse>>(`${this.apiUrl}/user/${userId}`, { params })
      .pipe(
        catchError(error => {
          this.setError('Failed to load user events');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  getEventCalendar(year: number, month: number, category?: string, eventType?: string): Observable<ApiResponse<EventCalendarDto>> {
    let params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    
    if (category) params = params.set('category', category);
    if (eventType) params = params.set('eventType', eventType);

    return this.http.get<ApiResponse<EventCalendarDto>>(`${this.apiUrl}/calendar`, { params })
      .pipe(
        catchError(error => {
          this.setError('Failed to load event calendar');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  getEventCategories(includeEventCounts: boolean = true): Observable<ApiResponse<EventCategoryDto[]>> {
    const params = new HttpParams().set('includeEventCounts', includeEventCounts.toString());
    
    return this.http.get<ApiResponse<EventCategoryDto[]>>(`${this.apiUrl}/categories`, { params })
      .pipe(
        catchError(error => {
          this.setError('Failed to load event categories');
          return of({ succeeded: false, data: [], message: error.message });
        })
      );
  }

  getEventsStats(category?: string, eventType?: string): Observable<ApiResponse<EventsStatsDto>> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (eventType) params = params.set('eventType', eventType);

    return this.http.get<ApiResponse<EventsStatsDto>>(`${this.apiUrl}/stats`, { params })
      .pipe(
        catchError(error => {
          this.setError('Failed to load events statistics');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  // Attendance Management
  attendEvent(eventId: string, request: AttendEventRequest): Observable<ApiResponse<EventAttendanceDto>> {
    return this.http.post<ApiResponse<EventAttendanceDto>>(`${this.apiUrl}/${eventId}/attend`, request)
      .pipe(
        map(response => {
          if (response.succeeded) {
            // Refresh current event to update attendance count
            if (this.currentEventSubject.value?.id === eventId) {
              this.getEventById(eventId).subscribe();
            }
          }
          return response;
        }),
        catchError(error => {
          this.setError('Failed to register for event');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  cancelAttendance(eventId: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${eventId}/attend`)
      .pipe(
        map(response => {
          if (response.succeeded) {
            // Refresh current event to update attendance count
            if (this.currentEventSubject.value?.id === eventId) {
              this.getEventById(eventId).subscribe();
            }
          }
          return response;
        }),
        catchError(error => {
          this.setError('Failed to cancel attendance');
          return of({ succeeded: false, data: false, message: error.message });
        })
      );
  }

  getEventAttendees(eventId: string, pageNumber: number = 1, pageSize: number = 10, attendanceType?: string): Observable<ApiResponse<EventAttendeesPagedResponse>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (attendanceType) {
      params = params.set('attendanceType', attendanceType);
    }

    return this.http.get<ApiResponse<EventAttendeesPagedResponse>>(`${this.apiUrl}/${eventId}/attendees`, { params })
      .pipe(
        catchError(error => {
          this.setError('Failed to load event attendees');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  // Comment Management
  createComment(eventId: string, request: CreateEventCommentRequest): Observable<ApiResponse<EventCommentDto>> {
    return this.http.post<ApiResponse<EventCommentDto>>(`${this.apiUrl}/${eventId}/comments`, request)
      .pipe(
        catchError(error => {
          this.setError('Failed to create comment');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  updateComment(commentId: string, request: UpdateEventCommentRequest): Observable<ApiResponse<EventCommentDto>> {
    return this.http.put<ApiResponse<EventCommentDto>>(`${this.apiUrl}/comments/${commentId}`, request)
      .pipe(
        catchError(error => {
          this.setError('Failed to update comment');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  deleteComment(commentId: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/comments/${commentId}`)
      .pipe(
        catchError(error => {
          this.setError('Failed to delete comment');
          return of({ succeeded: false, data: false, message: error.message });
        })
      );
  }

  getEventComments(eventId: string, pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<EventCommentsPagedResponse>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<EventCommentsPagedResponse>>(`${this.apiUrl}/${eventId}/comments`, { params })
      .pipe(
        catchError(error => {
          this.setError('Failed to load comments');
          return of({ succeeded: false, data: null as any, message: error.message });
        })
      );
  }

  // Invitation Management
  sendInvitations(eventId: string, request: InviteToEventRequest): Observable<ApiResponse<EventInvitationDto[]>> {
    return this.http.post<ApiResponse<EventInvitationDto[]>>(`${this.apiUrl}/${eventId}/invitations`, request)
      .pipe(
        catchError(error => {
          this.setError('Failed to send invitations');
          return of({ succeeded: false, data: [], message: error.message });
        })
      );
  }

  // Search
  searchEvents(searchTerm: string, filter?: EventFilter): Observable<ApiResponse<EventsPagedResponse>> {
    const searchFilter = { ...filter, searchTerm };
    return this.getEvents(searchFilter);
  }

  // Utility methods
  private refreshEvents(): void {
    // Refresh the current events list
    this.getEvents().subscribe();
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  // Clear state
  clearCurrentEvent(): void {
    this.currentEventSubject.next(null);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}