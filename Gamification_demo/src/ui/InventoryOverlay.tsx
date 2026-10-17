import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../audio/AudioManager';
import { useInventoryStore } from '../store/InventoryStore';
import type { InventoryItem } from '../store/InventoryStore';

interface InventoryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryOverlay: React.FC<InventoryOverlayProps> = ({ isOpen, onClose }) => {
  const { items } = useInventoryStore();
  const [activeTab, setActiveTab] = useState<InventoryItem['category']>('quest');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const tabs: { id: InventoryItem['category']; label: string }[] = [
    { id: 'quest', label: 'Quest Items' },
    { id: 'docs', label: 'Documents' },
    { id: 'notes', label: 'Research Notes' },
    { id: 'usbs', label: 'USB Drives' },
    { id: 'badges', label: 'Badges' },
    { id: 'keys', label: 'Keys' },
  ];

  const filteredItems = items.filter((item) => item.category === activeTab);

  const handleTabClick = (tabId: InventoryItem['category']) => {
    setActiveTab(tabId);
    setSelectedItem(null);
    audioManager.playSFX('hover');
  };

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    audioManager.playSFX('menu_select');
  };

  const handleClose = () => {
    audioManager.playSFX('click');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          {/* Main Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl h-[75vh] bg-slate-900/90 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Left sidebar: Tabs */}
            <div className="w-full md:w-1/4 bg-slate-950/45 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
              <div className="hidden md:block mb-6">
                <span className="text-[#00f0ff] font-bold text-xs tracking-widest block uppercase">DEVICES & PARCELS</span>
                <h2 className="text-white text-2xl font-black mt-1">INVENTORY</h2>
              </div>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-2.5 rounded-lg text-left text-xs font-bold tracking-wider uppercase transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600/35 to-[#00f0ff]/10 border-l-4 border-[#00f0ff] text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleClose}
                className="mt-auto hidden md:block w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-xs transition-colors text-center"
              >
                CLOSE [ESC/I]
              </button>
            </div>

            {/* Middle panel: Items Grid */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
                  {tabs.find((t) => t.id === activeTab)?.label} ({filteredItems.length})
                </h3>

                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-800 rounded-xl">
                    <span className="text-slate-600 text-2xl">📦</span>
                    <span className="text-slate-500 text-xs mt-2 font-medium">This tab is empty. Collect items on campus.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all duration-200 ${
                          selectedItem?.id === item.id
                            ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-650'
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="text-white text-xs font-bold leading-tight">{item.name}</div>
                          <span
                            className={`text-[9px] font-bold uppercase ${
                              item.rarity === 'legendary'
                                ? 'text-amber-400'
                                : item.rarity === 'rare'
                                ? 'text-[#00f0ff]'
                                : 'text-slate-400'
                            }`}
                          >
                            {item.rarity}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Close button for mobile */}
              <button
                onClick={handleClose}
                className="block md:hidden w-full mt-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-lg text-xs"
              >
                CLOSE
              </button>
            </div>

            {/* Right panel: Item Detail */}
            <div className="w-full md:w-1/3 bg-slate-950/60 p-6 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between">
              {selectedItem ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 bg-slate-900 border border-slate-800 rounded-xl">
                      {selectedItem.icon}
                    </span>
                    <div>
                      <h4 className="text-white text-sm font-black leading-tight">{selectedItem.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                        {selectedItem.category}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-slate-800 pt-3">
                    <p className="text-slate-300 text-xs leading-relaxed font-medium">
                      {selectedItem.description}
                    </p>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">RARITY SECURITY LEVEL</span>
                    <span
                      className={`text-xs font-black uppercase mt-1 block ${
                        selectedItem.rarity === 'legendary'
                          ? 'text-amber-400'
                          : selectedItem.rarity === 'rare'
                          ? 'text-[#00f0ff]'
                          : 'text-slate-400'
                      }`}
                    >
                      {selectedItem.rarity} INDEX
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-slate-600 text-3xl">🔍</span>
                  <p className="text-slate-500 text-xs font-medium mt-2 leading-relaxed max-w-[180px]">
                    Select an item in your inventory to audit its credentials.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InventoryOverlay;
