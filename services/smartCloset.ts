
import { WardrobeItem } from '../types';

// Mock database for the user's wardrobe
const MOCK_WARDROBE: WardrobeItem[] = [
  {
    id: 'WR-001',
    productName: 'Neon Cyber Jacket (FGT Custom)',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
    purchaseDate: '2025-05-15',
    status: 'active',
    condition: 'new',
    avbetValue: 50,
    ecoImpact: { co2Saved: 12.5, waterSaved: 2500 }
  },
  {
    id: 'WR-002',
    productName: 'Vintage Denim 90s',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80',
    purchaseDate: '2024-11-20',
    status: 'active',
    condition: 'good',
    avbetValue: 25,
    ecoImpact: { co2Saved: 8.2, waterSaved: 1800 }
  },
  {
    id: 'WR-003',
    productName: 'Silk Flow Dress',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
    purchaseDate: '2023-08-10',
    status: 'active',
    condition: 'worn',
    avbetValue: 15,
    ecoImpact: { co2Saved: 5.5, waterSaved: 1200 }
  }
];

export const getWardrobeItems = async (): Promise<WardrobeItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...MOCK_WARDROBE];
};

export const donateItem = async (itemId: string): Promise<{ success: boolean, earnedCredits: number }> => {
  console.log(`[AUTO DONATE] Processing donation for item ${itemId}...`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const item = MOCK_WARDROBE.find(i => i.id === itemId);
  if (item) {
    item.status = 'donated';
    // Logic to trigger circular economy logistics would go here
    return { success: true, earnedCredits: item.avbetValue };
  }
  return { success: false, earnedCredits: 0 };
};

export const registerInCloset = (
  userEmail: string, 
  itemData: { sku: string, mockupId: string, orderId: string, productDetails?: any }
) => {
  console.log(`[SMART CLOSET] Registering item ${itemData.sku} for user ${userEmail}`);
  
  // Create a new wardrobe item from the product details
  const newItem: WardrobeItem = {
    id: `WR-${Date.now()}`,
    productName: itemData.productDetails?.name || 'Prenda Retail JIT',
    image: itemData.productDetails?.image || 'https://source.unsplash.com/random/400x600?fashion',
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'active',
    condition: 'new',
    // Calculate estimated buyback value (~40% of price)
    avbetValue: itemData.productDetails?.price ? Math.floor(itemData.productDetails.price * 0.4) : 20,
    ecoImpact: { 
      co2Saved: 5 + Math.random() * 5, 
      waterSaved: 1000 + Math.random() * 1000 
    }
  };

  // Add to the beginning of the mock database
  MOCK_WARDROBE.unshift(newItem);
  
  // AutoDonate check logic could be triggered here
  console.log(`[AUTO DONATE] Item added to inventory. Tracking lifecycle started.`);
  
  return true;
};
