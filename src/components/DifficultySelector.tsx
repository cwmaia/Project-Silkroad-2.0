'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

const difficulties: { level: 'Easy' | 'Normal' | 'Hard' | 'Endless'; description: string }[] = [
  { level: 'Easy', description: 'Lower debt, more item availability, slower market volatility.' },
  { level: 'Normal', description: 'Standard debt, balanced supply/demand, regular challenge.' },
  { level: 'Hard', description: 'High debt, scarce inventory, frequent risk events.' },
  { level: 'Endless', description: 'No debt. Pure survival. Trade forever, no win condition.' }
];

export default function DifficultySelector({ isOpen, onClose, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (difficulty: 'Easy' | 'Normal' | 'Hard' | 'Endless') => void;
}) {
  const [selected, setSelected] = useState<'Easy' | 'Normal' | 'Hard' | 'Endless'>('Normal');

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-neutral-900 p-6 text-white shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold mb-4">Choose Difficulty</Dialog.Title>

                <div className="space-y-3">
                  {difficulties.map(({ level, description }) => (
                    <div
                      key={level}
                      className={`p-4 border rounded flex justify-between items-center cursor-pointer ${selected === level ? 'border-blue-500 bg-blue-100' : 'border-neutral-700'}`}
                    >
                      <div>
                        <div className="font-bold text-lg">{level}</div>
                        <div className="text-sm text-neutral-300">{description}</div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded ${selected === level ? 'bg-blue-500 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}
                        onClick={() => setSelected(level)}
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 font-bold rounded ${selected ? 'bg-white text-black hover:bg-gray-300' : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}
                    onClick={() => onConfirm(selected)}
                    disabled={!selected}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
