import React from 'react';
import { useApp, MainTab } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, currentUser, setIsCreateModalOpen, setIsLinkedInModalOpen, setIsSavedModalOpen } = useApp();

  const links: { tab: MainTab; label: string; icon: string }[] = [
    { tab: 'home', label: 'Home Dashboard', icon: 'home' },
    { tab: 'discover', label: 'Discover & Stories', icon: 'explore' },
    { tab: 'network', label: 'Network & Mentors', icon: 'groups' },
    { tab: 'opportunities', label: 'Opportunities', icon: 'work' },
    { tab: 'department', label: 'Department Hub', icon: 'account_balance' },
    { tab: 'profile', label: 'Professional Profile', icon: 'person' }
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[240px] h-[calc(100vh-56px)] sticky top-14 bg-[#0F172A] text-white border-r border-slate-800/80 p-3.5 shrink-0 overflow-y-auto">
      {/* Current Profile Card Snippet */}
      <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/60 mb-3.5 flex items-center gap-2.5">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-9 h-9 rounded-lg object-cover border border-slate-600 shadow-xs shrink-0"
        />
        <div className="min-w-0">
          <p className="font-bold text-[12px] text-white truncate leading-tight">{currentUser.name}</p>
          <p className="text-[10px] text-slate-400 truncate capitalize">{currentUser.role.replace('_', ' ')}</p>
          <span className="inline-flex items-center gap-1 text-[9px] text-blue-400 font-bold uppercase tracking-wider mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            {currentUser.verificationStatus.replace('Verified ', '')}
          </span>
        </div>
      </div>

      {/* Main Nav Items */}
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1.5">Navigation</p>
        {links.map((link) => {
          const isActive = currentTab === link.tab;
          return (
            <button
              key={link.tab}
              onClick={() => setCurrentTab(link.tab)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${isActive ? 'text-white' : 'text-slate-400'}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {link.icon}
              </span>
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Tools */}
      <div className="mt-4 pt-3 border-t border-slate-800 space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1.5">Quick Tools</p>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[16px] text-blue-400">add_circle</span>
          <span>Create Content</span>
        </button>

        <button
          onClick={() => setIsLinkedInModalOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[16px] text-sky-400">sync</span>
          <span>LinkedIn Sync</span>
        </button>

        <button
          onClick={() => setIsSavedModalOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[16px] text-amber-400">bookmark</span>
          <span>Saved Bookmarks</span>
        </button>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setCurrentTab('admin')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors text-left ${
              currentTab === 'admin'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-indigo-400">admin_panel_settings</span>
            <span>Administration</span>
          </button>
        )}
      </div>

      {/* Department Summary Footer */}
      <div className="mt-auto pt-4 border-t border-slate-800 text-[10px] text-slate-400 px-3">
        <p className="font-bold text-slate-200">IRE Department Network</p>
        <p className="text-slate-500 font-mono">Department community</p>
      </div>
    </aside>
  );
};
