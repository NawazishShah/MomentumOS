"use client"

import { createClient } from '@/lib/supabase/client'
import type { Habit, HabitLog } from '@/types/database.types'

const supabase = createClient()

export async function getHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*, logs:habit_logs(*)')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Habit[]
}

export async function createHabit(data: Partial<Habit>): Promise<Habit> {
  const { data: newHabit, error } = await supabase
    .from('habits')
    .insert([data])
    .select('*')
    .single()

  if (error) throw error
  return newHabit as Habit
}

export async function updateHabit(id: string, data: Partial<Habit>): Promise<Habit> {
  const { data: updatedHabit, error } = await supabase
    .from('habits')
    .update(data)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return updatedHabit as Habit
}

export async function logHabit(userId: string, habitId: string, date: string): Promise<HabitLog> {
  const { data, error } = await supabase
    .from('habit_logs')
    .insert([{ user_id: userId, habit_id: habitId, completed_at: date }])
    .select('*')
    .single()

  if (error) throw error
  return data as HabitLog
}

export async function unlogHabit(habitId: string, date: string): Promise<void> {
  const { error } = await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', habitId)
    .eq('completed_at', date)

  if (error) throw error
}

export async function getHabitLogsRange(userId: string, startDate: string, endDate: string): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('completed_at', startDate)
    .lte('completed_at', endDate)

  if (error) throw error
  return data as HabitLog[]
}
