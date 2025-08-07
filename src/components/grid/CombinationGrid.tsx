import { useState, useEffect } from 'react';
import { Brand, CombinationGridRow, EmailAddress, EmailParametersResponse, ExportRequest, Language, Mapping, Product } from '@/types/optimove';
import { optimoveApi } from '@/services/optimoveApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Package,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CombinationGridProps {
  combinations: CombinationGridRow[];
  onUpdateLanguages: (combinationId: string, languages: Language[]) => void;
  onToggleExpanded: (combinationId: string) => void;
  onRemoveCombination: (combinationId: string) => void;
  onExportSingle: (request: ExportRequest) => Promise<any>;
  onConstructPreviewUrl: (itemId: string, languageCode: string) => string;
  isLoading?: boolean;
  selectedBrand: Brand | null;
  selectedProduct: Product | null;
  mapping: Mapping | null;
}

export const CombinationGrid = ({
  combinations,
  onUpdateLanguages,
  onToggleExpanded,
  onRemoveCombination,
  onExportSingle,
  onConstructPreviewUrl,
  isLoading = false,
  selectedBrand,
  selectedProduct,
  mapping
}: CombinationGridProps) => {
  const { toast } = useToast();
  const [availableLanguages, setAvailableLanguages] = useState<Record<string, Language[]>>({});
  const [loadingLanguages, setLoadingLanguages] = useState<Record<string, boolean>>({});
  const [emailParams, setEmailParams] = useState<EmailParametersResponse | null>(null);

  // Load available languages for each mailing item
  useEffect(() => {
    const loadLanguagesForItems = async () => {
      const languagePromises = combinations.map(async (combo) => {
        if (!availableLanguages[combo.mailingItem.id]) {
          setLoadingLanguages(prev => ({ ...prev, [combo.mailingItem.id]: true }));
          try {
            const languages = await optimoveApi.getLanguages(combo.mailingItem.id);
            setAvailableLanguages(prev => ({ 
              ...prev, 
              [combo.mailingItem.id]: languages 
            }));
          } catch (error) {
            console.error(`Failed to load languages for ${combo.mailingItem.id}:`, error);
          } finally {
            setLoadingLanguages(prev => ({ ...prev, [combo.mailingItem.id]: false }));
          }
        }
      });

      await Promise.all(languagePromises);
    };

    if (combinations.length > 0) {
      loadLanguagesForItems();
    }
  }, [combinations, availableLanguages]);

  useEffect(() => {
    const fetchEmailIds = async () => {
      if (mapping?.optimoveBrandId) {
        try {
          const result = await optimoveApi.getEmailParameters(mapping.optimoveBrandId);
          setEmailParams(result);
        } catch (err) {
          console.error("Failed to load email parameters from Optimove", err);
        }
      }
    };

    fetchEmailIds();
  }, [mapping?.optimoveBrandId]);


  const handleLanguageToggle = (combinationId: string, language: Language, checked: boolean) => {
    const combination = combinations.find(c => c.id === combinationId);
    if (!combination) return;

    const currentLanguages = combination.selectedLanguages;
    const newLanguages = checked
      ? [...currentLanguages, language]
      : currentLanguages.filter(l => l.code !== language.code);

    onUpdateLanguages(combinationId, newLanguages);
  };

  const handlePreview = (itemId: string, languageCode: string) => {
    const url = onConstructPreviewUrl(itemId, languageCode);
    window.open(url, '_blank');
  };

  const resolveEmailId = (emailList: EmailAddress[], email: string): number => {
    const found = emailList.find(e => e.Email.toLowerCase() === email.toLowerCase());
    return found?.Id ?? 0;
  };


  const handleExport = async (request: ExportRequest) => {
    try {
      await onExportSingle(request);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (combinations.length === 0) {
    return (
      <Card className="border-dashed border-2 border-border">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Items in Combinations
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Select mailing items from the dropdowns above and click "Add to Combinations" to start building your export list.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Combinations Grid
        </h3>
        <Badge variant="secondary" className="text-sm">
          {combinations.length} item{combinations.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {combinations.map((combination, index) => {
        const itemLanguages = availableLanguages[combination.mailingItem.id] || [];
        const isLoadingLangs = loadingLanguages[combination.mailingItem.id];
        
        return (
          <Card key={combination.id} className="border border-card-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleExpanded(combination.id)}
                    className="h-8 w-8 p-0"
                  >
                    {combination.isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium bg-muted text-muted-foreground px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <CardTitle className="text-base">
                        {combination.mailingItem.name}
                      </CardTitle>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="font-mono">ID: {combination.mailingItem.id}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(combination.mailingItem.lastModified)}</span>
                      </div>
                      {combination.mailingItem.templateId && (
                        <Badge variant="outline" className="text-xs">
                          {combination.mailingItem.templateId}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {combination.selectedLanguages.length} language{combination.selectedLanguages.length !== 1 ? 's' : ''}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveCombination(combination.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {combination.isExpanded && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Language Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Available Languages
                    </Label>
                    
                    {isLoadingLangs ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                        Loading languages...
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {itemLanguages.map((language) => {
                          const isSelected = combination.selectedLanguages.some(
                            l => l.code === language.code
                          );
                          
                          return (
                            <div
                              key={language.code}
                              className="flex items-center space-x-3 p-2 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                            >
                              <Checkbox
                                id={`${combination.id}_${language.code}`}
                                checked={isSelected}
                                onCheckedChange={(checked) => 
                                  handleLanguageToggle(combination.id, language, checked as boolean)
                                }
                                disabled={isLoading}
                              />
                              <Label 
                                htmlFor={`${combination.id}_${language.code}`}
                                className="flex-1 cursor-pointer text-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{language.displayName}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground font-mono">
                                      {language.code}
                                    </span>
                                    {language.isDefault && (
                                      <Badge variant="outline" className="text-xs">
                                        Default
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Language Actions */}
                  {combination.selectedLanguages.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Actions per Language</Label>
                      <div className="space-y-2">
                        {combination.selectedLanguages.map((language) => (
                          <div
                            key={language.code}
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
                                onClick={() => handlePreview(combination.mailingItem.id, language.code)}
                                className="h-8 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                              
                              <Button
                                variant="default"
                                size="sm"
                                onClick={async () =>{
                                    if (!mapping || !selectedBrand || !selectedProduct) {
                                      toast({
                                        variant: 'destructive',
                                        title: 'Missing configuration',
                                        description: 'Brand, product or mapping config not available.'
                                      });
                                      return;
                                    }

                                    const html = await optimoveApi.getMailingHtml(combination.mailingItem.id, language.code);
                                    
                                    console.log("🧩 Combination Object:", combination);
                                    console.log("🗂️ Mapping Object:", mapping);
                                    console.log("📨 Email Parameters:", emailParams);
                                    await handleExport({
                                      mailingItemId: combination.mailingItem.id,
                                      templateName: combination.mailingItem.name + " | " + language.code, // 👈 populate all required fields
                                      subject: combination.mailingItem.name,//combination.mailingItem.subject ---> Remove this after implementing value replacers.
                                      html: html,
                                      plainText: "...",
                                      fromName: "CMS WIP",
                                      replyToAddressID: resolveEmailId(emailParams?.ReplyToAddresses || [], combination.mailingItem.replyToAddress),
                                      fromEmailAddressID: resolveEmailId(emailParams?.FromEmailAddresses || [], combination.mailingItem.fromAddress),
                                      folderID: mapping.folderId,//</div></div>mapping.folderId,
                                      brandId: mapping.optimoveBrandId,//</div>mapping.optimoveBrandId,
                                      language: language.code,
                                      mailingSite: mapping.mailingSite,
                                      brandName: mapping.brandCode,
                                      productName: mapping.productCode,
                                      mailType: combination.mailingItem.name
                                    })

                                  }
                                }
                                disabled={isLoading}
                                className="h-8 text-xs"
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Export
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};