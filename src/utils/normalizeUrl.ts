
export function normalizeUrl(raw: string): string {
  try {
    const url = new URL(raw.trim());
    url.hash = "";
    url.host = url.host.toLowerCase();
    const params = url.searchParams;
    const toDelete: string[] = [];
    params.forEach((_, key) => { if (/^(utm_|fbclid|gclid|igshid|mc_)/i.test(key)) toDelete.push(key); });
    toDelete.forEach((k) => params.delete(k));
    const entries = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));
    url.search = entries.length ? `?${entries.map(([k, v]) => `${k}=${v}`).join("&")}` : "";
    return url.toString();
  } catch {
    return raw.trim();
  }
}
