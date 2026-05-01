'use client';

import React from 'react';
import { useUser } from '@/hooks/useUser';

interface TopbarProps {
  title?: string;
  userName?: string;
}

export function Topbar({ title = 'Dashboard', userName }: TopbarProps) {
  const { signOut } = useUser();

  return (
    <header className="fixed top-0 right-0 left-60 h-14 bg-white border-b border-surface-border flex items-center justify-between px-8 z-40">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-700">{userName || 'User'}</span>
        <button 
          onClick={signOut}
          className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default Topbar;
