import {
  getMockBrands,
  getMockProducts,
  getMockMapping,
  getMockMailingItems,
  getMockLanguages,
  mockTemplateIdExists,
  exportToOptimove as mockExportToOptimove
} from '@/mock/optimoveMockApi';

import { Brand, Product, Mapping, MailingItem, Language, ExportResponse } from '@/types/optimove';

// API Service Layer - Easy to swap for real APIs
export class OptimoveApiService {
  // In production, replace these with real API calls
  async getBrands(): Promise<Brand[]> {
    return getMockBrands();
  }

  async getProducts(brandCode: string): Promise<Product[]> {
    return getMockProducts(brandCode);
  }

  async getMapping(brandCode: string, productCode: string): Promise<Mapping | null> {
    return getMockMapping(brandCode, productCode);
  }

  async getMailingItems(mailingSite: string): Promise<MailingItem[]> {
    return getMockMailingItems(mailingSite);
  }

  async getLanguages(itemId: string): Promise<Language[]> {
    return getMockLanguages(itemId);
  }

  async templateExists(itemId: string, languageCode: string): Promise<boolean> {
    return mockTemplateIdExists(itemId, languageCode);
  }

  async exportToOptimove(itemId: string, languageCode: string): Promise<ExportResponse> {
    return mockExportToOptimove(itemId, languageCode);
  }

  // Utility method to construct preview URL
  constructPreviewUrl(itemId: string, languageCode: string, sitecoreHost: string = 'https://sitecore-host'): string {
    return `${sitecoreHost}/?sc_itemid=${itemId}&sc_lang=${languageCode}&sc_mode=preview&mailExportMode=true`;
  }
}

// Singleton instance
export const optimoveApi = new OptimoveApiService();