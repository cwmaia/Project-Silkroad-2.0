import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../firebase';
import * as fs from 'fs';
import * as path from 'path';

const seedRegionsToFirestore = async () => {
  const db = getFirestore(app);

  // Load regions from JSON file
  const regionsFilePath = path.resolve(process.cwd(), 'public', 'Docs', 'silkroad_regions_npcs.json');
  let regionsData;
  try {
    regionsData = JSON.parse(fs.readFileSync(regionsFilePath, 'utf-8'));
    console.log('Regions data loaded successfully:', regionsData);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    return;
  }

  for (const region of regionsData) {
    try {
      const regionRef = doc(db, 'regions', region.slug);
      await setDoc(regionRef, region);
      console.log(`Seeded region: ${region.name}`);
    } catch (error) {
      console.error(`Error seeding region ${region.name}:`, error);
    }
  }

  console.log('All regions have been seeded.');
};

seedRegionsToFirestore().catch(error => console.error('Seeding failed:', error));

export { seedRegionsToFirestore };
