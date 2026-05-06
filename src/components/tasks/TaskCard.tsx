"use client"

import React, { memo } from 'react'
import type { Task } from '@/types/database.types'
import { completeTask } from '@/lib/tasks/actions'

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export const TaskCard = memo(({ task, onClick }: TaskCardProps) => {
  const isOverdue = task.due_date ? new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0)) : false
  const formattedDate = task.due_date ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(task.due_date)) : null

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
    high: 'bg-red-50 text-red-600 border-red-100',
    medium: 'bg-amber-50 text-amber-600 border-amber-100',
    low: 'bg-green-50 text-green-600 border-green-100'
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id)
      }}
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div 
          onClick={handleToggleDone}
          className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
            task.status === 'done' ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          {task.status === 'done' && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <h3 className={`text-sm font-medium text-slate-900 leading-tight ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
          {task.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-1.5 items-center">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wider ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>

        {task.label && (
          <span 
            className="text-[10px] font-medium px-1.5 py-0.5 rounded border"
            style={{ color: task.label.color, borderColor: task.label.color + '40', backgroundColor: task.label.color + '10' }}
          >
            {task.label.name}
          </span>
        )}

        {task.due_date && (
          <div className={`flex items-center gap-1 text-[10px] font-medium ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </div>
        )}

        {task.project && (
          <span className="text-[10px] text-slate-400 font-medium">
            • {task.project.name}
          </span>
        )}
      </div>
    </div>
  )
})

TaskCard.displayName = 'TaskCard'
