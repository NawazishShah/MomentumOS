"use client"

import React, { useState, useEffect, useRef } from 'react'
import type { TaskStatus, TaskPriority, Label, Project } from '@/types/database.types'

interface QuickAddTaskProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: any) => Promise<void>
  initialStatus?: TaskStatus
  labels: Label[]
  projects: Project[]
}

export function QuickAddTask({ isOpen, onClose, onAdd, initialStatus = 'inbox', labels, projects }: QuickAddTaskProps) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<TaskStatus>(initialStatus)
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [labelId, setLabelId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTitle('')
      setStatus(initialStatus)
      setPriority('medium')
      setDueDate('')
      setLabelId('')
      setProjectId('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, initialStatus])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      await onAdd({
        title,
        status,
        priority,
        due_date: dueDate || null,
        label_id: labelId || null,
        project_id: projectId || null
      })
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Quick Add Task</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Title</label>
            <input
              ref={inputRef}
              type="text"
              required
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
              <select
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="inbox">Inbox</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Priority</label>
              <select
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Due Date</label>
              <input
                type="date"
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Project</label>
              <select
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/20"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="">No Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
