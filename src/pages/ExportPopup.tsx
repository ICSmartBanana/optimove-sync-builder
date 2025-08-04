import { useOptimoveExport } from '@/hooks/useOptimoveExport';
import { BrandDropdown } from '@/components/dropdowns/BrandDropdown';
import { ProductDropdown } from '@/components/dropdowns/ProductDropdown';
import { MailingItemDropdown } from '@/components/dropdowns/MailingItemDropdown';
import { CombinationGrid } from '@/components/grid/CombinationGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RotateCcw, 
  Plus, 
  Trash2, 
  Upload, 
  Settings, 
  Info,
  AlertCircle
} from 'lucide-react';

export const ExportPopup = () => {
  const {
    selectedBrand,
    selectedProduct,
    selectedMailingItems,
    mapping,
    combinations,
    isLoading,
    error,
    selectBrand,
    selectProduct,
    selectMailingItems,
    addToCombinations,
    updateCombinationLanguages,
    toggleCombinationExpanded,
    removeCombination,
    exportSingle,
    exportAll,
    reset,
    clearGrid,
    constructPreviewUrl
  } = useOptimoveExport();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Optimove Export Manager
          </h1>
          <p className="text-muted-foreground">
            Export mailing items from Sitecore to Optimove platform
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Configuration Section */}
        <Card className="border-card-border shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Configuration
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                disabled={isLoading}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset All
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {/* Dropdowns Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BrandDropdown
                selectedBrand={selectedBrand}
                onBrandSelect={selectBrand}
                disabled={isLoading}
              />
              
              <ProductDropdown
                selectedBrand={selectedBrand}
                selectedProduct={selectedProduct}
                onProductSelect={selectProduct}
                disabled={isLoading}
              />
              
              <div className="md:col-span-1">
                <MailingItemDropdown
                  mapping={mapping}
                  selectedItems={selectedMailingItems}
                  onItemsSelect={selectMailingItems}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Mapping Info */}
            {mapping && (
              <div className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Mapping Configuration</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mailing Site:</span>
                    <p className="font-mono">{mapping.mailingSite}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">From Address:</span>
                    <p className="font-mono text-xs">{mapping.fromAddress}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Optimove Brand ID:</span>
                    <p className="font-mono">{mapping.optimoveBrandId}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Folder ID:</span>
                    <p className="font-mono">{mapping.folderId}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={addToCombinations}
                disabled={selectedMailingItems.length === 0 || isLoading}
                className="bg-primary hover:bg-primary-hover"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Combinations
                {selectedMailingItems.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedMailingItems.length}
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={clearGrid}
                disabled={combinations.length === 0 || isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Grid
              </Button>

              <Button
                variant="default"
                onClick={exportAll}
                disabled={combinations.length === 0 || isLoading}
                className="bg-success hover:bg-success/90"
              >
                <Upload className="h-4 w-4 mr-2" />
                Export All
                {combinations.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {combinations.reduce((total, combo) => total + combo.selectedLanguages.length, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Combinations Grid Section */}
        <div className="space-y-4">
          <CombinationGrid
            combinations={combinations}
            onUpdateLanguages={updateCombinationLanguages}
            onToggleExpanded={toggleCombinationExpanded}
            onRemoveCombination={removeCombination}
            onExportSingle={exportSingle}
            onConstructPreviewUrl={constructPreviewUrl}
            isLoading={isLoading}
            selectedBrand={selectedBrand}
            selectedProduct={selectedProduct}
            mapping={mapping}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-6 border-t border-border">
          <p>
            Optimove Export Manager • Sitecore Integration • 
            <span className="ml-2 font-mono">v1.0.0</span>
          </p>
        </div>
      </div>
    </div>
  );
};