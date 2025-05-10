import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import './typing-animation.css';

// Import our components
import SideNav from './game/SideNav';
import MarketPanel from './game/MarketPanel';
import InventoryPanel from './game/InventoryPanel';
import FinancialOps from './game/FinancialOps';
import MapPanel from './game/MapPanel';
import TravelPanel from './game/TravelPanel';
import MerchantPanel from './game/MerchantPanel';
import TerminalLog from './game/TerminalLog';
import { Item, Region, NPCMerchant } from './game/types';

// Define player state interface
interface PlayerState {
  credits: number;
  region: string;
  day: number;
  inventory: Record<string, number>; // itemId: quantity
}

// Define log entry interface
interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

const GameScreen: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [playerLocationSlug, setPlayerLocationSlug] = useState<string>('alpine-exchange');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('market');
  
  // Player state
  const [playerState, setPlayerState] = useState<PlayerState>({
    credits: 1000, // Default starting credits
    region: 'alpine-exchange', // Default starting region
    day: 1, // Day 1
    inventory: {}, // Empty inventory
  });

  // Terminal log state
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date(),
      message: 'System initialized. Welcome to Silkroad.',
      type: 'info'
    }
  ]);
  
  // Travel panel state
  const [isTravelPanelOpen, setIsTravelPanelOpen] = useState(false);
  const [selectedRegionSlug, setSelectedRegionSlug] = useState<string>('');
  const [selectedRegionName, setSelectedRegionName] = useState<string>('');
  const [selectedRegionRisk, setSelectedRegionRisk] = useState<string>('');
  
  // Merchant panel state
  const [isMerchantPanelOpen, setIsMerchantPanelOpen] = useState(false);
  const [merchantsInRegion, setMerchantsInRegion] = useState<NPCMerchant[]>([]);
  const [marketFilter, setMarketFilter] = useState<string>('');

  // Add a log entry to the terminal
  const addLog = (message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message,
      type
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  // Mock user ID - would be retrieved from authentication in a real app
  const mockUserId = 'user123';

  // On component mount, fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const db = getFirestore(app);
        
        // Fetch player data first
        await fetchPlayerData();
        
        // Fetch items
        const itemsCollection = collection(db, 'items');
        const itemsSnapshot = await getDocs(itemsCollection);
        
        const itemsList: Item[] = [];
        itemsSnapshot.forEach((doc) => {
          itemsList.push({ id: doc.id, ...doc.data() } as Item);
        });
        setItems(itemsList);
        
        // Fetch regions
        const regionsCollection = collection(db, 'regions');
        const regionsSnapshot = await getDocs(regionsCollection);
        
        const regionsList: Region[] = [];
        regionsSnapshot.forEach((doc) => {
          regionsList.push({ slug: doc.id, ...doc.data() } as Region);
        });
        setRegions(regionsList);
        
        // Set current region
        const currentRegionData = regionsList.find(r => r.slug === playerLocationSlug);
        if (currentRegionData) {
          setCurrentRegion(currentRegionData);
          // Set merchants for current region
          if (currentRegionData.npcMerchants) {
            setMerchantsInRegion(currentRegionData.npcMerchants);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch initial game data.');
        addLog('> System error: Could not retrieve data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Only run on component mount

  // Load player data from Firestore
  const fetchPlayerData = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.log('No authenticated user, using default player state');
        return;
      }
      
      const db = getFirestore(app);
      const userSessionRef = doc(db, `users/${user.uid}/saves/session`);
      const sessionSnapshot = await getDoc(userSessionRef);
      
      if (sessionSnapshot.exists()) {
        const sessionData = sessionSnapshot.data() as PlayerState;
        setPlayerState(sessionData);
        setPlayerLocationSlug(sessionData.region);
        addLog(`> Session loaded. Day ${sessionData.day} in ${sessionData.region}.`, 'info');
      } else {
        // No session exists yet, create one with defaults
        const defaultPlayerState: PlayerState = {
          credits: 1000,
          region: 'alpine-exchange',
          day: 1,
          inventory: {}
        };
        
        // Use setDoc instead of updateDoc for new documents
        await setDoc(userSessionRef, defaultPlayerState);
        
        setPlayerState(defaultPlayerState);
        addLog('> New session initialized.', 'info');
      }
    } catch (err) {
      console.error('Error fetching player data:', err);
      addLog('> Auth system error: Using backup data.', 'warning');
    }
  };

  const handleRegionSelect = (slug: string) => {
    if (slug === playerLocationSlug) {
      // Already in this region, don't do anything
      return;
    }
    
    // Find the selected region
    const selectedRegion = regions.find(r => r.slug === slug);
    if (selectedRegion) {
      setSelectedRegionSlug(slug);
      setSelectedRegionName(selectedRegion.name);
      setSelectedRegionRisk(selectedRegion.riskLevel);
      setIsTravelPanelOpen(true);
    }
  };
  
  const handleTravelConfirm = async () => {
    try {
      // Get current user from Firebase Auth
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        addLog('Authentication error. Please log in again.', 'error');
        return;
      }
      
      // Update the player's location in Firestore
      const db = getFirestore(app);
      const userSessionRef = doc(db, `users/${user.uid}/saves/session`);
      
      // First get current session data
      const sessionSnapshot = await getDoc(userSessionRef);
      const sessionData = sessionSnapshot.data() as PlayerState || {
        credits: 1000,
        region: playerLocationSlug,
        day: 1,
        inventory: {}
      };
      
      // Update the session with the new region and increment the day
      await updateDoc(userSessionRef, {
        region: selectedRegionSlug,
        day: increment(1)
      });
      
      // Update local player state
      const updatedPlayerState = {
        ...playerState,
        region: selectedRegionSlug,
        day: playerState.day + 1
      };
      setPlayerState(updatedPlayerState);
      
      // Update location and close travel panel
      setPlayerLocationSlug(selectedRegionSlug);
      setIsTravelPanelOpen(false);
      
      // Find the new region
      const newRegion = regions.find(r => r.slug === selectedRegionSlug);
      if (newRegion) {
        setCurrentRegion(newRegion);
        
        // Show merchants in the region
        if (newRegion.npcMerchants) {
          setMerchantsInRegion(newRegion.npcMerchants);
          setIsMerchantPanelOpen(true);
        }
        
        // Add log entry
        addLog(`> Traveled to ${newRegion.name}. Regional conditions updated.`, 'success');
      }
      
    } catch (err) {
      console.error('Error updating location:', err);
      setError('Failed to travel to the new location.');
      addLog(`> Travel error: Unable to reach destination.`, 'error');
    }
  };
  
  const handleBuyFromMerchant = (specialty: string) => {
    // Filter market items based on merchant specialty
    setMarketFilter(specialty);
    setActiveTab('market');
    setIsMerchantPanelOpen(false);
  };
  
  const handleRequestMission = (merchantName: string) => {
    // Log mission request
    addLog(`Requested mission from ${merchantName}.`, 'info');
    setIsMerchantPanelOpen(false);
  };

  // Handle buying an item
  const handleBuyItem = async (itemId: string, price: number): Promise<boolean> => {
    try {
      // Get current user from Firebase Auth
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        addLog('Authentication error. Please log in again.', 'error');
        return false;
      }
      
      // Check if player has enough credits
      if (playerState.credits < price) {
        addLog(`> Insufficient funds to complete purchase.`, 'error');
        return false;
      }
      
      // Get the item details
      const item = items.find(item => item.id === itemId);
      if (!item) {
        addLog(`> Item not found in database.`, 'error');
        return false;
      }
      
      // Update the player's inventory and credits in Firestore
      const db = getFirestore(app);
      const userSessionRef = doc(db, `users/${user.uid}/saves/session`);
      
      // Create a copy of the inventory with the new item
      const updatedInventory = { ...playerState.inventory };
      updatedInventory[itemId] = (updatedInventory[itemId] || 0) + 1;
      
      // Update Firestore
      await updateDoc(userSessionRef, {
        credits: playerState.credits - price,
        inventory: updatedInventory
      });
      
      // Update local player state
      const updatedPlayerState = {
        ...playerState,
        credits: playerState.credits - price,
        inventory: updatedInventory
      };
      setPlayerState(updatedPlayerState);
      
      // Find the merchant who sells this item (if any)
      let merchantName = "local merchant";
      if (currentRegion && currentRegion.npcMerchants) {
        for (const merchant of currentRegion.npcMerchants) {
          if (merchant.specialty.toLowerCase().includes(item.name.toLowerCase()) || 
              merchant.specialty.toLowerCase().includes(item.category.toLowerCase())) {
            merchantName = merchant.name;
            break;
          }
        }
      }
      
      // Log success message
      addLog(`> Acquired ${item.name} for ${price} credits from ${merchantName}.`, 'success');
      return true;
    } catch (err) {
      console.error('Error buying item:', err);
      addLog(`> Transaction error: Purchase failed.`, 'error');
      return false;
    }
  };

  // Render the appropriate main panel based on the active tab
  const renderMainPanel = () => {
    switch (activeTab) {
      case 'market':
        return (
          <MarketPanel 
            items={items} 
            loading={loading} 
            error={error} 
            filterValue={marketFilter}
            playerState={playerState}
            addLog={addLog}
            onBuyItem={handleBuyItem}
          />
        );
      case 'inventory':
        return <InventoryPanel />; 
      case 'finance':
        return <FinancialOps />;
      default:
        return (
          <MarketPanel 
            items={items} 
            loading={loading} 
            error={error}
            filterValue=""
            playerState={playerState}
            addLog={addLog}
            onBuyItem={handleBuyItem}
          />
        );
    }
  };
  
  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    // Clear any filters when changing tabs
    if (tabId === 'market') {
      setMarketFilter('');
    }
  };

  return (
    <div className="flex h-screen bg-terminal-black text-terminal-text overflow-hidden">
      {/* Scanline effect for the entire screen */}
      <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-10 z-50"></div>
      
      {/* Left sidebar */}
      <div className="h-full">
        <SideNav onNavClick={handleNavClick}/>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden space-y-4">
        {/* Top row for main panels */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main panel (Market, Inventory, Finance) */}
          <div className="md:col-span-2 h-full flex flex-col">
            {/* Main content - takes 2/3 of the height */}
            <div className="flex-1">
              {renderMainPanel()}
            </div>
            
            {/* Terminal Log - takes 1/3 of the height */}
            <div className="h-1/3 mt-4">
              <TerminalLog logs={logs} />
            </div>
          </div>
          
          {/* Right panel (Map) */}
          <div className="h-full">
            <MapPanel 
              currentLocationSlug={playerLocationSlug}
              onSelectRegion={handleRegionSelect} 
            />
          </div>
        </div>
      </div>
      
      {/* Travel confirmation modal */}
      <TravelPanel 
        isOpen={isTravelPanelOpen}
        onClose={() => setIsTravelPanelOpen(false)}
        onConfirm={handleTravelConfirm}
        regionName={selectedRegionName}
        riskLevel={selectedRegionRisk}
      />
      
      {/* Merchant interaction modal */}
      <MerchantPanel 
        isOpen={isMerchantPanelOpen}
        onClose={() => setIsMerchantPanelOpen(false)}
        merchants={merchantsInRegion}
        onBuyFromMerchant={handleBuyFromMerchant}
        onRequestMission={handleRequestMission}
      />
    </div>
  );
};

export default GameScreen;
