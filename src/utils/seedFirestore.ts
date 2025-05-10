import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../firebase';

export async function seedItemsToFirestore() {
  const db = getFirestore(app);

  const items = [
    {
      id: 'chromeDust',
      name: 'ChromeDust',
      category: 'Drugs',
      basePrice: 500,
      rarity: 'illegal',
      statEffect: { reputation: -5 },
      description: 'A highly addictive synthetic drug with devastating side effects.'
    },
    {
      id: 'somaStitch',
      name: 'SomaStitch',
      category: 'Medicine & Biotech',
      basePrice: 300,
      rarity: 'uncommon',
      statEffect: { health: +10 },
      description: 'Advanced biotech for rapid wound healing.'
    },
    {
      id: 'ghostKey',
      name: 'GhostKey',
      category: 'Augmentations & Tech',
      basePrice: 1200,
      rarity: 'rare',
      statEffect: { hacking: +5 },
      description: 'A neural implant for bypassing advanced security systems.'
    },
    {
      id: 'genesisSeeds',
      name: 'Genesis Seeds',
      category: 'Luxury/Rare Goods',
      basePrice: 2000,
      rarity: 'rare',
      statEffect: { reputation: +2 },
      description: 'Extremely rare seeds from pre-collapse Earth.'
    },
    {
      id: 'cleanSlate',
      name: 'CleanSlate',
      category: 'Information & Services',
      basePrice: 800,
      rarity: 'uncommon',
      statEffect: { reputation: +3 },
      description: 'A service to erase your digital footprint.'
    },
    {
      id: 'pureTabs',
      name: 'PureTabs',
      category: 'Survival & Utility',
      basePrice: 50,
      rarity: 'common',
      statEffect: { health: +2 },
      description: 'Water purification tablets for survival situations.'
    }
  ];

  for (const item of items) {
    const itemRef = doc(db, 'items', item.id);
    await setDoc(itemRef, item);
  }

  console.log('Firestore seeding complete: Items added.');
}
