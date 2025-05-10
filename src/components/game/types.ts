export interface Item {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  rarity: string;
  statEffect: Record<string, number>;
  description: string;
}

export interface NPCMerchant {
  name: string;
  title: string;
  specialty: string;
  dialogue: string[];
}

export interface Region {
  name: string;
  slug: string;
  priceModifier: Record<string, number>;
  riskLevel: string;
  theme: string;
  mapCoordinates: { x: number; y: number };
  npcMerchants: NPCMerchant[];
}

// Helper function for rarity color classes
export const getRarityColorClass = (rarity: string): string => {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 'text-gray-300';
    case 'uncommon':
      return 'text-green-400';
    case 'rare':
      return 'text-blue-400';
    case 'illegal':
      return 'text-terminal-error';
    default:
      return 'text-terminal-text';
  }
};
