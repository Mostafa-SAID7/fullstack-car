import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  QASignalRConnectionService, 
  ConnectionStatus
} from '../services/qa-signalr-connection.service';
import type { 
  ConnectionHealth, 
  ConnectionError,
  ActiveConnection,
  ConnectionEventHandler 
} from '../services/qa-signalr-connection.service';

// Hook for managing QA SignalR connection in React Dashboard
export const useQASignalRConnection = (getAuthToken: () => string | null) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [connectionHealth, setConnectionHealth] = useState<ConnectionHealth | null>(null);
  const [lastError, setLastError] = useState<ConnectionError | null>(null);
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([]);

  const serviceRef = useRef<QASignalRConnectionService | null>(null);
  const eventHandlersRef = useRef<Map<string, (() => void)[]>>(new Map());

  // Initialize service
  useEffect(() => {
    if (!serviceRef.current) {
      serviceRef.current = new QASignalRConnectionService(getAuthToken);

      // Set up status change handler
      const statusUnsubscribe = serviceRef.current.onStatusChange((status) => {
        setConnectionStatus(status);
        setIsReconnecting(status === ConnectionStatus.Reconnecting);
      });

      // Set up error handler
      const errorUnsubscribe = serviceRef.current.onError((error) => {
        setLastError(error);
      });

      // Start connection
      serviceRef.current.startConnection().catch(error => {
        console.error('Failed to start QA SignalR connection:', error);
      });

      // Cleanup function
      return () => {
        statusUnsubscribe();
        errorUnsubscribe();
        if (serviceRef.current) {
          serviceRef.current.dispose();
          serviceRef.current = null;
        }
      };
    }
  }, [getAuthToken]);

  // Connection management methods
  const connect = useCallback(async () => {
    if (serviceRef.current) {
      await serviceRef.current.startConnection();
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (serviceRef.current) {
      await serviceRef.current.stopConnection();
    }
  }, []);

  const forceReconnect = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.forceReconnect();
    }
  }, []);

  const testConnection = useCallback(async (message?: string) => {
    if (serviceRef.current) {
      await serviceRef.current.testConnection(message);
    }
  }, []);

  // Health monitoring methods
  const refreshConnectionHealth = useCallback(async () => {
    if (serviceRef.current) {
      try {
        const health = await serviceRef.current.getConnectionHealth();
        setConnectionHealth(health);
      } catch (error) {
        console.error('Failed to refresh connection health:', error);
      }
    }
  }, []);

  const refreshActiveConnections = useCallback(async () => {
    if (serviceRef.current) {
      try {
        const connections = await serviceRef.current.getActiveConnections();
        setActiveConnections(connections);
      } catch (error) {
        console.error('Failed to refresh active connections:', error);
      }
    }
  }, []);

  // Group management methods
  const joinGroup = useCallback(async (groupName: string) => {
    if (serviceRef.current) {
      await serviceRef.current.joinGroup(groupName);
    }
  }, []);

  const leaveGroup = useCallback(async (groupName: string) => {
    if (serviceRef.current) {
      await serviceRef.current.leaveGroup(groupName);
    }
  }, []);

  // Event subscription method
  const subscribeToEvent = useCallback((eventName: string, handler: ConnectionEventHandler) => {
    if (serviceRef.current) {
      const unsubscribe = serviceRef.current.onEvent(eventName, handler);
      
      // Track unsubscribe functions for cleanup
      if (!eventHandlersRef.current.has(eventName)) {
        eventHandlersRef.current.set(eventName, []);
      }
      eventHandlersRef.current.get(eventName)!.push(unsubscribe);

      // Return unsubscribe function
      return () => {
        unsubscribe();
        const handlers = eventHandlersRef.current.get(eventName);
        if (handlers) {
          const index = handlers.indexOf(unsubscribe);
          if (index > -1) {
            handlers.splice(index, 1);
          }
        }
      };
    }
    return () => {}; // No-op if service not available
  }, []);

  // Get connection statistics
  const getConnectionStats = useCallback(() => {
    if (serviceRef.current) {
      return serviceRef.current.getConnectionStats();
    }
    return null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup all event handlers
      eventHandlersRef.current.forEach(handlers => {
        handlers.forEach(unsubscribe => unsubscribe());
      });
      eventHandlersRef.current.clear();

      // Dispose service
      if (serviceRef.current) {
        serviceRef.current.dispose();
        serviceRef.current = null;
      }
    };
  }, []);

  // Auto-refresh health data when connected
  useEffect(() => {
    if (connectionStatus === ConnectionStatus.Connected) {
      refreshConnectionHealth();
      refreshActiveConnections();

      // Set up periodic refresh
      const healthInterval = setInterval(refreshConnectionHealth, 30000); // 30 seconds
      const connectionsInterval = setInterval(refreshActiveConnections, 60000); // 1 minute

      return () => {
        clearInterval(healthInterval);
        clearInterval(connectionsInterval);
      };
    }
  }, [connectionStatus, refreshConnectionHealth, refreshActiveConnections]);

  return {
    // Connection state
    connectionStatus,
    isConnected: connectionStatus === ConnectionStatus.Connected,
    isReconnecting,
    lastError,

    // Health data
    connectionHealth,
    activeConnections,

    // Connection management
    connect,
    disconnect,
    forceReconnect,
    testConnection,

    // Health monitoring
    refreshConnectionHealth,
    refreshActiveConnections,

    // Group management
    joinGroup,
    leaveGroup,

    // Event subscription
    subscribeToEvent,

    // Statistics
    getConnectionStats,

    // Service reference (for advanced usage)
    service: serviceRef.current
  };
};

// Specialized hooks for specific QA events
export const useQAAnswerEvents = (getAuthToken: () => string | null) => {
  const { subscribeToEvent, ...connection } = useQASignalRConnection(getAuthToken);
  const [newAnswers, setNewAnswers] = useState<any[]>([]);
  const [acceptedAnswers, setAcceptedAnswers] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribeNewAnswer = subscribeToEvent('newAnswer', (answer) => {
      setNewAnswers(prev => [answer, ...prev.slice(0, 49)]); // Keep last 50
    });

    const unsubscribeAcceptedAnswer = subscribeToEvent('answerAccepted', (data) => {
      setAcceptedAnswers(prev => [data, ...prev.slice(0, 49)]); // Keep last 50
    });

    return () => {
      unsubscribeNewAnswer();
      unsubscribeAcceptedAnswer();
    };
  }, [subscribeToEvent]);

  return {
    ...connection,
    newAnswers,
    acceptedAnswers,
    clearNewAnswers: () => setNewAnswers([]),
    clearAcceptedAnswers: () => setAcceptedAnswers([])
  };
};

export const useQAVoteEvents = (getAuthToken: () => string | null) => {
  const { subscribeToEvent, ...connection } = useQASignalRConnection(getAuthToken);
  const [voteUpdates, setVoteUpdates] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToEvent('voteUpdate', (voteData) => {
      setVoteUpdates(prev => [voteData, ...prev.slice(0, 99)]); // Keep last 100
    });

    return unsubscribe;
  }, [subscribeToEvent]);

  return {
    ...connection,
    voteUpdates,
    clearVoteUpdates: () => setVoteUpdates([])
  };
};

export const useQAReputationEvents = (getAuthToken: () => string | null) => {
  const { subscribeToEvent, ...connection } = useQASignalRConnection(getAuthToken);
  const [reputationUpdates, setReputationUpdates] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToEvent('reputationUpdate', (reputationData) => {
      setReputationUpdates(prev => [reputationData, ...prev.slice(0, 49)]); // Keep last 50
    });

    return unsubscribe;
  }, [subscribeToEvent]);

  return {
    ...connection,
    reputationUpdates,
    clearReputationUpdates: () => setReputationUpdates([])
  };
};

export const useQAModerationEvents = (getAuthToken: () => string | null) => {
  const { subscribeToEvent, ...connection } = useQASignalRConnection(getAuthToken);
  const [questionsClosed, setQuestionsClosed] = useState<any[]>([]);
  const [expertNotifications, setExpertNotifications] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribeQuestionClosed = subscribeToEvent('questionClosed', (data) => {
      setQuestionsClosed(prev => [data, ...prev.slice(0, 49)]); // Keep last 50
    });

    const unsubscribeExpertNotification = subscribeToEvent('expertNotification', (data) => {
      setExpertNotifications(prev => [data, ...prev.slice(0, 49)]); // Keep last 50
    });

    return () => {
      unsubscribeQuestionClosed();
      unsubscribeExpertNotification();
    };
  }, [subscribeToEvent]);

  return {
    ...connection,
    questionsClosed,
    expertNotifications,
    clearQuestionsClosed: () => setQuestionsClosed([]),
    clearExpertNotifications: () => setExpertNotifications([])
  };
};