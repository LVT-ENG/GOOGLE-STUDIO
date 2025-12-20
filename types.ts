
export type AppState = 
  | 'landing' 
  | 'questionnaire' 
  | 'biometrics' 
  | 'shop_pau' 
  | 'fgt_mockups' 
  | 'checkout_avbet' 
  | 'smart_closet'
  | 'retail_kiosk';

export type ProductCategory = 'pants' | 'jacket' | 'shoes' | 'accessory';

export interface GarmentMeasurements {
  // Pants
  waist?: number;
  hips?: number;
  length?: number;
  // Jackets/Tops
  chest?: number;
  shoulders?: number;
  sleeve?: number;
  // Shoes
  footLength?: number; // cm
}

export interface DetailedProduct {
  sku: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string;
  availableSizes: string[];
  // Base measurements for Size M (or 38/40) to calculate fit
  baseMeasurements: GarmentMeasurements; 
}

export interface WardrobeItem {
  id: string;
  productName: string;
  image: string;
  purchaseDate: string;
  status: 'active' | 'donated' | 'recycled';
  condition: 'new' | 'good' | 'worn';
  avbetValue: number; // Credits earned if donated
  ecoImpact: {
    co2Saved: number; // kg
    waterSaved: number; // liters
  };
}

export interface UserProfile {
  name: string;
  email: string;
  city: string;
  weight: number;
  height: number;
  avbetBalance: number;
  preferences: {
    styles: string[];
    colors: string[];
    fabricWeight: number; // g/m2
  };
  biometrics: {
    avatarPhotos: string[];
    voicePrint: boolean;
    irisScan: boolean;
    // Calculated precise measurements from CV
    measurements?: GarmentMeasurements; 
  };
}

export interface Product {
  sku: string;
  name: string;
  description: string;
  image: string;
  price: number;
  tags: string[];
  category: string;
}

export interface Mockup {
  id: string;
  baseSku: string;
  designId: string;
  previewUrl: string;
  price: number;
  productionData: {
    whiteBaseSku: string;
    printFile: string;
  };
}

export interface Garment {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
}

export interface RecipeData {
  title: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  calories: number;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    name: string;
    value: number;
    unit: string;
    fill: string;
  }[];
}
