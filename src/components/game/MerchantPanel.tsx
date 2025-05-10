'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { NPCMerchant } from './types'

interface MerchantPanelProps {
  isOpen: boolean
  onClose: () => void
  merchants: NPCMerchant[]
  onBuyFromMerchant: (specialty: string) => void
  onRequestMission: (merchantName: string) => void
}

export default function MerchantPanel({ 
  isOpen, 
  onClose, 
  merchants, 
  onBuyFromMerchant, 
  onRequestMission 
}: MerchantPanelProps) {
  const [activeMerchantIndex, setActiveMerchantIndex] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isDialogueChanging, setIsDialogueChanging] = useState(false);
  
  const activeMerchant = merchants && merchants.length > 0 ? merchants[activeMerchantIndex] : null;

  // Rotate dialogue every 8 seconds
  useEffect(() => {
    if (!activeMerchant || !isOpen) return;
    
    const intervalId = setInterval(() => {
      setIsDialogueChanging(true);
      setTimeout(() => {
        setDialogueIndex(prev => (prev + 1) % activeMerchant.dialogue.length);
        setIsDialogueChanging(false);
      }, 500);
    }, 8000);
    
    return () => clearInterval(intervalId);
  }, [activeMerchant, isOpen]);

  // Reset dialogue index when merchant changes
  useEffect(() => {
    setDialogueIndex(0);
    setIsDialogueChanging(false);
  }, [activeMerchantIndex]);

  const nextDialogue = () => {
    if (!activeMerchant) return;
    setIsDialogueChanging(true);
    setTimeout(() => {
      setDialogueIndex(prev => (prev + 1) % activeMerchant.dialogue.length);
      setIsDialogueChanging(false);
    }, 300);
  };

  const prevDialogue = () => {
    if (!activeMerchant) return;
    setIsDialogueChanging(true);
    setTimeout(() => {
      setDialogueIndex(prev => prev === 0 ? activeMerchant.dialogue.length - 1 : prev - 1);
      setIsDialogueChanging(false);
    }, 300);
  };

  if (!activeMerchant) return null;

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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded bg-neutral-900 text-left align-middle text-white shadow-xl transition-all border border-magenta-500/30 font-mono">
                {/* Glowing borders effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-magenta-500 to-transparent opacity-70"></div>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-magenta-500 to-transparent opacity-70"></div>
                  <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-magenta-500 to-transparent opacity-70"></div>
                  <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-magenta-500 to-transparent opacity-70"></div>
                </div>
                
                {/* Header */}
                <div className="p-4 border-b border-neutral-700 bg-black/60">
                  <Dialog.Title className="text-xl font-bold text-magenta-400 flex items-center">
                    <span className="animate-flicker mr-2">{'>'}</span> 
                    LOCAL MERCHANTS
                  </Dialog.Title>
                </div>
                
                {/* Merchant Navigation */}
                {merchants.length > 1 && (
                  <div className="flex gap-2 p-3 bg-black/30 border-b border-neutral-700 overflow-x-auto">
                    {merchants.map((merchant, index) => (
                      <button
                        key={merchant.name}
                        onClick={() => setActiveMerchantIndex(index)}
                        className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
                          index === activeMerchantIndex 
                            ? 'bg-magenta-500 text-black font-bold' 
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                        } transition-all`}
                      >
                        {merchant.name}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Merchant Portrait */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40">
                        {/* Glitch portrait effect */}
                        <div className="absolute inset-0 rounded-full bg-black/80 border-2 border-magenta-500/50 flex items-center justify-center overflow-hidden">
                          <div className="glitch-container w-full h-full flex items-center justify-center">
                            <div className="text-6xl">👤</div>
                            <div className="absolute inset-0 bg-gradient-to-t from-magenta-500/20 to-transparent pointer-events-none"></div>
                            {/* Scanlines */}
                            <div className="absolute inset-0 bg-scanlines opacity-30 pointer-events-none"></div>
                            {/* Glitch lines */}
                            <div className="absolute h-px bg-magenta-400 left-0 right-0 top-1/3 opacity-70"></div>
                            <div className="absolute h-px bg-cyan-400 left-0 right-0 top-2/3 opacity-70"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center mt-3">
                        <h3 className="font-bold text-lg text-magenta-300">{activeMerchant.name}</h3>
                        <p className="text-xs text-neutral-400">{activeMerchant.title}</p>
                      </div>
                    </div>
                    
                    {/* Merchant Info */}
                    <div className="flex-1">
                      {/* Specialties */}
                      <div className="mb-4">
                        <div className="text-xs text-neutral-500 mb-1">SPECIALTIES:</div>
                        <div className="text-sm text-yellow-400 font-bold bg-black/40 p-2 rounded border border-neutral-700">
                          {activeMerchant.specialty}
                        </div>
                      </div>
                      
                      {/* Dialogue */}
                      <div className="relative bg-black bg-opacity-70 p-4 rounded border border-neutral-700 min-h-[120px] flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-xs text-neutral-500">MERCHANT COMM:</div>
                          <div className="text-xs text-cyan-500">[ENCRYPTED]</div>
                        </div>
                        
                        <div className="flex-1 flex items-center">
                          <button 
                            onClick={prevDialogue} 
                            className="text-neutral-500 hover:text-white px-2"
                            aria-label="Previous quote"
                          >
                            ◀
                          </button>
                          
                          <div className="flex-1 p-2 relative">
                            <Transition
                              show={!isDialogueChanging}
                              enter="transition duration-300 ease-out"
                              enterFrom="opacity-0 -translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition duration-200 ease-in"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1"
                            >
                              <p className="text-cyan-300 italic">"{activeMerchant.dialogue[dialogueIndex]}"</p>
                            </Transition>
                          </div>
                          
                          <button 
                            onClick={nextDialogue} 
                            className="text-neutral-500 hover:text-white px-2"
                            aria-label="Next quote"
                          >
                            ▶
                          </button>
                        </div>
                        
                        <div className="self-end text-xs text-neutral-600 mt-2">
                          {dialogueIndex + 1}/{activeMerchant.dialogue.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-between items-center pt-4 border-t border-neutral-800">
                    <button 
                      onClick={onClose} 
                      className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors"
                    >
                      CLOSE
                    </button>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => onRequestMission(activeMerchant.name)}
                        className="px-4 py-2 bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600 transition-all hover:text-white"
                      >
                        REQUEST MISSION
                      </button>
                      <button 
                        onClick={() => onBuyFromMerchant(activeMerchant.specialty)}
                        className="px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-all hover:shadow-glow hover:scale-105"
                      >
                        BUY FROM MERCHANT
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
