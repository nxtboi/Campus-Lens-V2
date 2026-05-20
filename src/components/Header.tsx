/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Wifi, 
  WifiOff, 
  LayoutDashboard, 
  Users, 
  Award, 
  Sparkles, 
  Contact, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOffline: boolean;
}

export default function Header({ activeTab, setActiveTab, isOffline }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard Hub', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: Users },
    { id: 'exams', label: 'Unit Exams Deck', icon: Award },
    { id: 'intervention', label: 'AI Intervention Planner', icon: Sparkles },
    { id: 'faculty', label: 'Faculty Contact', icon: Contact },
  ];

  const activeNavItem = navigationItems.find(item => item.id === activeTab) || navigationItems[0];

  return (
    <>
      {/* 1. DESKTOP PERMANENT SIDEBAR */}
      <aside 
        id="app-sidebar-desktop" 
        className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 bg-white border-r border-gray-100 z-30 shadow-xs justify-between"
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Branding Header */}
          <div className="p-6 border-b border-gray-100 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
                <GraduationCap className="h-6 w-6" id="logo-icon-desktop" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg text-gray-950 tracking-tight block truncate">CampusLens</span>
                  <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                    v1.2
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium tracking-wide">
                  Powered by <span className="text-indigo-600 font-semibold">Ignizia</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto scrollbar-none" id="app-nav-desktop">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 block mb-3 select-none">
              Control Center
            </span>
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3.5 h-11 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer group
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 active:scale-[0.98]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <IconComponent 
                    className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} 
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sync Status Info Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/45 shrink-0 space-y-3">
          {isOffline ? (
            <div 
              id="offline-badge-desktop"
              className="flex items-center space-x-2 px-3 py-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold leading-relaxed"
              title="Express Backend disconnected. Operating on local offline cache."
            >
              <WifiOff className="h-4 w-4 animate-pulse text-amber-600 shrink-0" />
              <span>Offline Cache Backup</span>
            </div>
          ) : (
            <div 
              id="online-badge-desktop"
              className="flex items-center space-x-2 px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold leading-relaxed"
              title="Successfully synced with CampusLens CSV backend."
            >
              <Wifi className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>CSV Server Active</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold px-1 select-none">
            <span className="flex items-center">
              <ShieldCheck className="h-3 w-3 mr-0.5 text-emerald-500" /> Secure
            </span>
            <span>v1.2 FullStack</span>
          </div>
        </div>
      </aside>


      {/* 2. MOBILE TOP STICKY BAR */}
      <header 
        id="app-header-mobile" 
        className="flex md:hidden sticky top-0 bg-white border-b border-gray-100 h-16 items-center justify-between px-4 z-40 shadow-xs"
      >
        <div className="flex items-center space-x-2.5">
          <div className="bg-indigo-600 text-white p-2 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100">
            <GraduationCap className="h-5 w-5" id="logo-icon-mobile" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-gray-900 tracking-tight">CampusLens</span>
            <span className="text-[10px] font-semibold text-indigo-600 block leading-none">
              {activeNavItem.label}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 hover:bg-gray-50 border border-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>


      {/* 3. MOBILE RESPONSIVE SIDEBAR DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" id="mobile-drawer-portal">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity duration-200" 
          />

          {/* Drawer Panel content */}
          <div className="relative flex flex-col w-72 max-w-xs bg-white h-full shadow-2xl border-r border-gray-100 animate-in slide-in-from-left duration-205">
            {/* Close action element */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="bg-indigo-600 text-white p-2 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-sm text-gray-950">CampusLens</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 group cursor-pointer"
                aria-label="Close Navigation Menu"
              >
                <X className="h-4.5 w-4.5 text-gray-400 group-hover:text-gray-900 transition" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 py-5 px-4 space-y-1 overflow-y-auto" id="app-nav-mobile">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 block mb-2 select-none">
                Control Hub
              </span>
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-tab-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-3 h-11 rounded-lg text-xs font-semibold transition cursor-pointer group
                      ${isActive 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <IconComponent 
                      className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} 
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Sync status footer elements */}
            <div className="p-4 border-t border-gray-150 bg-gray-50/50 space-y-3">
              {isOffline ? (
                <div 
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold leading-relaxed"
                >
                  <WifiOff className="h-3.5 w-3.5 animate-pulse text-amber-600 shrink-0" />
                  <span>Offline Cache Backup</span>
                </div>
              ) : (
                <div 
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold leading-relaxed"
                >
                  <Wifi className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>CSV Server Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

