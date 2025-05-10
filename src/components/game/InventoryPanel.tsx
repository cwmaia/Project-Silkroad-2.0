import React from 'react';
import { Item, getRarityColorClass } from './types';

interface InventoryPanelProps {
  // In a real app, this would be populated with the user's inventory
  // For now, we'll just create a placeholder
  playerItems?: Item[];
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ playerItems = [] }) => {
  // Placeholder inventory data
  const placeholderItems = [
    {
      id: 'placeholder1',
      name: 'Empty Slot',
      category: 'System',
      basePrice: 0,
      rarity: 'common',
      statEffect: {},
      description: 'No item in this inventory slot.'
    }
  ];

  const items = playerItems.length > 0 ? playerItems : placeholderItems;

  return (
    <div className="h-full overflow-hidden bg-black border border-neutral-700 rounded-md">
      <div className="flex justify-between items-center p-3 border-b border-neutral-700 bg-black/80">
        <h2 className="text-lg font-mono text-cyan-400">
          <span className="animate-flicker">{'>'}</span> INVENTORY
        </h2>
        <div className="text-xs text-gray-500">
          {items.length} item(s)
        </div>
      </div>
      
      <div className="h-[calc(100%-3rem)] overflow-y-auto p-4 bg-black/80 font-mono">
        <div className="mb-4 text-cyan-400">
          <span className="animate-flicker">{'>'}</span> SCANNING INVENTORY...
        </div>

        {items.length === 0 ? (
          <div className="text-gray-500 text-center p-4">
            Your inventory is empty.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="p-2 border border-neutral-800 hover:border-cyan-400 transition-colors duration-200 group rounded-sm"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold group-hover:text-cyan-400 transition-colors duration-200">
                    {item.name}
                  </h3>
                  <span className={`${getRarityColorClass(item.rarity)} text-sm`}>
                    {item.rarity.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-gray-500 text-sm mb-1">
                  {item.category}
                </div>
                
                <p className="text-sm mb-2">{item.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="text-terminal-text">
                    Value: <span className="text-cyan-400">{item.basePrice} credits</span>
                  </div>
                  
                  <div className="opacity-50 cursor-not-allowed px-3 py-1 border border-neutral-700 text-sm hover:bg-neutral-800 transition-colors duration-200 rounded">
                    USE
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 text-gray-500 text-sm">
          <span className="animate-flicker">{'>'}</span> END OF INVENTORY
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
