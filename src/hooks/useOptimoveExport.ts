import { useState, useCallback } from 'react';
import { optimoveApi } from '@/services/optimoveApi';
import { Brand, Product, MailingItem, Language, CombinationGridRow, OptimoveState } from '@/types/optimove';
import { useToast } from '@/hooks/use-toast';

export const useOptimoveExport = () => {
  const { toast } = useToast();
  
  const [state, setState] = useState<OptimoveState>({
    selectedBrand: null,
    selectedProduct: null,
    selectedMailingItems: [],
    mapping: null,
    combinations: [],
    isLoading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const selectBrand = useCallback(async (brand: Brand | null) => {
    setState(prev => ({
      ...prev,
      selectedBrand: brand,
      selectedProduct: null,
      selectedMailingItems: [],
      mapping: null,
      error: null
    }));
  }, []);

  const selectProduct = useCallback(async (product: Product | null) => {
    if (!state.selectedBrand || !product) {
      setState(prev => ({ ...prev, selectedProduct: null, mapping: null }));
      return;
    }

    setLoading(true);
    try {
      const mapping = await optimoveApi.getMapping(state.selectedBrand.code, product.code);
      setState(prev => ({
        ...prev,
        selectedProduct: product,
        mapping,
        selectedMailingItems: [],
        error: null
      }));
    } catch (error) {
      setError('Failed to load mapping configuration');
      console.error('Error loading mapping:', error);
    } finally {
      setLoading(false);
    }
  }, [state.selectedBrand, setLoading, setError]);

  const selectMailingItems = useCallback((items: MailingItem[]) => {
    setState(prev => ({ ...prev, selectedMailingItems: items }));
  }, []);

  const addToCombinations = useCallback(async () => {
    if (!state.selectedMailingItems.length) {
      toast({
        title: "No Items Selected",
        description: "Please select mailing items to add to combinations.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const newCombinations: CombinationGridRow[] = [];
      
      for (const item of state.selectedMailingItems) {
        // Check if item already exists in combinations
        const existingIndex = state.combinations.findIndex(combo => combo.mailingItem.id === item.id);
        if (existingIndex === -1) {
          const languages = await optimoveApi.getLanguages(item.id);
          newCombinations.push({
            id: `combo_${item.id}_${Date.now()}`,
            mailingItem: item,
            selectedLanguages: languages.filter(lang => lang.isDefault),
            isExpanded: false
          });
        }
      }

      setState(prev => ({
        ...prev,
        combinations: [...prev.combinations, ...newCombinations],
        selectedMailingItems: []
      }));

      if (newCombinations.length > 0) {
        toast({
          title: "Items Added",
          description: `${newCombinations.length} mailing item(s) added to combinations.`,
        });
      } else {
        toast({
          title: "Items Already Added",
          description: "All selected items are already in the combinations grid.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setError('Failed to add items to combinations');
      console.error('Error adding to combinations:', error);
    } finally {
      setLoading(false);
    }
  }, [state.selectedMailingItems, state.combinations, setLoading, setError, toast]);

  const updateCombinationLanguages = useCallback((combinationId: string, languages: Language[]) => {
    setState(prev => ({
      ...prev,
      combinations: prev.combinations.map(combo =>
        combo.id === combinationId
          ? { ...combo, selectedLanguages: languages }
          : combo
      )
    }));
  }, []);

  const toggleCombinationExpanded = useCallback((combinationId: string) => {
    setState(prev => ({
      ...prev,
      combinations: prev.combinations.map(combo =>
        combo.id === combinationId
          ? { ...combo, isExpanded: !combo.isExpanded }
          : combo
      )
    }));
  }, []);

  const removeCombination = useCallback((combinationId: string) => {
    setState(prev => ({
      ...prev,
      combinations: prev.combinations.filter(combo => combo.id !== combinationId)
    }));
    
    toast({
      title: "Item Removed",
      description: "Mailing item removed from combinations.",
    });
  }, [toast]);

  const exportSingle = useCallback(async (itemId: string, languageCode: string) => {
    setLoading(true);
    try {
      const result = await optimoveApi.exportToOptimove(itemId, languageCode);
      
      toast({
        title: result.isUpdate ? "Template Updated" : "Template Created",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      return result;
    } catch (error) {
      const errorMessage = 'Failed to export to Optimove';
      setError(errorMessage);
      toast({
        title: "Export Failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, toast]);

  const exportAll = useCallback(async () => {
    if (!state.combinations.length) {
      toast({
        title: "No Items to Export",
        description: "Please add items to the combinations grid first.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const combination of state.combinations) {
        for (const language of combination.selectedLanguages) {
          try {
            await optimoveApi.exportToOptimove(combination.mailingItem.id, language.code);
            successCount++;
          } catch (error) {
            errorCount++;
            console.error(`Export failed for ${combination.mailingItem.name} (${language.code}):`, error);
          }
        }
      }

      toast({
        title: "Export Complete",
        description: `Successfully exported ${successCount} item(s). ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
        variant: errorCount > 0 ? "destructive" : "default"
      });
    } catch (error) {
      setError('Failed to export items');
      console.error('Export all failed:', error);
    } finally {
      setLoading(false);
    }
  }, [state.combinations, setLoading, setError, toast]);

  const reset = useCallback(() => {
    setState({
      selectedBrand: null,
      selectedProduct: null,
      selectedMailingItems: [],
      mapping: null,
      combinations: [],
      isLoading: false,
      error: null
    });
    
    toast({
      title: "Form Reset",
      description: "All selections have been cleared.",
    });
  }, [toast]);

  const clearGrid = useCallback(() => {
    setState(prev => ({ ...prev, combinations: [] }));
    
    toast({
      title: "Grid Cleared",
      description: "All items removed from combinations grid.",
    });
  }, [toast]);

  const constructPreviewUrl = useCallback((itemId: string, languageCode: string) => {
    return optimoveApi.constructPreviewUrl(itemId, languageCode);
  }, []);

  return {
    ...state,
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
  };
};