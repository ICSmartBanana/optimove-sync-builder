import { Brand, Product, Mapping, MailingItem, Language, ExportResponse } from '@/types/optimove';

// Mock Brands
export const mockBrands: Brand[] = [
  { code: 'BMW', name: 'BMW', description: 'Luxury automotive brand' },
  { code: 'MINI', name: 'MINI', description: 'Premium compact car brand' },
  { code: 'RR', name: 'Rolls-Royce', description: 'Ultra-luxury automotive brand' },
  { code: 'BMW_MC', name: 'BMW Motorrad', description: 'BMW motorcycle division' }
];

// Mock Products by Brand
export const mockProducts: Record<string, Product[]> = {
  BMW: [
    { code: 'BMW_SALES', name: 'BMW Sales' },
    { code: 'BMW_SERVICE', name: 'BMW Service'},
    { code: 'BMW_PARTS', name: 'BMW Parts'}
  ],
  MINI: [
    { code: 'MINI_SALES', name: 'MINI Sales'},
    { code: 'MINI_SERVICE', name: 'MINI Service'}
  ],
  RR: [
    { code: 'RR_SALES', name: 'Rolls-Royce Sales'},
    { code: 'RR_SERVICE', name: 'Rolls-Royce Service'}
  ],
  BMW_MC: [
    { code: 'MC_SALES', name: 'Motorrad Sales'},
    { code: 'MC_SERVICE', name: 'Motorrad Service'}
  ]
};

// Mock Mappings
export const mockMappings: Record<string, Mapping> = {
  'BMW_BMW_SALES': {
    brandCode: 'BMW',
    productCode: 'BMW_SALES',
    mailingSite: 'bmw-sales-site',
    replyTo: 'noreply@bmw-sales.com',
    fromAddress: 'BMW Sales <sales@bmw.com>',
    optimoveBrandId: 'bmw_brand_001',
    folderId: 'folder_bmw_sales',
    emailIds: ['email_001', 'email_002', 'email_003']
  },
  'BMW_BMW_SERVICE': {
    brandCode: 'BMW',
    productCode: 'BMW_SERVICE',
    mailingSite: 'bmw-service-site',
    replyTo: 'noreply@bmw-service.com',
    fromAddress: 'BMW Service <service@bmw.com>',
    optimoveBrandId: 'bmw_brand_001',
    folderId: 'folder_bmw_service',
    emailIds: ['email_004', 'email_005']
  },
  'MINI_MINI_SALES': {
    brandCode: 'MINI',
    productCode: 'MINI_SALES',
    mailingSite: 'mini-sales-site',
    replyTo: 'noreply@mini-sales.com',
    fromAddress: 'MINI Sales <sales@mini.com>',
    optimoveBrandId: 'mini_brand_001',
    folderId: 'folder_mini_sales',
    emailIds: ['email_006', 'email_007']
  }
};

// Mock Mailing Items by Mailing Site
export const mockMailingItems: Record<string, MailingItem[]> = {
  'bmw-sales-site': [
    {
      id: 'mailing_001',
      name: 'BMW X5 Launch Campaign',
      mailingSite: 'bmw-sales-site',
      templateId: 'template_001',
      path: '/sitecore/content/BMW/Campaigns/X5Launch',
      lastModified: '2024-01-15T10:30:00Z',
      isActive: true
    },
    {
      id: 'mailing_002',
      name: 'BMW 3 Series Newsletter',
      mailingSite: 'bmw-sales-site',
      path: '/sitecore/content/BMW/Newsletters/3Series',
      lastModified: '2024-01-10T14:20:00Z',
      isActive: true
    },
    {
      id: 'mailing_003',
      name: 'BMW Test Drive Invitation',
      mailingSite: 'bmw-sales-site',
      path: '/sitecore/content/BMW/Invitations/TestDrive',
      lastModified: '2024-01-08T09:15:00Z',
      isActive: true
    }
  ],
  'bmw-service-site': [
    {
      id: 'mailing_004',
      name: 'Service Reminder Campaign',
      mailingSite: 'bmw-service-site',
      templateId: 'template_002',
      path: '/sitecore/content/BMW/Service/Reminders',
      lastModified: '2024-01-12T11:45:00Z',
      isActive: true
    },
    {
      id: 'mailing_005',
      name: 'BMW Care+ Program',
      mailingSite: 'bmw-service-site',
      path: '/sitecore/content/BMW/Service/CarePlus',
      lastModified: '2024-01-05T16:30:00Z',
      isActive: true
    }
  ],
  'mini-sales-site': [
    {
      id: 'mailing_006',
      name: 'MINI Cooper SE Electric',
      mailingSite: 'mini-sales-site',
      path: '/sitecore/content/MINI/Electric/CooperSE',
      lastModified: '2024-01-14T13:20:00Z',
      isActive: true
    }
  ]
};

// Mock Languages by Item ID
export const mockLanguages: Record<string, Language[]> = {
  mailing_001: [
    { code: 'en-US', name: 'English (US)', displayName: 'English (United States)', isDefault: true },
    { code: 'de-DE', name: 'German (DE)', displayName: 'Deutsch (Deutschland)', isDefault: false },
    { code: 'fr-FR', name: 'French (FR)', displayName: 'Français (France)', isDefault: false }
  ],
  mailing_002: [
    { code: 'en-US', name: 'English (US)', displayName: 'English (United States)', isDefault: true },
    { code: 'de-DE', name: 'German (DE)', displayName: 'Deutsch (Deutschland)', isDefault: false }
  ],
  mailing_003: [
    { code: 'en-US', name: 'English (US)', displayName: 'English (United States)', isDefault: true },
    { code: 'es-ES', name: 'Spanish (ES)', displayName: 'Español (España)', isDefault: false },
    { code: 'it-IT', name: 'Italian (IT)', displayName: 'Italiano (Italia)', isDefault: false }
  ],
  mailing_004: [
    { code: 'en-US', name: 'English (US)', displayName: 'English (United States)', isDefault: true },
    { code: 'de-DE', name: 'German (DE)', displayName: 'Deutsch (Deutschland)', isDefault: false }
  ],
  mailing_005: [
    { code: 'en-US', name: 'English (US)', displayName: 'English (United States)', isDefault: true }
  ],
  mailing_006: [
    { code: 'en-GB', name: 'English (GB)', displayName: 'English (United Kingdom)', isDefault: true },
    { code: 'de-DE', name: 'German (DE)', displayName: 'Deutsch (Deutschland)', isDefault: false }
  ]
};

// Mock existing template IDs (for checking if template exists)
export const mockExistingTemplateIds: Record<string, string[]> = {
  mailing_001: ['en-US', 'de-DE'],
  mailing_004: ['en-US']
};

// API Functions
export const getMockBrands = (): Promise<Brand[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBrands), 300);
  });
};

export const getMockProducts = (brandCode: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProducts[brandCode] || []), 250);
  });
};

export const getMockMapping = (brandCode: string, productCode: string): Promise<Mapping | null> => {
  return new Promise((resolve) => {
    const key = `${brandCode}_${productCode}`;
    setTimeout(() => resolve(mockMappings[key] || null), 200);
  });
};

export const getMockMailingItems = (mailingSite: string): Promise<MailingItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMailingItems[mailingSite] || []), 350);
  });
};

export const getMockLanguages = (itemId: string): Promise<Language[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockLanguages[itemId] || []), 150);
  });
};

export const mockTemplateIdExists = (itemId: string, languageCode: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const existingLangs = mockExistingTemplateIds[itemId] || [];
    setTimeout(() => resolve(existingLangs.includes(languageCode)), 100);
  });
};

export const exportToOptimove = (itemId: string, languageCode: string): Promise<ExportResponse> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const templateExists = await mockTemplateIdExists(itemId, languageCode);
      
      if (templateExists) {
        resolve({
          success: true,
          templateId: `template_${itemId}_${languageCode}_updated`,
          message: `Template updated successfully for ${itemId} (${languageCode})`,
          //isUpdate: true
        });
      } else {
        resolve({
          success: true,
          templateId: `template_${itemId}_${languageCode}_new`,
          message: `New template created successfully for ${itemId} (${languageCode})`,
          //isUpdate: false
        });
      }
    }, 800);
  });
};