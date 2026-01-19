// Event API Types - matching backend DTOs

export interface EventDto {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location?: string;
  isOnline: boolean;
  isPublic: boolean;
  isFree: boolean;
  price?: number;
  currency?: string;
  maxAttendees?: number;
  attendeeCount: number;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  organizer: EventOrganizerDto;
  tags: string[];
  imageUrl?: string;
  websiteUrl?: string;
  registrationUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventSummaryDto {
  id: string;
  title: string;
  shortDescription?: string;
  category: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location?: string;
  isOnline: boolean;
  isFree: boolean;
  price?: number;
  attendeeCount: number;
  maxAttendees?: number;
  organizer: EventOrganizerDto;
  imageUrl?: string;
  isFeatured: boolean;
}

export interface EventOrganizerDto {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  organizationType: string;
}

export interface EventCategoryDto {
  id: string;
  name: string;
  description?: string;
  eventCount?: number;
  iconName?: string;
}

export interface EventAttendanceDto {
  id: string;
  eventId: string;
  userId: string;
  attendanceType: string;
  responseDate: string;
  isApproved: boolean;
  checkedIn: boolean;
  checkedInAt?: string;
  notes?: string;
}

export interface EventAttendeeDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatarUrl?: string;
  attendanceType: string;
  responseDate: string;
  isApproved: boolean;
  checkedIn: boolean;
  checkedInAt?: string;
}

export interface EventCommentDto {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  parentCommentId?: string;
  replies?: EventCommentDto[];
}

export interface EventInvitationDto {
  id: string;
  eventId: string;
  invitedUserId: string;
  invitedUserEmail: string;
  invitedBy: string;
  invitedByName: string;
  status: string;
  sentAt: string;
  respondedAt?: string;
  message?: string;
}

export interface EventUpdateDto {
  id: string;
  eventId: string;
  title: string;
  content: string;
  updateType: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface EventCalendarDto {
  year: number;
  month: number;
  events: EventCalendarEventDto[];
  totalEvents: number;
}

export interface EventCalendarEventDto {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isOnline: boolean;
  category: string;
  attendeeCount: number;
}

// Request DTOs
export interface CreateEventRequest {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location?: string;
  isOnline: boolean;
  isPublic: boolean;
  isFree: boolean;
  price?: number;
  currency?: string;
  maxAttendees?: number;
  tags: string[];
  imageUrl?: string;
  websiteUrl?: string;
  registrationUrl?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  isOnline?: boolean;
  isPublic?: boolean;
  isFree?: boolean;
  price?: number;
  currency?: string;
  maxAttendees?: number;
  tags?: string[];
  imageUrl?: string;
  websiteUrl?: string;
  registrationUrl?: string;
}

export interface GetEventsRequest {
  pageNumber?: number;
  pageSize?: number;
  category?: string;
  eventType?: string;
  searchTerm?: string;
  location?: string;
  fromDate?: string;
  toDate?: string;
  isOnline?: boolean;
  isFree?: boolean;
  isPublic?: boolean;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface AttendEventRequest {
  attendanceType: string;
  notes?: string;
}

export interface CreateEventCommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface UpdateEventCommentRequest {
  content: string;
}

export interface InviteToEventRequest {
  userIds?: string[];
  emails?: string[];
  message?: string;
}

export interface CreateEventUpdateRequest {
  title: string;
  content: string;
  updateType: string;
}

// Response DTOs
export interface EventsPagedResponse {
  items: EventSummaryDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EventAttendeesPagedResponse {
  items: EventAttendeeDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  stats: EventAttendanceStatsDto;
}

export interface EventCommentsPagedResponse {
  items: EventCommentDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalComments: number;
  totalReplies: number;
}

export interface EventsStatsDto {
  totalEvents: number;
  totalUpcomingEvents: number;
  totalPastEvents: number;
  totalOnlineEvents: number;
  totalInPersonEvents: number;
  totalFreeEvents: number;
  totalPaidEvents: number;
  averageAttendance: number;
  mostPopularCategory: string;
  totalAttendees: number;
}

export interface EventAttendanceStatsDto {
  eventId: string;
  totalAttendees: number;
  confirmedAttendees: number;
  maybeAttendees: number;
  declinedAttendees: number;
  checkedInAttendees: number;
  pendingApproval: number;
}

// Filter and Search Types
export interface EventFilter {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  category?: string;
  eventType?: string;
  location?: string;
  fromDate?: string;
  toDate?: string;
  isOnline?: boolean;
  isFree?: boolean;
  isPublic?: boolean;
  sortBy?: string;
  sortDirection?: string;
  status?: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
}

// API Response wrapper
export interface ApiResponse<T> {
  succeeded: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}