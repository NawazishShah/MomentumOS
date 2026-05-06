"use client"

import { useState, useEffect, useCallback } from 'react'
import type { Habit, HabitLog } from '@/types/database.types'
import { getHabits, logHabit, unlogHabit, createHabit, updateHabit } from '@/lib/habits/actions'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export function useHabits(userId: string, initialData?: Habit[]) {
  const [habits, setHabits] = useState<Habit[]>(initialData || [])
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)

  const loadHabits = useCallback(async () => {
    try {
      const data = await getHabits(userId)
      setHabits(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (!initialData) {
      loadHabits()
    }
  }, [initialData, loadHabits])

  // Realtime subscription
  useEffect(() => {
    if (!userId) return

    const habitsChannel = supabase
      .channel('habits-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habits', filter: `user_id=eq.${userId}` }, () => loadHabits())
      .subscribe()

    const logsChannel = supabase
      .channel('habit-logs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'habit_logs', filter: `user_id=eq.${userId}` }, () => loadHabits())
      .subscribe()

    return () => {
      supabase.removeChannel(habitsChannel)
      supabase.removeChannel(logsChannel)
    }
  }, [userId, loadHabits])

  const toggleHabit = async (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return

    const isLogged = habit.logs?.some(l => l.completed_at === date)

    // Optimistic update
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newLogs = isLogged 
          ? h.logs?.filter(l => l.completed_at !== date) 
          : [...(h.logs || []), { habit_id: habitId, completed_at: date } as HabitLog]
        return { ...h, logs: newLogs }
      }
      return h
    }))

    try {
      if (isLogged) {
        await unlogHabit(habitId, date)
      } else {
        await logHabit(userId, habitId, date)
      }
    } catch (err: any) {
      setError(err.message)
      loadHabits() // Rollback
    }
  }

  const addHabit = async (data: Partial<Habit>) => {
    try {
      await createHabit({ ...data, user_id: userId })
    } catch (err: any) {
      setError(err.message)
    }
  }

  const editHabit = async (id: string, data: Partial<Habit>) => {
    try {
      await updateHabit(id, data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return {
    habits,
    loading,
    error,
    toggleHabit,
    addHabit,
    editHabit,
    refresh: loadHabits
  }
}
