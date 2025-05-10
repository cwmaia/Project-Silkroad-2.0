'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

        <div className="bg-white rounded-lg max-w-sm mx-auto p-6">
          <Dialog.Title className="text-lg font-bold">Authentication Modal</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            Modal content goes here...
          </Dialog.Description>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AuthModal;
