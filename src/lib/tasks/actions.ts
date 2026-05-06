"use client"

import { createClient } from '@/lib/supabase/client'
import type { Task, Label, Project, TaskStatus } from '@/types/database.types'

const supabase = createClient()

export async function getTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, label:labels(*), project:projects(*)')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data as Task[]
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  if (!data.user_id) throw new Error('User ID is required to create a task')

  // Get current max sort_order for the status
  const { data: maxTask } = await supabase
    .from('tasks')
    .select('sort_order')
    .eq('user_id', data.user_id)
    .eq('status', data.status || 'inbox')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sort_order = (maxTask?.sort_order ?? -1) + 1

  const { data: newTask, error } = await supabase
    .from('tasks')
    .insert([{ 
      user_id: data.user_id,
      title: data.title || '',
      status: data.status || 'inbox',
      priority: data.priority || 'medium',
      project_id: data.project_id || null,
      label_id: data.label_id || null,
      due_date: data.due_date || null,
      notes: data.notes || null,
      sort_order 
    }])
    .select('*, label:labels(*), project:projects(*)')
    .single()

  if (error) throw error
  return newTask as unknown as Task
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  const { data: updatedTask, error } = await supabase
    .from('tasks')
    .update(data as any) // Using any here to bypass strict table check if needed, but trying to avoid it
    .eq('id', id)
    .select('*, label:labels(*), project:projects(*)')
    .single()

  if (error) throw error
  return updatedTask as unknown as Task
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function moveTask(id: string, newStatus: TaskStatus): Promise<void> {
  // Get current max sort_order for the new status
  const { data: maxTask } = await supabase
    .from('tasks')
    .select('sort_order')
    .eq('status', newStatus)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sort_order = ((maxTask as any)?.sort_order ?? -1) + 1

  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus, sort_order } as any)
    .eq('id', id)

  if (error) throw error
}

export async function completeTask(id: string, done: boolean): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ 
      status: done ? 'done' : 'todo', 
      completed_at: done ? new Date().toISOString() : null 
    } as any)
    .eq('id', id)

  if (error) throw error
}

export async function getLabels(userId: string): Promise<Label[]> {
  const { data, error } = await supabase
    .from('labels')
    .select('*')
    .eq('user_id', userId)
    .order('name')

  if (error) throw error
  return data as Label[]
}

export async function getProjects(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('name')

  if (error) throw error
  return data as Project[]
}
