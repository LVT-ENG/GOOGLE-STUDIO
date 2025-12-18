
import { GarmentMeasurements, DetailedProduct, ProductCategory } from '../types';

// Standard sizing increments (simplified for demo)
// e.g., Size M is base, Size S is -4cm, Size L is +4cm
const SIZE_INCREMENTS: Record<ProductCategory, number> = {
  pants: 4, // 4cm per size step for waist/hips
  jacket: 4, // 4cm per size step for chest
  shoes: 0.5, // 0.5cm per size step
  accessory: 0
};

const SIZES_ORDER = ['XS', 'S', 'M', 'L', 'XL'];

// This simulates the Computer Vision analysis of the user in the mirror
export const simulateUserScan = (): GarmentMeasurements => {
  // Randomly generate "realistic" average measurements for the demo
  return {
    waist: 75 + Math.floor(Math.random() * 15), // 75-90 cm
    hips: 95 + Math.floor(Math.random() * 15),  // 95-110 cm
    chest: 90 + Math.floor(Math.random() * 20), // 90-110 cm
    shoulders: 40 + Math.floor(Math.random() * 10), // 40-50 cm
    footLength: 24 + Math.random() * 2, // 24-26 cm
    length: 100 // Leg length
  };
};

export const calculatePerfectFit = (
  userMetrics: GarmentMeasurements, 
  product: DetailedProduct
): { size: string, confidence: number, matchDetails: string } => {
  
  if (product.category === 'accessory') {
    return { size: 'OneSize', confidence: 100, matchDetails: 'Universal Fit' };
  }

  const base = product.baseMeasurements;
  const increment = SIZE_INCREMENTS[product.category];
  
  // Determine which metric is primary for sizing
  let userPrimaryMetric = 0;
  let productBaseMetric = 0;

  if (product.category === 'pants') {
    userPrimaryMetric = userMetrics.hips || 100;
    productBaseMetric = base.hips || 100;
  } else if (product.category === 'jacket') {
    userPrimaryMetric = userMetrics.chest || 100;
    productBaseMetric = base.chest || 100;
  } else if (product.category === 'shoes') {
    userPrimaryMetric = userMetrics.footLength || 25;
    productBaseMetric = base.footLength || 25;
  }

  // Calculate difference
  const diff = userPrimaryMetric - productBaseMetric;
  
  // Calculate size offset from 'M' (or base size which we treat as middle index 2 in SIZES_ORDER)
  // For shoes, base is 39/40 usually, but let's stick to the S/M/L logic for clothes or specific indices for shoes.
  
  let recommendedSize = '';
  
  if (product.category === 'shoes') {
    // Shoe logic: Base is usually around size 39 (24.5cm)
    // 0.5cm steps approx 1 EU size.
    const steps = Math.round(diff / increment);
    const baseSizeEU = 39; 
    const calculatedSize = baseSizeEU + steps;
    // Find closest available size
    recommendedSize = product.availableSizes.reduce((prev, curr) => 
      Math.abs(Number(curr) - calculatedSize) < Math.abs(Number(prev) - calculatedSize) ? curr : prev
    );
  } else {
    // Clothing logic (S, M, L)
    // Base is 'M' (index 2 in SIZES_ORDER)
    const steps = Math.round(diff / increment);
    const baseIndex = 2; // Index of 'M'
    let targetIndex = baseIndex + steps;
    
    // Clamp to available sizes
    targetIndex = Math.max(0, Math.min(SIZES_ORDER.length - 1, targetIndex));
    const theoreticalSize = SIZES_ORDER[targetIndex];
    
    // Check if available
    recommendedSize = product.availableSizes.includes(theoreticalSize) 
      ? theoreticalSize 
      : product.availableSizes[product.availableSizes.length - 1]; // Fallback to largest if oversize, or closest logic
  }

  return {
    size: recommendedSize,
    confidence: 95 + Math.random() * 4,
    matchDetails: `Matched using ${product.category === 'pants' ? 'Hips' : product.category === 'jacket' ? 'Chest' : 'Length'} scan.`
  };
};
