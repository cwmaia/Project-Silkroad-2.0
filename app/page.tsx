'use client';

import React, { useState } from 'react';
import LandingScreen from '../src/components/LandingScreen';
import HomeScreen from '../src/components/HomeScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
