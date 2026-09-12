"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export const MAX_COMPARE = 3;
const STORAGE_KEY = "compare-tray:v1";

type Item = { slug: string; name: string };

type CompareTrayContextValue = {
  items: Item[];
  add: (item: Item) => { ok: boolean; reason?: string };
  remove: (slug: string) => void;
  clear: () => void;
  isSelected: (slug: string) => boolean;
};

const CompareTrayContext = createContext<CompareTrayContextValue | null>(null);

export function CompareTrayProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client only, avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupted storage — ignore, start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CompareTrayContextValue>(
    () => ({
      items,
      add: (item) => {
        if (items.some((i) => i.slug === item.slug)) return { ok: true };
        if (items.length >= MAX_COMPARE) {
          return { ok: false, reason: `You can compare up to ${MAX_COMPARE} colleges at a time.` };
        }
        setItems((prev) => [...prev, item]);
        return { ok: true };
      },
      remove: (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug)),
      clear: () => setItems([]),
      isSelected: (slug) => items.some((i) => i.slug === slug),
    }),
    [items]
  );

  return (
    <CompareTrayContext.Provider value={value}>{children}</CompareTrayContext.Provider>
  );
}

export function useCompareTray() {
  const ctx = useContext(CompareTrayContext);
  if (!ctx) throw new Error("useCompareTray must be used within CompareTrayProvider");
  return ctx;
}
