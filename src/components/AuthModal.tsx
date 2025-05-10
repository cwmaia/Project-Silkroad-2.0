'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { app } from "../firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin"); // 'signin' or 'signup'
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("Connecting...");

    const auth = getAuth(app);

    try {
      await setPersistence(auth, browserLocalPersistence);

      if (mode === "signin") {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Signed in:", userCred.user);
        setStatus("Signed in successfully.");
        onClose(); // close modal
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ Account created:", userCred.user);
        setStatus("Account created successfully.");
        onClose(); // close modal
      }
    } catch (err: any) {
      console.error("❌ Auth error:", err);
      setError(err.message);
      setStatus(null);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" />

        <div className="bg-white rounded-lg max-w-sm mx-auto p-6">
          <Dialog.Title className="text-lg font-bold">Authentication</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            {mode === "signin" ? "Sign in to your account" : "Create a new account"}
          </Dialog.Description>

          {status && <p className="text-green-400 text-sm mt-2">{status}</p>}
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-2"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 text-blue-500 hover:underline"
          >
            {mode === "signin" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>

          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AuthModal;
