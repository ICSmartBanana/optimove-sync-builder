export interface Brand {
  code: string;
  name: string;
  description?: string;
}

export interface Product {
  code: string;
  name: string;
  description?: string;
}

export interface Mapping {
  brandCode: string;
  productCode: string;
  mailingSite: string;
  replyTo: string;
  fromAddress: string;
  optimoveBrandId: number;
  folderId: number;
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
  subject: string;
  version: number;
  replyToAddress: string;
  fromAddress: string;
  mailType: string;
  html: string;
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
  mailingItemId: string;
  templateName: string;
  subject: string;
  html: string;
  plainText: string;
  fromName: string;
  replyToAddressID: number;
  fromEmailAddressID: number;
  folderID: number;
  brandId: number;
  language: string;
  mailingSite: string;
  brandName: string;
  productName: string;
  mailType: string;
}

export interface ExportResponse {
  success: boolean;
  templateId?: string;
  message: string;
  //isUpdate: boolean;
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

export interface EmailAddress {
  Id: number;
  Email: string;
}

export interface EmailParametersResponse {
  FromEmailAddresses: EmailAddress[];
  ReplyToAddresses: EmailAddress[];
}
