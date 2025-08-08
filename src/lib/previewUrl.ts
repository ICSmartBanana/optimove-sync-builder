// Build Sitecore preview URL for an item.
// Example final URL:
// https://cms.test.env.works/?sc_itemid={GUID}&sc_lang=en&sc_mode=preview&mailExportMode=true
export function buildPreviewUrl(opts: {
  siteBaseUrl: string;   // e.g. "https://cms.test.env.works"
  itemId: string;        // "{GUID}" (can be raw with braces)
  lang?: string;         // "en" (default)
}) {
  const { siteBaseUrl, itemId, lang = "en" } = opts;
  const url = new URL(siteBaseUrl);
  url.searchParams.set("sc_itemid", itemId);
  url.searchParams.set("sc_lang", lang);
  url.searchParams.set("sc_mode", "preview");
  url.searchParams.set("mailExportMode", "true");
  return url.toString();
}
