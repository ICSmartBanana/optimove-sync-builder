import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Upload } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { usePreviewHtml } from "@/hooks/usePreviewHtml";

export function LanguageActionRow({
  language,
  combination,
  siteBaseUrl,
  handlePreview,
  handleExport,
  mapping,
  selectedBrand,
  selectedProduct,
  emailParams,
  isLoading,
  toast,
  optimoveApi,
  resolveEmailId
}) {
  const { ref, inView } = useInView<HTMLDivElement>("600px");

  // Prefetch when in view
  useEffect(() => {
    if (inView) {
      usePreviewHtml(siteBaseUrl, combination.mailingItem.id, language.code);
    }
  }, [inView, siteBaseUrl, combination.mailingItem.id, language.code]);

  return (
    <div
      ref={ref}
      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-secondary"
    >
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="font-mono text-xs">
          {language.code}
        </Badge>
        <span className="text-sm font-medium">{language.displayName}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePreview(combination.mailingItem.id, language.code)}
          className="h-8 text-xs"
        >
          <Eye className="h-3 w-3 mr-1" />
          Preview
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={async () => {
            if (!mapping || !selectedBrand || !selectedProduct) {
              toast({
                variant: "destructive",
                title: "Missing configuration",
                description: "Brand, product or mapping config not available."
              });
              return;
            }

            const html = await optimoveApi.getMailingHtml(
              combination.mailingItem.id,
              language.code
            );

            await handleExport({
              mailingItemId: combination.mailingItem.id,
              templateName: combination.mailingItem.name + " | " + language.code,
              subject: combination.mailingItem.name,
              html: html,
              plainText: "...",
              fromName: "CMS WIP",
              replyToAddressID: resolveEmailId(
                emailParams?.ReplyToAddresses || [],
                combination.mailingItem.replyToAddress
              ),
              fromEmailAddressID: resolveEmailId(
                emailParams?.FromEmailAddresses || [],
                combination.mailingItem.fromAddress
              ),
              folderID: mapping.folderId,
              brandId: mapping.optimoveBrandId,
              language: language.code,
              mailingSite: mapping.mailingSite,
              brandName: mapping.brandCode,
              productName: mapping.productCode,
              mailType: combination.mailingItem.name
            });
          }}
          disabled={isLoading}
          className="h-8 text-xs"
        >
          <Upload className="h-3 w-3 mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
}
