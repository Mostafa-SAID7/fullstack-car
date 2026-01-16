import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initializeSignalR, ConnectionStatus } from '@/services/signalr/SignalRService';

interface SignalRContextType {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  error: Error | null;
}

const SignalRContext = createContext<SignalRContextType>({
  connectionStatus: ConnectionStatus.Disconnected,
  isConnected: false,
  error: null
});

interface SignalRProviderProps {
  children: ReactNode;
  hubUrl: string;
  getAccessToken: () => string | null;
  autoConnect?: boolean;
}

/**
 * SignalR Provider Component
 * Initializes and manages SignalR connection for the entire app
 */
export const SignalRProvider: React.FC<SignalRProviderProps> = ({
  children,
  hubUrl,
  getAccessToken,
  autoConnect = true
}) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize SignalR service
    const signalRService = initializeSignalR(hubUrl, getAccessToken);

    // Set up connection state change handler
    signalRService.setOnConnectionStateChange((status) => {
      setConnectionStatus(status);
      setIsConnected(status === ConnectionStatus.Connected);
    });

    // Set up error handler
    signalRService.setOnError((err) => {
      setError(err);
    });

    // Auto-connect if enabled
    if (autoConnect) {
      const token = getAccessToken();
      if (token) {
        signalRService.start().catch((err) => {
          console.error('Failed to start SignalR connection:', err);
          setError(err);
        });
      }
    }

    // Cleanup on unmount
    return () => {
      signalRService.stop().catch((err) => {
        console.error('Failed to stop SignalR connection:', err);
      });
    };
  }, [hubUrl, getAccessToken, autoConnect]);

  return (
    <SignalRContext.Provider value={{ connectionStatus, isConnected, error }}>
      {children}
    </SignalRContext.Provider>
  );
};

/**
 * Hook to access SignalR context
 */
export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalRContext must be used within a SignalRProvider');
  }
  return context;
};
