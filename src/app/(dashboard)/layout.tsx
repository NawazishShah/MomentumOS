import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import type { Database } from '@/types/database.types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // handled by middleware
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { count: taskCount } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .neq('status', 'done');

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        taskCount={taskCount || 0} 
        userEmail={user.email} 
        userName={(profile as any)?.full_name} 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar userName={(profile as any)?.full_name || user.email} />
        <main className="flex-1 ml-60 mt-14 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
