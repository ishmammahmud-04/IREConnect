import React from 'react';
import { useApp, MainTab } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useApp();

  const navItems: { tab: MainTab; label: string; icon: string }[] = [
    { tab: 'home', label: 'Home', icon: 'home' },
    { tab: 'discover', label: 'Discover', icon: 'explore' },
    { tab: 'network', label: 'Network', icon: 'groups' },
    { tab: 'opportunities', label: 'Jobs', icon: 'work' },
    { tab: 'profile', label: 'Profile', icon: 'person' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-[#0F172A] text-white border-t border-slate-800 shadow-lg px-2 py-1 pb-safe flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = currentTab === item.tab;
        return (
          <button
            key={item.tab}
            onClick={() => setCurrentTab(item.tab)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 active:scale-95 ${
              isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-10 h-6 rounded-lg flex items-center justify-center transition-all ${
                isActive ? 'bg-blue-600/20 text-blue-400' : 'bg-transparent'
              }`}
            >
              <span
                className="material-symbols-outlined text-[19px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-tight leading-tight mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}

    </nav>
  );
};
