'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

interface TravelPanelProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  regionName: string
  riskLevel: string
}

export default function TravelPanel({ isOpen, onClose, onConfirm, regionName, riskLevel }: TravelPanelProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      onConfirm();
      setIsConfirming(false);
    }, 1200); // Show animation for 1.2 seconds
  };

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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-neutral-900 p-6 text-left align-middle text-white shadow-xl transition-all border border-cyan-500/30 font-mono">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
                  <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-70"></div>
                  <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-70"></div>
                </div>
                
                <Dialog.Title className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="text-lg animate-flicker mr-2">{'>'}</span> 
                  TRAVEL TO {regionName.toUpperCase()}?
                </Dialog.Title>
                
                <div className="px-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-400 uppercase tracking-wider">
                      Risk Level
                    </div>
                    <div className={`text-sm font-bold ${getRiskLevelColor(riskLevel)} tracking-wider`}>
                      {riskLevel.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded border border-neutral-700 p-3 mb-4">
                    <p className="text-sm text-neutral-300">
                      <span className="text-yellow-400">WARNING:</span> Traveling will advance the day and update the regional market. Local merchant inventories and prices will change.
                    </p>
                  </div>

                  {isConfirming ? (
                    <div className="flex flex-col items-center justify-center py-3">
                      <div className="text-cyan-400 mb-2">
                        <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <p className="text-sm text-cyan-300 animate-pulse">Calculating optimal route...</p>
                    </div>
                  ) : (
                    <div className="mt-6 flex justify-between">
                      <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors border border-neutral-700"
                      >
                        CANCEL
                      </button>
                      
                      <button 
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 transition-all hover:shadow-glow hover:scale-105"
                      >
                        CONFIRM TRAVEL
                      </button>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

// Helper function for risk level colors
function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case 'low': return 'text-green-400';
    case 'moderate': return 'text-yellow-400';
    case 'high': return 'text-terminal-error';
    default: return 'text-gray-400';
  }
}
