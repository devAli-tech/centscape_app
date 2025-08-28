
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalizeUrl } from "@/utils/normalizeUrl";
import type { WishlistItem } from "@/components/WishlistItemCard";
import { v4 as uuidv4 } from "uuid";

const KEY = "@centscape:wishlist";
const VER_KEY = "@centscape:dbVersion";

export type ItemV1 = {
  id: string; title: string; price: number | null; image?: string | null; source: string; url: string; createdAt: number;
};

export type ItemV2 = WishlistItem & { url: string };

export async function loadItems(): Promise<ItemV2[]> {
  const raw = await AsyncStorage.getItem(KEY);
  const verRaw = await AsyncStorage.getItem(VER_KEY);
  const version = verRaw ? Number(verRaw) : 1;
  if (!raw) return [];
  const arr = JSON.parse(raw) as (ItemV1 | ItemV2)[];
  if (version < 2) {
    const migrated: ItemV2[] = (arr as ItemV1[]).map((i) => ({
      id: i.id, title: i.title, price: i.price, image: i.image, source: i.source,
      normalizedUrl: normalizeUrl(i.url), createdAt: i.createdAt, url: i.url,
    }));
    await AsyncStorage.multiSet([[KEY, JSON.stringify(migrated)], [VER_KEY, "2"]]);
    return migrated;
  }
  return arr as ItemV2[];
}

export async function saveItems(items: ItemV2[]): Promise<void> {
  await AsyncStorage.multiSet([[KEY, JSON.stringify(items)], [VER_KEY, "2"]]);
}

export async function addItem(input: { url: string; title: string; image?: string | null; price: number | null }): Promise<{ ok: boolean; reason?: string; item?: ItemV2 }> {
  const items = await loadItems();
  const normalizedUrl = normalizeUrl(input.url);
  if (items.some((i) => i.normalizedUrl === normalizedUrl)) {
    return { ok: false, reason: "duplicate" };
  }
  const u = new URL(input.url);
  const item: ItemV2 = {
    id: uuidv4(),
    title: input.title || u.hostname,
    image: input.image ?? null,
    price: input.price ?? null,
    source: u.hostname.replace(/^www\./, ""),
    normalizedUrl,
    createdAt: Date.now(),
    url: input.url,
  };
  const out = [item, ...items];
  await saveItems(out);
  return { ok: true, item };
}

export async function removeItem(id: string): Promise<void> {
  const items = await loadItems();
  await saveItems(items.filter((i) => i.id !== id));
}
