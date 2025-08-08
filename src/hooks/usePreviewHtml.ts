import { useEffect, useRef, useState } from "react";
import { buildPreviewUrl } from "@/lib/previewUrl";

const cache = new Map<string, string>();

export function usePreviewHtml(siteBaseUrl: string, itemId: string, lang = "en") {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const key = `${itemId}|${lang}`;
    if (!itemId) return;

    // cached?
    if (cache.has(key)) {
      setHtml(cache.get(key) || null);
      return;
    }

    setLoading(true);
    setError(null);

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const url = buildPreviewUrl({ siteBaseUrl, itemId, lang });

    fetch(url, { method: "GET", credentials: "include", signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Preview HTTP ${r.status}`);
        const text = await r.text();
        cache.set(key, text);
        setHtml(text);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message || "Failed to load preview");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [siteBaseUrl, itemId, lang]);

  return { html, loading, error };
}
