"use client"

import React, { useState } from 'react'
import type { Habit } from '@/types/database.types'
import { useHabits } from '@/hooks/useHabits'
import { HabitCard } from './HabitCard'
import { HabitStats } from './HabitStats'
import { HabitModal } from './HabitModal'

interface HabitTrackerProps {
  userId: string
  initialHabits: Habit[]
}

export function HabitTracker({ userId, initialHabits }: HabitTrackerProps) {
  const { habits, loading, error, toggleHabit, addHabit, editHabit } = useHabits(userId, initialHabits)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  const handleCreate = () => {
    setEditingHabit(null)
    setIsModalOpen(true)
  }

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setIsModalOpen(true)
  }

  const handleSave = async (data: Partial<Habit>) => {
    if (editingHabit) {
      await editHabit(editingHabit.id, data)
    } else {
      await addHabit(data)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Habit Tracker</h1>
          <p className="text-slate-500 font-medium">Small wins lead to big results.</p>
        </div>
        
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] transition-all active:scale-[0.98]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Habit
        </button>
      </div>

      <HabitStats habits={habits} />

      {habits.length === 0 && !loading ? (
        <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
          <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No habits yet</h3>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto">Start by creating your first habit and begin your journey towards better consistency.</p>
          <button 
            onClick={handleCreate}
            className="text-blue-600 font-bold hover:text-blue-700 underline underline-offset-4"
          >
            Create your first habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleHabit}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {loading && habits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Habits...</p>
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-3">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        habit={editingHabit}
      />
    </div>
  )
}
