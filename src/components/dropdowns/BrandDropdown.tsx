import { useState, useEffect } from 'react';
import { Brand } from '@/types/optimove';
import { optimoveApi } from '@/services/optimoveApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface BrandDropdownProps {
  selectedBrand: Brand | null;
  onBrandSelect: (brand: Brand | null) => void;
  disabled?: boolean;
}

export const BrandDropdown = ({ selectedBrand, onBrandSelect, disabled }: BrandDropdownProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const brandStrings = await optimoveApi.getBrands(); // string[]
      
      // Convert to Brand[]
      const brandsData: Brand[] = brandStrings.map((b) => ({
        code: b,
        name: b,
        description: '', // or leave as undefined
      }));

      setBrands(brandsData); // ✅ Now matches your expected Brand[]
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  loadBrands();
}, []);


  const handleValueChange = (value: string) => {
    if (value === 'none') {
      onBrandSelect(null);
      return;
    }
    
    const brand = brands.find(b => b.code === value);
    onBrandSelect(brand || null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="brand-select" className="text-sm font-medium text-foreground">
        Brand *
      </Label>
      <Select
        value={selectedBrand?.code || 'none'}
        onValueChange={handleValueChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="w-full bg-card border-border hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <SelectValue placeholder="Select a brand..." />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-popover border-border shadow-lg">
          <SelectItem value="none" className="text-muted-foreground">
            Select a brand...
          </SelectItem>
          {brands.map((brand) => (
            <SelectItem 
              key={brand.code} 
              value={brand.code}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex flex-col">
                <span className="font-medium">{brand.name}</span>
                {brand.description && (
                  <span className="text-xs text-muted-foreground">{brand.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};