import { useState, useEffect, useCallback } from 'react';
import { servicesService } from '../api/servicesService';
import type { 
  ServiceBooking, 
  BookingsQueryParams,
  CreateBookingRequest,
  PaginatedResult
} from '../types';

interface UseBookingsParams extends BookingsQueryParams {}

interface UseBookingsReturn {
  bookings: PaginatedResult<ServiceBooking> | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createBooking: (data: CreateBookingRequest) => Promise<void>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;
  confirmBooking: (id: string, notes?: string) => Promise<void>;
  completeBooking: (id: string, notes?: string) => Promise<void>;
}

export const useBookings = (params: UseBookingsParams = {}): UseBookingsReturn => {
  const [bookings, setBookings] = useState<PaginatedResult<ServiceBooking> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await servicesService.getBookings(params);

      if (result.succeeded) {
        setBookings(result.data);
      } else {
        throw new Error('Failed to fetch bookings');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [
    params.page,
    params.limit,
    params.search,
    params.status,
    params.serviceId,
    params.providerId,
    params.customerId,
    params.fromDate,
    params.toDate,
    params.isEmergency,
    params.sortBy,
    params.sortOrder
  ]);

  const createBooking = useCallback(async (data: CreateBookingRequest) => {
    try {
      // This would call the booking creation endpoint
      console.log('Creating booking:', data);
      await fetchBookings(); // Refresh the list
    } catch (err) {
      throw err;
    }
  }, [fetchBookings]);

  const cancelBooking = useCallback(async (id: string, reason?: string) => {
    try {
      // This would call the booking cancellation endpoint
      console.log('Cancelling booking:', id, reason);
      await fetchBookings(); // Refresh the list
    } catch (err) {
      throw err;
    }
  }, [fetchBookings]);

  const confirmBooking = useCallback(async (id: string, notes?: string) => {
    try {
      // This would call the booking confirmation endpoint
      console.log('Confirming booking:', id, notes);
      await fetchBookings(); // Refresh the list
    } catch (err) {
      throw err;
    }
  }, [fetchBookings]);

  const completeBooking = useCallback(async (id: string, notes?: string) => {
    try {
      // This would call the booking completion endpoint
      console.log('Completing booking:', id, notes);
      await fetchBookings(); // Refresh the list
    } catch (err) {
      throw err;
    }
  }, [fetchBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    isLoading,
    error,
    refetch: fetchBookings,
    createBooking,
    cancelBooking,
    confirmBooking,
    completeBooking
  };
};