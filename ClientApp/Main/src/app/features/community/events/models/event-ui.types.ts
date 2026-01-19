// Event UI Types - for frontend-specific models

export interface EventListItem {
  id: string;
  title: string;
  shortDescription?: string;
  category: string;
  eventType: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  isOnline: boolean;
  isFree: boolean;
  price?: number;
  attendeeCount: number;
  maxAttendees?: number;
  organizer: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  imageUrl?: string;
  isFeatured: boolean;
  isUpcoming: boolean;
  isPast: boolean;
  isOngoing: boolean;
  daysUntilEvent?: number;
  formattedDate: string;
  formattedTime: string;
  formattedLocation: string;
}

export interface EventDetail extends EventListItem {
  description: string;
  tags: string[];
  websiteUrl?: string;
  registrationUrl?: string;
  status: string;
  isActive: boolean;
  userAttendanceStatus?: 'attending' | 'maybe' | 'not_attending' | 'not_responded';
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  attendanceStats: {
    confirmed: number;
    maybe: number;
    declined: number;
    pending: number;
  };
}

export interface EventFormData {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  eventType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
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

export interface EventFilterOptions {
  categories: { value: string; label: string; count?: number }[];
  eventTypes: { value: string; label: string; count?: number }[];
  locations: { value: string; label: string; count?: number }[];
  priceRanges: { value: string; label: string; min?: number; max?: number }[];
  dateRanges: { value: string; label: string; fromDate?: string; toDate?: string }[];
}

export interface EventSearchState {
  searchTerm: string;
  category: string;
  eventType: string;
  location: string;
  fromDate?: string;
  toDate?: string;
  isOnline?: boolean;
  isFree?: boolean;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  pageSize: number;
}

export interface EventCalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: EventCalendarEvent[];
  hasEvents: boolean;
}

export interface EventCalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  isOnline: boolean;
  attendeeCount: number;
  color: string;
}

export interface EventAttendeeListItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  attendanceType: 'attending' | 'maybe' | 'not_attending';
  responseDate: Date;
  isApproved: boolean;
  checkedIn: boolean;
  checkedInAt?: Date;
  canApprove: boolean;
  canCheckIn: boolean;
}

export interface EventCommentItem {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  parentCommentId?: string;
  replies: EventCommentItem[];
  canEdit: boolean;
  canDelete: boolean;
  isReplying: boolean;
  replyContent: string;
}

export interface EventInvitationItem {
  id: string;
  eventTitle: string;
  eventStartDate: Date;
  invitedBy: string;
  invitedByName: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: Date;
  respondedAt?: Date;
  message?: string;
  canRespond: boolean;
}

export interface EventUpdateItem {
  id: string;
  title: string;
  content: string;
  updateType: 'general' | 'schedule_change' | 'location_change' | 'cancellation' | 'important';
  createdAt: Date;
  createdBy: string;
  createdByName: string;
  isNew: boolean;
}

// Form validation types
export interface EventFormErrors {
  title?: string;
  description?: string;
  category?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  price?: string;
  maxAttendees?: string;
  general?: string;
}

// Loading states
export interface EventsLoadingState {
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  attending: boolean;
  commenting: boolean;
  inviting: boolean;
}

// Sort options
export interface EventSortOption {
  value: string;
  label: string;
  icon: string;
}

// Category and type definitions
export interface EventCategoryOption {
  value: string;
  label: string;
  description?: string;
  icon: string;
  color: string;
}

export interface EventTypeOption {
  value: string;
  label: string;
  description?: string;
  icon: string;
}

// Statistics for dashboard
export interface EventsDashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  myEvents: number;
  attendingEvents: number;
  popularCategories: { category: string; count: number; percentage: number }[];
  recentActivity: {
    type: 'created' | 'attended' | 'commented' | 'invited';
    eventTitle: string;
    eventId: string;
    date: Date;
  }[];
}

// Notification types
export interface EventNotification {
  id: string;
  type: 'invitation' | 'reminder' | 'update' | 'cancellation' | 'approval';
  eventId: string;
  eventTitle: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  actionUrl?: string;
}