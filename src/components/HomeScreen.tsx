import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const HomeScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExists, setSessionExists] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

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

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome, {email}</h1>
      {sessionExists ? (
        <button
          onClick={() => console.log('Continue button clicked')}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Continue
        </button>
      ) : (
        <button
          onClick={() => console.log('New Game button clicked')}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
        >
          New Game
        </button>
      )}
    </div>
  );
};

export default HomeScreen;
