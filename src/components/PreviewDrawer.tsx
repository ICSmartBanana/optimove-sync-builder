// src/components/PreviewDrawer.tsx
import { useMemo } from "react";
import { X } from "lucide-react";
import { buildPreviewUrl } from "@/lib/previewUrl";

type Props = {
  open: boolean;
  onClose: () => void;
  itemId?: string;
  lang?: string;
  siteBaseUrl: string;
};

export default function PreviewDrawer({ open, onClose, itemId, lang = "en", siteBaseUrl }: Props) {
  const src = useMemo(() => {
    if (!open || !itemId) return "about:blank";
    return buildPreviewUrl({ siteBaseUrl, itemId, lang });
  }, [open, itemId, lang, siteBaseUrl]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[min(900px,90vw)] bg-white shadow-2xl transition-transform duration-300 z-[1000]
                  ${open ? "translate-x-0" : "translate-x-full"}`}
      role="dialog"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="font-medium text-sm truncate">
          {itemId ? `Preview: ${itemId} (${lang})` : "Preview"}
        </div>
        <button
          onClick={onClose}
          className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <iframe
        key={src}                 // force reload when URL changes
        title="sitecore-preview"
        src={src}
        className="w-full h-[calc(100%-44px)] border-0"
        // No sandbox; Sitecore preview may need same cookies/scripts
        // If your org requires sandbox, try: sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
}