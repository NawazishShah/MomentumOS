'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Repeat, 
  BookOpen, 
  Briefcase, 
  BarChart2, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Habits', href: '/habits', icon: Repeat },
  { label: 'Learning', href: '/learning', icon: BookOpen },
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'KPIs', href: '/kpis', icon: BarChart2 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-slate-900 text-white flex flex-col z-50">
      <div className="h-14 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold tracking-tight">🚀 MomentumOS</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group',
                isActive 
                  ? 'bg-brand-500 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className={cn(
                'h-5 w-5',
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
              )} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-slate-400 truncate">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
