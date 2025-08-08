import { useState, useEffect, useMemo } from 'react';
import { Brand, CombinationGridRow, EmailAddress, EmailParametersResponse, ExportRequest, Language, Mapping, Product } from '@/types/optimove';
import { optimoveApi } from '@/services/optimoveApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Eye,
  Upload,
  Trash2,
  ChevronDown,
  ChevronRight,
  Globe,
  Calendar,
  Package
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInView } from '@/hooks/useInView';

export function LanguageActionRow(props: {
  language: Language;
  combination: CombinationGridRow;
  siteBaseUrl: string;
  isLoading: boolean;
  mapping: Mapping | null;
  selectedBrand: Brand | null;
  selectedProduct: Product | null;
  emailParams: EmailParametersResponse | null;
  toast: ReturnType<typeof useToast>['toast'];
  optimoveApi: typeof optimoveApi;
  resolveEmailId: (list: EmailAddress[], email: string) => number;
  onPreview: (itemId: string, languageCode: string) => void;
  onExport: (req: ExportRequest) => Promise<void>;
}) {
  const {
    language, combination, siteBaseUrl, isLoading,
    mapping, selectedBrand, selectedProduct, emailParams,
    toast, optimoveApi, resolveEmailId, onPreview, onExport
  } = props;

  // Stable hook calls:
  const { ref, inView } = useInView<HTMLDivElement>('600px');

  // Prefetch by toggling the input; NEVER call this conditionally
  //usePreviewHtml(siteBaseUrl, inView ? combination.mailingItem.id : '', language.code);

  return (
    <div
      ref={ref}
      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-secondary"
    >
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="font-mono text-xs">
          {language.code}
        </Badge>
        <span className="text-sm font-medium">
          {language.displayName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview(combination.mailingItem.id, language.code)}
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
                variant: 'destructive',
                title: 'Missing configuration',
                description: 'Brand, product or mapping config not available.'
              });
              return;
            }

            const html = await optimoveApi.getMailingHtml(
              combination.mailingItem.id,
              language.code
            );

            await onExport({
              mailingItemId: combination.mailingItem.id,
              templateName: combination.mailingItem.name + ' | ' + language.code,
              subject: combination.mailingItem.name,
              html,
              plainText: '...',
              fromName: 'CMS WIP',
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