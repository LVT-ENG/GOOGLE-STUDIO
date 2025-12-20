
import { DetailedProduct } from '../types';

export const INVENTORY_DATABASE: DetailedProduct[] = [
  {
    sku: 'ULT-RED-VELVET', 
    name: 'Vestido Terciopelo Rojo', 
    category: 'jacket',
    price: 450,
    description: 'Vestido largo de terciopelo premium con hombros descubiertos. Corte sirena elegante.',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',
    availableSizes: ['XS', 'S', 'M', 'L'],
    baseMeasurements: { chest: 88, waist: 66, hips: 94 }
  },
  {
    sku: 'ULT-NAVY-BLAZER', 
    name: 'Blazer Sastre Navy', 
    category: 'jacket', 
    price: 280,
    description: 'Blazer azul marino de lana fría. Forro interior de seda y botones de asta.',
    image: 'https://images.unsplash.com/photo-1591369822096-35f93fdf943b?auto=format&fit=crop&w=800&q=80',
    availableSizes: ['M', 'L', 'XL'],
    baseMeasurements: { chest: 104, shoulders: 46, sleeve: 63 }
  },
  {
    sku: 'ULT-BLACK-DRESS', 
    name: 'Vestido Little Black JIT', 
    category: 'jacket', 
    price: 195,
    description: 'Vestido negro sin mangas, corte evasé. Un básico atemporal fabricado bajo demanda.',
    image: 'https://images.unsplash.com/photo-1502517333630-b15b00c61d4b?auto=format&fit=crop&w=800&q=80',
    availableSizes: ['XS', 'S', 'M'],
    baseMeasurements: { chest: 90, waist: 68, hips: 96 }
  },
  {
    sku: 'ULT-FLORAL-WRAP', 
    name: 'Vestido Wrap Floral', 
    category: 'jacket', 
    price: 220,
    description: 'Vestido cruzado con estampado floral suave y mangas mariposa.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    availableSizes: ['S', 'M', 'L'],
    baseMeasurements: { chest: 92, waist: 72 }
  },
  {
    sku: 'ULT-CLASSIC-JEAN', 
    name: 'Denim Indigo Recto', 
    category: 'pants', 
    price: 110,
    description: 'Vaquero azul clásico de corte recto. Denim japonés de 14oz.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    availableSizes: ['30', '32', '34', '36'],
    baseMeasurements: { waist: 82, hips: 100, length: 105 }
  }
];
