"use client"

import React from 'react'
import type { Label } from '@/types/database.types'

interface TaskFilterBarProps {
  labels: Label[]
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function TaskFilterBar({ labels, activeFilter, onFilterChange }: TaskFilterBarProps) {
  const staticFilters = [
    { id: 'all', label: 'All tasks' },
    { id: 'priority:high', label: 'High priority' },
    { id: 'due:today', label: 'Due today' },
    { id: 'due:none', label: 'No due date' },
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
      {staticFilters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === filter.id
              ? 'bg-blue-50 text-blue-600 border-blue-300'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
        >
          {filter.label}
        </button>
      ))}
      
      <div className="h-4 w-px bg-gray-200 mx-1" />

      {labels.map((label) => (
        <button
          key={label.id}
          onClick={() => onFilterChange(`label:${label.id}`)}
          className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === `label:${label.id}`
              ? 'bg-blue-50 text-blue-600 border-blue-300'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}
          style={{ borderColor: activeFilter === `label:${label.id}` ? undefined : label.color + '40' }}
        >
          {label.name}
        </button>
      ))}
    </div>
  )
}
