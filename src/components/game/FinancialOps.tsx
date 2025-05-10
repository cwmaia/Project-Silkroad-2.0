import React, { useState } from 'react';

interface FinancialOpsProps {
  // In a real app, these would be populated with actual data
  // For now, we'll just create placeholders
  credits?: number;
  debt?: number;
}

const FinancialOps: React.FC<FinancialOpsProps> = ({ 
  credits = 1000, 
  debt = 500 
}) => {
  const [amount, setAmount] = useState<string>('');

  return (
    <div className="h-full overflow-hidden bg-black border border-neutral-700 rounded-md">
      <div className="flex justify-between items-center p-3 border-b border-neutral-700 bg-black/80">
        <h2 className="text-lg font-mono text-cyan-400">
          <span className="animate-flicker">{'>'}</span> FINANCIAL OPS
        </h2>
        <div className="text-xs text-gray-500">
          {new Date().toLocaleString()}
        </div>
      </div>
      
      <div className="h-[calc(100%-3rem)] overflow-y-auto p-4 bg-black/80 font-mono">
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 border border-neutral-800 rounded-sm">
              <div className="text-gray-500 text-sm">AVAILABLE CREDITS</div>
              <div className="text-2xl text-cyan-400">{credits.toLocaleString()}</div>
            </div>
            <div className="p-3 border border-neutral-800 rounded-sm">
              <div className="text-gray-500 text-sm">OUTSTANDING DEBT</div>
              <div className="text-2xl text-terminal-error">{debt.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="p-4 border border-neutral-800 rounded-sm mb-4">
            <h3 className="text-lg text-cyan-400 mb-2">TRANSFER FUNDS</h3>
            <div className="mb-3">
              <label className="block text-gray-500 text-sm mb-1">AMOUNT</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black border border-neutral-700 p-2 text-white font-mono focus:border-cyan-400 focus:outline-none rounded-sm"
                placeholder="Enter amount"
              />
            </div>
            <div className="mb-3">
              <label className="block text-gray-500 text-sm mb-1">RECIPIENT ID</label>
              <input 
                type="text" 
                className="w-full bg-black border border-neutral-700 p-2 text-white font-mono focus:border-cyan-400 focus:outline-none rounded-sm"
                placeholder="Enter recipient ID"
              />
            </div>
            <button className="w-full bg-black border border-cyan-400 text-cyan-400 p-2 hover:bg-cyan-400 hover:text-black transition-colors duration-200 rounded-sm">
              EXECUTE TRANSFER
            </button>
          </div>
          
          <div className="p-4 border border-neutral-800 rounded-sm">
            <h3 className="text-lg text-cyan-400 mb-2">DEBT MANAGEMENT</h3>
            <div className="mb-3">
              <label className="block text-gray-500 text-sm mb-1">PAYMENT AMOUNT</label>
              <input 
                type="number" 
                className="w-full bg-black border border-neutral-700 p-2 text-white font-mono focus:border-cyan-400 focus:outline-none rounded-sm"
                placeholder="Enter payment amount"
              />
            </div>
            <button className="w-full bg-black border border-cyan-400 text-cyan-400 p-2 hover:bg-cyan-400 hover:text-black transition-colors duration-200 rounded-sm mb-2">
              MAKE PAYMENT
            </button>
            <button className="w-full bg-black border border-terminal-error text-terminal-error p-2 hover:bg-terminal-error hover:text-black transition-colors duration-200 rounded-sm">
              REQUEST LOAN
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-gray-500 text-sm">
          <span className="animate-flicker">{'>'}</span> FINANCIAL OPERATIONS READY
        </div>
      </div>
    </div>
  );
};

export default FinancialOps;
