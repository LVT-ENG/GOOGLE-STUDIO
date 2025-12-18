
import { DetailedProduct } from '../types';

export const INVENTORY_DATABASE: DetailedProduct[] = [
  {
    sku: 'ULT-RED-DRS-01', 
    name: 'Vestido Estructural Rojo', 
    category: 'jacket', 
    price: 350,
    description: 'Diseño icónico rojo con patronaje dinámico ajustable. Tejido técnico de alta densidad con memoria de forma.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=90', 
    availableSizes: ['XS', 'S', 'M', 'L'],
    baseMeasurements: { chest: 88, waist: 66, hips: 94 }
  },
  {
    sku: 'FGT-PEACOCK-01', 
    name: 'Traje Pavo Real Generativo', 
    category: 'jacket', 
    price: 1850,
    description: 'Edición limitada FGT V1. Patrones generativos algorítmicos impresos sobre seda técnica multicapa.',
    image: 'https://images.unsplash.com/photo-1539109132305-d75d830638c4?auto=format&fit=crop&w=1200&q=90',
    availableSizes: ['S', 'M', 'L'],
    baseMeasurements: { chest: 104, shoulders: 46, sleeve: 63 }
  },
  {
    sku: 'ULT-LEA-SET-01', 
    name: 'Biker Piel Tech Plus', 
    category: 'jacket',
    price: 590,
    description: 'Conjunto de piel premium con mapeo corporal exacto. Herrajes de titanio y forro transpirable inteligente.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=90',
    availableSizes: ['S', 'M', 'L', 'XL'],
    baseMeasurements: { chest: 112, shoulders: 48, sleeve: 65 }
  },
  {
    sku: 'ULT-URB-GEOM-01', 
    name: 'Set Urbano Geométrico', 
    category: 'pants',
    price: 245,
    description: 'Patronaje asimétrico derivado de análisis topográfico corporal. Algodón orgánico de 350g/m².',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90',
    availableSizes: ['XS', 'S', 'M', 'L'],
    baseMeasurements: { waist: 74, hips: 98 }
  }
];
