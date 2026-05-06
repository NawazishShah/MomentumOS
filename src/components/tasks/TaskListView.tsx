"use client"

import React from 'react'
import type { Task, TaskStatus } from '@/types/database.types'
import { TaskListRow } from './TaskListRow'

interface TaskListViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function TaskListView({ tasks, onTaskClick }: TaskListViewProps) {
  const groups: { id: TaskStatus; label: string }[] = [
    { id: 'inbox', label: 'Inbox' },
    { id: 'todo', label: 'To do' },
    { id: 'in_progress', label: 'In progress' },
    { id: 'done', label: 'Done' }
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {groups.map(group => {
        const groupTasks = tasks.filter(t => t.status === group.id)
        if (groupTasks.length === 0) return null

        return (
          <div key={group.id}>
            <div className="bg-slate-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {group.label}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                {groupTasks.length}
              </span>
            </div>
            <div>
              {groupTasks.map(task => (
                <TaskListRow key={task.id} task={task} onClick={() => onTaskClick(task)} />
              ))}
            </div>
          </div>
        )
      })}

      {tasks.length === 0 && (
        <div className="p-8 text-center text-slate-400 italic">
          No tasks found matching current filters.
        </div>
      )}
    </div>
  )
}
