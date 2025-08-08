import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import { usePreviewHtml } from "@/hooks/usePreviewHtml";

type Props = {
  open: boolean;
  onClose: () => void;
  itemId?: string;
  lang?: string;
  siteBaseUrl: string; // from env/config
};

// Side drawer with an iframe to isolate HTML/CSS from the app
export default function PreviewDrawer({ open, onClose, itemId, lang = "en", siteBaseUrl }: Props) {
  const { html, loading, error } = usePreviewHtml(siteBaseUrl, itemId || "", lang);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Write HTML into the iframe whenever it changes
  useEffect(() => {
    if (!open || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html || "");
    doc.close();
  }, [open, html]);

  const title = useMemo(() => (itemId ? `Preview: ${itemId}` : "Preview"), [itemId]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[min(900px,90vw)] bg-white shadow-2xl transition-transform duration-300 z-[1000]
                  ${open ? "translate-x-0" : "translate-x-full"}`}
      role="dialog"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="font-medium text-sm truncate">{title}</div>
        <button
          onClick={onClose}
          className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="h-[calc(100%-44px)]">
        {loading && (
          <div className="h-full grid place-items-center text-sm text-gray-500">Loading preview…</div>
        )}
        {error && (
          <div className="p-4 text-red-600 text-sm">Failed to load preview: {error}</div>
        )}
        {!loading && !error && (
          <iframe
            ref={iframeRef}
            title="sitecore-preview"
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        )}
      </div>
    </div>
  );
}
