import { useState, useEffect, useMemo } from 'react';
import { Brand } from '@/types/optimove';
import { optimoveApi } from '@/services/optimoveApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface BrandDropdownProps {
  selectedBrand: Brand | null;
  onBrandSelect: (brand: Brand | null) => void;
  disabled?: boolean;
}

export const BrandDropdown = ({
  selectedBrand,
  onBrandSelect,
  disabled,
}: BrandDropdownProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBrands = async () => {
      setIsLoading(true);
      try {
        const brandStrings = await optimoveApi.getBrands(); // string[]
        const brandsData: Brand[] = brandStrings.map((b) => ({
          code: b,
          name: b,
          description: '',
        }));
        setBrands(brandsData);
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

    const brand = brands.find((b) => b.code === value);
    onBrandSelect(brand || null);
  };

  // Filter brands based on search term
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

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
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <SelectValue placeholder="Select a brand..." />
          </div>
        </SelectTrigger>

        <SelectContent className="bg-popover border-border shadow-lg">
          {/* Search Input inside dropdown */}
          <div className="px-2 py-1">
            <Input
              placeholder="Search brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Default option */}
          <SelectItem value="none" className="text-muted-foreground">
            Select a brand...
          </SelectItem>

          {/* Filtered brand options */}
          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <SelectItem
                key={brand.code}
                value={brand.code}
                className="hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{brand.name}</span>
                  {brand.description && (
                    <span className="text-xs text-muted-foreground">
                      {brand.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="text-sm text-muted-foreground px-3 py-2">
              No matching brands
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
