import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { WishlistItem } from "@/components/WishlistItemCard";
import { addItem, loadItems, removeItem } from "@/services/storage";

type Ctx = {
  items: WishlistItem[];
  loading: boolean;
  add: ReturnType<typeof addItem>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const WishlistContext = createContext<Ctx | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const data = await loadItems();
    setItems(data as any);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  const api = useMemo<Ctx>(
    () => ({
      items,
      loading,
      add: addItem,
      remove: async (id) => { await removeItem(id); await refresh(); },
      refresh,
    }),
    [items, loading]
  );

  return <WishlistContext.Provider value={api}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}