import React, { useState, useEffect } from 'react';
import { Item, getRarityColorClass } from './types';
import '../typing-animation.css';

interface MarketPanelProps {
  items: Item[];
  loading: boolean;
  error: string | null;
  filterValue?: string; // Optional filter string based on merchant specialty
  playerState: {
    credits: number;
    inventory: Record<string, number>;
  };
  addLog: (message: string, type: 'info' | 'warning' | 'error' | 'success') => void;
  onBuyItem: (itemId: string, price: number) => Promise<boolean>;
}

const MarketPanel: React.FC<MarketPanelProps> = ({ 
  items, 
  loading, 
  error, 
  filterValue, 
  playerState,
  addLog,
  onBuyItem
}) => {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [purchasingItems, setPurchasingItems] = useState<Set<string>>(new Set());
  
  // Update filtered items when items or filter changes
  useEffect(() => {
    if (!filterValue) {
      setFilteredItems(items);
      return;
    }
    
    // Split the filter value to handle multiple specialties like "ChromeLiver, SkinShield"
    const filterTerms = filterValue.toLowerCase().split(',').map(term => term.trim());
    
    const filtered = items.filter(item => {
      // Check if item name, category, or description contains any of the filter terms
      return filterTerms.some(term => 
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    });
    
    setFilteredItems(filtered);
  }, [items, filterValue]);

  // Handle buying an item
  const handleBuyItem = async (item: Item) => {
    if (purchasingItems.has(item.id)) {
      return; // Prevent multiple clicks
    }

    // Check if player has enough credits
    if (playerState.credits < item.basePrice) {
      addLog(`> Insufficient funds to purchase ${item.name}.`, 'error');
      return;
    }

    try {
      // Mark item as being purchased
      setPurchasingItems(prev => new Set(prev).add(item.id));
      
      // Call the buyItem function from parent
      const success = await onBuyItem(item.id, item.basePrice);
      
      if (success) {
        addLog(`> Acquired ${item.name} for ${item.basePrice} credits.`, 'success');
      }
    } catch (err) {
      console.error('Error purchasing item:', err);
      addLog(`> Transaction failed: Could not purchase ${item.name}.`, 'error');
    } finally {
      // Remove the purchasing state
      setPurchasingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  // Group items by category
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyan-400 font-mono animate-pulse">
          Loading market data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-terminal-error font-mono">
          ERROR: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-black border border-neutral-700 rounded-md">
      <div className="flex justify-between items-center p-3 border-b border-neutral-700 bg-black/80">
        <h2 className="text-lg font-mono text-cyan-400">
          <span className="animate-flicker">{'>'}</span> MARKET
        </h2>
        <div className="text-xs text-gray-500">
          {new Date().toLocaleString()}
        </div>
      </div>
      
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-scanlines z-10"></div>
      
      {/* Terminal content */}
      <div className="h-[calc(100%-3rem)] overflow-y-auto p-4 bg-black/80 font-mono relative z-0">
        <div className="mb-4 text-cyan-400">
          <span className="animate-flicker">{'>'}</span> LISTING AVAILABLE ITEMS...
        </div>

        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="mb-6">
            <h2 className="text-terminal-magenta border-b border-neutral-700 pb-1 mb-2">
              {category.toUpperCase()}
            </h2>
            
            <div className="space-y-4">
              {categoryItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-2 border border-neutral-800 hover:border-cyan-400 transition-colors duration-200 group rounded-sm"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold group-hover:text-cyan-400 transition-colors duration-200 typing-animation">
                      {item.name}
                    </h3>
                    <span className={`${getRarityColorClass(item.rarity)} text-sm`}>
                      {item.rarity.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-gray-500 text-sm mb-1">
                    {category}
                  </div>
                  
                  <p className="text-sm mb-2">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-terminal-text">
                      Price: <span className="text-cyan-400">{item.basePrice} credits</span>
                    </div>
                    
                    <button
                      onClick={() => handleBuyItem(item)}
                      disabled={purchasingItems.has(item.id) || playerState.credits < item.basePrice}
                      className={`px-3 py-1 border text-sm rounded transition-all duration-200 ${
                        purchasingItems.has(item.id) 
                          ? 'bg-cyan-800 text-white border-cyan-700 cursor-wait' 
                          : playerState.credits < item.basePrice
                            ? 'opacity-50 cursor-not-allowed border-neutral-700 bg-neutral-900 text-neutral-400'
                            : 'border-cyan-500 hover:bg-cyan-500 hover:text-black text-cyan-400'
                      }`}
                    >
                      {purchasingItems.has(item.id) ? 'PROCESSING...' : 'BUY'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-4 text-gray-500 text-sm">
          <span className="animate-flicker">{'>'}</span> END OF LISTING
        </div>
      </div>
    </div>
  );
};

export default MarketPanel;
