import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import DifficultySelector from './DifficultySelector';
import GameScreen from './GameScreen';

const HomeScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExists, setSessionExists] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isDifficultySelectorOpen, setIsDifficultySelectorOpen] = useState(false);
  const [showGameScreen, setShowGameScreen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError('No user is currently logged in.');
        setLoading(false);
        return;
      }

      setEmail(currentUser.email);

      const db = getFirestore();
      const sessionRef = doc(db, `users/${currentUser.uid}/saves/session`);

      try {
        const sessionDoc = await getDoc(sessionRef);
        setSessionExists(sessionDoc.exists());
      } catch (err: any) {
        console.error('Error fetching session data:', err);
        setError('Failed to fetch session data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewGame = () => {
    setIsDifficultySelectorOpen(true);
  };

  const startNewGame = async (difficulty: 'Easy' | 'Normal' | 'Hard' | 'Endless') => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('No user is currently logged in.');
      return;
    }

    const db = getFirestore();
    const sessionRef = doc(db, `users/${currentUser.uid}/saves/session`);

    const defaultValues = {
      Easy: { credits: 1500, debt: 3000, region: 'Neo-Baltic Node' },
      Normal: { credits: 1000, debt: 5000, region: 'Pacific Enterprise' },
      Hard: { credits: 750, debt: 8000, region: 'Southern Red Zone' },
      Endless: { credits: 1000, debt: 0, region: 'Free Port Authority' },
    };

    const sessionData = {
      difficulty,
      credits: defaultValues[difficulty].credits,
      debt: defaultValues[difficulty].debt,
      region: defaultValues[difficulty].region,
      day: 1,
      inventory: {},
      lastUpdated: Timestamp.now(),
    };

    try {
      await setDoc(sessionRef, sessionData);
      console.log('Game session created successfully:', sessionData);
      // Navigate to GameScreen
      setShowGameScreen(true);
    } catch (err) {
      console.error('Error creating game session:', err);
    }
  };

  const handleConfirmDifficulty = (difficulty: 'Easy' | 'Normal' | 'Hard' | 'Endless') => {
    console.log(`Selected difficulty: ${difficulty}`);
    setIsDifficultySelectorOpen(false);
    startNewGame(difficulty);
  };

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (showGameScreen) {
    return <GameScreen />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome, {email}</h1>
      {sessionExists ? (
        <button
          onClick={() => setShowGameScreen(true)}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Continue
        </button>
      ) : (
        <button
          onClick={handleNewGame}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
        >
          New Game
        </button>
      )}

      <DifficultySelector
        isOpen={isDifficultySelectorOpen}
        onClose={() => setIsDifficultySelectorOpen(false)}
        onConfirm={handleConfirmDifficulty}
      />
    </div>
  );
};

export default HomeScreen;
