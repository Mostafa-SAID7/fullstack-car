import { useEffect, useState, useCallback } from 'react';
import { getSignalRService, ConnectionStatus, CommunityEvents } from '@/services/signalr/SignalRService';

/**
 * React hook for using SignalR in components
 * @param eventName - The event to subscribe to
 * @param callback - Callback function when event is received
 */
export function useSignalREvent<K extends keyof CommunityEvents>(
  eventName: K,
  callback: (data: CommunityEvents[K]) => void
) {
  useEffect(() => {
    try {
      const signalRService = getSignalRService();
      const unsubscribe = signalRService.on(eventName, callback);

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.warn('SignalR service not initialized:', error);
    }
  }, [eventName, callback]);
}

/**
 * React hook for monitoring SignalR connection status
 */
export function useSignalRConnection() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    try {
      const signalRService = getSignalRService();
      
      // Set initial status
      setConnectionStatus(signalRService.getConnectionStatus());
      setIsConnected(signalRService.isConnected());

      // Subscribe to status changes
      signalRService.setOnConnectionStateChange((status) => {
        setConnectionStatus(status);
        setIsConnected(status === ConnectionStatus.Connected);
      });

    } catch (error) {
      console.warn('SignalR service not initialized:', error);
    }
  }, []);

  return { connectionStatus, isConnected };
}

/**
 * React hook for invoking SignalR hub methods
 */
export function useSignalRInvoke() {
  const invoke = useCallback(async (methodName: string, ...args: any[]) => {
    try {
      const signalRService = getSignalRService();
      return await signalRService.invoke(methodName, ...args);
    } catch (error) {
      console.error('Error invoking SignalR method:', error);
      throw error;
    }
  }, []);

  return { invoke };
}
