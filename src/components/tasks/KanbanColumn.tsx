"use client"

import React, { useState } from 'react'
import type { Task, TaskStatus } from '@/types/database.types'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  id: TaskStatus
  label: string
  color: string
  tasks: Task[]
  onMoveTask: (id: string, status: TaskStatus) => void
  onTaskClick: (task: Task) => void
  onQuickAdd: (status: TaskStatus) => void
}

export function KanbanColumn({ id, label, color, tasks, onMoveTask, onTaskClick, onQuickAdd }: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      onMoveTask(taskId, id)
    }
  }

  const statusColors: Record<string, string> = {
    gray: 'bg-slate-500',
    indigo: 'bg-indigo-500',
    teal: 'bg-teal-500',
    green: 'bg-green-500'
  }

  return (
    <div 
      className={`flex flex-col h-full rounded-xl bg-slate-50/50 p-3 transition-all ${
        isOver ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${statusColors[color]}`} />
          <h2 className="text-sm font-semibold text-slate-700">{label}</h2>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar max-h-[calc(100vh-250px)]">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </div>

      <button
        onClick={() => onQuickAdd(id)}
        className="mt-3 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-blue-100"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Quick add
      </button>
    </div>
  )
}
