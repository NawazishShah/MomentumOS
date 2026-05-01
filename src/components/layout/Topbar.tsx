import React from 'react';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title = 'Dashboard' }: TopbarProps) {
  return (
    <header className="fixed top-0 right-0 left-60 h-14 bg-white border-b border-surface-border flex items-center justify-between px-8 z-40">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300" />
      </div>
    </header>
  );
}

export default Topbar;
