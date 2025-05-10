import React from 'react';

interface SideNavProps {
  onNavClick: (tabId: string) => void;
}

const SideNav: React.FC<SideNavProps> = ({ onNavClick }) => {
  const navItems = [
    { id: 'market', label: 'MARKET', icon: '💹' },
    { id: 'inventory', label: 'INVENTORY', icon: '🎒' },
    { id: 'finance', label: 'FINANCE', icon: '💰' },
    { id: 'missions', label: 'MISSIONS', icon: '📋' },
    { id: 'settings', label: 'SETTINGS', icon: '⚙️' },
    { id: 'logout', label: 'LOGOUT', icon: '🚪' },
  ];

  return (
    <div className="w-64 h-full bg-black border-r border-neutral-700 font-mono text-white p-4">
      <div className="mb-6">
        <h1 className="text-xl text-cyan-400 mb-1">
          <span className="animate-flicker">{'>'}</span> SILKROAD
        </h1>
        <div className="text-xs text-gray-500">TERMINAL v1.0</div>
      </div>

      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <a 
                href="#"
                className="flex items-center p-2 hover:bg-neutral-900 hover:border-l-2 hover:border-cyan-400 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.id);
                }}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4 text-xs text-gray-500">
        <div className="border-t border-neutral-700 pt-2 mt-2">
          <div>USER: AGENT_1337</div>
          <div>STATUS: CONNECTED</div>
          <div className="text-cyan-400">
            {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
