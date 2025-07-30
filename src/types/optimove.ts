export interface Brand {
  code: string;
  name: string;
  description?: string;
}

export interface Product {
  code: string;
  name: string;
  brandCode: string;
  description?: string;
}

export interface Mapping {
  brandCode: string;
  productCode: string;
  mailingSite: string;
  replyTo: string;
  fromAddress: string;
  optimoveBrandId: string;
  folderId: string;
  emailIds: string[];
}

export interface MailingItem {
  id: string;
  name: string;
  mailingSite: string;
  templateId?: string;
  path: string;
  lastModified: string;
  isActive: boolean;
}

export interface Language {
  code: string;
  name: string;
  displayName: string;
  isDefault: boolean;
}

export interface CombinationGridRow {
  id: string;
  mailingItem: MailingItem;
  selectedLanguages: Language[];
  isExpanded: boolean;
}

export interface ExportRequest {
  itemId: string;
  language: string;
  brandCode: string;
  productCode: string;
  mapping: Mapping;
}

export interface ExportResponse {
  success: boolean;
  templateId?: string;
  message: string;
  isUpdate: boolean;
}

export interface OptimoveState {
  selectedBrand: Brand | null;
  selectedProduct: Product | null;
  selectedMailingItems: MailingItem[];
  mapping: Mapping | null;
  combinations: CombinationGridRow[];
  isLoading: boolean;
  error: string | null;
}