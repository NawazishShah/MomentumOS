"use client"

import React from 'react'
import type { Habit } from '@/types/database.types'

interface HabitStatsProps {
  habits: Habit[]
}

export function HabitStats({ habits }: HabitStatsProps) {
  const totalCompletions = habits.reduce((acc, h) => acc + (h.logs?.length || 0), 0)
  
  const today = new Date().toISOString().split('T')[0]
  const completionsToday = habits.filter(h => h.logs?.some(l => l.completed_at === today)).length

  const bestStreak = habits.reduce((acc, h) => {
    // Basic streak calc (same as card)
    if (!h.logs || h.logs.length === 0) return acc
    const logDates = new Set(h.logs.map(l => l.completed_at))
    let streak = 0
    const d = new Date()
    const todayStr = d.toISOString().split('T')[0]
    if (logDates.has(todayStr)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      d.setDate(d.getDate() - 1)
    }
    while (logDates.has(d.toISOString().split('T')[0])) {
      streak++
      d.setDate(d.getDate() - 1)
    }
    return Math.max(acc, streak)
  }, 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Progress</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{completionsToday}</span>
          <span className="text-sm font-bold text-slate-400">/ {habits.length} habits</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-1000"
            style={{ width: habits.length > 0 ? `${(completionsToday / habits.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Best Streak</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{bestStreak}</span>
          <span className="text-sm font-bold text-slate-400">days</span>
        </div>
        <div className="mt-4 flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < bestStreak ? 'bg-amber-400' : 'bg-slate-100'}`} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">All Time</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{totalCompletions}</span>
          <span className="text-sm font-bold text-slate-400">completions</span>
        </div>
        <p className="text-xs text-slate-400 mt-4 font-medium italic">Building Momentum...</p>
      </div>
    </div>
  )
}
