
export type Preview = { title: string; image?: string | null; price: number | null };
const PRICE_PATTERNS = [
  /\$\s?(\d{1,5}(?:[.,]\d{2})?)/i,
  /data-price\s*=\s*"(\d+(?:[.,]\d{2})?)"/i,
  /itemprop="price"\s*content=\s*"(\d+(?:[.,]\d{2})?)"/i,
];
export async function fetchPreview(targetUrl: string, timeoutMs = 8000): Promise<Preview> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const res = await fetch(targetUrl, { signal: controller.signal });
  clearTimeout(id);
  const html = await res.text();
  const getMeta = (p: RegExp) => html.match(p)?.[1]?.trim();
  const title =
    getMeta(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
    getMeta(/<title>([^<]+)<\/title>/i) || "Untitled";
  const image =
    getMeta(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
    getMeta(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i) || null;
  let price: number | null = null;
  for (const pattern of PRICE_PATTERNS) {
    const m = html.match(pattern);
    if (m) { const n = parseFloat(m[1].replace(/,/g, ".")); if (!isNaN(n)) { price = Math.round(n * 100) / 100; break; } }
  }
  return { title, image, price };
}
