"use client"

import React, { useState, useMemo, useEffect } from 'react'
import type { Task, Label, Project, TaskStatus } from '@/types/database.types'
import { useTasks } from '@/hooks/useTasks'
import { TaskFilterBar } from './TaskFilterBar'
import { KanbanBoard } from './KanbanBoard'
import { TaskListView } from './TaskListView'
import { TaskDetailPanel } from './TaskDetailPanel'
import { QuickAddTask } from './QuickAddTask'

interface TasksPageProps {
  userId: string
  initialTasks: Task[]
  labels: Label[]
  projects: Project[]
}

export function TasksPage({ userId, initialTasks, labels, projects }: TasksPageProps) {
  const { tasks, loading, error, addTask, updateTask, deleteTask, moveTask } = useTasks(userId, initialTasks)
  const [view, setView] = useState<'board' | 'list'>('board')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [quickAddInitialStatus, setQuickAddInitialStatus] = useState<TaskStatus>('inbox')

  // Keyboard shortcut for Quick Add
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
      if (e.key === 'n' && !isInput) {
        e.preventDefault()
        setQuickAddInitialStatus('inbox')
        setIsQuickAddOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') return tasks
    
    if (activeFilter === 'priority:high') return tasks.filter(t => t.priority === 'high')
    if (activeFilter === 'due:today') {
      const today = new Date().toISOString().split('T')[0]
      return tasks.filter(t => t.due_date === today)
    }
    if (activeFilter === 'due:none') return tasks.filter(t => !t.due_date)
    
    if (activeFilter.startsWith('label:')) {
      const labelId = activeFilter.split(':')[1]
      return tasks.filter(t => t.label_id === labelId)
    }
    
    return tasks
  }, [tasks, activeFilter])

  const handleQuickAdd = (status: TaskStatus) => {
    setQuickAddInitialStatus(status)
    setIsQuickAddOpen(true)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  // Find updated task in our list to keep panel fresh
  const currentSelectedTask = useMemo(() => {
    if (!selectedTask) return null
    return tasks.find(t => t.id === selectedTask.id) || null
  }, [tasks, selectedTask])

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setView('board')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              view === 'board' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Board
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              view === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            List
          </button>
        </div>
      </div>

      <TaskFilterBar
        labels={labels}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="flex-1 mt-2 min-h-0 overflow-visible">
        {view === 'board' ? (
          <KanbanBoard
            tasks={filteredTasks}
            onMoveTask={moveTask}
            onTaskClick={handleTaskClick}
            onQuickAdd={handleQuickAdd}
          />
        ) : (
          <TaskListView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>

      <TaskDetailPanel
        task={currentSelectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
        onDelete={deleteTask}
        labels={labels}
        projects={projects}
      />

      <QuickAddTask
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAdd={addTask}
        initialStatus={quickAddInitialStatus}
        labels={labels}
        projects={projects}
      />
    </div>
  )
}
