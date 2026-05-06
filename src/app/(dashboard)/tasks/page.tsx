import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { TasksPage } from '@/components/tasks/TasksPage'
import { getTasks, getLabels, getProjects } from '@/lib/tasks/actions'
import type { Database } from '@/types/database.types'

export default async function TasksAppPage() {
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

  if (!user) {
    redirect('/auth/sign-in')
  }

  // Pre-fetch data for SSR
  const [tasks, labels, projects] = await Promise.all([
    getTasks(user.id),
    getLabels(user.id),
    getProjects(user.id)
  ])

  return (
    <TasksPage
      userId={user.id}
      initialTasks={tasks}
      labels={labels}
      projects={projects}
    />
  )
}
