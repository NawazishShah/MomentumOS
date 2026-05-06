import React from 'react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getTasks } from '@/lib/tasks/actions'
import { getHabits } from '@/lib/habits/actions'
import type { Database } from '@/types/database.types'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // Handled by middleware
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [tasks, habits] = await Promise.all([
    getTasks(user.id),
    getHabits(user.id)
  ])

  const pendingTasks = tasks.filter(t => t.status !== 'done')
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high')
  
  const today = new Date().toISOString().split('T')[0]
  const completedHabitsToday = habits.filter(h => h.logs?.some(l => l.completed_at === today)).length

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h2>
          <p className="text-slate-500 font-medium">Welcome back to your personal operating system.</p>
        </div>
        <Badge color="green">System Online</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-xl shadow-blue-500/10 bg-blue-600 text-white">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Tasks Pending</p>
          <p className="text-4xl font-black">{pendingTasks.length}</p>
          <div className="mt-4 flex items-center gap-2">
            <Link href="/tasks" className="text-xs font-bold hover:underline underline-offset-4">View All Tasks →</Link>
          </div>
        </Card>

        <Card className="border-none shadow-xl shadow-indigo-500/10 bg-indigo-600 text-white">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Habits Done</p>
          <p className="text-4xl font-black">{completedHabitsToday} <span className="text-lg opacity-60">/ {habits.length}</span></p>
          <div className="mt-4 flex items-center gap-2">
            <Link href="/habits" className="text-xs font-bold hover:underline underline-offset-4">Daily Tracking →</Link>
          </div>
        </Card>

        <Card className="border-none shadow-xl shadow-rose-500/10 bg-rose-500 text-white">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">High Priority</p>
          <p className="text-4xl font-black">{highPriorityTasks.length}</p>
          <p className="text-[10px] font-bold mt-4 uppercase tracking-widest opacity-80">Requires Attention</p>
        </Card>

        <Card className="border-none shadow-xl shadow-emerald-500/10 bg-emerald-500 text-white">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">System Status</p>
          <p className="text-4xl font-black">100%</p>
          <p className="text-[10px] font-bold mt-4 uppercase tracking-widest opacity-80">All Modules Active</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Upcoming Tasks" className="bg-white border-slate-100 shadow-sm">
          <div className="space-y-3">
            {pendingTasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${task.priority === 'high' ? 'bg-rose-500' : 'bg-blue-400'}`} />
                  <span className="text-sm font-bold text-slate-700">{task.title}</span>
                </div>
                {task.due_date && (
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{task.due_date}</span>
                )}
              </div>
            ))}
            {pendingTasks.length === 0 && <p className="text-sm text-slate-400 italic py-4">No pending tasks. You're all caught up!</p>}
          </div>
        </Card>

        <Card title="Today's Habits" className="bg-white border-slate-100 shadow-sm">
          <div className="space-y-3">
            {habits.slice(0, 5).map(habit => {
              const isDone = habit.logs?.some(l => l.completed_at === today)
              return (
                <div key={habit.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-md shadow-sm" style={{ backgroundColor: habit.color }} />
                    <span className="text-sm font-bold text-slate-700">{habit.name}</span>
                  </div>
                  {isDone ? (
                    <Badge color="green">Done</Badge>
                  ) : (
                    <Badge color="gray">Pending</Badge>
                  )}
                </div>
              )
            })}
            {habits.length === 0 && <p className="text-sm text-slate-400 italic py-4">No habits set up yet. Start building routines!</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
