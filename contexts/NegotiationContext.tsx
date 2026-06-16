import { Negotiation, NegotiationMessage, NotificationType } from '@/types';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { negotiationService } from '@/services/negotiation';
import { notify } from '@/lib/notify';
import { useAuth } from './AuthContext';
import { socketService } from '@/services/socket';

interface NegotiationContextType {
  currentNegotiation: Negotiation | null;
  negotiations: Negotiation[];
  negotiationMessages: NegotiationMessage[];
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
  fetchNegotiationById: (id: string, silent?: boolean) => Promise<void>;
  fetchNegotiationMessages: (negotiationId: string) => Promise<void>;
  loadNegotiationDetail: (negotiationId: string) => Promise<void>;
  fetchNegotiations: () => Promise<void>;
  setCurrentNegotiation: (negotiation: Negotiation | null) => void;
}

const NegotiationContext = createContext<NegotiationContextType | null>(null);

function NegotiationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const userRole = user?.role;

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [negotiationMessages, setNegotiationMessages] = useState<NegotiationMessage[]>([]);
  const [currentNegotiation, setCurrentNegotiation] = useState<Negotiation | null>(null);

  const currentNegotiationIdRef = useRef<string | null>(null);
  const prevUserIdRef = useRef<string | undefined>(undefined);
  const fetchNegotiationByIdRef = useRef<
    ((id: string, silent?: boolean) => Promise<void>) | null
  >(null);
  const fetchNegotiationsRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    currentNegotiationIdRef.current = currentNegotiation?.id ?? null;
  }, [currentNegotiation?.id]);

  const fetchBuyerNegotiations = useCallback(async () => {
    const res = await negotiationService.getBuyerNegotiations();
    if (res.success && res.data) setNegotiations(res.data);
  }, []);

  const fetchSellerNegotiations = useCallback(async () => {
    const res = await negotiationService.getSellerNegotiations();
    if (res.success && res.data) setNegotiations(res.data);
  }, []);

  const fetchNegotiations = useCallback(async () => {
    if (userRole === 'BUYER') {
      await fetchBuyerNegotiations();
    } else if (userRole === 'SELLER') {
      await fetchSellerNegotiations();
    }
  }, [userRole, fetchBuyerNegotiations, fetchSellerNegotiations]);

  useEffect(() => {
    fetchNegotiationsRef.current = fetchNegotiations;
  }, [fetchNegotiations]);

  useEffect(() => {
    const previousUserId = prevUserIdRef.current;
    prevUserIdRef.current = userId;

    if (!userId) {
      if (previousUserId) {
        setNegotiations([]);
        setCurrentNegotiation(null);
        setNegotiationMessages([]);
        setError(null);
      }
      return;
    }

    if (userId !== previousUserId) {
      setLoading(true);
      fetchNegotiations().finally(() => setLoading(false));
    }
  }, [userId, fetchNegotiations]);

  const fetchNegotiationMessages = useCallback(async (negotiationId: string) => {
    try {
      const res = await negotiationService.getNegotiationMessages(negotiationId);
      if (!res.success) {
        setError(res.message);
        notify.error(res.message);
        return;
      }
      if (res.data) {
        setNegotiationMessages(res.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load messages';
      setError(msg);
      notify.error(msg);
    }
  }, []);

  const fetchNegotiationById = useCallback(async (id: string, silent = false) => {
    try {
      if (!silent) setDetailLoading(true);
      const res = await negotiationService.getNegotiation(id);
      if (!res.success) {
        setError(res.message);
        notify.error(res.message);
      }
      if (res.data) setCurrentNegotiation(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load negotiation';
      setError(msg);
      notify.error(msg);
    } finally {
      if (!silent) setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNegotiationByIdRef.current = fetchNegotiationById;
  }, [fetchNegotiationById]);

  const loadNegotiationDetail = useCallback(async (negotiationId: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const negRes = await negotiationService.getNegotiation(negotiationId);
      if (!negRes.success) {
        setError(negRes.message);
        notify.error(negRes.message);
        return;
      }
      if (negRes.data) setCurrentNegotiation(negRes.data);

      const msgRes = await negotiationService.getNegotiationMessages(negotiationId);
      if (!msgRes.success) {
        setError(msgRes.message);
        notify.error(msgRes.message);
        return;
      }
      if (msgRes.data) setNegotiationMessages(msgRes.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load negotiation';
      setError(msg);
      notify.error(msg);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const setCurrentNegotiationStable = useCallback((negotiation: Negotiation | null) => {
    setCurrentNegotiation(negotiation);
  }, []);

  // Live chat messages
  useEffect(() => {
    const unsubscribeChat = socketService.onNegotiationMessage((negotiationMessage) => {
      const msgNegotiationId = negotiationMessage.negotiation?.id;
      const activeId = currentNegotiationIdRef.current;

      if (msgNegotiationId && activeId && msgNegotiationId === activeId) {
        setNegotiationMessages((prev) => {
          if (prev.some((m) => m.id === negotiationMessage.id)) return prev;
          return [...prev, negotiationMessage];
        });
      } else if (msgNegotiationId) {
        notify.info('New message in a negotiation', 'Chat');
      }
    });

    const unsubscribeNotif = socketService.onNotification((notification) => {
      if (notification.type === NotificationType.NEGOTIATION) {
        fetchNegotiationsRef.current?.();
        const activeId = currentNegotiationIdRef.current;
        if (activeId) {
          fetchNegotiationByIdRef.current?.(activeId, true);
        }
      }
    });

    const unsubscribeError = socketService.onSocketError((message) => {
      notify.error(message, 'Chat error');
    });

    return () => {
      unsubscribeChat();
      unsubscribeNotif();
      unsubscribeError();
    };
  }, []);

  const value = useMemo(
    () => ({
      currentNegotiation,
      negotiations,
      negotiationMessages,
      loading,
      detailLoading,
      error,
      fetchNegotiationById,
      fetchNegotiationMessages,
      loadNegotiationDetail,
      fetchNegotiations,
      setCurrentNegotiation: setCurrentNegotiationStable,
    }),
    [
      currentNegotiation,
      negotiations,
      negotiationMessages,
      loading,
      detailLoading,
      error,
      fetchNegotiationById,
      fetchNegotiationMessages,
      loadNegotiationDetail,
      fetchNegotiations,
      setCurrentNegotiationStable,
    ],
  );

  return (
    <NegotiationContext.Provider value={value}>
      {children}
    </NegotiationContext.Provider>
  );
}

const useNegotiation = () => {
  const context = useContext(NegotiationContext);
  if (!context) {
    throw new Error('useNegotiation must be used within NegotiationProvider');
  }
  return context;
};

export { useNegotiation, NegotiationProvider };
