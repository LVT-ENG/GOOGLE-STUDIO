
import { Mockup } from '../types';

let sequence = 1;

export const generateMockups = async (page: number = 1, perPage: number = 3): Promise<{ mockups: Mockup[], total: number }> => {
  // FGT (Fashion Generative Tech) simulation
  const total = 20;
  const start = (page - 1) * perPage;
  const end = Math.min(start + perPage, total);
  
  const mockups: Mockup[] = [];

  for (let i = start; i < end; i++) {
    const id = `MK-${i + 1}`;
    mockups.push({
      id,
      baseSku: `BASE-${i + 1}`,
      designId: `DSGN-${Date.now()}-${i}`,
      previewUrl: `https://source.unsplash.com/random/400x600?fashion,outfit&sig=${i}`,
      price: 59 + (i % 5) * 10,
      productionData: {
        whiteBaseSku: `WH-BASE-${100 + i}`,
        printFile: `/patterns/${id}.dxf`
      }
    });
  }

  return { mockups, total };
};

export const createPatternFromMockup = (mockupId: string) => {
  console.log(`[CAP AUTO-PRODUCTION] Generating DXF pattern for ${mockupId}...`);
  return {
    patternFile: `/patterns/${mockupId}.dxf`,
    sku: `WHITE_BASE_${sequence++}`,
    timestamp: Date.now()
  };
};
