import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { HabitTracker } from '@/components/habits/HabitTracker'
import { getHabits } from '@/lib/habits/actions'
import type { Database } from '@/types/database.types'

export default async function HabitsPage() {
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

  const initialHabits = await getHabits(user.id)

  return (
    <div className="min-h-full">
      <HabitTracker userId={user.id} initialHabits={initialHabits} />
    </div>
  )
}
