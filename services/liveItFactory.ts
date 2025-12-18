
export interface ProductionOrder {
  orderId: string;
  status: 'in_production' | 'completed' | 'shipped';
  traceability: string[];
  sku: string;
  patternFile: string;
}

export const produceGarmentCAP = async (patternData: { patternFile: string, sku: string }): Promise<ProductionOrder> => {
  console.log(`[LIVEIT FACTORY] Receiving JIT order for SKU: ${patternData.sku}`);
  
  await new Promise(resolve => setTimeout(resolve, 800)); // Production simulation

  return {
    orderId: `ORD-${Date.now()}`,
    status: 'in_production',
    traceability: ['cutting', 'sewing', 'quality_check', 'printing', 'packaging'],
    patternFile: patternData.patternFile,
    sku: patternData.sku
  };
};
