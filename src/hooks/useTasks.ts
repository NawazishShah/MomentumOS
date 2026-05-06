"use client"

import { useReducer, useEffect, useCallback, useMemo } from 'react'
import type { Task, TaskStatus } from '@/types/database.types'
import { getTasks, createTask, updateTask, deleteTask as apiDeleteTask, moveTask as apiMoveTask } from '@/lib/tasks/actions'
import { useTaskRealtime } from './useTaskRealtime'

type State = {
  tasks: Task[]
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false }
    case 'ADD_TASK':
      if (state.tasks.some(t => t.id === action.payload.id)) return state
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t)
      }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload)
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

export function useTasks(userId: string, initialData?: Task[]) {
  const [state, dispatch] = useReducer(reducer, {
    tasks: initialData || [],
    loading: !initialData,
    error: null
  })

  useEffect(() => {
    if (initialData) return

    async function load() {
      try {
        const data = await getTasks(userId)
        dispatch({ type: 'SET_TASKS', payload: data })
      } catch (err: any) {
        dispatch({ type: 'SET_ERROR', payload: err.message })
      }
    }
    load()
  }, [userId, initialData])

  useTaskRealtime(userId, dispatch)

  const tasksByStatus = useCallback((status: TaskStatus) => {
    return state.tasks.filter(t => t.status === status)
  }, [state.tasks])

  const addTask = async (data: Partial<Task>) => {
    try {
      const newTask = await createTask({ ...data, user_id: userId })
      dispatch({ type: 'ADD_TASK', payload: newTask })
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
    }
  }

  const editTask = async (id: string, data: Partial<Task>) => {
    // Optimistic update
    const oldTask = state.tasks.find(t => t.id === id)
    if (!oldTask) return

    dispatch({ type: 'UPDATE_TASK', payload: { ...oldTask, ...data } })

    try {
      await updateTask(id, data)
    } catch (err: any) {
      dispatch({ type: 'UPDATE_TASK', payload: oldTask })
      dispatch({ type: 'SET_ERROR', payload: err.message })
    }
  }

  const removeTask = async (id: string) => {
    const oldTask = state.tasks.find(t => t.id === id)
    if (!oldTask) return

    dispatch({ type: 'DELETE_TASK', payload: id })

    try {
      await apiDeleteTask(id)
    } catch (err: any) {
      dispatch({ type: 'ADD_TASK', payload: oldTask })
      dispatch({ type: 'SET_ERROR', payload: err.message })
    }
  }

  const moveTaskStatus = async (id: string, status: TaskStatus) => {
    const oldTask = state.tasks.find(t => t.id === id)
    if (!oldTask) return

    dispatch({ type: 'UPDATE_TASK', payload: { ...oldTask, status } })

    try {
      await apiMoveTask(id, status)
    } catch (err: any) {
      dispatch({ type: 'UPDATE_TASK', payload: oldTask })
      dispatch({ type: 'SET_ERROR', payload: err.message })
    }
  }

  return {
    ...state,
    dispatch,
    tasksByStatus,
    addTask,
    updateTask: editTask,
    deleteTask: removeTask,
    moveTask: moveTaskStatus
  }
}
