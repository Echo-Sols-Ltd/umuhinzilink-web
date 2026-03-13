import { useState, useEffect } from 'react';
import { socketService } from '@/services/socket';
import { NegotiationMessage, NegotiationStatusUpdate } from '@/types';

export const useNegotiationSocket = (negotiationId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [lastStatusUpdate, setLastStatusUpdate] = useState<NegotiationStatusUpdate | null>(null);

  useEffect(() => {
    // Update connection status
    const updateConnectionStatus = () => {
      setIsConnected(socketService.isConnected());
    };

    // Handle incoming messages
    const handleMessage = (nid: string, message: NegotiationMessage) => {
      if (nid === negotiationId) {
        setMessages(prev => [...prev, message]);
      }
    };

    // Handle status updates
    const handleStatusUpdate = (nid: string, status: NegotiationStatusUpdate) => {
      if (nid === negotiationId) {
        setLastStatusUpdate(status);
      }
    };

    // Set up listeners
    const interval = setInterval(updateConnectionStatus, 1000);
    updateConnectionStatus();
    
    socketService.onNegotiationMessage(handleMessage);
    socketService.onNegotiationStatus(handleStatusUpdate);

    // Subscribe to negotiation if ID is provided
    if (negotiationId && socketService.isConnected()) {
      socketService.subscribeToNegotiation(negotiationId);
    }

    return () => {
      clearInterval(interval);
      socketService.removeNegotiationMessageListener(handleMessage);
      socketService.removeNegotiationStatusListener(handleStatusUpdate);
      
      // Unsubscribe from negotiation when component unmounts
      if (negotiationId) {
        socketService.unsubscribeFromNegotiation(negotiationId);
      }
    };
  }, [negotiationId]);

  // Re-subscribe when connection is established
  useEffect(() => {
    if (negotiationId && isConnected) {
      socketService.subscribeToNegotiation(negotiationId);
    }
  }, [negotiationId, isConnected]);

  const sendMessage = (message: NegotiationMessage) => {
    if (negotiationId) {
      socketService.sendNegotiationMessage(negotiationId, message);
    }
  };

  const sendStatusUpdate = (status: NegotiationStatusUpdate) => {
    if (negotiationId) {
      socketService.sendNegotiationStatusUpdate(negotiationId, status);
    }
  };

  return {
    isConnected,
    messages,
    lastStatusUpdate,
    sendMessage,
    sendStatusUpdate,
  };
};
