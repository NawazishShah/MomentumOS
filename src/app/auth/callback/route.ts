// SUPABASE DASHBOARD SETUP REQUIRED:
// 1. Authentication > Providers > Google: 
//    Add Client ID + Secret from Google Cloud Console
// 2. Authentication > URL Configuration:
//    Site URL: http://localhost:3000
//    Redirect URLs: http://localhost:3000/auth/callback
// 3. Authentication > Email Templates:
//    Confirm signup, Magic Link, Reset password
//    all redirect to: {{ .SiteURL }}/auth/callback

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set({ name, value, ...options });
              });
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Check if profile exists for user, if not redirect to /auth/onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (!profile || !profile.full_name) {
        return NextResponse.redirect(new URL('/auth/onboarding', request.url));
      }
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // On error: redirect to /auth/sign-in?error=auth_failed
  return NextResponse.redirect(new URL('/auth/sign-in?error=auth_failed', request.url));
}
