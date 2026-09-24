import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'starlens.seenConstellations';

interface SeenContextValue {
  isSeen: (id: string) => boolean;
  toggleSeen: (id: string) => void;
  seenCount: number;
  isLoaded: boolean;
}

const SeenContext = createContext<SeenContextValue | null>(null);

export function SeenStoreProvider({ children }: PropsWithChildren) {
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSeenIds(new Set(parsed));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<SeenContextValue>(
    () => ({
      isSeen: (id: string) => seenIds.has(id),
      seenCount: seenIds.size,
      isLoaded,
      toggleSeen: (id: string) => {
        setSeenIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))).catch(() => {});
          return next;
        });
      },
    }),
    [seenIds, isLoaded]
  );

  return <SeenContext.Provider value={value}>{children}</SeenContext.Provider>;
}

export function useSeen() {
  const ctx = useContext(SeenContext);
  if (!ctx) throw new Error('useSeen must be used within a SeenStoreProvider');
  return ctx;
}
