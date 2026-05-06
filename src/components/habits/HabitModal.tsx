"use client"

import React, { useState, useEffect } from 'react'
import type { Habit } from '@/types/database.types'

interface HabitModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Habit>) => Promise<void>
  habit?: Habit | null
}

const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ef4444', // Red
  '#06b6d4', // Cyan
]

export function HabitModal({ isOpen, onClose, onSave, habit }: HabitModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (habit) {
      setName(habit.name)
      setDescription(habit.description || '')
      setColor(habit.color)
      setFrequency(habit.frequency)
    } else {
      setName('')
      setDescription('')
      setColor(COLORS[0])
      setFrequency('daily')
    }
  }, [habit, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({ name, description, color, frequency })
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            {habit ? 'Edit Habit' : 'Create Habit'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Habit Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 font-bold focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="e.g. Morning Meditation"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Frequency</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  frequency === 'daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  frequency === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Color Theme</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full transition-all ring-offset-2 ${
                    color === c ? 'ring-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c, ringColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: color, boxShadow: `${color}40 0px 8px 24px` }}
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              habit ? 'Update Habit' : 'Create Habit'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
