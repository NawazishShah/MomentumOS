"use client"

import React, { useState, useEffect } from 'react'
import type { Task, Label, Project, TaskStatus, TaskPriority } from '@/types/database.types'

interface TaskDetailPanelProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, data: Partial<Task>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  labels: Label[]
  projects: Project[]
}

export function TaskDetailPanel({ task, isOpen, onClose, onUpdate, onDelete, labels, projects }: TaskDetailPanelProps) {
  const [showToast, setShowToast] = useState(false)

  if (!isOpen || !task) return null

  const handleUpdate = async (field: keyof Task, value: any) => {
    if (task[field] === value) return
    
    await onUpdate(task.id, { [field]: value })
    setShowToast(true)
    setTimeout(() => setShowToast(false), 1500)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDelete(task.id)
      onClose()
    }
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 lg:hidden"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-screen w-full sm:w-[380px] bg-white border-l border-slate-200 shadow-2xl z-[60] flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Task Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <textarea
              className="w-full text-xl font-semibold text-slate-900 bg-transparent border-none p-0 focus:ring-0 resize-none min-h-[60px]"
              value={task.title}
              onChange={(e) => onUpdate(task.id, { title: e.target.value })}
              onBlur={(e) => handleUpdate('title', e.target.value)}
              placeholder="Task title..."
            />
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center text-sm">
            <span className="text-slate-400 font-medium">Status</span>
            <select
              className="bg-slate-50 border-none rounded-lg text-slate-700 py-1.5 focus:ring-2 focus:ring-blue-500/20"
              value={task.status}
              onChange={(e) => handleUpdate('status', e.target.value as TaskStatus)}
            >
              <option value="inbox">Inbox</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <span className="text-slate-400 font-medium">Priority</span>
            <select
              className="bg-slate-50 border-none rounded-lg text-slate-700 py-1.5 focus:ring-2 focus:ring-blue-500/20"
              value={task.priority}
              onChange={(e) => handleUpdate('priority', e.target.value as TaskPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <span className="text-slate-400 font-medium">Due Date</span>
            <input
              type="date"
              className="bg-slate-50 border-none rounded-lg text-slate-700 py-1.5 focus:ring-2 focus:ring-blue-500/20"
              value={task.due_date || ''}
              onChange={(e) => handleUpdate('due_date', e.target.value || null)}
            />

            <span className="text-slate-400 font-medium">Label</span>
            <select
              className="bg-slate-50 border-none rounded-lg text-slate-700 py-1.5 focus:ring-2 focus:ring-blue-500/20"
              value={task.label_id || ''}
              onChange={(e) => handleUpdate('label_id', e.target.value || null)}
            >
              <option value="">No Label</option>
              {labels.map(label => (
                <option key={label.id} value={label.id}>{label.name}</option>
              ))}
            </select>

            <span className="text-slate-400 font-medium">Project</span>
            <select
              className="bg-slate-50 border-none rounded-lg text-slate-700 py-1.5 focus:ring-2 focus:ring-blue-500/20"
              value={task.project_id || ''}
              onChange={(e) => handleUpdate('project_id', e.target.value || null)}
            >
              <option value="">No Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Notes</h3>
            <textarea
              className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20 min-h-[200px]"
              value={task.notes || ''}
              onChange={(e) => onUpdate(task.id, { notes: e.target.value })}
              onBlur={(e) => handleUpdate('notes', e.target.value || null)}
              placeholder="Add some notes..."
            />
          </div>

          <div className="pt-4 text-[10px] text-slate-400 italic">
            Created on {new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(task.created_at))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleDelete}
            className="w-full py-2.5 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Task
          </button>
        </div>

        {showToast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all animate-bounce">
            Saved
          </div>
        )}
      </div>
    </>
  )
}
