import { useState, useEffect } from 'react';
import { MailingItem, Mapping } from '@/types/optimove';
import { optimoveApi } from '@/services/optimoveApi';
import { Label } from '@/components/ui/label';
import { Loader2, Package, Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface MailingItemDropdownProps {
  mapping: Mapping | null;
  selectedItems: MailingItem[];
  onItemsSelect: (items: MailingItem[]) => void;
  disabled?: boolean;
}

export const MailingItemDropdown = ({ 
  mapping, 
  selectedItems, 
  onItemsSelect, 
  disabled 
}: MailingItemDropdownProps) => {
  const [mailingItems, setMailingItems] = useState<MailingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!mapping) {
      setMailingItems([]);
      onItemsSelect([]);
      return;
    }

    const loadMailingItems = async () => {
      setIsLoading(true);
      try {
        const itemsData = await optimoveApi.getMailingItems(mapping.mailingSite);
        setMailingItems(itemsData);
      } catch (error) {
        console.error('Failed to load mailing items:', error);
        setMailingItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMailingItems();
  }, [mapping, onItemsSelect]);

  const handleItemToggle = (item: MailingItem, checked: boolean) => {
    if (checked) {
      onItemsSelect([...selectedItems, item]);
    } else {
      onItemsSelect(selectedItems.filter(selected => selected.id !== item.id));
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      onItemsSelect([]);
    } else {
      onItemsSelect(filteredItems);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isDisabled = disabled || !mapping || isLoading;

  const filteredItems = mailingItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.templateId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const allSelected = filteredItems.length > 0 && selectedItems.length === filteredItems.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground">
          Mailing Items
        </Label>
        {selectedItems.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {selectedItems.length} selected
          </Badge>
        )}
      </div>

      {/* 🔍 Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name, ID, or template..."
        className="w-full p-2 border border-input rounded-md text-sm"
        disabled={isDisabled}
      />

      {isLoading && (
        <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading mailing items...</span>
        </div>
      )}

      {!mapping && !isLoading && (
        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Select brand and product first to view mailing items
          </p>
        </div>
      )}

      {mapping && mailingItems.length === 0 && !isLoading && (
        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No mailing items found for this configuration
          </p>
        </div>
      )}

      {filteredItems.length > 0 && (
        <div className="space-y-2">
          {/* Select All Option */}
          <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg border border-secondary">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              disabled={isDisabled}
            />
            <Label 
              htmlFor="select-all" 
              className="text-sm font-medium cursor-pointer flex-1"
            >
              {allSelected ? 'Deselect All' : 'Select All'} ({filteredItems.length} items)
            </Label>
          </div>

          {/* Individual Items */}
          <div className="max-h-64 overflow-y-auto space-y-2 border border-border rounded-lg bg-card">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.some(selected => selected.id === item.id);

              return (
                <div
                  key={item.id}
                  className={`flex items-start space-x-3 p-3 hover:bg-accent/50 transition-colors cursor-pointer border-b border-border last:border-b-0 ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleItemToggle(item, !isSelected)}
                >
                  <Checkbox
                    id={item.id}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleItemToggle(item, checked as boolean)}
                    disabled={isDisabled}
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <Label 
                      htmlFor={item.id} 
                      className="text-sm font-medium cursor-pointer block"
                    >
                      {item.name}
                    </Label>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        ID: {item.id}
                      </span>
                      {item.templateId && (
                        <Badge variant="outline" className="text-xs">
                          Template: {item.templateId}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Modified: {formatDate(item.lastModified)}
                      </span>
                      {item.isActive && (
                        <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
