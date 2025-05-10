'use client';

import React, { useState, useEffect } from 'react';
import LandingScreen from '../src/components/LandingScreen';
import HomeScreen from '../src/components/HomeScreen';
import { seedItemsToFirestore } from '../src/utils/seedFirestore';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Seed items to Firestore when the app starts
    const seedData = async () => {
      try {
        await seedItemsToFirestore();
        console.log('Items seeded successfully');
      } catch (error) {
        console.error('Error seeding items:', error);
      }
    };
    
    seedData();
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <HomeScreen />
      ) : (
        <LandingScreen onAuthSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}
