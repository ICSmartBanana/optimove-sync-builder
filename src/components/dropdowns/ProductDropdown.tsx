import { useState, useEffect } from 'react';
import { Product, Brand } from '@/types/optimove';
import { optimoveApi } from '@/services/optimoveApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface ProductDropdownProps {
  selectedBrand: Brand | null;
  selectedProduct: Product | null;
  onProductSelect: (product: Product | null) => void;
  disabled?: boolean;
}

export const ProductDropdown = ({
  selectedBrand,
  selectedProduct,
  onProductSelect,
  disabled,
}: ProductDropdownProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!selectedBrand) {
      setProducts([]);
      onProductSelect(null);
      return;
    }

    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await optimoveApi.getProducts(selectedBrand.code);
        setProducts(productsData);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [selectedBrand, onProductSelect]);

  const handleValueChange = (value: string) => {
    if (value === 'none') {
      onProductSelect(null);
      return;
    }

    const product = products.find((p) => p.code === value);
    onProductSelect(product || null);
  };

  const isDisabled = disabled || !selectedBrand || isLoading;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="product-select" className="text-sm font-medium text-foreground">
        Product *
      </Label>
      <Select
        value={selectedProduct?.code || 'none'}
        onValueChange={handleValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger
          className={`w-full bg-card border-border transition-colors ${
            isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <SelectValue
              placeholder={selectedBrand ? 'Select a product...' : 'Select brand first...'}
            />
          </div>
        </SelectTrigger>

        <SelectContent className="bg-popover border-border shadow-lg max-h-96 overflow-y-auto">
          {/* 👇 Search Input Added Here */}
          <div className="p-2 sticky top-0 bg-popover z-10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="w-full px-2 py-1 text-sm border rounded"
            />
          </div>

          <SelectItem value="none" className="text-muted-foreground">
            {selectedBrand ? 'Select a product...' : 'Select brand first...'}
          </SelectItem>

          {filteredProducts.map((product) => (
            <SelectItem
              key={product.code}
              value={product.code}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex flex-col">
                <span className="font-medium">{product.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
