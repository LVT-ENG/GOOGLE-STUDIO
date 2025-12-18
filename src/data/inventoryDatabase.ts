
import { DetailedProduct } from '../types';

// Using local assets based on provided demo images
// Assumes images are placed in public/assets/demo/

export const INVENTORY_DATABASE: DetailedProduct[] = [
  // --- FEATURED DEMO ITEMS ---
  {
    sku: 'RED-DRESS-001', name: 'Vestido Chic Rojo', category: 'jacket', // Using jacket category for top/dress logic or add new
    price: 299,
    description: 'Diseño estructural rojo vibrante. Tejido premium.',
    image: '/assets/demo/image_6.jpg', // Woman in red dress
    availableSizes: ['XS', 'S', 'M', 'L'],
    baseMeasurements: { chest: 90, waist: 70, hips: 98 }
  },
  {
    sku: 'LEA-JKT-M-001', name: 'Biker Piel Hombre', category: 'jacket',
    price: 350,
    description: 'Cuero genuino, corte clásico moderno.',
    image: '/assets/demo/image_12.jpg', // Male leather jacket layout
    availableSizes: ['M', 'L', 'XL'],
    baseMeasurements: { chest: 108, shoulders: 48, sleeve: 64 }
  },
  {
    sku: 'LEA-JKT-F-001', name: 'Biker Piel Mujer', category: 'jacket',
    price: 320,
    description: 'Corte entallado, hardware plateado.',
    image: '/assets/demo/image_13.jpg', // Female leather jacket layout
    availableSizes: ['XS', 'S', 'M'],
    baseMeasurements: { chest: 92, shoulders: 40, sleeve: 59 }
  },
  {
    sku: 'GRN-SET-001', name: 'Conjunto Vinilo Verde', category: 'pants',
    price: 180,
    description: 'Acabado brillante, futurista.',
    image: '/assets/demo/image_11.jpg', // Woman in green outfit
    availableSizes: ['S', 'M'],
    baseMeasurements: { waist: 68, hips: 94 }
  },
  
  // --- STANDARD CATALOG ---
  {
    sku: 'PNT-001', name: 'Techwear Cargo Black', category: 'pants', price: 120,
    description: 'Water-resistant, multi-pocket utility trousers.',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80',
    availableSizes: ['S', 'M', 'L', 'XL'],
    baseMeasurements: { waist: 82, hips: 100, length: 105 }
  },
  {
    sku: 'SHU-001', name: 'White Sneakers', category: 'shoes', price: 89,
    description: 'Classic minimal leather sneakers.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
    availableSizes: ['37', '38', '39', '40', '41'],
    baseMeasurements: { footLength: 24.5 }
  },
   {
    sku: 'ACC-005', name: 'Sunglasses', category: 'accessory', price: 150,
    description: 'Aviator style.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    availableSizes: ['OneSize'],
    baseMeasurements: {}
  }
];
