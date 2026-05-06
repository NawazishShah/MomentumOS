"use client"

import React from 'react'
import type { Habit } from '@/types/database.types'

interface HabitCardProps {
  habit: Habit
  onToggle: (habitId: string, date: string) => void
  onEdit: (habit: Habit) => void
}

export function HabitCard({ habit, onToggle, onEdit }: HabitCardProps) {
  const today = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(today.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const calculateStreak = () => {
    if (!habit.logs || habit.logs.length === 0) return 0
    const logDates = new Set(habit.logs.map(l => l.completed_at))
    let streak = 0
    const d = new Date()
    
    // Check today
    const todayStr = d.toISOString().split('T')[0]
    if (logDates.has(todayStr)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      // If not done today, check if it was done yesterday (streak might still be alive)
      d.setDate(d.getDate() - 1)
    }

    while (logDates.has(d.toISOString().split('T')[0])) {
      streak++
      d.setDate(d.getDate() - 1)
    }
    return streak
  }

  const streak = calculateStreak()

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-100 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: habit.color, boxShadow: `${habit.color}40 0px 8px 16px` }}
          >
            <span className="text-lg font-bold">{habit.name[0].toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{habit.name}</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{habit.frequency}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="block text-lg font-black text-slate-900 leading-none">{streak}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Streak</span>
          </div>
          <button 
            onClick={() => onEdit(habit)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-slate-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end gap-1">
        {last7Days.map((date) => {
          const d = new Date(date)
          const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' })
          const isCompleted = habit.logs?.some(l => l.completed_at === date)
          const isToday = date === today.toISOString().split('T')[0]

          return (
            <div key={date} className="flex flex-col items-center gap-2 flex-1">
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${isToday ? 'text-blue-600' : 'text-slate-300'}`}>
                {dayName}
              </span>
              <button
                onClick={() => onToggle(habit.id, date)}
                className={`w-full aspect-square rounded-lg border-2 transition-all flex items-center justify-center ${
                  isCompleted 
                    ? 'scale-105 shadow-md border-transparent' 
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
                style={{ backgroundColor: isCompleted ? habit.color : undefined }}
              >
                {isCompleted && (
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
