"use client"

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Task } from '@/types/database.types'

const supabase = createClient()

export function useTaskRealtime(userId: string, dispatch: any) {
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          dispatch({ type: 'ADD_TASK', payload: payload.new as Task })
        }
        if (payload.eventType === 'UPDATE') {
          dispatch({ type: 'UPDATE_TASK', payload: payload.new as Task })
        }
        if (payload.eventType === 'DELETE') {
          dispatch({ type: 'DELETE_TASK', payload: payload.old.id as string })
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, dispatch])
}
