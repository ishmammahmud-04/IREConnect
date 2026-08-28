import React, { useState } from 'react';
import { useApp, MainTab } from '../context/AppContext';
import { UserRole } from '../types';
import { supabase } from '../lib/supabase';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentTab,
    setCurrentTab,
    notifications,
    setIsNotificationsModalOpen,
    setIsChatModalOpen,
    setIsSettingsModalOpen,
    setIsCreateModalOpen,
    setIsSavedModalOpen,
    globalSearchQuery,
    setGlobalSearchQuery
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#0F172A] flex items-center justify-center text-white border border-slate-800 shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px] text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                memory
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-[16px] md:text-[17px] font-bold text-slate-900 tracking-tight">
                  IRE Network
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden md:block leading-none">
                IoT &amp; Robotics Engineering
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-2">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
              search
            </span>
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => {
                setGlobalSearchQuery(e.target.value);
                if (currentTab !== 'discover' && currentTab !== 'home') {
                  setCurrentTab('discover');
                }
              }}
              placeholder="Search students, alumni, projects, papers..."
              className="w-full h-8 pl-8 pr-7 bg-slate-100/90 border border-slate-200 rounded-full text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-all"
            />
            {globalSearchQuery && (
              <button
                onClick={() => setGlobalSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'home'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Home
          </button>
          <button
            onClick={() => setCurrentTab('discover')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'discover'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">explore</span>
            Discover
          </button>
          <button
            onClick={() => setCurrentTab('network')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'network'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            Network
          </button>
          <button
            onClick={() => setCurrentTab('opportunities')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'opportunities'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">work</span>
            Opportunities
          </button>
          <button
            onClick={() => setCurrentTab('department')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'department'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            Department
          </button>
        </nav>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* + Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Create</span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={() => setIsSavedModalOpen(true)}
            aria-label="Saved Bookmarks"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Saved Items"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setIsChatModalOpen(true)}
            aria-label="Messages"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Messages"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
          </button>

          <button
            onClick={() => setIsNotificationsModalOpen(true)}
            aria-label="Notifications"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Role Switcher & Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <div className="w-6 h-6 rounded-md overflow-hidden border border-slate-300 bg-slate-200 shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-[11px] font-bold text-slate-900 leading-tight truncate max-w-[85px]">
                  {currentUser.name}
                </p>
                <p className="text-[9px] font-medium text-slate-500 capitalize leading-tight">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">
                arrow_drop_down
              </span>
            </button>

            {/* Dropdown Menu */}
            {isRoleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 text-xs animate-in fade-in slide-in-from-top-2"
                onClick={() => setIsRoleDropdownOpen(false)}
              >
                <div className="p-2.5 border-b border-slate-100 mb-1.5 bg-slate-50 rounded-lg">
                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                </div>

                <div className="border-t border-slate-100 mt-2 pt-1.5">
                  <button
                    onClick={() => setCurrentTab('profile')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                  >
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                  >
                    <span className="material-symbols-outlined text-[16px]">settings</span>
                    <span>Settings &amp; Privacy</span>
                  </button>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-red-600 hover:bg-red-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
