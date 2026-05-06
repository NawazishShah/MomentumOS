"use client"

import React from 'react'
import type { Task } from '@/types/database.types'
import { completeTask } from '@/lib/tasks/actions'

interface TaskListRowProps {
  task: Task
  onClick: () => void
}

export function TaskListRow({ task, onClick }: TaskListRowProps) {
  const isOverdue = task.due_date ? new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0)) : false
  const formattedDate = task.due_date ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(task.due_date)) : ''

  const handleToggleDone = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const isDone = task.status === 'done'
    try {
      await completeTask(task.id, !isDone)
    } catch (err) {
      console.error(err)
    }
  }

  const priorityColors = {
    high: 'text-red-600 bg-red-50 border-red-100',
    medium: 'text-amber-600 bg-amber-50 border-amber-100',
    low: 'text-green-600 bg-green-50 border-green-100'
  }

  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-100 hover:bg-slate-50 transition-colors cursor-pointer group"
    >
      <div 
        onClick={handleToggleDone}
        className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
          task.status === 'done' ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-500'
        }`}
      >
        {task.status === 'done' && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <div className={`flex-1 text-sm font-medium text-slate-700 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
        {task.title}
      </div>

      <div className="w-20 hidden md:block">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <div className="w-24 hidden lg:block">
        {task.label && (
          <span 
            className="text-[10px] font-medium px-2 py-0.5 rounded border whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ color: task.label.color, borderColor: task.label.color + '40', backgroundColor: task.label.color + '10' }}
          >
            {task.label.name}
          </span>
        )}
      </div>

      <div className={`w-24 text-[10px] font-medium hidden sm:block ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
        {formattedDate}
      </div>

      <div className="w-28 text-[10px] text-slate-400 font-medium hidden xl:block overflow-hidden text-ellipsis whitespace-nowrap">
        {task.project?.name}
      </div>
    </div>
  )
}
