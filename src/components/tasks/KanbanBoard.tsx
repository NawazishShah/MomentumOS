"use client"

import React from 'react'
import type { Task, TaskStatus } from '@/types/database.types'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  tasks: Task[]
  onMoveTask: (id: string, status: TaskStatus) => void
  onTaskClick: (task: Task) => void
  onQuickAdd: (status: TaskStatus) => void
}

export function KanbanBoard({ tasks, onMoveTask, onTaskClick, onQuickAdd }: KanbanBoardProps) {
  const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'inbox', label: 'Inbox', color: 'gray' },
    { id: 'todo', label: 'To do', color: 'indigo' },
    { id: 'in_progress', label: 'In progress', color: 'teal' },
    { id: 'done', label: 'Done', color: 'green' }
  ]

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(t => t.status === status)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full items-start">
      {COLUMNS.map(col => (
        <KanbanColumn
          key={col.id}
          id={col.id}
          label={col.label}
          color={col.color}
          tasks={getTasksByStatus(col.id)}
          onMoveTask={onMoveTask}
          onTaskClick={onTaskClick}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  )
}
